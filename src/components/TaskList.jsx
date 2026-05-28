import { formatDate, formatTime, TODAY } from '../utils/formatters'

export default function TaskList({ tasks, taskFlash }) {
  const grouped = tasks.reduce((acc, t) => {
    const key = t.date || 'No date'
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort()

  if (tasks.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40vh',
          color: '#3a3650',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>◎</div>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          No tasks yet
        </p>
        <p style={{ fontSize: '0.75rem', color: '#2a2438', marginTop: '0.5rem' }}>
          Say "Create a task for…"
        </p>
      </div>
    )
  }

  return (
    <div>
      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: '2rem' }}>
          {/* Date header */}
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: date === TODAY ? '#c4a882' : '#4a4558',
              marginBottom: '0.75rem',
              paddingBottom: '0.4rem',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {formatDate(date)}
          </div>

          {/* Tasks */}
          {grouped[date]
            .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
            .map((task) => (
              <TaskRow key={task.id} task={task} taskFlash={taskFlash} />
            ))}
        </div>
      ))}
    </div>
  )
}

function TaskRow({ task, taskFlash }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.65rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        animation: taskFlash ? 'fadeIn 0.4s ease' : 'none',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: task.completed ? '#3a3650' : '#c4a882',
          flexShrink: 0,
          marginTop: '2px',
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.4,
            color: task.completed ? '#3a3650' : '#e8e4dc',
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </div>
      </div>
      {task.time && (
        <div
          style={{
            fontSize: '0.7rem',
            color: '#6a6280',
            letterSpacing: '0.05em',
            flexShrink: 0,
          }}
        >
          {formatTime(task.time)}
        </div>
      )}
    </div>
  )
}
