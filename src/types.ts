/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Category {
  Cables = "Cables",
  Iluminacion = "Iluminación",
  CanosTubos = "Caños/Tubos",
  Termica = "Térmica",
  TomasInterruptores = "Tomas e Interruptores",
  Accesorios = "Accesorios",
  Tableros = "Tableros",
}

export enum Unit {
  Unidad = "Unidad",
  Metro = "Metro",
  Rollo = "Rollo",
  Caja = "Caja",
}

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: Category;
  unit: Unit;
  stockActual: number;
  stockMinimo: number;
  iva: number;
  priceCosto: number;
  pricePublico: number;
  priceGremio: number;
  priceMayorista: number;
}

export enum SaleType {
  Presupuesto = "Presupuesto",
  FacturaA = "Factura A",
  FacturaB = "Factura B",
  FacturaC = "Factura C",
}

export enum SaleStatus {
  Pendiente = "Pendiente",
  Confirmada = "Confirmada",
}

export enum PaymentMethod {
  EfectivoTransferencia = "Efectivo/Transferencia",
  TarjetaCredito = "Tarjeta de Crédito",
  TarjetaDebito = "Tarjeta de Débito",
  QR = "QR",
}

export interface Sale {
  id: string;
  date: string;
  type: SaleType;
  client: string;
  cuit?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  itemsCount: number;
  total: number;
  status: SaleStatus;
  isDeclared?: boolean;
}

export type View = "dashboard" | "ventas" | "inventario" | "historial";

export type PriceList = "publico" | "gremio" | "mayorista";

export interface CartItem {
  product: Product;
  quantity: number;
}
