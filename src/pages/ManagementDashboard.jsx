import { useMemo, useState } from "react"
import ReportCard from "../components/ReportCard"

function ManagementDashboard({
  reports,
  loading,
  error,
  onRetry,
  onViewReport,
  onLogout,
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")

  const filteredReports = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesSearch =
        !searchValue ||
        `${report.title} ${report.location} ${report.description} ${report.userId}`
          .toLowerCase()
          .includes(searchValue)

      const matchesStatus =
        statusFilter === "All" ||
        (report.status || "Open") === statusFilter

      const matchesPriority =
        priorityFilter === "All" ||
        (report.priority || "Unassigned") ===
          priorityFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      )
    })
  }, [
    reports,
    search,
    statusFilter,
    priorityFilter,
  ])

  const total = reports.length

  const open = reports.filter(
    (report) => (report.status || "Open") === "Open"
  ).length

  const inReview = reports.filter(
    (report) => report.status === "In Review"
  ).length

  const resolved = reports.filter(
    (report) => report.status === "Resolved"
  ).length

  const high = reports.filter(
    (report) => report.priority === "High"
  ).length

  const medium = reports.filter(
    (report) => report.priority === "Medium"
  ).length

  const low = reports.filter(
    (report) => report.priority === "Low"
  ).length

  return (
    <div className="app-page">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="small-logo">🚨</span>

          <div>
            <strong>CampusSOS</strong>
            <span>Management Portal</span>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="management-label">
            Campus Management
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">MANAGEMENT DASHBOARD</p>

            <h1>Campus Issues</h1>

            <p>
              Review, prioritize and resolve campus
              complaints.
            </p>
          </div>
        </section>

        <section className="stats-grid management-stats">
          <StatCard
            label="Total Issues"
            value={total}
            icon="📋"
          />

          <StatCard
            label="Open"
            value={open}
            icon="🔵"
          />

          <StatCard
            label="In Review"
            value={inReview}
            icon="🟠"
          />

          <StatCard
            label="Resolved"
            value={resolved}
            icon="✅"
          />
        </section>

        <section className="priority-summary">
          <div>
            <span>High Priority</span>
            <strong>{high}</strong>
          </div>

          <div>
            <span>Medium Priority</span>
            <strong>{medium}</strong>
          </div>

          <div>
            <span>Low Priority</span>
            <strong>{low}</strong>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <h2>All Issues</h2>

              <p>
                Manage and track reports submitted by
                students.
              </p>
            </div>
          </div>

          <div className="filters">
            <input
              className="search-input filter-search"
              type="search"
              placeholder="Search issues, locations or students..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">
                In Review
              </option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Unassigned">
                Unassigned
              </option>
            </select>
          </div>

          <div className="filter-result">
            Showing {filteredReports.length} of{" "}
            {reports.length} issues
          </div>

          {loading && (
            <div className="state-card">
              <div className="spinner" />
              <p>Loading all campus issues...</p>
            </div>
          )}

          {error && !loading && (
            <div className="state-card error-state">
              <h3>Unable to load issues</h3>

              <p>{error}</p>

              <button
                type="button"
                className="secondary-button"
                onClick={onRetry}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredReports.length === 0 && (
              <div className="state-card">
                <div className="empty-icon">🔎</div>

                <h3>No issues found</h3>

                <p>
                  No reports match the current search or
                  filters.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredReports.length > 0 && (
              <div className="reports-grid">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onView={onViewReport}
                    management
                  />
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

export default ManagementDashboard