import fetch from 'node-fetch';

const PROVIDER = (process.env.AI_PROVIDER || 'openai').toLowerCase();

async function callOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error al llamar a OpenAI');
  return data.choices[0].message.content.trim();
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error al llamar a Gemini');
  return data.candidates[0].content.parts[0].text.trim();
}

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error al llamar a Claude');
  return data.content[0].text.trim();
}

// Genera una frase motivacional + recomendacion basada en las actividades
// recientes del usuario (ultimos 7 dias) y, opcionalmente, su estado de animo.
export async function generateMotivation({ recentActivities = [], mood = '' } = {}) {
  const resumen =
    recentActivities.map((a) => `- ${a.date}: ${a.category} (${a.title})`).join('\n') ||
    'Sin actividades recientes registradas.';

  const prompt = `Eres un asistente empatico de bienestar personal llamado Lalita.
Basandote en este resumen de actividades recientes del usuario:
${resumen}
${mood ? `Estado de animo actual: ${mood}` : ''}

Genera:
1. Una frase motivacional corta y calida (maximo 2 lineas).
2. Una recomendacion breve y practica de habito o autocuidado para hoy.

Responde en espanol, en tono cercano y positivo, sin usar markdown ni listas numeradas, solo dos frases separadas por un salto de linea.`;

  if (PROVIDER === 'gemini') return callGemini(prompt);
  if (PROVIDER === 'claude') return callClaude(prompt);
  return callOpenAI(prompt);
}
