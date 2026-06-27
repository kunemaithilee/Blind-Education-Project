import { API_URL } from "./api";

function authHeaders() {
  const token = localStorage.getItem("echolearn-token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function authRequest(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
}

export function loginUser(credentials) {
  return authRequest("/auth/login", credentials);
}

export function registerUser(data) {
  return authRequest("/auth/register", data);
}
