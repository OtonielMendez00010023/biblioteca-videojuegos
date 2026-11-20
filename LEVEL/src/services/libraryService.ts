import api from "./api";

export interface LibraryGame {
  id_biblioteca: number;
  fecha_adquisicion: string;
  id_videojuego: number;
  titulo: string;
  estudio: string | null;
  imagen: string | null;
}

export async function claimGames(
  id_compra: number
): Promise<{ message: string; juegos_nuevos: number }> {
  const response = await api.post("/biblioteca/reclamar", { id_compra });
  return response.data;
}

export async function getMyLibrary(): Promise<LibraryGame[]> {
  const response = await api.get<LibraryGame[]>("/biblioteca");
  return response.data;
}