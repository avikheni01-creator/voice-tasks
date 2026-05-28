let currentUtterance = null

export function speak(text, onEnd) {
  // Cancel any ongoing speech
  if (currentUtterance) {
    window.speechSynthesis.cancel()
    currentUtterance = null
  }

  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 1.05
  utter.pitch = 1
  utter.volume = 1

  // Pick best available English voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(
    (v) =>
      v.name.includes('Google') ||
      v.name.includes('Samantha') ||
      v.lang === 'en-US'
  )
  if (preferred) utter.voice = preferred

  utter.onend = () => {
    currentUtterance = null
    onEnd?.()
  }
  utter.onerror = () => {
    currentUtterance = null
    onEnd?.()
  }

  currentUtterance = utter
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
  currentUtterance = null
}

// Call once on app load to prime the voice list
export function primeVoices() {
  window.speechSynthesis.getVoices()
}
