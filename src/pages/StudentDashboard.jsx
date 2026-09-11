import {
  useMemo,
  useState,
} from "react"


const MAX_SEARCH_LENGTH = 400

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


function StudentDashboard({
  reports,
  user,
  onReportIssue,
  onViewReport,
}) {
  const [search, setSearch] =
    useState("")

  const [searchError, setSearchError] =
    useState("")


  /*
  ============================================================
  ONLY SHOW THE LOGGED-IN STUDENT'S REPORTS
  ============================================================
  */

  const myReports = useMemo(() => {
    if (
      !Array.isArray(reports) ||
      !user?.id
    ) {
      return []
    }

    return reports.filter(
      (report) =>
        report &&
        String(report.userId) ===
          String(user.id)
    )
  }, [reports, user?.id])


  /*
  ============================================================
  SEARCH VALIDATION
  ============================================================
  */

  function handleSearchChange(event) {
    const value =
      event.target.value

    if (
      value.length >
      MAX_SEARCH_LENGTH
    ) {
      setSearchError(
        "Invalid input. Search must be 400 characters or less."
      )

      return
    }

    setSearch(value)
    setSearchError("")
  }


  /*
  ============================================================
  FILTER REPORTS
  ============================================================
  */

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    if (!query) {
      return myReports
    }

    return myReports.filter(
      (report) => {
        const title =
          typeof report.title ===
          "string"
            ? report.title.toLowerCase()
            : ""

        const location =
          typeof report.location ===
          "string"
            ? report.location.toLowerCase()
            : ""

        const description =
          typeof report.description ===
          "string"
            ? report.description.toLowerCase()
            : ""

        return (
          title.includes(query) ||
          location.includes(query) ||
          description.includes(query)
        )
      }
    )
  }, [myReports, search])


  /*
  ============================================================
  STATUS COUNTS
  ============================================================
  */

  const openCount = useMemo(
    () =>
      myReports.filter(
        (report) =>
          !report.status ||
          report.status === "Open"
      ).length,
    [myReports]
  )


  const inReviewCount = useMemo(
    () =>
      myReports.filter(
        (report) =>
          report.status ===
          "In Review"
      ).length,
    [myReports]
  )


  const resolvedCount = useMemo(
    () =>
      myReports.filter(
        (report) =>
          report.status ===
          "Resolved"
      ).length,
    [myReports]
  )


  /*
  ============================================================
  SAFE DISPLAY HELPERS
  ============================================================
  */

  function getStatus(report) {
    if (
      VALID_STATUSES.includes(
        report?.status
      )
    ) {
      return report.status
    }

    return "Open"
  }


  function getStatusClass(status) {
    if (
      status === "Resolved"
    ) {
      return "status-resolved"
    }

    if (
      status === "In Review"
    ) {
      return "status-review"
    }

    return "status-open"
  }


  function getPriorityClass(
    priority
  ) {
    if (
      priority === "High"
    ) {
      return "priority-high"
    }

    if (
      priority === "Medium"
    ) {
      return "priority-medium"
    }

    return "priority-low"
  }


  function getReportDate(
    createdAt
  ) {
    if (
      typeof createdAt !==
      "string" ||
      !createdAt.trim()
    ) {
      return "Recently"
    }

    const date =
      new Date(createdAt)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Recently"
    }

    return date.toLocaleDateString()
  }


  function clearSearch() {
    setSearch("")
    setSearchError("")
  }


  /*
  ============================================================
  RENDER
  ============================================================
  */

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
              Hello,{" "}
              {user?.name ||
                user?.rollNumber ||
                "Student"}{" "}
              👋
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

            <div
              className="stat-icon"
              aria-hidden="true"
            >
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

            <div
              className="stat-icon"
              aria-hidden="true"
            >
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

            <div
              className="stat-icon"
              aria-hidden="true"
            >
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

            <div
              className="stat-icon"
              aria-hidden="true"
            >
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

              <span
                className="search-icon"
                aria-hidden="true"
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Search my reports..."
                value={search}
                maxLength={
                  MAX_SEARCH_LENGTH
                }
                aria-invalid={
                  Boolean(searchError)
                }
                onChange={
                  handleSearchChange
                }
              />

            </div>


            {searchError && (
              <p
                className="field-error"
                role="alert"
              >
                {searchError}
              </p>
            )}

          </div>


          {/* ================= REPORTS ================= */}

          {filteredReports.length > 0 ? (

            <div className="reports-grid">

              {filteredReports.map(
                (report) => {

                  const status =
                    getStatus(report)

                  const statusClass =
                    getStatusClass(
                      status
                    )

                  const validPriority =
                    VALID_PRIORITIES.includes(
                      report.priority
                    )

                  return (
                    <article
                      className="report-card"
                      key={
                        report.id
                      }
                    >

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {status}
                      </span>


                      <h3>
                        {typeof report.title ===
                        "string" &&
                        report.title.trim()
                          ? report.title
                          : "Untitled Report"}
                      </h3>


                      <div className="report-card-meta">

                        <span>
                          📍{" "}
                          {typeof report.location ===
                          "string" &&
                          report.location.trim()
                            ? report.location
                            : "Location unavailable"}
                        </span>


                        <span>
                          📅{" "}
                          {getReportDate(
                            report.createdAt
                          )}
                        </span>

                      </div>


                      <p>
                        {typeof report.description ===
                        "string" &&
                        report.description.trim()
                          ? report.description
                          : "No description available."}
                      </p>


                      {/* Priority is assigned by management */}

                      {validPriority && (
                        <div
                          style={{
                            marginTop:
                              "13px",
                          }}
                        >
                          <span
                            className={`priority-badge ${getPriorityClass(
                              report.priority
                            )}`}
                          >
                            {report.priority}{" "}
                            Priority
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
                            onViewReport(
                              report
                            )
                          }
                        >
                          View Details
                        </button>

                      </div>

                    </article>
                  )
                }
              )}

            </div>

          ) : (

            /* ================= EMPTY STATE ================= */

            <div className="empty-state">

              <div
                className="empty-icon"
                aria-hidden="true"
              >
                📭
              </div>


              {search.trim() ? (
                <>
                  <h3>
                    No reports found
                  </h3>

                  <p>
                    No report matches your
                    search. Try another issue
                    title, location, or keyword.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      clearSearch
                    }
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
                    onClick={
                      onReportIssue
                    }
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