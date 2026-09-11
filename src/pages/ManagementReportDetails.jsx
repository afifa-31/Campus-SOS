import {
  useEffect,
  useState,
} from "react"

import PriorityBadge from "../components/PriorityBadge"
import StatusTracker from "../components/StatusTracker"
import {
  updateReport,
  deleteReport,
} from "../services/reportsApi"


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


function ManagementReportDetails({
  report,
  onBack,
  onUpdated,
  onDeleted,
}) {
  const [status, setStatus] =
    useState("Open")

  const [priority, setPriority] =
    useState("")

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")


  /*
  ============================================================
  LOAD REPORT VALUES
  ============================================================
  */

  useEffect(() => {
    if (
      !report ||
      typeof report !== "object"
    ) {
      setStatus("Open")
      setPriority("")
      return
    }

    setStatus(
      VALID_STATUSES.includes(
        report.status
      )
        ? report.status
        : "Open"
    )

    setPriority(
      VALID_PRIORITIES.includes(
        report.priority
      )
        ? report.priority
        : ""
    )

    setError("")
    setSuccess("")
  }, [report])


  /*
  ============================================================
  SAFETY CHECK
  ============================================================
  */

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
            are trying to manage.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </div>

      </main>
    )
  }


  /*
  ============================================================
  SAFE REPORT VALUES
  ============================================================
  */

  const reportId =
    report.id !== null &&
    report.id !== undefined &&
    String(report.id).trim() !== ""
      ? String(report.id)
      : ""

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

  const reporterName =
    typeof report.reporterName ===
      "string" &&
    report.reporterName.trim() !== ""
      ? report.reporterName.trim()
      : "Unknown student"

  const reporterEmail =
    typeof report.reporterEmail ===
      "string" &&
    report.reporterEmail.trim() !== ""
      ? report.reporterEmail.trim()
      : "Email unavailable"

  const userId =
    report.userId !== null &&
    report.userId !== undefined &&
    String(report.userId).trim() !== ""
      ? String(report.userId)
      : "Unavailable"


  /*
  ============================================================
  VALIDATION
  ============================================================
  */

  function validateChanges() {
    if (
      !reportId
    ) {
      return "Invalid report ID."
    }

    if (
      !VALID_STATUSES.includes(
        status
      )
    ) {
      return "Invalid status."
    }

    if (
      priority !== "" &&
      !VALID_PRIORITIES.includes(
        priority
      )
    ) {
      return "Invalid priority."
    }

    return ""
  }


  /*
  ============================================================
  SAVE CHANGES
  ============================================================
  */

  async function handleSave() {
    if (
      saving ||
      deleting
    ) {
      return
    }

    setError("")
    setSuccess("")

    const validationError =
      validateChanges()

    if (validationError) {
      setError(
        validationError
      )
      return
    }

    try {
      setSaving(true)

      const updatedReport =
        await updateReport(
          reportId,
          {
            status,
            priority:
              priority === ""
                ? null
                : priority,
          }
        )

      if (
        !updatedReport ||
        typeof updatedReport !==
          "object"
      ) {
        throw new Error(
          "Invalid report returned by the server."
        )
      }

      setSuccess(
        "Report updated successfully."
      )

      if (
        typeof onUpdated ===
        "function"
      ) {
        onUpdated(
          updatedReport
        )
      }
    } catch (err) {
      setError(
        err?.message ||
          "Failed to update report. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }


  /*
  ============================================================
  DELETE REPORT
  ============================================================
  */

  async function handleDelete() {
    if (
      saving ||
      deleting
    ) {
      return
    }

    if (!reportId) {
      setError(
        "Invalid report ID."
      )
      return
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccess("")

    try {
      setDeleting(true)

      await deleteReport(
        reportId
      )

      setSuccess(
        "Report deleted successfully."
      )

      if (
        typeof onDeleted ===
        "function"
      ) {
        onDeleted(reportId)
      }
    } catch (err) {
      setError(
        err?.message ||
          "Failed to delete report. Please try again."
      )
    } finally {
      setDeleting(false)
    }
  }


  /*
  ============================================================
  PAGE
  ============================================================
  */

  return (
    <main className="details-container">

      {/* ==================================================
          PAGE HEADER
          ================================================== */}

      <div className="details-header">

        <div>

          <p className="eyebrow">
            MANAGEMENT
          </p>

          <h1>
            {title}
          </h1>

          <p>
            Report ID:{" "}
            <strong>
              {reportId ||
                "Unavailable"}
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


      {/* ==================================================
          ERROR MESSAGE
          ================================================== */}

      {error && (
        <div
          className="global-error"
          role="alert"
        >
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}


      {/* ==================================================
          SUCCESS MESSAGE
          ================================================== */}

      {success && (
        <div
          className="success-message"
          role="status"
        >
          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}


      {/* ==================================================
          REPORT INFORMATION
          ================================================== */}

      <section className="details-card">

        <div className="detail-grid">

          <DetailItem
            label="Report ID"
            value={
              reportId ||
              "Unavailable"
            }
          />

          <DetailItem
            label="Location"
            value={location}
          />

          <DetailItem
            label="Student"
            value={reporterName}
          />

          <DetailItem
            label="Student ID"
            value={userId}
          />

          <DetailItem
            label="Email"
            value={reporterEmail}
          />

          <DetailItem
            label="Date Submitted"
            value={formatDate(
              report.createdAt
            )}
          />

        </div>


        {/* ==================================================
            DESCRIPTION
            ================================================== */}

        <div className="description-section">

          <h3>
            Issue Description
          </h3>

          <p>
            {description}
          </p>

        </div>

      </section>


      {/* ==================================================
          MANAGEMENT CONTROLS
          ================================================== */}

      <section className="details-card">

        <div className="section-heading simple">

          <div>

            <p className="eyebrow">
              MANAGEMENT CONTROLS
            </p>

            <h2>
              Update Report
            </h2>

            <p>
              Assign a priority and update the
              issue status.
            </p>

          </div>

        </div>


        <div className="management-control-grid">

          {/* ================================================
              PRIORITY
              ================================================ */}

          <div className="form-field">

            <label htmlFor="report-priority">
              Priority
            </label>

            <select
              id="report-priority"
              value={priority}
              disabled={
                saving ||
                deleting
              }
              onChange={(event) => {
                const value =
                  event.target.value

                if (
                  value === "" ||
                  VALID_PRIORITIES.includes(
                    value
                  )
                ) {
                  setPriority(value)
                  setError("")
                  setSuccess("")
                } else {
                  setError(
                    "Invalid priority."
                  )
                }
              }}
            >

              <option value="">
                Not Assigned
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

            <div className="control-preview">

              <span>
                Current:
              </span>

              <PriorityBadge
                priority={
                  priority ||
                  null
                }
              />

            </div>

          </div>


          {/* ================================================
              STATUS
              ================================================ */}

          <div className="form-field">

            <label htmlFor="report-status">
              Status
            </label>

            <select
              id="report-status"
              value={status}
              disabled={
                saving ||
                deleting
              }
              onChange={(event) => {
                const value =
                  event.target.value

                if (
                  VALID_STATUSES.includes(
                    value
                  )
                ) {
                  setStatus(value)
                  setError("")
                  setSuccess("")
                } else {
                  setError(
                    "Invalid status."
                  )
                }
              }}
            >

              <option value="Open">
                Open
              </option>

              <option value="In Review">
                In Review
              </option>

              <option value="Resolved">
                Resolved
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* ==================================================
          STATUS TRACKING
          ================================================== */}

      <section className="details-card">

        <div className="section-heading simple">

          <div>

            <h2>
              Status Tracking
            </h2>

            <p>
              Current progress of this campus
              issue.
            </p>

          </div>

        </div>


        <StatusTracker
          status={status}
        />


        <div className="tracking-note">

          {getTrackingMessage(
            status
          )}

        </div>

      </section>


      {/* ==================================================
          ACTIONS
          ================================================== */}

      <div className="details-actions">

        <button
          type="button"
          className="secondary-button"
          disabled={
            saving ||
            deleting
          }
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>


        <div className="details-action-group">

          <button
            type="button"
            className="primary-button"
            disabled={
              saving ||
              deleting
            }
            onClick={handleSave}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>


          <button
            type="button"
            className="danger-button"
            disabled={
              saving ||
              deleting
            }
            onClick={handleDelete}
          >
            {deleting
              ? "Deleting..."
              : "Delete Report"}
          </button>

        </div>

      </div>

    </main>
  )
}


/*
============================================================
DETAIL ITEM
============================================================
*/

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


/*
============================================================
STATUS CLASS
============================================================
*/

function getStatusClass(
  status
) {
  if (
    status === "Resolved"
  ) {
    return "resolved"
  }

  if (
    status === "In Review"
  ) {
    return "review"
  }

  return "open"
}


/*
============================================================
TRACKING MESSAGE
============================================================
*/

function getTrackingMessage(
  status
) {
  if (
    status === "Resolved"
  ) {
    return (
      "This issue has been resolved by campus management."
    )
  }

  if (
    status === "In Review"
  ) {
    return (
      "Management is currently reviewing and processing this issue."
    )
  }

  return (
    "This report is open and waiting for review."
  )
}


/*
============================================================
DATE FORMATTER
============================================================
*/

function formatDate(
  value
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return "Date unavailable"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable"
  }

  return date.toLocaleString()
}


export default ManagementReportDetails