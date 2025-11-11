import { useEffect, useState } from "react";
import { getUserProfile } from "../api";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (e) {
        console.log("Erro ao carregar user:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { user, loading, error };
}
