import api from "./api";

export interface Sale { numero_factura: string; fecha_emision: string; total: string | number; nombre: string; apellido: string; correo: string; items: { id_videojuego: number; titulo: string; cantidad: number; precio_unitario: string | number }[]; }

export async function checkout(items: { id_videojuego: number; cantidad: number }[], metodo_pago: "TARJETA" | "BITCOIN", referencia_pago: string) {
  return (await api.post("/compras/checkout", { items, metodo_pago, referencia_pago })).data;
}

export async function getVendorSales(): Promise<Sale[]> {
  return (await api.get<Sale[]>("/facturas/vendedor")).data;
}

export async function getAdminSales(): Promise<Sale[]> {
  return (await api.get<Sale[]>("/facturas/admin")).data;
}
