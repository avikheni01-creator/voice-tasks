import { useRef, useCallback } from 'react'

export function useVoice({ onResult, onError, status, setStatus, setTranscript, setWaveActive, setListening }) {
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (status === 'thinking' || status === 'listening') return

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setListening(true)
      setStatus('listening')
      setTranscript('')
      setWaveActive(true)
    }

    // Store final transcript on the recognition object
    recognition.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('')
      setTranscript(t)
      if (e.results[e.results.length - 1].isFinal) {
        recognition._finalText = t
      }
    }

    recognition.onend = () => {
      setListening(false)
      setWaveActive(false)
      const finalText = recognitionRef.current?._finalText || ''
      if (finalText.trim()) {
        onResult(finalText.trim())
      } else {
        setStatus('idle')
      }
    }

    recognition.onerror = (e) => {
      setListening(false)
      setWaveActive(false)
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        onError(`Microphone error: ${e.error}. Please check permissions.`)
      }
      setStatus('idle')
    }

    recognition.start()
  }, [status, onResult, onError, setStatus, setTranscript, setWaveActive, setListening])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  return { startListening, stopListening }
}
