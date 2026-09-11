import PriorityBadge from "../components/PriorityBadge"
import StatusTracker from "../components/StatusTracker"

const VALID_STATUSES = [
  "Open",
  "In Review",
  "Resolved",
]

const VALID_PRIORITIES = [
  "High",
  "Medium",
  "Low",
]

function StudentReportDetails({
  report,
  onBack,
}) {
  if (
    !report ||
    typeof report !== "object"
  ) {
    return (
      <main className="details-container">
        <div className="empty-state">
          <div
            className="empty-icon"
            aria-hidden="true"
          >
            📭
          </div>

          <h2>
            Report not found
          </h2>

          <p>
            We could not find the report you
            are trying to view.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onBack}
          >
            ← Back to My Reports
          </button>
        </div>
      </main>
    )
  }

  const reportId =
    report.id !== null &&
    report.id !== undefined &&
    String(report.id).trim() !== ""
      ? String(report.id)
      : "Unavailable"

  const title =
    typeof report.title === "string" &&
    report.title.trim() !== ""
      ? report.title.trim()
      : "Untitled Report"

  const location =
    typeof report.location === "string" &&
    report.location.trim() !== ""
      ? report.location.trim()
      : "Location unavailable"

  const description =
    typeof report.description === "string" &&
    report.description.trim() !== ""
      ? report.description.trim()
      : "No description available."

  const status =
    VALID_STATUSES.includes(report.status)
      ? report.status
      : "Open"

  const priority =
    VALID_PRIORITIES.includes(report.priority)
      ? report.priority
      : null

  const createdDate = formatDate(
    report.createdAt
  )

  return (
    <main className="details-container">

      <div className="details-header">
        <div>
          <p className="eyebrow">
            REPORT DETAILS
          </p>

          <h1>
            {title}
          </h1>

          <p>
            Report ID:{" "}
            <strong>
              {reportId}
            </strong>
          </p>
        </div>

        <span
          className={`status-badge status-${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      <section className="details-card">

        <div className="detail-grid">

          <DetailItem
            label="Report ID"
            value={reportId}
          />

          <DetailItem
            label="Location"
            value={location}
          />

          <DetailItem
            label="Date Submitted"
            value={createdDate}
          />

          <DetailItem
            label="Current Status"
            value={status}
          />

          <div className="detail-item">
            <span>
              Priority
            </span>

            <strong>
              <PriorityBadge
                priority={priority}
              />
            </strong>
          </div>

        </div>

        <div className="description-section">

          <h3>
            Issue Description
          </h3>

          <p>
            {description}
          </p>

        </div>

      </section>

      <section className="details-card">

        <div className="section-heading simple">

          <div>
            <h2>
              Status Tracking
            </h2>

            <p>
              Follow the progress of your issue
              from submission to resolution.
            </p>
          </div>

        </div>

        <StatusTracker
          status={status}
        />

        <div className="tracking-note">
          {getTrackingMessage(status)}
        </div>

      </section>

      <div className="details-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          ← Back to My Reports
        </button>

      </div>

    </main>
  )
}

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="detail-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  )
}

function getStatusClass(status) {
  if (status === "Resolved") {
    return "resolved"
  }

  if (status === "In Review") {
    return "review"
  }

  return "open"
}

function getTrackingMessage(status) {
  if (status === "Resolved") {
    return "Your issue has been resolved by campus management."
  }

  if (status === "In Review") {
    return "Management is currently reviewing and working on your issue."
  }

  return "Your report has been received and is waiting for management review."
}

function formatDate(value) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return "Date unavailable"
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable"
  }

  return date.toLocaleString()
}

export default StudentReportDetails