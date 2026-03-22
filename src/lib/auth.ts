// Simple localStorage-based auth (no backend required)
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const USERS_KEY = "mymoneyfriend_users";
const SESSION_KEY = "mymoneyfriend_session";
const SESSION_EXPIRY_KEY = "mymoneyfriend_session_expiry";

const REMEMBER_DAYS = 7;

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
  // Register always keeps session for 7 days
  saveSession(publicUser, true);
  return publicUser;
}

export function login(emailOrUsername: string, password: string, remember = false): User {
  const users = getUsers();
  const identifier = emailOrUsername.trim().toLowerCase();
  const user = users.find(
    (u) =>
      (u.email.toLowerCase() === identifier ||
        u.name.toLowerCase() === identifier) &&
      u.password === password
  );
  if (!user) throw new Error("Usuário/e-mail ou senha incorretos.");
  const { password: _, ...publicUser } = user;
  saveSession(publicUser, remember);
  return publicUser;
}

function saveSession(user: User, remember: boolean) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (remember) {
    const expiry = Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(SESSION_EXPIRY_KEY, String(expiry));
  } else {
    // Session-only: expires when tab is closed (use sessionStorage expiry marker)
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.setItem(SESSION_KEY, "active");
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (expiry) {
      // Persistent session: check expiry
      if (Date.now() > Number(expiry)) {
        logout();
        return null;
      }
    } else {
      // Session-only: check if tab is still active
      const sessionActive = sessionStorage.getItem(SESSION_KEY);
      if (!sessionActive) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}
