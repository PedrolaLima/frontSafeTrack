import { getToken } from "../utils/secureStore";
import { API_URL} from '@env'

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
