import { useMemo, useState } from "react"
import ReportCard from "../components/ReportCard"

function StudentDashboard({
  user,
  reports,
  loading,
  error,
  onRetry,
  onReportIssue,
  onViewReport,
  onLogout,
}) {
  const [search, setSearch] = useState("")

  const myReports = useMemo(() => {
    return reports.filter(
      (report) => report.userId === user.id
    )
  }, [reports, user.id])

  const filteredReports = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) {
      return myReports
    }

    return myReports.filter((report) =>
      `${report.title} ${report.location} ${report.description}`
        .toLowerCase()
        .includes(value)
    )
  }, [myReports, search])

  const total = myReports.length

  const open = myReports.filter(
    (report) => report.status === "Open"
  ).length

  const inReview = myReports.filter(
    (report) => report.status === "In Review"
  ).length

  const resolved = myReports.filter(
    (report) => report.status === "Resolved"
  ).length

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

        <div className="topbar-actions">
          <span className="user-name">{user.name}</span>

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
            <p className="eyebrow">STUDENT DASHBOARD</p>

            <h1>Hello, {user.name} 👋</h1>

            <p>
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

        <section className="stats-grid student-stats">
          <StatCard
            label="My Reports"
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

        <section className="content-section">
          <div className="section-heading">
            <div>
              <h2>My Reports</h2>
              <p>
                Only reports submitted from your account
                appear here.
              </p>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Search my reports..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {loading && (
            <div className="state-card">
              <div className="spinner" />
              <p>Loading your reports...</p>
            </div>
          )}

          {error && !loading && (
            <div className="state-card error-state">
              <h3>Unable to load reports</h3>
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
                <div className="empty-icon">📭</div>

                <h3>
                  {search
                    ? "No matching reports"
                    : "No reports yet"}
                </h3>

                <p>
                  {search
                    ? "Try a different search."
                    : "Your submitted campus issues will appear here."}
                </p>

                {!search && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={onReportIssue}
                  >
                    Report Your First Issue
                  </button>
                )}
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
                    management={false}
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

export default StudentDashboard