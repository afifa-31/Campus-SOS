import {
  useMemo,
  useState,
} from "react"


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


function ManagementDashboard({
  reports,
  onViewReport,
}) {
  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("All")

  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const [searchError, setSearchError] =
    useState("")


  /*
  ============================================================
  SAFE REPORT LIST
  ============================================================
  */

  const safeReports = useMemo(() => {
    if (!Array.isArray(reports)) {
      return []
    }

    return reports.filter(
      (report) =>
        report &&
        typeof report === "object"
    )
  }, [reports])


  /*
  ============================================================
  STATS
  ============================================================
  */

  const totalIssues =
    safeReports.length

  const openIssues =
    safeReports.filter(
      (report) =>
        report.status === "Open"
    ).length

  const inReviewIssues =
    safeReports.filter(
      (report) =>
        report.status === "In Review"
    ).length

  const resolvedIssues =
    safeReports.filter(
      (report) =>
        report.status === "Resolved"
    ).length


  /*
  ============================================================
  PRIORITY INSIGHTS
  ============================================================
  */

  const highPriority =
    safeReports.filter(
      (report) =>
        report.priority === "High"
    ).length

  const mediumPriority =
    safeReports.filter(
      (report) =>
        report.priority === "Medium"
    ).length

  const lowPriority =
    safeReports.filter(
      (report) =>
        report.priority === "Low"
    ).length


  /*
  ============================================================
  FILTERED REPORTS
  ============================================================
  */

  const filteredReports =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase()

      return safeReports.filter(
        (report) => {
          const reportStatus =
            VALID_STATUSES.includes(
              report.status
            )
              ? report.status
              : "Open"

          const reportPriority =
            VALID_PRIORITIES.includes(
              report.priority
            )
              ? report.priority
              : null


          /*
          ------------------------------------------------------
          STATUS FILTER
          ------------------------------------------------------
          */

          if (
            statusFilter !== "All" &&
            reportStatus !== statusFilter
          ) {
            return false
          }


          /*
          ------------------------------------------------------
          PRIORITY FILTER
          ------------------------------------------------------
          */

          if (
            priorityFilter !== "All"
          ) {
            if (
              priorityFilter ===
              "Not Assigned"
            ) {
              if (
                reportPriority !== null
              ) {
                return false
              }
            } else if (
              reportPriority !==
              priorityFilter
            ) {
              return false
            }
          }


          /*
          ------------------------------------------------------
          SEARCH
          ------------------------------------------------------
          */

          if (!searchValue) {
            return true
          }

          const title =
            typeof report.title ===
            "string"
              ? report.title
              : ""

          const location =
            typeof report.location ===
            "string"
              ? report.location
              : ""

          const description =
            typeof report.description ===
            "string"
              ? report.description
              : ""

          const userId =
            report.userId !==
              null &&
            report.userId !==
              undefined
              ? String(report.userId)
              : ""

          const reporterName =
            typeof report.reporterName ===
            "string"
              ? report.reporterName
              : ""

          return (
            title
              .toLowerCase()
              .includes(searchValue) ||
            location
              .toLowerCase()
              .includes(searchValue) ||
            description
              .toLowerCase()
              .includes(searchValue) ||
            userId
              .toLowerCase()
              .includes(searchValue) ||
            reporterName
              .toLowerCase()
              .includes(searchValue)
          )
        }
      )
    }, [
      safeReports,
      search,
      statusFilter,
      priorityFilter,
    ])


  /*
  ============================================================
  SEARCH VALIDATION
  ============================================================
  */

  function handleSearchChange(event) {
    const value =
      event.target.value

    if (value.length > 400) {
      setSearchError(
        "Invalid input: Search cannot exceed 400 characters."
      )

      return
    }

    setSearch(value)

    if (value.length <= 400) {
      setSearchError("")
    }
  }


  /*
  ============================================================
  CLEAR SEARCH
  ============================================================
  */

  function clearSearch() {
    setSearch("")
    setSearchError("")
  }


  /*
  ============================================================
  RESET FILTERS
  ============================================================
  */

  function clearFilters() {
    setSearch("")
    setStatusFilter("All")
    setPriorityFilter("All")
    setSearchError("")
  }


  /*
  ============================================================
  PAGE
  ============================================================
  */

  return (
    <main className="dashboard-container">

      {/* ==================================================
          PAGE INTRO
          ================================================== */}

      <section className="dashboard-hero">

        <div>

          <p className="eyebrow">
            MANAGEMENT PORTAL
          </p>

          <h1>
            Campus Issues
          </h1>

          <p>
            Monitor, prioritize, and manage
            campus reports from one place.
          </p>

        </div>

      </section>


      {/* ==================================================
          MAIN STATS
          ================================================== */}

      <section className="stats-grid">

        <StatCard
          label="Total Issues"
          value={totalIssues}
          icon="📋"
        />

        <StatCard
          label="Open"
          value={openIssues}
          icon="🟠"
        />

        <StatCard
          label="In Review"
          value={inReviewIssues}
          icon="🔵"
        />

        <StatCard
          label="Resolved"
          value={resolvedIssues}
          icon="🟢"
        />

      </section>


      {/* ==================================================
          PRIORITY INSIGHTS
          ================================================== */}

      <section className="details-card priority-insights">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              PRIORITY OVERVIEW
            </p>

            <h2>
              Priority Insights
            </h2>

            <p>
              Review the current severity
              distribution across all issues.
            </p>

          </div>

        </div>


        <div className="priority-summary">

          <PriorityInsight
            label="High"
            value={highPriority}
            className="high"
          />

          <PriorityInsight
            label="Medium"
            value={mediumPriority}
            className="medium"
          />

          <PriorityInsight
            label="Low"
            value={lowPriority}
            className="low"
          />

        </div>

      </section>


      {/* ==================================================
          SEARCH + FILTERS
          ================================================== */}

      <section className="details-card">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              REPORT MANAGEMENT
            </p>

            <h2>
              All Reports
            </h2>

            <p>
              Search and filter every submitted
              campus issue.
            </p>

          </div>

        </div>


        <div className="management-filters">

          <div className="search-field">

            <label htmlFor="management-search">
              Search Reports
            </label>

            <input
              id="management-search"
              type="search"
              value={search}
              onChange={
                handleSearchChange
              }
              placeholder="Search title, location, description, student ID or reporter name"
              maxLength={400}
              aria-invalid={
                Boolean(searchError)
              }
              aria-describedby={
                searchError
                  ? "management-search-error"
                  : undefined
              }
            />

            <div className="input-meta">
              <span>
                Search by title, location,
                description, student ID or
                reporter name.
              </span>

              <span>
                {search.length}/400
              </span>
            </div>

            {searchError && (
              <p
                id="management-search-error"
                className="field-error"
                role="alert"
              >
                {searchError}
              </p>
            )}

          </div>


          <div className="filter-field">

            <label htmlFor="status-filter">
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => {
                const value =
                  event.target.value

                if (
                  value === "All" ||
                  VALID_STATUSES.includes(
                    value
                  )
                ) {
                  setStatusFilter(value)
                } else {
                  setStatusFilter("All")
                }
              }}
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

          </div>


          <div className="filter-field">

            <label htmlFor="priority-filter">
              Priority
            </label>

            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(event) => {
                const value =
                  event.target.value

                if (
                  value === "All" ||
                  value ===
                    "Not Assigned" ||
                  VALID_PRIORITIES.includes(
                    value
                  )
                ) {
                  setPriorityFilter(value)
                } else {
                  setPriorityFilter("All")
                }
              }}
            >

              <option value="All">
                All Priorities
              </option>

              <option value="Not Assigned">
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

          </div>


          <button
            type="button"
            className="secondary-button filter-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        {/* ==================================================
            SEARCH RESULT SUMMARY
            ================================================== */}

        <div className="results-summary">

          <strong>
            {filteredReports.length}
          </strong>

          <span>
            {filteredReports.length === 1
              ? "report"
              : "reports"}{" "}
            shown
          </span>

          {search.trim() && (
            <button
              type="button"
              className="text-button"
              onClick={clearSearch}
            >
              Clear search
            </button>
          )}

        </div>


        {/* ==================================================
            EMPTY STATE
            ================================================== */}

        {filteredReports.length === 0 ? (
          <div className="empty-state">

            <div
              className="empty-icon"
              aria-hidden="true"
            >
              🔎
            </div>

            <h3>
              No reports found
            </h3>

            <p>
              {search.trim()
                ? "No reports match your search. Try a different keyword."
                : "There are no reports matching the selected filters."}
            </p>

            {(search.trim() ||
              statusFilter !== "All" ||
              priorityFilter !== "All") && (
              <button
                type="button"
                className="primary-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>
        ) : (
          <div className="management-report-list">

            {filteredReports.map(
              (report) => (
                <ManagementReportRow
                  key={
                    report.id !==
                      null &&
                    report.id !==
                      undefined
                      ? String(report.id)
                      : `${report.userId || "report"}-${report.createdAt || Math.random()}`
                  }
                  report={report}
                  onViewReport={
                    onViewReport
                  }
                />
              )
            )}

          </div>
        )}

      </section>

    </main>
  )
}


