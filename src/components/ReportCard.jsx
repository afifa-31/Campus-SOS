function ReportCard({
  report,
  onViewDetails,
  onStatusChange,
  onDelete,
}) {
  return (
    <article className="report-card">
      <div className="report-card-top">
        <h3>{report.title}</h3>

        <span
          className={`status-badge ${report.status.toLowerCase()}`}
        >
          {report.status}
        </span>
      </div>

      <p className="report-location">
        📍 {report.location}
      </p>

      <div className="report-priority">
        <span
          className={`priority-badge ${(report.priority || "Medium").toLowerCase()}`}
        >
          {report.priority || "Medium"} Priority
        </span>
      </div>

      <p className="report-description">
        {report.description}
      </p>

      <p className="report-date">
        Reported: {report.createdAt}
      </p>

      <div className="report-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onViewDetails(report)}
        >
          View Details
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onStatusChange(report.id)}
        >
          {report.status === "Open"
            ? "Mark as Resolved"
            : "Reopen Issue"}
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(report.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default ReportCard