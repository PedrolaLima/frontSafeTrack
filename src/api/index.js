import { getToken, deleteToken } from "../utils/secureStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchWithAuth(endpoint, options = {}) {
    const token = await getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers, 
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
    
    const data = await res.json().catch(() => ({ message: "Resposta não é JSON ou vazia." })); 

    if (res.status === 401) {
        console.error("Token expirado (401). Redirecionando para login.");
        deleteToken();
        throw new Error("Sessão expirada. Por favor, logue novamente."); 
    }

    if (!res.ok) {
        const errorMessage = data.message || `Erro na requisição: Status ${res.status}`;
        throw new Error(errorMessage);
    }

    return data;
}

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

// CREATE USER
export async function createUser(dto, role) {
    let endpoint = "";

    if (role === "ADMIN") {
        endpoint = "/user/representante";
    } else if (role === "REPRESENTANTE") {
        endpoint = "/user/morador";
    } else {
        throw new Error("Usuário sem permissão para cadastrar.");
    }

    return fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export async function getUserProfile() {
  return fetchWithAuth('/me');
}

export async function getUserById(adminId) {
    if (!adminId) throw new Error("ID do representante é obrigatório.");
    return fetchWithAuth(`/user/${adminId}`);
}

export async function getAllUsers() {
    return fetchWithAuth('/user');
}

export async function getUsersByBairro() {
    return fetchWithAuth('/user/bairro');
}

export async function activateOrDeactivateUser(userId) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");
    return fetchWithAuth(`/user/${userId}/activate-deactivate`, {
        method: "PUT",
    });
}

// --- BAIRROS ---

export async function getAllBairros() {
    return fetchWithAuth('/bairro');
}

export async function getBairroDetails(bairroId) {
    if (!bairroId) throw new Error("ID do Bairro é obrigatório.");
    return fetchWithAuth(`/bairro/${bairroId}`);
}

export async function getBairroCentro(idBairro) {
    if (!idBairro) throw new Error("ID do Bairro é obrigatório.");
    return fetchWithAuth(`/bairro/centro/${idBairro}`);
}

export async function getBairroPolygon(idBairro) {
    if (!idBairro) throw new Error("ID do Bairro é obrigatório.");
    const data = await fetchWithAuth(`/bairro/polygon/${idBairro}`);
    return data.polygon; 
}

// CREATE MARKER
export async function createMarker(dto) {
  return fetchWithAuth('/markers', {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// GET all markers (last 3 months)
export async function getAllMarkers() {
    try {
        return fetchWithAuth('/markers');
    } catch (error) {
        console.error("Erro ao carregar marcadores:", error);
        return []; 
    }
}

// PLACESID
export async function getPlaceDetailsByApi(placeId) {
    try {
        return fetchWithAuth(`/places/place-details?placeId=${encodeURIComponent(placeId)}`);
    } catch (err) {
        console.error("Erro na busca de detalhes do local:", err);
        throw err;
    }
}

export async function deleteMarker(markerId) {
    if (!markerId) throw new Error("ID do marcador é obrigatório.");
    return fetchWithAuth(`/markers/${markerId}`, {
        method: "DELETE",
    });
}