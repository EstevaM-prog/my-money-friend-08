import axios from "axios";

// Instância base do Axios configurada para apontar para o seu backend Go + Gin
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// O backend utiliza as rotas e tipos que você definiu. 
// Vamos montar os services para que os seus componentes ou seu hook `useFinance` do Frontend os utilizem!

// ==========================================
// USUÁRIOS
// ==========================================
export const usersService = {
  getAll: async () => {
    const { data } = await api.get("/users");
    return data.data; // O retorno do Gin está formatado como { message: "...", data: [...] }
  },
  create: async (userData: any) => {
    const { data } = await api.post("/users", userData);
    return data;
  },
};

// ==========================================
// DESPESAS
// ==========================================
export const despesasService = {
  getAll: async () => {
    const { data } = await api.get("/despesas");
    return data.data;
  },
  create: async (despesaData: any) => {
    const { data } = await api.post("/despesas", despesaData);
    return data;
  },
};

// ==========================================
// RECEITAS
// ==========================================
export const receitasService = {
  getAll: async () => {
    const { data } = await api.get("/receitas");
    return data.data;
  },
  create: async (receitaData: any) => {
    const { data } = await api.post("/receitas", receitaData);
    return data;
  },
};

// Siga esse padrão e crie objects (services) para Cartão, Meta, Investment e Categories!
