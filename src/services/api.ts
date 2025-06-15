import { faker } from '@faker-js/faker';
import { Product, SparePart } from '../types';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock products
const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.commerce.productName(),
    // price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })), // Removed
    description: faker.commerce.productDescription(),
    createdAt: faker.date.past().toISOString(),
    brandName: faker.company.name(),
    apiSpec: `API-${faker.string.alphanumeric(6).toUpperCase()}`,
    packSize: `${faker.number.int({ min: 1, max: 1000 })}${faker.helpers.arrayElement(['ml', 'g', 'pcs', 'oz'])}`,
    uom: faker.helpers.arrayElement(['ml', 'g', 'pcs', 'kg', 'L', 'unit']),
    unitsPerCase: faker.number.int({ min: 1, max: 100 }),
    qtyPerCaseL: faker.helpers.maybe(() => parseFloat(faker.number.float({ min: 0.1, max: 20, precision: 1 }).toFixed(1)), { probability: 0.6 }),
  }));
};

// Generate mock spare parts
const generateMockSpareParts = (count: number): SparePart[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${faker.vehicle.manufacturer()} ${faker.commerce.productAdjective()} Part`,
    partNumber: `P${faker.string.alphanumeric(8).toUpperCase()}`,
    compatibleWith: faker.vehicle.model(),
    // price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })), // Removed
    supplier: faker.company.name(),
    createdAt: faker.date.past().toISOString(),
    brandName: faker.company.name(),
    apiSpec: `SP-API-${faker.string.alphanumeric(5).toUpperCase()}`,
    packSize: `${faker.number.int({ min: 1, max: 10 })}${faker.helpers.arrayElement(['unit', 'set', 'pcs'])}`,
    uom: faker.helpers.arrayElement(['unit', 'set', 'pcs']),
    unitsPerCase: faker.number.int({ min: 1, max: 24 }),
    qtyPerCaseL: faker.helpers.maybe(() => parseFloat(faker.number.float({ min: 0.05, max: 5, precision: 2 }).toFixed(2)), { probability: 0.3 }),
  }));
};

export const productAPI = {
  async getProducts(): Promise<Product[]> {
    await delay(800); // Simulate API delay
    return generateMockProducts(25);
  },
};

export const sparePartAPI = {
  async getSpareParts(): Promise<SparePart[]> {
    await delay(600); // Simulate API delay
    return generateMockSpareParts(30);
  },
};
