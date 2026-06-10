import { Dynamics365BusinessCentralService } from '../generated';
import { getBCContext, getBCDataset } from './bcContext';
import type {
  TransferOrder,
  TransferOrderLine,
  Location,
  ItemAvailability,
  TransferStatus,
} from './types';

type Rec = Record<string, unknown>;

function recordOf(row: unknown): Rec {
  if (row && typeof row === 'object' && 'dynamicProperties' in row) {
    const dp = (row as { dynamicProperties?: unknown }).dynamicProperties;
    if (dp && typeof dp === 'object') return dp as Rec;
  }
  return (row ?? {}) as Rec;
}

function pickStr(rec: Rec, ...keys: string[]): string {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return '';
}

function pickNum(rec: Rec, ...keys: string[]): number {
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) return Number(v);
  }
  return 0;
}

function mapStatus(raw: string): TransferStatus {
  const v = raw.toLowerCase();
  if (v.includes('receiv')) return 'Received';
  if (v.includes('transit') || v.includes('shipped') || v.includes('released')) return 'In Transit';
  return 'Open';
}

async function unwrap<T>(
  label: string,
  fetchFn: () => Promise<{ success: boolean; data?: { value?: T[] }; error?: { message?: string } | Error }>,
): Promise<T[]> {
  const res = await fetchFn();
  if (!res.success) {
    const msg = (res.error && 'message' in res.error ? res.error.message : undefined) ?? 'unknown';
    throw new Error(`${label} failed: ${msg}`);
  }
  return res.data?.value ?? [];
}

export async function getTransferOrders(): Promise<TransferOrder[]> {
  const { env, companyId } = await getBCContext();
  const dataset = getBCDataset();
  const rows = await unwrap('getTransferOrders', () =>
    Dynamics365BusinessCentralService.GetItemsV3(env, companyId, dataset, 'transferOrders'),
  );
  return rows.map((row) => {
    const r = recordOf(row);
    return {
      id: pickStr(r, 'id', 'systemId'),
      no: pickStr(r, 'number', 'no', 'transferOrderNo'),
      status: mapStatus(pickStr(r, 'status')),
      fromLocationCode: pickStr(r, 'transferFromLocationCode', 'transferFromCode', 'fromLocationCode'),
      toLocationCode: pickStr(r, 'transferToLocationCode', 'transferToCode', 'toLocationCode'),
      shipmentDate: pickStr(r, 'shipmentDate', 'postingDate'),
      receiptDate: pickStr(r, 'receiptDate'),
      lineCount: pickNum(r, 'lineCount', 'numberOfLines'),
    };
  });
}

export async function getTransferOrderLines(orderId: string): Promise<TransferOrderLine[]> {
  const { env, companyId } = await getBCContext();
  const dataset = getBCDataset();
  const filter = `documentId eq ${orderId}`;
  const rows = await unwrap('getTransferOrderLines', () =>
    Dynamics365BusinessCentralService.GetItemsV3(env, companyId, dataset, 'transferOrderLines', undefined, filter),
  );
  return rows.map((row) => {
    const r = recordOf(row);
    return {
      id: pickStr(r, 'id', 'systemId'),
      transferOrderId: pickStr(r, 'documentId', 'transferOrderId') || orderId,
      lineNo: pickNum(r, 'lineNumber', 'lineNo'),
      itemNo: pickStr(r, 'itemNumber', 'itemNo', 'no'),
      description: pickStr(r, 'description'),
      quantity: pickNum(r, 'quantity'),
      unit: pickStr(r, 'unitOfMeasureCode', 'unit'),
      qtyShipped: pickNum(r, 'quantityShipped', 'qtyShipped'),
      qtyReceived: pickNum(r, 'quantityReceived', 'qtyReceived'),
    };
  });
}

export async function getLocations(): Promise<Location[]> {
  const { env, companyId } = await getBCContext();
  const dataset = getBCDataset();
  const rows = await unwrap('getLocations', () =>
    Dynamics365BusinessCentralService.GetItemsV3(env, companyId, dataset, 'locations'),
  );
  return rows.map((row) => {
    const r = recordOf(row);
    return {
      code: pickStr(r, 'code'),
      name: pickStr(r, 'displayName', 'name'),
    };
  });
}

export async function getItemAvailability(itemNo: string, locationCode: string): Promise<ItemAvailability> {
  const { env, companyId } = await getBCContext();
  const dataset = getBCDataset();
  const escItem = itemNo.replace(/'/g, "''");
  const escLoc = locationCode.replace(/'/g, "''");
  const filter = `itemNumber eq '${escItem}' and locationCode eq '${escLoc}'`;
  const rows = await unwrap('getItemAvailability', () =>
    Dynamics365BusinessCentralService.GetItemsV3(env, companyId, dataset, 'itemLedgerEntries', undefined, filter),
  );
  let available = 0;
  for (const row of rows) {
    available += pickNum(recordOf(row), 'quantity');
  }
  return { itemNo, locationCode, availableQuantity: available };
}

const POSTING_UNSUPPORTED_MESSAGE =
  'Transfer posting is not yet wired up. BC v2.0 OData does not expose transferOrder posting as a connector operation, ' +
  'and we have not yet identified a custom BC procedure that wraps the post-shipment / post-receipt codeunits. ' +
  'Next step: either (a) publish an AL extension procedure that calls codeunit 5704 "TransferOrder-Post Shipment" / 5705 "TransferOrder-Post Receipt" and call it via ExecuteProcedureV3, or (b) trigger posting via Power Automate flow.';

export async function postShipment(_orderId: string): Promise<void> {
  throw new Error(POSTING_UNSUPPORTED_MESSAGE);
}

export async function postReceipt(_orderId: string, _lines: { lineNo: number; qtyReceived: number }[]): Promise<void> {
  throw new Error(POSTING_UNSUPPORTED_MESSAGE);
}
