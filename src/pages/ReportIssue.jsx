import { useEffect, useState } from "react"
import { createReport } from "../services/reportsApi"

const DRAFT_KEY = "campusSOSFormDraft"

function ReportIssue({ user, onBack, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)

    if (!savedDraft) {
      return
    }

    try {
      const parsed = JSON.parse(savedDraft)

      setFormData({
        title: parsed.title || "",
        location: parsed.location || "",
        description: parsed.description || "",
      })
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    const hasContent = Object.values(formData).some(
      (value) => value.trim() !== ""
    )

    if (hasContent && !success) {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(formData)
      )
    }
  }, [formData, success])

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))

    setError("")
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      setError("Please complete all fields.")
      return
    }

    if (formData.description.length > 400) {
      setError(
        "Description must be 400 characters or less."
      )
      return
    }

    try {
      setLoading(true)

      const report = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        userId: user.id,
        reporterEmail: user.email,
        reporterName: user.name,
        status: "Open",
        priority: null,
        createdAt: new Date().toISOString(),
      }

      const created = await createReport(report)

      localStorage.removeItem(DRAFT_KEY)

      setSuccess("Your issue has been reported successfully.")

      setFormData({
        title: "",
        location: "",
        description: "",
      })

      setTimeout(() => {
        onCreated(created)
      }, 700)
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit the report. Please try again."
      )
    } finally {
      setLoading(false)
    }
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
          ← Back
        </button>
      </header>

      <main className="form-container">
        <div className="form-header">
          <p className="eyebrow">NEW REPORT</p>

          <h1>Report a Campus Issue</h1>

          <p>
            Tell campus management what happened and where
            the problem is. Management will review and assign
            the appropriate priority.
          </p>
        </div>

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="title">
              Issue Title <span>*</span>
            </label>

            <input
              id="title"
              type="text"
              maxLength={100}
              placeholder="Example: Water leakage"
              value={formData.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="location">
              Location <span>*</span>
            </label>

            <input
              id="location"
              type="text"
              maxLength={120}
              placeholder="Example: Block B - First Floor"
              value={formData.location}
              onChange={(event) =>
                updateField(
                  "location",
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-field">
            <div className="label-row">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <span>
                {formData.description.length}/400
              </span>
            </div>

            <textarea
              id="description"
              rows="7"
              maxLength={400}
              placeholder="Describe the problem clearly..."
              value={formData.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <div className="info-box">
            <span>ℹ️</span>

            <p>
              <strong>Priority is assigned by management.</strong>
              {" "}
              You do not need to select a priority for your
              report.
            </p>
          </div>

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

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Report"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ReportIssue