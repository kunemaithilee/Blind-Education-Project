const OpenAI = require("openai");

const SYSTEM_PROMPT = `You are EchoLearn AI, a voice-first educational assistant for blind and visually impaired students.
- Give clear, concise answers suitable for text-to-speech.
- Keep responses under 4 sentences unless the topic requires more depth.
- Use simple language and avoid visual references like "as you can see" or "click here".
- When asked about navigation, suggest voice commands like "say go to courses" or "say open physics".
- If you don't know the answer, say so honestly.`;

const FALLBACK_ANSWERS = {
  gravity: "Gravity is a force that pulls objects toward each other. On Earth, it pulls things toward the ground.",
  photosynthesis: "Photosynthesis is how plants use sunlight, water, and carbon dioxide to make food and release oxygen.",
  alkane: "Alkanes are hydrocarbons with only single bonds. Their general formula is C n H two n plus two.",
};

function getFallbackAnswer(question) {
  const text = question.toLowerCase();
  for (const [key, answer] of Object.entries(FALLBACK_ANSWERS)) {
    if (text.includes(key)) return answer;
  }
  return null;
}

let openai = null;
function getClient() {
  if (openai) return openai;
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  openai = new OpenAI({ apiKey: key });
  return openai;
}

async function askOpenAI(question) {
  const client = getClient();
  if (!client) return null;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices?.[0]?.message?.content?.trim() || null;
}

async function getAnswer(question) {
  if (!question || typeof question !== "string") {
    return "Please ask a question so I can help you.";
  }

  const aiAnswer = await askOpenAI(question);
  if (aiAnswer) return aiAnswer;

  const fallback = getFallbackAnswer(question);
  if (fallback) return fallback;

  return "I heard your question. You can ask me about science, math, courses, or say help to learn voice commands.";
}

module.exports = { getAnswer };
