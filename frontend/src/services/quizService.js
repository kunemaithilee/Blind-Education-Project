import { API_URL } from "./api";

function authHeaders() {
  const token = localStorage.getItem("echolearn-token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getQuizzes() {
  try {
    const res = await fetch(`${API_URL}/quizzes`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return [];
  }
}

export async function getQuizById(id) {
  try {
    const res = await fetch(`${API_URL}/quizzes/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return null;
  }
}

export async function submitQuiz(quizId, answers) {
  try {
    const res = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ quizId, answers }),
    });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch {
    return { score: 0, total: 0, percentage: 0, results: [] };
  }
}
