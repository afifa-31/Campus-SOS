import { useMemo, useState } from "react"

function ManagementDashboard({
  reports,
  onViewReport,
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState("All")
  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const openCount = reports.filter(
    (report) =>
      (report.status || "Open") === "Open"
  ).length

  const inReviewCount = reports.filter(
    (report) =>
      (report.status || "Open") === "In Review"
  ).length

  const resolvedCount = reports.filter(
    (report) =>
      (report.status || "Open") === "Resolved"
  ).length

  const highCount = reports.filter(
    (report) =>
      report.priority === "High"
  ).length

  const mediumCount = reports.filter(
    (report) =>
      report.priority === "Medium"
  ).length

  const lowCount = reports.filter(
    (report) =>
      report.priority === "Low"
  ).length


  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase()

    return reports.filter((report) => {

      const matchesSearch =
        !query ||
        report.title
          ?.toLowerCase()
          .includes(query) ||
        report.location
          ?.toLowerCase()
          .includes(query) ||
        report.description
          ?.toLowerCase()
          .includes(query) ||
        report.userId
          ?.toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === "All" ||
        (report.status || "Open") ===
          statusFilter

      const matchesPriority =
        priorityFilter === "All" ||
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

        {/* HEADER */}

        <section className="dashboard-header">

          <div className="dashboard-heading">

            <p className="eyebrow">
              MANAGEMENT DASHBOARD
            </p>

            <h1>
              Campus Issues
            </h1>

            <p className="dashboard-subtitle">
              Review, prioritize and resolve
              campus complaints.
            </p>

          </div>

        </section>


        {/* MAIN STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              📋
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Total Issues
              </span>

              <strong>
                {reports.length}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              🔵
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Open
              </span>

              <strong>
                {openCount}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              🟠
            </div>

            <div className="stat-content">
              <span className="stat-label">
                In Review
              </span>

              <strong>
                {inReviewCount}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              ✅
            </div>

            <div className="stat-content">
              <span className="stat-label">
                Resolved
              </span>

              <strong>
                {resolvedCount}
              </strong>
            </div>
          </div>

        </section>


        {/* PRIORITY INSIGHTS */}

        <section className="priority-section">

          <div className="section-heading">

            <h2>
              Priority Insights
            </h2>

            <p>
              Overview of campus issues by
              priority level.
            </p>

          </div>


          <div className="priority-grid">

            <div className="priority-card priority-high">
              <strong>
                {highCount}
              </strong>

              <span>
                High Priority
              </span>
            </div>


            <div className="priority-card priority-medium">
              <strong>
                {mediumCount}
              </strong>

              <span>
                Medium Priority
              </span>
            </div>


            <div className="priority-card priority-low">
              <strong>
                {lowCount}
              </strong>

              <span>
                Low Priority
              </span>
            </div>

          </div>

        </section>


        {/* ALL ISSUES */}

        <section className="issues-section">

          <div className="section-heading">

            <h2>
              All Issues
            </h2>

            <p>
              Manage and track reports submitted
              by students.
            </p>

          </div>


          {/* FILTER PANEL */}

          <div className="filter-panel">

            <div className="search-wrapper">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search issues, locations or students..."
                value={search}
                maxLength={400}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            <div className="filter-controls">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
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
                  setPriorityFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
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


          <div className="results-count">
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


          {/* REPORT LIST */}

          {filteredReports.length > 0 ? (

            <div className="reports-grid">

              {filteredReports.map((report) => {

                const status =
                  report.status || "Open"

                const priority =
                  report.priority || null

                const statusClass =
                  status === "Resolved"
                    ? "status-resolved"
                    : status === "In Review"
                      ? "status-review"
                      : "status-open"

                const priorityClass =
                  priority === "High"
                    ? "priority-high"
                    : priority === "Medium"
                      ? "priority-medium"
                      : "priority-low"


                return (
                  <article
                    className="report-card"
                    key={report.id}
                  >

                    <div className="report-card-top">

                      <span className="report-id">
                        #{report.id}
                      </span>

                      {priority && (
                        <span
                          className={`priority-badge ${priorityClass}`}
                        >
                          {priority}
                        </span>
                      )}

                    </div>


                    <h3>
                      {report.title}
                    </h3>


                    <div className="report-card-meta">

                      <span>
                        📍 {report.location}
                      </span>

                      <span>
                        📅{" "}
                        {report.createdAt
                          ? new Date(
                              report.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </span>

                    </div>


                    <p>
                      {report.description}
                    </p>


                    <div className="report-card-footer">

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {status}
                      </span>


                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          onViewReport(report)
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </article>
                )
              })}

            </div>

          ) : (

            <div className="empty-state">

              <div className="empty-icon">
                🔎
              </div>

              <h3>
                No issues found
              </h3>

              <p>
                Try changing your search or
                filters.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearch("")
                  setStatusFilter("All")
                  setPriorityFilter("All")
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

      </div>
    </main>
  )
}

export default ManagementDashboard