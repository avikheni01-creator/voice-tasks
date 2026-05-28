import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ─── localStorage-backed storage shim ────────────────────────────────────────
window.storage = {
  _store: JSON.parse(localStorage.getItem('_storage') || '{}'),
  get: async (k) => {
    const v = window.storage._store[k]
    return v !== undefined ? { value: v } : null
  },
  set: async (k, v) => {
    window.storage._store[k] = v
    localStorage.setItem('_storage', JSON.stringify(window.storage._store))
    return { key: k, value: v }
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