/*
============================================================
STAT CARD
============================================================
*/

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="stat-card">

      <div
        className="stat-icon"
        aria-hidden="true"
      >
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  )
}


/*
============================================================
PRIORITY INSIGHT
============================================================
*/

function PriorityInsight({
  label,
  value,
  className,
}) {
  return (
    <div
      className={`priority-insight ${className}`}
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {value === 1
          ? "issue"
          : "issues"}
      </small>

    </div>
  )
}


/*
============================================================
MANAGEMENT REPORT ROW
============================================================
*/

function ManagementReportRow({
  report,
  onViewReport,
}) {
  const title =
    typeof report.title === "string" &&
    report.title.trim()
      ? report.title.trim()
      : "Untitled Report"

  const location =
    typeof report.location === "string" &&
    report.location.trim()
      ? report.location.trim()
      : "Location unavailable"

  const description =
    typeof report.description ===
      "string" &&
    report.description.trim()
      ? report.description.trim()
      : "No description available."

  const reporterName =
    typeof report.reporterName ===
      "string" &&
    report.reporterName.trim()
      ? report.reporterName.trim()
      : "Unknown student"

  const reporterEmail =
    typeof report.reporterEmail ===
      "string" &&
    report.reporterEmail.trim()
      ? report.reporterEmail.trim()
      : "Email unavailable"

  const userId =
    report.userId !== null &&
    report.userId !== undefined &&
    String(report.userId).trim()
      ? String(report.userId)
      : "Unavailable"

  const status =
    VALID_STATUSES.includes(
      report.status
    )
      ? report.status
      : "Open"

  const priority =
    VALID_PRIORITIES.includes(
      report.priority
    )
      ? report.priority
      : null


  return (
    <article className="management-report-row">

      <div className="management-report-main">

        <div className="management-report-top">

          <div>

            <span className="report-label">
              ISSUE
            </span>

            <h3>
              {title}
            </h3>

          </div>

          <span
            className={`status-badge status-${getStatusClass(
              status
            )}`}
          >
            {status}
          </span>

        </div>


        <p className="management-description">
          {description}
        </p>


        <div className="management-report-meta">

          <div>
            <span>
              Location
            </span>

            <strong>
              {location}
            </strong>
          </div>


          <div>
            <span>
              Student
            </span>

            <strong>
              {reporterName}
            </strong>
          </div>


          <div>
            <span>
              Student ID
            </span>

            <strong>
              {userId}
            </strong>
          </div>


          <div>
            <span>
              Email
            </span>

            <strong>
              {reporterEmail}
            </strong>
          </div>


          <div>
            <span>
              Priority
            </span>

            <strong>
              {priority || "Not Assigned"}
            </strong>
          </div>

        </div>

      </div>


      <div className="management-report-action">

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (
              typeof onViewReport ===
              "function"
            ) {
              onViewReport(report)
            }
          }}
        >
          View Report
        </button>

      </div>

    </article>
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


export default ManagementDashboard