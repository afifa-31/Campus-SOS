const steps = ["Open", "In Review", "Resolved"]

function StatusTracker({ status }) {
  const currentIndex = steps.indexOf(status)

  return (
    <div className="status-tracker">
      {steps.map((step, index) => {
        const completed = index <= currentIndex

        return (
          <div className="status-step-wrapper" key={step}>
            <div className={`status-step ${completed ? "active" : ""}`}>
              <div className="status-dot">
                {completed ? "✓" : index + 1}
              </div>

              <span>{step}</span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`status-line ${
                  index < currentIndex ? "active" : ""
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StatusTracker