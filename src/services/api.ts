import axios from 'axios';

// Importa a URL base do arquivo .env (usando Vite)
const baseURL = import.meta.env.VITE_API_URL ;

// Cria uma instância do Axios com a URL base
const api = axios.create({
  baseURL,
});

// Exemplo de função para usar api.get
export const fetchData = async (endpoint: string, params?: Record<string, any>) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export default api;