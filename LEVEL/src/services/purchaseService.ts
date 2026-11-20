import api from "./api";

export interface CheckoutItem {
  id_videojuego: number;
  cantidad: number;
}

export interface CheckoutResponse {
  message: string;
  id_compra: number;
  total: number;
}

export async function checkout(
  items: CheckoutItem[],
  metodo_pago = "TARJETA"
): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>("/compras/checkout", {
    items,
    metodo_pago,
  });
  return response.data;
}