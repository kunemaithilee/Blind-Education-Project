import { API_URL } from "./api";

function localAssistantAnswer(question) {
  const text = question.toLowerCase();

  if (text.includes("photosynthesis")) {
    return "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to make their own food. They also release oxygen.";
  }

  if (text.includes("gravity")) {
    return "Gravity is a force that pulls objects toward each other. On Earth, gravity pulls things toward the ground and keeps us from floating away.";
  }

  if (text.includes("blind") || text.includes("accessibility")) {
    return "Accessibility means designing technology so everyone can use it, including blind users. Voice commands, screen reader support, and high contrast help make learning easier.";
  }

  if (text.includes("course") || text.includes("lesson")) {
    return "You can say go to courses to open the courses page, or say read lesson to open the lesson page.";
  }

  return `I heard your question: ${question}. The online AI backend is not connected yet, but I am ready to guide navigation and answer basic learning questions.`;
}

export async function askAssistant(question) {
  try {
    const response = await fetch(`${API_URL}/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    const data = await response.json();
    return data.answer || data.message || localAssistantAnswer(question);
  } catch {
    return localAssistantAnswer(question);
  }
}
