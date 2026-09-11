function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="priority-badge priority-pending">
        Not assigned
      </span>
    )
  }

  return (
    <span
      className={`priority-badge priority-${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  )
}

export default PriorityBadge