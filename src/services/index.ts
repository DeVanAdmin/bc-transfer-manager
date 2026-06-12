import * as real from './transferService';
import * as mock from './mockTransferService';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const impl = USE_MOCK ? mock : real;

export const getTransferOrders     = impl.getTransferOrders;
export const getTransferOrderLines = impl.getTransferOrderLines;
export const getLocations          = impl.getLocations;
export const getItems              = impl.getItems;
export const getCompanies          = impl.getCompanies;
export const setActiveCompany      = impl.setActiveCompany;
export const getActiveCompanyId    = impl.getActiveCompanyId;
export const getEnvironments       = impl.getEnvironments;
export const getActiveEnvironment  = impl.getActiveEnvironment;
export const setActiveEnvironment  = impl.setActiveEnvironment;
export const getItemAvailability   = impl.getItemAvailability;
export const postShipment          = impl.postShipment;
export const postReceipt           = impl.postReceipt;
export const createTransferOrder   = impl.createTransferOrder;

export * from './types';
