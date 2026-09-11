import { useEffect, useState } from "react"
import ReportCard from "./components/ReportCard"
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from "./services/reportsApi"

function App() {
  const [showForm, setShowForm] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [storageError, setStorageError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    priority: "Medium",
  })

  const [errors, setErrors] = useState({})

  // Load reports from MockAPI
  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true)
        setError("")

        const data = await getReports()

        if (!Array.isArray(data)) {
          throw new Error("Invalid reports data")
        }

        // Give older reports a default priority if they do not have one
        const reportsWithPriority = data.map((report) => ({
          ...report,
          priority: report.priority || "Medium",
        }))

        setReports(reportsWithPriority)

        try {
          localStorage.setItem(
            "campusSOSReports",
            JSON.stringify(reportsWithPriority)
          )
        } catch {
          setStorageError("Reports could not be saved locally.")
        }
      } catch {
        setError(
          "Unable to connect to the server. Showing saved reports instead."
        )

        try {
          const savedReports = localStorage.getItem("campusSOSReports")

          if (savedReports) {
            const parsedReports = JSON.parse(savedReports)

            if (Array.isArray(parsedReports)) {
              setReports(
                parsedReports.map((report) => ({
                  ...report,
                  priority: report.priority || "Medium",
                }))
              )
            } else {
              setReports([])
            }
          } else {
            setReports([])
          }
        } catch {
          setReports([])
          setStorageError("Saved reports could not be loaded.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [])

  // Save reports to localStorage
  useEffect(() => {
    if (isLoading) {
      return
    }

    try {
      localStorage.setItem(
        "campusSOSReports",
        JSON.stringify(reports)
      )
    } catch {
      setStorageError("Reports could not be saved locally.")
    }
  }, [reports, isLoading])

  // Restore unfinished form draft after refresh
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("campusSOSFormDraft")

      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft)

        if (parsedDraft && typeof parsedDraft === "object") {
          setFormData({
            title: parsedDraft.title || "",
            location: parsedDraft.location || "",
            description: parsedDraft.description || "",
            priority: parsedDraft.priority || "Medium",
          })

          // If a draft exists, show the form automatically
          setShowForm(true)
        }
      }
    } catch {
      setStorageError("Saved form draft could not be loaded.")
    }
  }, [])

  // Save unfinished form draft
  useEffect(() => {
    const isEmpty =
      !formData.title.trim() &&
      !formData.location.trim() &&
      !formData.description.trim() &&
      formData.priority === "Medium"

    if (isEmpty) {
      return
    }

    try {
      localStorage.setItem(
        "campusSOSFormDraft",
        JSON.stringify(formData)
      )
    } catch {
      setStorageError("Form draft could not be saved locally.")
    }
  }, [formData])

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }))
  }

  function validateForm() {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required."
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required."
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required."
    } else if (formData.description.length > 400) {
      newErrors.description =
        "Description must be 400 characters or less."
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    const newReport = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: "Open",
      createdAt: new Date().toLocaleString(),
    }

    try {
      const createdReport = await createReport(newReport)

      setReports((previous) => [
        {
          ...createdReport,
          priority: createdReport.priority || formData.priority,
        },
        ...previous,
      ])

      setFormData({
        title: "",
        location: "",
        description: "",
        priority: "Medium",
      })

      // Remove saved draft after successful submission
      localStorage.removeItem("campusSOSFormDraft")

      setErrors({})
      setShowForm(false)
    } catch {
      setError(
        "Unable to create the report. Please check your connection and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleStatusChange(id) {
    const report = reports.find((item) => item.id === id)

    if (!report) {
      return
    }

    const newStatus =
      report.status === "Open" ? "Resolved" : "Open"

    try {
      setError("")

      const updatedReport = await updateReport(id, {
        status: newStatus,
      })

      setReports((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...updatedReport,
                priority:
                  updatedReport.priority || item.priority || "Medium",
              }
            : item
        )
      )

      if (selectedReport?.id === id) {
        setSelectedReport({
          ...updatedReport,
          priority:
            updatedReport.priority ||
            selectedReport.priority ||
            "Medium",
        })
      }
    } catch {
      setError(
        "Unable to update the report status. Please try again."
      )
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")

      await deleteReport(id)

      setReports((previous) =>
        previous.filter((item) => item.id !== id)
      )

      if (selectedReport?.id === id) {
        setSelectedReport(null)
      }
    } catch {
      setError(
        "Unable to delete the report. Please try again."
      )
    }
  }

  function handleViewDetails(report) {
    setSelectedReport(report)
  }

  function closeDetails() {
    setSelectedReport(null)
  }

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase().trim()

    const matchesSearch =
      report.title?.toLowerCase().includes(search) ||
      report.location?.toLowerCase().includes(search) ||
      report.description?.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === "All" ||
      report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalReports = reports.length

  const openReports = reports.filter(
    (report) => report.status === "Open"
  ).length

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length

  // Priority-based dashboard insights
  const highPriorityReports = reports.filter(
    (report) => (report.priority || "Medium") === "High"
  ).length

  const mediumPriorityReports = reports.filter(
    (report) => (report.priority || "Medium") === "Medium"
  ).length

  const lowPriorityReports = reports.filter(
    (report) => (report.priority || "Medium") === "Low"
  ).length

  return (
    <>
      <header>
        <h1>CampusSOS</h1>
        <p>Report and track campus issues</p>
      </header>

      <main>
        <section className="hero">
          <div>
            <h2>Campus Issues</h2>
            <p>
              Help make our campus better by reporting problems
              and tracking their resolution.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setShowForm((previous) => !previous)
              setSelectedReport(null)
            }}
          >
            + Report an Issue
          </button>
        </section>

        {showForm && (
          <form className="report-form" onSubmit={handleSubmit}>
            <h2>Report a Campus Issue</h2>

            <div className="form-group">
              <label htmlFor="title">Issue Title</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Broken fan"
                value={formData.title}
                onChange={handleInputChange}
              />

              {errors.title && (
                <p className="form-error">{errors.title}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Room 245"
                value={formData.location}
                onChange={handleInputChange}
              />

              {errors.location && (
                <p className="form-error">{errors.location}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue..."
                maxLength={400}
                value={formData.description}
                onChange={handleInputChange}
              />

              <p className="character-count">
                {formData.description.length}/400 characters
              </p>

              {errors.description && (
                <p className="form-error">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Report"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="error-state">
            {error}
          </div>
        )}

        {storageError && (
          <div className="error-state">
            {storageError}
          </div>
        )}

        <section className="dashboard-stats">
          <div className="stat-card">
            <strong>{totalReports}</strong>
            <span>Total Reports</span>
          </div>

          <div className="stat-card">
            <strong>{openReports}</strong>
            <span>Open Issues</span>
          </div>

          <div className="stat-card">
            <strong>{resolvedReports}</strong>
            <span>Resolved</span>
          </div>
        </section>

        {/* Priority Dashboard */}
        <section className="priority-dashboard">
          <div className="priority-dashboard-header">
            <div>
              <h2>Priority Insights</h2>
              <p>
                Overview of campus issues by priority level.
              </p>
            </div>
          </div>

          <div className="priority-stats">
            <div className="priority-card high">
              <strong>{highPriorityReports}</strong>
              <span>High Priority</span>
            </div>

            <div className="priority-card medium">
              <strong>{mediumPriorityReports}</strong>
              <span>Medium Priority</span>
            </div>

            <div className="priority-card low">
              <strong>{lowPriorityReports}</strong>
              <span>Low Priority</span>
            </div>
          </div>
        </section>

        <section className="search-section">
          <div className="search-controls">
            <input
              type="search"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search reports"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter reports by status"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </section>

        <section className="reports-section">
          <h2>Reported Issues</h2>

          <p>
            Search and filter campus reports.
          </p>

          {isLoading ? (
            <div className="loading-state">
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="empty-state">
              {searchTerm || statusFilter !== "All"
                ? "No reports match your search or filter."
                : "No reports have been submitted yet."}
            </div>
          ) : (
            <div className="reports-list">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onViewDetails={handleViewDetails}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {selectedReport && (
          <section className="report-details">
            <h2>{selectedReport.title}</h2>

            <p>
              <strong>Location:</strong>{" "}
              {selectedReport.location}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              <span
                className={`priority-badge ${(selectedReport.priority || "Medium").toLowerCase()}`}
              >
                {selectedReport.priority || "Medium"}
              </span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${selectedReport.status.toLowerCase()}`}
              >
                {selectedReport.status}
              </span>
            </p>

            <p>
              <strong>Reported:</strong>{" "}
              {selectedReport.createdAt}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {selectedReport.description}
            </p>

            <div className="report-details-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  handleStatusChange(selectedReport.id)
                }
              >
                {selectedReport.status === "Open"
                  ? "Mark as Resolved"
                  : "Reopen Issue"}
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  handleDelete(selectedReport.id)
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={closeDetails}
              >
                Back to Reports
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App