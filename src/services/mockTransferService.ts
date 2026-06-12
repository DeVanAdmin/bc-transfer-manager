import type {
  TransferOrder,
  TransferOrderLine,
  Location,
  ItemAvailability,
  NewTransferOrderLine,
  Item,
  Company,
} from './types';
import {
  mockTransferOrders,
  mockTransferOrderLines,
  mockLocations,
  mockItemAvailability,
  mockItems,
  mockCompanies,
} from './mockData';

const READ_DELAY_MS = 600;
const WRITE_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTransferOrders(): Promise<TransferOrder[]> {
  await delay(READ_DELAY_MS);
  return mockTransferOrders.map((o) => ({ ...o }));
}

export async function getTransferOrderLines(orderId: string): Promise<TransferOrderLine[]> {
  await delay(READ_DELAY_MS);
  return mockTransferOrderLines
    .filter((l) => l.transferOrderId === orderId)
    .map((l) => ({ ...l }));
}

export async function getLocations(): Promise<Location[]> {
  await delay(READ_DELAY_MS);
  return mockLocations.map((l) => ({ ...l }));
}

export async function getItems(): Promise<Item[]> {
  await delay(READ_DELAY_MS);
  return mockItems.map((i) => ({ ...i }));
}

export async function getCompanies(): Promise<Company[]> {
  await delay(READ_DELAY_MS);
  return mockCompanies.map((c) => ({ ...c }));
}

let mockActiveCompanyId: string | null = null;

export function setActiveCompany(companyId: string): void {
  // Mock data is a single fixed set, so this only drives the company dropdown.
  mockActiveCompanyId = companyId;
}

export function getActiveCompanyId(): string | null {
  return mockActiveCompanyId;
}

export function getTransferSourceDiagnostic(): string {
  return `mock data → ${mockTransferOrders.length} orders`;
}

export async function getItemAvailability(itemNo: string, locationCode: string): Promise<ItemAvailability> {
  await delay(READ_DELAY_MS);
  const match = mockItemAvailability.find((a) => a.itemNo === itemNo && a.locationCode === locationCode);
  return match ? { ...match } : { itemNo, locationCode, availableQuantity: 0 };
}

export async function postShipment(orderId: string): Promise<void> {
  await delay(WRITE_DELAY_MS);
  // eslint-disable-next-line no-console
  console.log('POST_SHIPMENT triggered — will connect to Power Automate flow in phase 4');
  const order = mockTransferOrders.find((o) => o.id === orderId || o.no === orderId);
  if (order) order.status = 'In Transit';
}

export async function postReceipt(
  orderId: string,
  _lines: { lineNo: number; qtyReceived: number }[],
): Promise<void> {
  await delay(WRITE_DELAY_MS);
  // eslint-disable-next-line no-console
  console.log('POST_RECEIPT triggered — will connect to Power Automate flow in phase 4');
  const order = mockTransferOrders.find((o) => o.id === orderId || o.no === orderId);
  if (order) order.status = 'Received';
}

export async function createTransferOrder(
  fromLocationCode: string,
  toLocationCode: string,
  shipmentDate: string,
  receiptDate: string,
  lines: NewTransferOrderLine[],
  _originEmail: string,
  _destinationEmail: string,
): Promise<TransferOrder> {
  await delay(WRITE_DELAY_MS);
  // eslint-disable-next-line no-console
  console.log('CREATE_TRANSFER_ORDER triggered — will connect to BC/Power Automate in phase 4');
  const newOrder: TransferOrder = {
    id: crypto.randomUUID(),
    no: 'TO-' + Date.now(),
    status: 'Open',
    fromLocationCode,
    toLocationCode,
    shipmentDate,
    receiptDate,
    lineCount: lines.length,
  };
  mockTransferOrders.push(newOrder);
  // Also push lines so the order's expansion in CoordinatorView shows content
  // instead of "No line items found".
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    mockTransferOrderLines.push({
      id: `${newOrder.id}-L${String(i + 1).padStart(2, '0')}`,
      transferOrderId: newOrder.id,
      lineNo: (i + 1) * 10000,
      itemNo: l.itemNo,
      description: l.description,
      quantity: l.quantity,
      unit: l.unit,
      qtyShipped: 0,
      qtyReceived: 0,
    });
  }
  return newOrder;
}
