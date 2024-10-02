import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
  },
  });


  export const getSecretariosPaginados = async (page) => {
    try {
        const response = await api.get(`/secretario/paginado?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do secretário:", error);
        throw error;
    }
};