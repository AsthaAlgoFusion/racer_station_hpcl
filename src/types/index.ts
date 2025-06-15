export interface Product {
  id: number;
  name: string;
  // price: number; // Removed
  description: string;
  createdAt: string;
  brandName: string;
  apiSpec: string;
  packSize: string;
  uom: string; // Unit of Measure
  unitsPerCase: number;
  qtyPerCaseL?: number; // Quantity per Case in Liters (optional)
}

export interface SparePart {
  id: number;
  name: string;
  partNumber: string;
  compatibleWith: string;
  // price: number; // Removed
  supplier: string;
  createdAt: string;
  brandName: string;
  apiSpec: string;
  packSize: string;
  uom: string; // Unit of Measure
  unitsPerCase: number;
  qtyPerCaseL?: number; // Quantity per Case in Liters (optional)
}
