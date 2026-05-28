export default function VoiceOrb({ status, waveActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease',
        transform: status === 'listening' ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Ripple rings */}
      {waveActive &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `1px solid ${
                status === 'listening'
                  ? '#c4a882'
                  : status === 'speaking'
                  ? '#8b9dba'
                  : '#4a4558'
              }`,
              animation: `ripple 2s ease-out ${i * 0.6}s infinite`,
              opacity: 0,
            }}
          />
        ))}

      {/* Core orb */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background:
            status === 'listening'
              ? 'radial-gradient(circle, #c4a882, #8b6d4a)'
              : status === 'speaking'
              ? 'radial-gradient(circle, #8b9dba, #4a5d80)'
              : status === 'thinking'
              ? 'radial-gradient(circle, #9b8dba, #5a4a80)'
              : 'radial-gradient(circle, #2a2438, #1a1025)',
          border: `1px solid ${status === 'idle' ? '#3a3050' : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.4s ease',
          boxShadow: waveActive
            ? `0 0 30px ${
                status === 'listening'
                  ? 'rgba(196,168,130,0.3)'
                  : 'rgba(139,157,186,0.3)'
              }`
            : 'none',
        }}
      >
        <OrbIcon status={status} />
      </div>
    </div>
  )
}

function OrbIcon({ status }) {
  if (status === 'thinking') {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#c4a882',
              animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  if (status === 'listening') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="13" rx="3" fill="#0a0a0f" />
        <path d="M5 10a7 7 0 0014 0" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="19" x2="12" y2="22" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (status === 'speaking') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 9v6h4l5 5V4L7 9H3z" fill="#0a0a0f" />
        <path d="M16.5 12c0-1.8-1-3.3-2.5-4.1v8.2c1.5-.8 2.5-2.3 2.5-4.1z" fill="#0a0a0f" />
        <path d="M14 3.2v2.1c2.9 1 5 3.8 5 6.7s-2.1 5.7-5 6.7v2.1C18.2 19.6 21 16 21 12s-2.8-7.6-7-8.8z" fill="#0a0a0f" />
      </svg>
    )
  }

  // idle
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="13" rx="3" fill="#c4a882" opacity="0.6" />
      <path d="M5 10a7 7 0 0014 0" stroke="#c4a882" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="19" x2="12" y2="22" stroke="#c4a882" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
