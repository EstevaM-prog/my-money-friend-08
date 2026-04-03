import { api } from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

const SESSION_KEY = "mymoneyfriend_session";
const SESSION_EXPIRY_KEY = "mymoneyfriend_session_expiry";
const SESSION_DAYS = 7;

// ─── Salva a sessão com validade de 7 dias ────────────────────────────────────
function saveSession(user: User) {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_EXPIRY_KEY, String(expiry));
}

// ─── Retorna a sessão válida ou null ──────────────────────────────────────────
export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!raw || !expiry) return null;

    // Se a sessão expirou, limpa tudo e força novo login
    if (Date.now() > Number(expiry)) {
      logout();
      return null;
    }

    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

// ─── Registra novo usuário via API ────────────────────────────────────────────
export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await api.post("/users", { name, email, password });
  const user: User = res.data.data;
  saveSession(user); // sessão de 7 dias a partir do cadastro
  return user;
}

// ─── Login via API + renova sessão por mais 7 dias ────────────────────────────
export async function login(email: string, password: string): Promise<User> {
  // Busca usuário pelo email na API
  const res = await api.get(`/users?email=${encodeURIComponent(email.trim())}`);
  const users: (User & { password?: string })[] = res.data.data || [];

  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!match) {
    throw new Error("Usuário não encontrado.");
  }

  // Renova a sessão por mais 7 dias a cada login bem-sucedido
  saveSession(match);
  return match;
}

// ─── Logout: remove apenas a sessão ──────────────────────────────────────────
export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

// ─── Verifica se a sessão está próxima do vencimento e renova ─────────────────
// Chame isso no App.tsx para renovar automaticamente sessões ativas
export function refreshSessionIfNeeded(): void {
  const raw = localStorage.getItem(SESSION_KEY);
  const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!raw || !expiry) return;

  const remaining = Number(expiry) - Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  // Se falta menos de 1 dia, renova por mais 7 dias automaticamente
  if (remaining > 0 && remaining < oneDayMs) {
    const user = JSON.parse(raw) as User;
    saveSession(user);
  }
}
