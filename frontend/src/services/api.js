export const API_URL = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");

function authHeaders() {
  const token = localStorage.getItem("echolearn-token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet(path, fallback) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch (error) {
    return fallback;
  }
}

export async function apiPost(path, body, fallback) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch (error) {
    return fallback;
  }
}
