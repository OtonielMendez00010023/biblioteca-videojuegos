import api from "./api";

export interface Sale { numero_factura: string; fecha_emision: string; total: string | number; nombre: string; apellido: string; correo: string; items: { id_videojuego: number; titulo: string; cantidad: number; precio_unitario: string | number }[]; }

export interface MyInvoice {
  id_factura: number;
  numero_factura: string;
  fecha_emision: string;
  total: string | number;
  estado: string;
  id_compra: number;
  metodo_pago: "TARJETA" | "BITCOIN";
  cantidad_productos: number;
}

export interface InvoiceDetail extends MyInvoice {
  subtotal: string | number;
  estado_factura: string;
  fecha_compra: string;
  nombre_facturacion: string | null;
  correo_facturacion: string | null;
  direccion_facturacion: string | null;
  referencia_pago: string | null;
  titular_tarjeta: string | null;
  vencimiento_tarjeta: string | null;
  referencia_transaccion: string | null;
  productos: { titulo: string; cantidad: number; precio_unitario: string | number; subtotal: string | number }[];
}

export async function checkout(items: { id_videojuego: number; cantidad: number }[], metodo_pago: "TARJETA" | "BITCOIN", referencia_pago: string, facturacion: unknown, pago_demo: unknown) {
  return (await api.post("/compras/checkout", { items, metodo_pago, referencia_pago, facturacion, pago_demo })).data;
}

export async function getVendorSales(): Promise<Sale[]> {
  return (await api.get<Sale[]>("/facturas/vendedor")).data;
}

export async function getAdminSales(): Promise<Sale[]> {
  return (await api.get<Sale[]>("/facturas/admin")).data;
}

export async function getMyInvoices(): Promise<MyInvoice[]> {
  return (await api.get<MyInvoice[]>("/facturas/mis-facturas")).data;
}

export async function getInvoiceDetail(id: number): Promise<InvoiceDetail> {
  return (await api.get<InvoiceDetail>(`/facturas/${id}`)).data;
}
