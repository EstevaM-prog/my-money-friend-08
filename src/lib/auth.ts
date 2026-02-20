// Simple localStorage-based auth (no backend required)
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const USERS_KEY = "financaspro_users";
const SESSION_KEY = "financaspro_session";

function getUsers(): (User & { password: string })[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function register(name: string, email: string, password: string): User {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("E-mail já cadastrado.");
  }
  const user: User & { password: string } = {
    id: String(Date.now()),
    name,
    email,
    password,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const { password: _, ...publicUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function login(email: string, password: string): User {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("E-mail ou senha incorretos.");
  const { password: _, ...publicUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
