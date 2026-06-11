import type { TransferOrder, TransferOrderLine, Location, ItemAvailability, Item } from './types';

export const mockLocations: Location[] = [
  { code: 'EAST',  name: 'East Warehouse' },
  { code: 'WEST',  name: 'West Warehouse' },
  { code: 'NORTH', name: 'North Warehouse' },
  { code: 'SOUTH', name: 'South Warehouse' },
];

export const mockItems: Item[] = [
  { itemNo: 'ITEM-1001', description: 'Cordless drill 18V',        unit: 'PCS' },
  { itemNo: 'ITEM-1002', description: 'Steel wood screws 1.5in',   unit: 'BOX' },
  { itemNo: 'ITEM-1003', description: 'Safety goggles anti-fog',   unit: 'PCS' },
  { itemNo: 'ITEM-1004', description: 'LED work light 30W',        unit: 'PCS' },
  { itemNo: 'ITEM-1005', description: 'Nitrile gloves L',          unit: 'BOX' },
  { itemNo: 'ITEM-1006', description: 'Heavy-duty extension cord', unit: 'PCS' },
];

export const mockTransferOrders: TransferOrder[] = [
  { id: 'TO-001', no: 'TO-2024-001', status: 'Open',       fromLocationCode: 'EAST',  toLocationCode: 'WEST',  shipmentDate: '2026-06-12', receiptDate: '2026-06-15', lineCount: 3 },
  { id: 'TO-002', no: 'TO-2024-002', status: 'Open',       fromLocationCode: 'NORTH', toLocationCode: 'EAST',  shipmentDate: '2026-06-13', receiptDate: '2026-06-16', lineCount: 2 },
  { id: 'TO-003', no: 'TO-2024-003', status: 'In Transit', fromLocationCode: 'WEST',  toLocationCode: 'SOUTH', shipmentDate: '2026-06-08', receiptDate: '2026-06-14', lineCount: 4 },
  { id: 'TO-004', no: 'TO-2024-004', status: 'In Transit', fromLocationCode: 'SOUTH', toLocationCode: 'EAST',  shipmentDate: '2026-06-09', receiptDate: '2026-06-13', lineCount: 1 },
  { id: 'TO-005', no: 'TO-2024-005', status: 'Received',   fromLocationCode: 'EAST',  toLocationCode: 'NORTH', shipmentDate: '2026-06-02', receiptDate: '2026-06-06', lineCount: 2 },
  { id: 'TO-006', no: 'TO-2024-006', status: 'Received',   fromLocationCode: 'NORTH', toLocationCode: 'WEST',  shipmentDate: '2026-06-03', receiptDate: '2026-06-08', lineCount: 3 },
];

interface LineDraft {
  itemNo: string;
  description: string;
  quantity: number;
  unit: 'PCS' | 'BOX';
}

const drafts: Record<string, LineDraft[]> = {
  'TO-001': [
    { itemNo: 'ITEM-1001', description: 'Cordless drill 18V',         quantity: 12, unit: 'PCS' },
    { itemNo: 'ITEM-1002', description: 'Steel wood screws 1.5in',    quantity: 50, unit: 'BOX' },
    { itemNo: 'ITEM-1003', description: 'Safety goggles anti-fog',    quantity: 20, unit: 'PCS' },
  ],
  'TO-002': [
    { itemNo: 'ITEM-1004', description: 'LED work light 30W',         quantity:  8, unit: 'PCS' },
    { itemNo: 'ITEM-1005', description: 'Nitrile gloves L',           quantity: 30, unit: 'BOX' },
  ],
  'TO-003': [
    { itemNo: 'ITEM-1001', description: 'Cordless drill 18V',         quantity:  6, unit: 'PCS' },
    { itemNo: 'ITEM-1003', description: 'Safety goggles anti-fog',    quantity: 25, unit: 'PCS' },
    { itemNo: 'ITEM-1006', description: 'Heavy-duty extension cord',  quantity: 15, unit: 'PCS' },
    { itemNo: 'ITEM-1002', description: 'Steel wood screws 1.5in',    quantity: 40, unit: 'BOX' },
  ],
  'TO-004': [
    { itemNo: 'ITEM-1005', description: 'Nitrile gloves L',           quantity: 18, unit: 'BOX' },
  ],
  'TO-005': [
    { itemNo: 'ITEM-1004', description: 'LED work light 30W',         quantity: 10, unit: 'PCS' },
    { itemNo: 'ITEM-1006', description: 'Heavy-duty extension cord',  quantity:  5, unit: 'PCS' },
  ],
  'TO-006': [
    { itemNo: 'ITEM-1001', description: 'Cordless drill 18V',         quantity:  9, unit: 'PCS' },
    { itemNo: 'ITEM-1002', description: 'Steel wood screws 1.5in',    quantity: 45, unit: 'BOX' },
    { itemNo: 'ITEM-1003', description: 'Safety goggles anti-fog',    quantity: 22, unit: 'PCS' },
  ],
};

export const mockTransferOrderLines: TransferOrderLine[] = mockTransferOrders.flatMap((order) => {
  const lines = drafts[order.id] ?? [];
  const isReceived  = order.status === 'Received';
  const isInTransit = order.status === 'In Transit';
  return lines.map((draft, i) => ({
    id: `${order.id}-L${String(i + 1).padStart(2, '0')}`,
    transferOrderId: order.id,
    lineNo: (i + 1) * 10000,
    itemNo: draft.itemNo,
    description: draft.description,
    quantity: draft.quantity,
    unit: draft.unit,
    qtyShipped:  isReceived || isInTransit ? draft.quantity : 0,
    qtyReceived: isReceived ? draft.quantity : 0,
  }));
});

export const mockItemAvailability: ItemAvailability[] = [
  { itemNo: 'ITEM-1001', locationCode: 'EAST', availableQuantity: 120 },
];
