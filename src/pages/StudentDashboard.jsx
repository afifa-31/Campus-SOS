import { useMemo, useState } from "react"

function StudentDashboard({
  reports,
  user,
  onReportIssue,
  onViewReport,
}) {
  const [search, setSearch] = useState("")

  const myReports = useMemo(() => {
    return reports.filter(
      (report) => report.userId === user.id
    )
  }, [reports, user.id])

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return myReports
    }

    return myReports.filter((report) => {
      return (
        report.title?.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query)
      )
    })
  }, [myReports, search])

  const openCount = myReports.filter(
    (report) => (report.status || "Open") === "Open"
  ).length

  const inReviewCount = myReports.filter(
    (report) => (report.status || "Open") === "In Review"
  ).length

  const resolvedCount = myReports.filter(
    (report) => (report.status || "Open") === "Resolved"
  ).length

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <section className="dashboard-header">
          <div className="dashboard-heading">
            <p className="eyebrow">
              STUDENT DASHBOARD
            </p>

            <h1>
              Hello, {user.name} 👋
            </h1>

            <p className="dashboard-subtitle">
              Report campus problems and track your
              submitted issues.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onReportIssue}
          >
            + Report New Issue
          </button>
        </section>


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          <div className="stat-card total-card">
            <div className="stat-icon">
              📋
            </div>

            <div className="stat-content">
              <span className="stat-label">
                My Reports
              </span>

              <strong>
                {myReports.length}
              </strong>
            </div>
          </div>


          <div className="stat-card open-card">
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


          <div className="stat-card review-card">
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


          <div className="stat-card resolved-card">
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


        {/* ================= MY REPORTS ================= */}

        <section className="issues-section">

          <div className="issues-heading">
            <div>
              <h2>
                My Reports
              </h2>

              <p>
                Only reports submitted from your
                account appear here.
              </p>
            </div>
          </div>


          {/* ================= SEARCH ================= */}

          <div className="filter-panel">

            <div className="search-wrapper">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search my reports..."
                value={search}
                maxLength={400}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

          </div>


          {/* ================= REPORTS ================= */}

          {filteredReports.length > 0 ? (

            <div className="reports-grid">

              {filteredReports.map((report) => {

                const status =
                  report.status || "Open"

                const statusClass =
                  status === "Resolved"
                    ? "status-resolved"
                    : status === "In Review"
                      ? "status-review"
                      : "status-open"

                return (
                  <article
                    className="report-card"
                    key={report.id}
                  >

                    <span
                      className={`status-badge ${statusClass}`}
                    >
                      {status}
                    </span>

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


                    {/* Priority is visible only if management assigned it */}

                    {report.priority && (
                      <div
                        style={{
                          marginTop: "13px",
                        }}
                      >
                        <span
                          className={`priority-badge ${
                            report.priority === "High"
                              ? "priority-high"
                              : report.priority === "Medium"
                                ? "priority-medium"
                                : "priority-low"
                          }`}
                        >
                          {report.priority} Priority
                        </span>
                      </div>
                    )}


                    <div className="report-card-actions">

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {status}
                      </span>

                      <button
                        type="button"
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

            /* ================= EMPTY STATE ================= */

            <div className="empty-state">

              <div className="empty-icon">
                📭
              </div>

              {search.trim() ? (
                <>
                  <h3>
                    No reports found
                  </h3>

                  <p>
                    Try searching with a different
                    issue title or location.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSearch("")}
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h3>
                    No reports yet
                  </h3>

                  <p>
                    Your submitted campus issues
                    will appear here.
                  </p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={onReportIssue}
                  >
                    Report Your First Issue
                  </button>
                </>
              )}

            </div>

          )}

        </section>

      </div>
    </main>
  )
}

export default StudentDashboard