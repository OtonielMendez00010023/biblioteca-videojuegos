import api from "./api";

export interface LoginResponse {
  message: string;
  token: string;
  rol: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id_usuario: number;
    nombre: string;
    correo: string;
  };
}

export async function login(
  correo: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", {
    correo,
    password,
  });

  sessionStorage.setItem("level_token", response.data.token);
  sessionStorage.setItem("level_role", response.data.rol);

  return response.data;
}

export async function register(
  user: RegisterData
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    user
  );

  return response.data;
}

export function logout(): void {
  sessionStorage.removeItem("level_token");
  sessionStorage.removeItem("level_role");
}