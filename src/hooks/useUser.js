import { useEffect, useState } from "react";
import { getUserProfile } from "../api";

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (e) {
        console.log("Erro ao carregar user:", e);
      }
    }
    load();
  }, []);

  return user;
}
