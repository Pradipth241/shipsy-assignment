// src/types/globals.d.ts

// This defines the detailed structure of a single shipment
export interface Shipment {
  id: string;
  shipperName: string;
  shipperPhone: string;
  shipperAddress: string;
  shipperEmail: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverEmail: string;
  typeOfShipment: string;
  weight: number;
  packages: number;
  product: string;
  quantity: number;
  paymentMode: string;
  totalFreight: number;
  ratePerKg: number;
  carrier: string;
  mode: string;
  origin: string;
  destination: string;
  pickupDate: Date;
  expectedDeliveryDate: Date;
  comments?: string;
  status: string;
  isFragile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// This defines the shape of the form data for creating/editing
export type ShipmentFormData = Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'totalFreight'>;