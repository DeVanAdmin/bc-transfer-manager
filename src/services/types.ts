export type TransferStatus = 'Open' | 'In Transit' | 'Received';

export interface TransferOrder {
  id: string;
  no: string;
  status: TransferStatus;
  fromLocationCode: string;
  toLocationCode: string;
  shipmentDate: string;
  receiptDate: string;
  lineCount: number;
}

export interface TransferOrderLine {
  id: string;
  transferOrderId: string;
  lineNo: number;
  itemNo: string;
  description: string;
  quantity: number;
  unit: string;
  qtyShipped: number;
  qtyReceived: number;
}

export interface Location {
  code: string;
  name: string;
}

export interface ItemAvailability {
  itemNo: string;
  locationCode: string;
  availableQuantity: number;
}

export interface NewTransferOrderLine {
  itemNo: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Item {
  itemNo: string;
  description: string;
  unit: string;
}
