import type { TransferOrder, TransferOrderLine, Location, ItemAvailability } from './types';
import {
  mockTransferOrders,
  mockTransferOrderLines,
  mockLocations,
  mockItemAvailability,
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
