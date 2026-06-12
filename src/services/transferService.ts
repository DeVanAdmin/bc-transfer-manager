import { Dynamics365BusinessCentralService, BCTransferManager_CreateTransferOrderService } from '../generated';
import { getBCContext, getBCDataset } from './bcContext';
export { getCompanies, setActiveCompany, getActiveCompanyId } from './bcContext';
import type {
  TransferOrder,
  TransferOrderLine,
  Location,
  ItemAvailability,
  TransferStatus,
  NewTransferOrderLine,
  Item,
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

// The custom "Transfer Order API" page (page 70000) exposes the full Transfer
// Header table with no filter, via route devan/transferManager/v1.0. The
// standard v2.0/transferOrders entity returns only a subset, which is why some
// orders never showed. Prefer the custom API; fall back so we never regress.
const TRANSFER_API_DATASET = 'devan/transferManager/v1.0';
const TRANSFER_API_TABLE = 'transferOrderActions';
const PAGE_SIZE = 5000;

type PagedResult<T> = { ok: true; rows: T[] } | { ok: false; error: string };

async function fetchAllRows<T>(
  page: (
    top: number,
    skip: number,
  ) => Promise<{ success: boolean; data?: { value?: T[] }; error?: { message?: string } | Error }>,
): Promise<PagedResult<T>> {
  const all: T[] = [];
  let skip = 0;
  // Page through results; cap iterations as a runaway guard.
  for (let i = 0; i < 100; i++) {
    const res = await page(PAGE_SIZE, skip);
    if (!res.success) {
      const msg = (res.error && 'message' in res.error ? res.error.message : undefined) ?? 'unknown';
      return { ok: false, error: msg };
    }
    const rows = res.data?.value ?? [];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
    skip += PAGE_SIZE;
  }
  return { ok: true, rows: all };
}

// TEMP diagnostic: records which source served the order list and how many
// rows each returned, so the UI can show it. Remove once the source is settled.
let transferSourceDiag = '';
export function getTransferSourceDiagnostic(): string {
  return transferSourceDiag;
}

export async function getTransferOrders(): Promise<TransferOrder[]> {
  const { env, companyId, companyName } = await getBCContext();
  const dataset = getBCDataset();

  // Try the custom, unfiltered Transfer Order API first.
  const custom = await fetchAllRows((top, skip) =>
    Dynamics365BusinessCentralService.GetItemsV3(
      env, companyId, TRANSFER_API_DATASET, TRANSFER_API_TABLE, undefined, undefined, undefined, top, skip,
    ),
  );

  let result = custom;
  if (custom.ok) {
    transferSourceDiag = `company "${companyName}" · custom ${TRANSFER_API_DATASET}/${TRANSFER_API_TABLE} → ${custom.rows.length} orders`;
  } else {
    // Fall back to the standard entity if the custom API isn't reachable.
    const fallback = await fetchAllRows((top, skip) =>
      Dynamics365BusinessCentralService.GetItemsV3(
        env, companyId, dataset, 'transferOrders', undefined, undefined, undefined, top, skip,
      ),
    );
    result = fallback;
    transferSourceDiag =
      `company "${companyName}" · custom FAILED (${custom.error}) → fallback v2.0/transferOrders ` +
      `→ ${fallback.ok ? `${fallback.rows.length} orders` : `FAILED (${fallback.error})`}`;
  }
  if (!result.ok) {
    throw new Error(`getTransferOrders failed: ${result.error}`);
  }

  return result.rows.map((row) => {
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

export async function getItems(): Promise<Item[]> {
  const { env, companyId } = await getBCContext();
  const dataset = getBCDataset();
  const rows = await unwrap('getItems', () =>
    Dynamics365BusinessCentralService.GetItemsV3(env, companyId, dataset, 'items'),
  );
  return rows
    .map((row) => {
      const r = recordOf(row);
      return {
        itemNo: pickStr(r, 'number', 'no', 'itemNo'),
        description: pickStr(r, 'displayName', 'description', 'name'),
        unit: pickStr(r, 'baseUnitOfMeasureCode', 'baseUnitOfMeasure', 'unitOfMeasureCode') || 'PCS',
      };
    })
    .filter((it) => it.itemNo.length > 0);
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

// The Create Transfer Order flow responds with a single text output (e.g.
// "SUCCESS: TO000123"). The generator types Run() as IOperationResult<void>,
// so the response payload isn't typed — coerce it to that response string,
// whether the connector returns it raw or wrapped in an outputs object.
function coerceFlowResult(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    for (const v of Object.values(data as Record<string, unknown>)) {
      if (typeof v === 'string') return v;
    }
  }
  return '';
}

export async function createTransferOrder(
  fromLocationCode: string,
  toLocationCode: string,
  shipmentDate: string,
  receiptDate: string,
  lines: NewTransferOrderLine[],
  originEmail: string,
  destinationEmail: string,
): Promise<TransferOrder> {
  // Resolve human-readable location names to pass into the flow.
  const locations = await getLocations();
  const fromLocationName = locations.find((l) => l.code === fromLocationCode)?.name ?? fromLocationCode;
  const toLocationName = locations.find((l) => l.code === toLocationCode)?.name ?? toLocationCode;

  const orderDataJson = {
    fromLocationCode,
    fromLocationName,
    toLocationCode,
    toLocationName,
    inTransitCode: 'OWN LOG.',
    shipmentDate,
    receiptDate,
    originEmail,
    destinationEmail,
    lines: lines.map((l) => ({
      itemNo: l.itemNo,
      description: l.description,
      quantity: l.quantity,
      unit: l.unit,
    })),
  };

  const result = await BCTransferManager_CreateTransferOrderService.Run({
    text: JSON.stringify(orderDataJson),
  });

  if (!result.success) {
    const msg = (result.error && 'message' in result.error ? result.error.message : undefined) ?? 'unknown';
    throw new Error(`createTransferOrder flow failed: ${msg}`);
  }

  const raw = coerceFlowResult(result.data);
  if (!raw.startsWith('SUCCESS:')) {
    throw new Error(raw || 'createTransferOrder flow did not return a success response.');
  }

  const no = raw.slice('SUCCESS:'.length).trim();
  return {
    id: crypto.randomUUID(),
    no,
    status: 'Open',
    fromLocationCode,
    toLocationCode,
    shipmentDate,
    receiptDate,
    lineCount: lines.length,
  };
}
