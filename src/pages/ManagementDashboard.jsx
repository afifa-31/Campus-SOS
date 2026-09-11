import { useMemo, useState } from "react"
import ReportCard from "../components/ReportCard"

function ManagementDashboard({
  reports,
  onSelectReport,
  user,
  onLogout,
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [priorityFilter, setPriorityFilter] = useState("All Priorities")

  const openCount = reports.filter(
    (report) => report.status === "Open"
  ).length

  const inReviewCount = reports.filter(
    (report) => report.status === "In Review"
  ).length

  const resolvedCount = reports.filter(
    (report) => report.status === "Resolved"
  ).length

  const highPriorityCount = reports.filter(
    (report) => report.priority === "High"
  ).length

  const mediumPriorityCount = reports.filter(
    (report) => report.priority === "Medium"
  ).length

  const lowPriorityCount = reports.filter(
    (report) => report.priority === "Low"
  ).length

  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return reports.filter((report) => {
      const matchesSearch =
        !searchText ||
        report.title?.toLowerCase().includes(searchText) ||
        report.location?.toLowerCase().includes(searchText) ||
        report.description?.toLowerCase().includes(searchText) ||
        report.reporterName?.toLowerCase().includes(searchText) ||
        report.reporterEmail?.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === "All Statuses" ||
        report.status === statusFilter

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        report.priority === priorityFilter

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

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <section className="dashboard-header">

          <div className="dashboard-heading">
            <p className="eyebrow">
              MANAGEMENT DASHBOARD
            </p>

            <h1>Campus Issues</h1>

            <p className="dashboard-subtitle">
              Review, prioritize and resolve campus complaints.
            </p>
          </div>

          <div className="dashboard-user">
            <div className="user-info">
              <span className="user-role">
                Campus Management
              </span>

              <span className="user-email">
                {user?.email}
              </span>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>

        </section>


        {/* ================= OVERVIEW STATS ================= */}

        <section className="dashboard-section">

          <div className="stats-grid">

            <div className="stat-card total-card">
              <div className="stat-icon">
                📋
              </div>

              <div className="stat-content">
                <strong>
                  {reports.length}
                </strong>

                <span className="stat-label">
                  Total Issues
                </span>
              </div>
            </div>


            <div className="stat-card open-card">
              <div className="stat-icon">
                🔵
              </div>

              <div className="stat-content">
                <strong>
                  {openCount}
                </strong>

                <span className="stat-label">
                  Open Issues
                </span>
              </div>
            </div>


            <div className="stat-card review-card">
              <div className="stat-icon">
                🟠
              </div>

              <div className="stat-content">
                <strong>
                  {inReviewCount}
                </strong>

                <span className="stat-label">
                  In Review
                </span>
              </div>
            </div>


            <div className="stat-card resolved-card">
              <div className="stat-icon">
                ✅
              </div>

              <div className="stat-content">
                <strong>
                  {resolvedCount}
                </strong>

                <span className="stat-label">
                  Resolved
                </span>
              </div>
            </div>

          </div>

        </section>


        {/* ================= PRIORITY INSIGHTS ================= */}

        <section className="dashboard-section priority-section">

          <div className="section-heading">
            <h2>Priority Insights</h2>

            <p>
              Overview of campus issues by priority level.
            </p>
          </div>


          <div className="priority-grid">

            <div className="priority-card high-priority">
              <div className="priority-number">
                {highPriorityCount}
              </div>

              <div>
                <span className="priority-title">
                  High Priority
                </span>

                <span className="priority-description">
                  Requires immediate attention
                </span>
              </div>
            </div>


            <div className="priority-card medium-priority">
              <div className="priority-number">
                {mediumPriorityCount}
              </div>

              <div>
                <span className="priority-title">
                  Medium Priority
                </span>

                <span className="priority-description">
                  Needs attention soon
                </span>
              </div>
            </div>


            <div className="priority-card low-priority">
              <div className="priority-number">
                {lowPriorityCount}
              </div>

              <div>
                <span className="priority-title">
                  Low Priority
                </span>

                <span className="priority-description">
                  Can be handled normally
                </span>
              </div>
            </div>

          </div>

        </section>


        {/* ================= ALL ISSUES ================= */}

        <section className="issues-section">

          <div className="issues-heading">

            <div>
              <p className="eyebrow">
                ISSUE MANAGEMENT
              </p>

              <h2>All Issues</h2>

              <p>
                Manage and track reports submitted by students.
              </p>
            </div>

            <div className="issue-count">
              Showing{" "}
              <strong>
                {filteredReports.length}
              </strong>{" "}
              of{" "}
              <strong>
                {reports.length}
              </strong>{" "}
              issues
            </div>

          </div>


          {/* ================= FILTER BAR ================= */}

          <div className="filter-panel">

            <div className="search-wrapper">
              <span className="search-icon">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search issues, locations or students..."
                aria-label="Search issues"
              />
            </div>


            <div className="filter-controls">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                aria-label="Filter by status"
              >
                <option>
                  All Statuses
                </option>

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


              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                aria-label="Filter by priority"
              >
                <option>
                  All Priorities
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

            </div>

          </div>


          {/* ================= REPORTS ================= */}

          {filteredReports.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No issues found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="reports-grid">

              {filteredReports.map((report) => (

                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() =>
                    onSelectReport(report)
                  }
                />

              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  )
}

export default ManagementDashboard