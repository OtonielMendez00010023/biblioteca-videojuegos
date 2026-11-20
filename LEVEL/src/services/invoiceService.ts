import api from "./api";

export interface GeneratedInvoice {
  id_factura: number;
  id_compra: number;
  numero_factura: string;
  fecha_emision: string;
  subtotal: string | number;
  total: string | number;
  estado: string;
}

export interface InvoiceDetail {
  id_factura: number;
  numero_factura: string;
  fecha_emision: string;
  total: string | number;
  id_usuario: number;
  correo_comprador: string;
}

export async function generateInvoice(
  id_compra: number
): Promise<{ message: string; factura: GeneratedInvoice }> {
  const response = await api.post("/facturas/generar", { id_compra });
  return response.data;
}

// Endpoint vulnerable a IDOR (cualquier usuario autenticado puede consultar cualquier ID)
export async function getInvoiceById(id: number): Promise<InvoiceDetail> {
  const response = await api.get<InvoiceDetail>(`/facturas/${id}`);
  return response.data;
}