import axios from "axios";

/**
 * My Money Friend - API Client Configuration
 * Base URL: Points to the Go/Gin backend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cashflow-dg8a.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper for data extraction to keep code DRY
const extractData = (res: any) => res.data.data;

/**
 * 👤 USER SERVICE
 */
export const usersService = {
  getAll: () => api.get("/users").then(extractData),
  create: (payload: any) => api.post("/users", payload).then(extractData),
  update: (id: string, payload: any) => api.put(`/users/${id}`, payload).then(extractData),
  delete: (id: string) => api.delete(`/users/${id}`),
};

/**
 * 💳 ACCOUNTS SERVICE
 */
export const accountsService = {
  getAll: () => api.get("/cartoes").then(extractData),
  create: (payload: any) => api.post("/cartoes", payload).then(extractData),
  update: (id: string, payload: any) => api.put(`/cartoes/${id}`, payload).then(extractData),
  delete: (id: string) => api.delete(`/cartoes/${id}`),
};

/**
 * 💸 TRANSACTIONS SERVICE
 */
export const transactionsService = {
  // Merges both income (receitas) and expenses (despesas) into a single stream
  getAll: async () => {
    const [despesas, receitas] = await Promise.all([
      api.get("/despesas"),
      api.get("/receitas")
    ]);
    const d = despesas.data.data || [];
    const r = receitas.data.data || [];
    return [...d, ...r];
  },
  create: (payload: any) => {
    const endpoint = payload.type === "income" ? "/receitas" : "/despesas";
    return api.post(endpoint, payload).then(extractData);
  },
  delete: (id: string, type: string) => {
    const endpoint = type === "income" ? "/receitas" : "/despesas";
    return api.delete(`${endpoint}/${id}`);
  },
};

/**
 * 🎯 GOALS SERVICE
 */
export const goalsService = {
  getAll: () => api.get("/metas").then(extractData),
  create: (payload: any) => api.post("/metas", payload).then(extractData),
  update: (id: string, payload: any) => api.put(`/metas/${id}`, payload).then(extractData),
  delete: (id: string) => api.delete(`/metas/${id}`),
};

/**
 * 🏷️ CATEGORIES SERVICE
 */
export const categoriesService = {
  getAll: () => api.get("/categories").then(extractData),
  create: (payload: any) => api.post("/categories", payload).then(extractData),
  update: (id: string, payload: any) => api.put(`/categories/${id}`, payload).then(extractData),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

/**
 * 📈 INVESTMENTS SERVICE
 */
export const investmentsService = {
  getAll: () => api.get("/investments").then(extractData),
  create: (payload: any) => api.post("/investments", payload).then(extractData),
  delete: (id: string) => api.delete(`/investments/${id}`),
};

/**
 * 📝 BUDGET RULES SERVICE
 */
export const budgetRulesService = {
  getAll: () => api.get("/budget-rules").then(extractData),
  create: (payload: any) => api.post("/budget-rules", payload).then(extractData),
  update: (id: string, payload: any) => api.put(`/budget-rules/${id}`, payload).then(extractData),
  delete: (id: string) => api.delete(`/budget-rules/${id}`),
};
