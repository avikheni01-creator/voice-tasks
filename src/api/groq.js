const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export async function callGroq(messages, systemPrompt) {
  // Groq requires strictly alternating user/assistant roles
  const cleanMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .filter((m) => m.content && m.content.trim() !== '')
    .map((m) => ({ role: m.role, content: String(m.content) }))

  // Ensure conversation starts with a user message
  const firstUserIdx = cleanMessages.findIndex((m) => m.role === 'user')
  const trimmed = firstUserIdx > 0 ? cleanMessages.slice(firstUserIdx) : cleanMessages

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...trimmed,
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.error('Groq error:', err)
    throw new Error(err.error?.message || 'Groq API error')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
