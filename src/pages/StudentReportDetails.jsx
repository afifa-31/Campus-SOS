import PriorityBadge from "../components/PriorityBadge"
import StatusTracker from "../components/StatusTracker"

function StudentReportDetails({
  report,
  onBack,
}) {
  if (!report) {
    return null
  }

  return (
    <div className="app-page">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="small-logo">🚨</span>

          <div>
            <strong>CampusSOS</strong>
            <span>Student Portal</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onBack}
        >
          ← My Reports
        </button>
      </header>

      <main className="details-container">
        <div className="details-header">
          <div>
            <p className="eyebrow">REPORT DETAILS</p>

            <h1>{report.title}</h1>

            <p>
              Submitted on{" "}
              {formatDate(report.createdAt)}
            </p>
          </div>

          <span
            className={`status-badge status-${getStatusClass(
              report.status
            )}`}
          >
            {report.status || "Open"}
          </span>
        </div>

        <section className="details-card">
          <div className="detail-grid">
            <DetailItem
              label="Location"
              value={report.location}
            />

            <DetailItem
              label="Priority"
              value={
                <PriorityBadge
                  priority={report.priority}
                />
              }
            />

            <DetailItem
              label="Submitted"
              value={formatDate(report.createdAt)}
            />

            <DetailItem
              label="Current Status"
              value={report.status || "Open"}
            />
          </div>

          <div className="description-section">
            <h3>Issue Description</h3>

            <p>{report.description}</p>
          </div>
        </section>

        <section className="details-card">
          <div className="section-heading simple">
            <div>
              <h2>Status Tracking</h2>

              <p>
                Track the progress of your issue as
                management processes it.
              </p>
            </div>
          </div>

          <StatusTracker
            status={report.status || "Open"}
          />

          <div className="tracking-note">
            {getTrackingMessage(report.status)}
          </div>
        </section>
      </main>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function getStatusClass(status) {
  if (status === "Resolved") return "resolved"
  if (status === "In Review") return "review"
  return "open"
}

function getTrackingMessage(status) {
  if (status === "Resolved") {
    return "This issue has been resolved by campus management."
  }

  if (status === "In Review") {
    return "Management is currently reviewing and processing this issue."
  }

  return "Your report has been received and is waiting for management review."
}

function formatDate(date) {
  if (!date) return "Date unavailable"

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable"
  }

  return parsed.toLocaleString()
}

export default StudentReportDetails