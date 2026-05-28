export const TODAY = new Date().toISOString().slice(0, 10)
export const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

export function formatDate(d) {
  if (d === TODAY) return 'Today'
  if (d === TOMORROW) return 'Tomorrow'
  if (d === 'No date') return 'Unscheduled'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

export function buildSystemPrompt(tasks) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return `You are a voice-controlled task manager assistant. Today is ${dateStr}, current time is ${timeStr}.

CURRENT TASKS (JSON):
${JSON.stringify(tasks, null, 2)}

You manage tasks for the user. Each task has: { id, title, time, date, completed }.
Dates use format YYYY-MM-DD. Times use format HH:MM (24h).

IMPORTANT RULES:
1. Respond ONLY with a JSON object — no markdown, no extra text.
2. The JSON must have: { "speech": "...", "action": "...", "tasks": [...] }
   - "speech": what you say aloud (natural, conversational, concise)
   - "action": one of: none | create | update | delete | read | confirm_delete
   - "tasks": the FULL updated task list after the action (same array if no change)
3. For DELETE: first set action="confirm_delete" and ask for confirmation in speech. Only set action="delete" when user confirms (says yes/correct/go ahead etc).
4. For ambiguous references, ask a clarifying question.
5. Understand natural language: "evening" = 17:00-23:59, "morning" = 06:00-11:59, "afternoon" = 12:00-16:59.
6. Understand "previous one", "that task", "the second one" using conversation context.
7. For multiple tasks in one request, create all of them.
8. "tomorrow" = ${TOMORROW}, "today" = ${TODAY}
9. Task IDs: use Date.now() + index as string for new tasks.
10. Keep speech responses SHORT (1-2 sentences max). Do not list all tasks unless asked.
11. If user says "what tasks do I have" or asks for agenda, summarize conversationally.`
}
