import api from "./api";

export interface BackendGame {
  id_videojuego: number;
  id_vendedor: number;
  titulo: string;
  descripcion: string | null;
  estudio: string | null;
  tagline: string | null;
  precio: string | number;
  stock: number;
  imagen: string | null;
  estado: string;
  fecha_publicacion: string;
  plataformas: string[];
  nombre_vendedor?: string;
  apellido_vendedor?: string;
  categorias?: string;
}

export interface CreateGamePayload {
  titulo: string;
  descripcion: string;
  estudio: string;
  tagline: string;
  precio: number;
  stock: number;
  imagen: string;
  categorias: number[];
  plataformas: string[];
}

export interface UpdateGamePayload {
  titulo: string;
  precio: number;
  stock: number;
}

const CATEGORY_MAP: Record<string, number> = {
  accion: 1,
  aventura: 2,
  deportes: 3,
  estrategia: 4,
  rpg: 5,
  simulacion: 6,
  terror: 7,
  carreras: 8,
};

// Convierte texto libre (ej. "Acción • Aventura") en IDs válidos de la BD
export function mapGenreToCategoryIds(genreText: string): number[] {
  const normalized = genreText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const ids = Object.entries(CATEGORY_MAP)
    .filter(([keyword]) => normalized.includes(keyword))
    .map(([, id]) => id);

  return ids.length > 0 ? ids : [1]; // Por defecto: 1 (ACCION)
}

export async function getGames(): Promise<BackendGame[]> {
  const response = await api.get<BackendGame[]>("/games");
  return response.data;
}

export async function createGame(payload: CreateGamePayload): Promise<{ message: string; id_videojuego: number }> {
  const response = await api.post("/games", payload);
  return response.data;
}

export async function updateGame(id: number, payload: UpdateGamePayload): Promise<{ message: string; juego: BackendGame }> {
  const response = await api.put(`/games/${id}`, payload);
  return response.data;
}

export async function deleteGame(id: number): Promise<{ message: string }> {
  const response = await api.delete(`/games/${id}`);
  return response.data;
}
