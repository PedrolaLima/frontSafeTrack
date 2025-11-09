import { getToken } from "../utils/secureStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function login(email, password) {

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data.message || `Erro no login: Status ${res.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export async function createUser(dto, role) {
  const token = await getToken();

  let endpoint = "";

  if (role === "ADMIN") {
    endpoint = "/user/representante";
  } else if (role === "REPRESENTANTE") {
    endpoint = "/user/morador";
  } else {
    throw new Error("Usuário sem permissão para cadastrar.");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro ao criar usuário");
  }

  return data;
}


// request GET autenticada (server)
export async function getUserProfile() {
  const token = await getToken();

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message ?? "Erro ao buscar perfil");

  return data;
}
