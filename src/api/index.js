import { getToken } from "../utils/secureStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// LOGIN
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

// GET USER PROFILE
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

export async function getUserById(adminId) {
    if (!adminId) return;

    const token = await getToken();
    const res = await fetch(`${API_URL}/user/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage = data.message || `Erro ao buscar detalhes do representante: Status ${res.status}`;
        throw new Error(errorMessage);
    }

    return data;
}

// PLACESID
export async function getPlaceDetailsByApi(placeId) {
  const token = await getToken();

  try {
    const res = await fetch(
      `${API_URL}/places/place-details?placeId=${encodeURIComponent(placeId)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erro ao buscar detalhes do local");
    }

    return data;
  } catch (err) {
    console.error("Erro na busca de detalhes do local:", err);
    throw err;
  }
}
// MARKERS
export async function createMarker(dto) {
  const token = await getToken();

  const res = await fetch(`${API_URL}/markers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro ao criar marcador");
  }

  return data;
}

// GET all markers (last 3 months)
export async function getAllMarkers() {
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/markers`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os marcadores");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar marcadores:", error);
    return [];
  }
}

// BAIRROS
export async function getBairroCentro(idBairro) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/bairro/centro/${idBairro}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar centroide do bairro.");
  return await res.json();
}

export async function getBairroPolygon(idBairro) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/bairro/polygon/${idBairro}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar polígono do bairro.");
  
  // O backend retorna { polygon: <GeoJsonPolygon> }. Precisamos do objeto interno.
  const data = await res.json();
  return data.polygon; 
}

export async function getAllBairros() {
    const token = await getToken();
    const res = await fetch(`${API_URL}/bairro`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar lista de bairros.");
    return await res.json();
}

export async function getBairroDetails(bairroId) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/bairro/${bairroId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    
    if (!res.ok) {
        const errorMessage = data.message || `Erro ao buscar detalhes do bairro: Status ${res.status}`;
        throw new Error(errorMessage);
    }
    return data;
}