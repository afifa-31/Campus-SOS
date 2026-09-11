import PriorityBadge from "./PriorityBadge"

function ReportCard({
  report,
  onView,
  management = false,
}) {
  return (
    <article className="report-card">
      <div className="report-card-top">
        <div>
          <span className="report-id">
            #{String(report.id).slice(-6)}
          </span>

          <h3>{report.title}</h3>
        </div>

        {management && (
          <PriorityBadge priority={report.priority} />
        )}
      </div>

      <div className="report-meta">
        <span>📍 {report.location}</span>
        <span>📅 {formatDate(report.createdAt)}</span>
      </div>

      <p className="report-preview">
        {report.description}
      </p>

      <div className="report-card-bottom">
        <span
          className={`status-badge status-${getStatusClass(
            report.status
          )}`}
        >
          {report.status || "Open"}
        </span>

        {management && report.userId && (
          <span className="reporter">
            Reporter: {report.userId}
          </span>
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={() => onView(report)}
        >
          View Details
        </button>
      </div>
    </article>
  )
}

function getStatusClass(status) {
  if (status === "Resolved") return "resolved"
  if (status === "In Review") return "review"
  return "open"
}

function formatDate(date) {
  if (!date) return "Date unavailable"

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable"
  }

  return parsed.toLocaleDateString()
}

export default ReportCard