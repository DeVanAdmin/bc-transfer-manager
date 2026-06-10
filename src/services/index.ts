import * as real from './transferService';
import * as mock from './mockTransferService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const impl = USE_MOCK ? mock : real;

export const getTransferOrders     = impl.getTransferOrders;
export const getTransferOrderLines = impl.getTransferOrderLines;
export const getLocations          = impl.getLocations;
export const getItemAvailability   = impl.getItemAvailability;
export const postShipment          = impl.postShipment;
export const postReceipt           = impl.postReceipt;

export * from './types';
