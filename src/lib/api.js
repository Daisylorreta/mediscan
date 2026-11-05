const TOKEN_KEY = "mediscan_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: form ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  signup: (name, email, password) => request("/auth/signup", { method: "POST", body: { name, email, password } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me"),
  health: () => request("/health"),
  listMedications: () => request("/medications"),
  addMedication: (med) => request("/medications", { method: "POST", body: med }),
  deleteMedication: (id) => request(`/medications/${id}`, { method: "DELETE" }),
  scanMedication: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/medications/scan", { method: "POST", form });
  },
  chat: (messages) => request("/chat", { method: "POST", body: { messages } }),
  listConsultations: () => request("/chat/consultations"),
};
