const STORAGE_KEY = 'voice-tasks-v1'

export async function loadTasks() {
  try {
    const r = await window.storage.get(STORAGE_KEY)
    return r ? JSON.parse(r.value) : []
  } catch {
    return []
  }
}

export async function saveTasks(tasks) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(tasks))
  } catch (err) {
    console.error('Failed to save tasks:', err)
  }
}
