import VoiceOrb from './VoiceOrb'

const EXAMPLE_COMMANDS = [
  'Create a task for 3 PM',
  "What's on my agenda today?",
  'Delete the morning task',
  'Move the sync to 4 PM',
]

const STATUS_LABELS = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
}

export default function VoicePanel({
  status,
  waveActive,
  transcript,
  lastResponse,
  onOrbClick,
}) {
  return (
    <div
      style={{
        width: '280px',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 1.5rem',
        gap: '1.5rem',
      }}
    >
      <VoiceOrb status={status} waveActive={waveActive} onClick={onOrbClick} />

      {/* Status label */}
      <div
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: status === 'idle' ? '#4a4558' : '#c4a882',
          transition: 'color 0.3s',
        }}
      >
        {STATUS_LABELS[status]}
      </div>

      {/* Live transcript while listening */}
      {transcript && status === 'listening' && (
        <div
          style={{
            background: 'rgba(196,168,130,0.05)',
            border: '1px solid rgba(196,168,130,0.1)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#a09070',
            lineHeight: 1.5,
            width: '100%',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          "{transcript}"
        </div>
      )}

      {/* Last assistant response */}
      {lastResponse && status !== 'listening' && (
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#8a8098',
            lineHeight: 1.6,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {lastResponse}
        </div>
      )}

      {/* Example commands shown only on first load */}
      {status === 'idle' && !lastResponse && (
        <div style={{ width: '100%', marginTop: 'auto' }}>
          <div
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#3a3050',
              marginBottom: '0.75rem',
              textAlign: 'center',
            }}
          >
            Try saying
          </div>
          {EXAMPLE_COMMANDS.map((ex) => (
            <div
              key={ex}
              style={{
                fontSize: '0.72rem',
                color: '#3a3050',
                padding: '0.3rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                fontStyle: 'italic',
              }}
            >
              "{ex}"
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
