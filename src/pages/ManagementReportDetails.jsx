import { useState } from "react"

import StatusTracker from "../components/StatusTracker"
import PriorityBadge from "../components/PriorityBadge"

import { updateReport, deleteReport } from "../services/reportsApi"


function ManagementReportDetails({
  report,
  onBack,
  onUpdated,
  onDeleted,
}) {
  const [priority, setPriority] = useState(
    report?.priority || ""
  )

  const [status, setStatus] = useState(
    report?.status || "Open"
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")


  if (!report) {
    return (
      <main className="page">
        <div className="empty-state">
          <h2>Report not found</h2>

          <button
            className="primary-button"
            onClick={onBack}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    )
  }


  async function handleSave() {
    setError("")
    setSuccess("")

    try {
      setSaving(true)

      const updated = await updateReport(
        report.id,
        {
          priority: priority || null,
          status,
        }
      )

      setSuccess("Report updated successfully.")

      onUpdated(updated)
    } catch (err) {
      setError(
        err.message ||
          "Unable to update report."
      )
    } finally {
      setSaving(false)
    }
  }


  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?\n\nThis action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccess("")

    try {
      setDeleting(true)

      await deleteReport(report.id)

      onDeleted(report.id)

    } catch (err) {
      setError(
        err.message ||
          "Unable to delete report."
      )

      setDeleting(false)
    }
  }


  return (
    <main className="page">

      {/* HEADER */}

      <header className="page-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p className="eyebrow">
            MANAGEMENT PORTAL
          </p>

          <h1>Report Details</h1>
        </div>

      </header>


      {/* REPORT */}

      <section className="detail-card">

        <div className="detail-header">

          <div>

            <span className="report-id">
              Report #{report.id}
            </span>

            <h2>
              {report.title}
            </h2>

          </div>

          <PriorityBadge
            priority={priority}
          />

        </div>


        {/* BASIC INFORMATION */}

        <div className="detail-grid">

          <div className="detail-item">

            <span className="detail-label">
              Location
            </span>

            <strong>
              {report.location}
            </strong>

          </div>


          <div className="detail-item">

            <span className="detail-label">
              Submitted By
            </span>

            <strong>
              {report.reporterName ||
                report.userId ||
                "Student"}
            </strong>

          </div>


          <div className="detail-item">

            <span className="detail-label">
              Student ID
            </span>

            <strong>
              {report.userId ||
                "Not available"}
            </strong>

          </div>


          <div className="detail-item">

            <span className="detail-label">
              Submitted On
            </span>

            <strong>
              {report.createdAt
                ? new Date(
                    report.createdAt
                  ).toLocaleString()
                : "Unknown"}
            </strong>

          </div>

        </div>


        {/* DESCRIPTION */}

        <div className="description-section">

          <h3>
            Description
          </h3>

          <p>
            {report.description}
          </p>

        </div>


        {/* STATUS */}

        <div className="management-section">

          <h3>
            Update Status
          </h3>

          <select
            className="management-select"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
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


        {/* PRIORITY */}

        <div className="management-section">

          <h3>
            Assign Priority
          </h3>

          <select
            className="management-select"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >

            <option value="">
              No Priority
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

          <p className="helper-text">
            Priority is assigned by management
            based on severity and campus impact.
          </p>

        </div>


        {/* STATUS TRACKER */}

        <div className="management-section">

          <h3>
            Resolution Progress
          </h3>

          <StatusTracker
            status={status}
          />

        </div>


        {/* MESSAGES */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        {/* ACTIONS */}

        <div className="management-actions">

          <button
            className="primary-button"
            onClick={handleSave}
            disabled={saving || deleting}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>


          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Report"}
          </button>

        </div>

      </section>

    </main>
  )
}


export default ManagementReportDetails