import { useState, useRef, useCallback, useEffect } from 'react'
import { callGroq } from './api/groq'
import { useTasks } from './hooks/useTasks'
import { useVoice } from './hooks/useVoice'
import { speak, stopSpeaking, primeVoices } from './utils/tts'
import { buildSystemPrompt } from './utils/formatters'
import TaskList from './components/TaskList'
import VoicePanel from './components/VoicePanel'
import GlobalStyles from './components/GlobalStyles'

export default function App() {
  const { tasks, updateTasks } = useTasks()

  const [status, setStatus] = useState('idle')       // idle | listening | thinking | speaking
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [lastResponse, setLastResponse] = useState('')
  const [waveActive, setWaveActive] = useState(false)
  const [taskFlash, setTaskFlash] = useState(null)
  const [conversationHistory, setConversationHistory] = useState([])

  // Refs so callbacks always see latest values without re-creating
  const tasksRef = useRef(tasks)
  const historyRef = useRef(conversationHistory)
  tasksRef.current = tasks
  historyRef.current = conversationHistory

  useEffect(() => { primeVoices() }, [])

  // ── Process a recognised voice command ──────────────────────────────────────
  const processCommand = useCallback(async (userText) => {
    setStatus('thinking')

    const systemPrompt = buildSystemPrompt(tasksRef.current)
    const newHistory = [...historyRef.current, { role: 'user', content: userText }]

    try {
      const raw = await callGroq(newHistory, systemPrompt)
      const clean = raw.replace(/```json|```/g, '').trim()
      const { speech, action, tasks: newTasks } = JSON.parse(clean)

      // Persist task changes for non-read actions
      if (action !== 'none' && action !== 'read' && action !== 'confirm_delete') {
        updateTasks(newTasks)
        setTaskFlash(action)
        setTimeout(() => setTaskFlash(null), 1500)
      }

      setConversationHistory([...newHistory, { role: 'assistant', content: raw }])
      setLastResponse(speech)
      setStatus('speaking')
      setSpeaking(true)
      setWaveActive(true)

      speak(speech, () => {
        setSpeaking(false)
        setStatus('idle')
        setWaveActive(false)
      })
    } catch (err) {
      console.error('processCommand error:', err)
      const errMsg = 'Sorry, I had trouble with that. Could you try again?'
      setLastResponse(errMsg)
      setStatus('speaking')
      speak(errMsg, () => {
        setStatus('idle')
        setWaveActive(false)
      })
    }
  }, [updateTasks])

  // ── Voice hook ───────────────────────────────────────────────────────────────
  const { startListening, stopListening } = useVoice({
    status,
    setStatus,
    setTranscript,
    setWaveActive,
    setListening,
    onResult: processCommand,
    onError: (msg) => setLastResponse(msg),
  })

  const handleOrbClick = useCallback(() => {
    if (status === 'listening') {
      stopListening()
    } else {
      if (status === 'speaking') {
        stopSpeaking()
        setSpeaking(false)
        setWaveActive(false)
      }
      startListening()
    }
  }, [status, startListening, stopListening])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#e8e4dc',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GlobalStyles />

      {/* Background gradient */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 20% 20%, #1a1025 0%, #0a0a0f 60%)',
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'relative', zIndex: 1,
          padding: '2rem 2.5rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'baseline', gap: '1rem',
        }}
      >
        <h1
          style={{
            margin: 0, fontSize: '1.1rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#c4a882', fontWeight: 400,
          }}
        >
          Voice Tasks
        </h1>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#4a4558', textTransform: 'uppercase' }}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </header>

      {/* Body */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flex: 1,
        }}
      >
        {/* Task list */}
        <div
          style={{
            flex: 1, padding: '1.5rem 2rem',
            overflowY: 'auto', maxHeight: 'calc(100vh - 80px)',
          }}
        >
          <TaskList tasks={tasks} taskFlash={taskFlash} />
        </div>

        {/* Voice panel */}
        <VoicePanel
          status={status}
          waveActive={waveActive}
          transcript={transcript}
          lastResponse={lastResponse}
          onOrbClick={handleOrbClick}
        />
      </div>
    </div>
  )
}
