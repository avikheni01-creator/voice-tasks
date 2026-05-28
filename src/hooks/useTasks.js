import { useState, useEffect, useCallback } from 'react'
import { loadTasks, saveTasks } from '../api/storage'

export function useTasks() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    loadTasks().then(setTasks)
  }, [])

  const updateTasks = useCallback((newTasks) => {
    setTasks(newTasks)
    saveTasks(newTasks)
  }, [])

  return { tasks, updateTasks }
}
