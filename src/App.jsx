import {
  useEffect,
  useState,
} from "react"

import Login from "./pages/Login"
import StudentDashboard from "./pages/StudentDashboard"
import ManagementDashboard from "./pages/ManagementDashboard"
import ReportIssue from "./pages/ReportIssue"
import StudentReportDetails from "./pages/StudentReportDetails"
import ManagementReportDetails from "./pages/ManagementReportDetails"

import {
  getCurrentUser,
  logout,
} from "./services/auth"

import {
  getReports,
  createReport,
} from "./services/reportsApi"


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


function normalizeReport(report) {
  if (!report || typeof report !== "object") {
    return null
  }

  const status =
    VALID_STATUSES.includes(report.status)
      ? report.status
      : "Open"

  const priority =
    VALID_PRIORITIES.includes(report.priority)
      ? report.priority
      : null

  return {
    ...report,
    status,
    priority,
  }
}


function normalizeReports(data) {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .map(normalizeReport)
    .filter(Boolean)
}


function App() {
  const [user, setUser] = useState(
    () => getCurrentUser()
  )

  const [loginRole, setLoginRole] =
    useState("student")

  const [screen, setScreen] =
    useState("dashboard")

  const [reports, setReports] =
    useState([])

  const [selectedReport, setSelectedReport] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  /*
    ==========================================================
    LOAD REPORTS
    ==========================================================
  */

  useEffect(() => {
    if (!user) {
      setReports([])
      return
    }

    let cancelled = false

    async function loadReports() {
      try {
        setLoading(true)
        setError("")

        const data = await getReports()

        if (cancelled) {
          return
        }

        const normalizedReports =
          normalizeReports(data)

        setReports(normalizedReports)
      } catch (err) {
        if (cancelled) {
          return
        }

        setReports([])

        setError(
          err?.message ||
            "Unable to load reports. Please check your connection and try again."
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      cancelled = true
    }
  }, [user])


  /*
    ==========================================================
    LOGIN
    ==========================================================
  */

  function handleLogin(loggedInUser) {
    if (
      !loggedInUser ||
      !loggedInUser.id ||
      !loggedInUser.role
    ) {
      setError(
        "Invalid login session. Please sign in again."
      )

      return
    }

    setUser(loggedInUser)
    setScreen("dashboard")
    setSelectedReport(null)
    setReports([])
    setError("")
  }


  /*
    ==========================================================
    LOGOUT
    ==========================================================
  */

  function handleLogout() {
    try {
      logout()
    } finally {
      setUser(null)
      setReports([])
      setSelectedReport(null)
      setScreen("dashboard")
      setError("")
      setLoginRole("student")
    }
  }


  /*
    ==========================================================
    CREATE REPORT
    ==========================================================

    App is the single owner of API report creation.

    ReportIssue will later pass only the validated
    report data into this function.

    This prevents the old duplicate-POST problem.
  */

  async function handleCreateReport(reportData) {
    if (!reportData) {
      throw new Error(
        "Invalid report data."
      )
    }

    try {
      setError("")

      const createdReport =
        await createReport(reportData)

      const normalizedReport =
        normalizeReport(createdReport)

      if (!normalizedReport) {
        throw new Error(
          "The server returned an invalid report."
        )
      }

      setReports((previousReports) => [
        normalizedReport,
        ...previousReports,
      ])

      setSelectedReport(null)
      setScreen("dashboard")

      return normalizedReport
    } catch (err) {
      const message =
        err?.message ||
        "Unable to create the report."

      setError(message)

      throw new Error(message)
    }
  }


  /*
    ==========================================================
    REPORT UPDATED
    ==========================================================
  */

  function handleReportUpdated(updatedReport) {
    const normalizedReport =
      normalizeReport(updatedReport)

    if (!normalizedReport) {
      setError(
        "Invalid report returned by the server."
      )

      return
    }

    setReports((previousReports) =>
      previousReports.map((report) =>
        String(report.id) ===
        String(normalizedReport.id)
          ? normalizedReport
          : report
      )
    )

    setSelectedReport(normalizedReport)
    setError("")
  }


  /*
    ==========================================================
    REPORT DELETED
    ==========================================================
  */

  function handleReportDeleted(
    deletedReportId
  ) {
    if (
      deletedReportId === null ||
      deletedReportId === undefined
    ) {
      setError(
        "Invalid report ID."
      )

      return
    }

    setReports((previousReports) =>
      previousReports.filter(
        (report) =>
          String(report.id) !==
          String(deletedReportId)
      )
    )

    setSelectedReport(null)
    setScreen("dashboard")
    setError("")
  }


  /*
    ==========================================================
    OPEN STUDENT REPORT
    ==========================================================
  */

  function handleStudentViewReport(report) {
    if (!report) {
      setError(
        "Unable to open this report."
      )

      return
    }

    /*
      Extra frontend authorization check.

      The dashboard already filters the student's
      reports, but this protects the details screen
      from accidentally receiving another student's
      report.
    */

    if (
      user?.role === "student" &&
      String(report.userId) !==
        String(user.id)
    ) {
      setError(
        "You are not authorized to view this report."
      )

      return
    }

    setSelectedReport(report)
    setScreen("student-details")
    setError("")
  }


  /*
    ==========================================================
    OPEN MANAGEMENT REPORT
    ==========================================================
  */

  function handleManagementViewReport(report) {
    if (!report) {
      setError(
        "Unable to open this report."
      )

      return
    }

    if (user?.role !== "management") {
      setError(
        "You are not authorized to view management reports."
      )

      return
    }

    setSelectedReport(report)
    setScreen("management-details")
    setError("")
  }


  /*
    ==========================================================
    RETURN TO DASHBOARD
    ==========================================================
  */

  function goToDashboard() {
    setSelectedReport(null)
    setScreen("dashboard")
    setError("")
  }


  /*
    ==========================================================
    LOGGED-OUT VIEW
    ==========================================================
  */

  if (!user) {
    return (
      <Login
        role={loginRole}
        onLogin={handleLogin}
        onSwitchRole={() =>
          setLoginRole((currentRole) =>
            currentRole === "student"
              ? "management"
              : "student"
          )
        }
      />
    )
  }


  /*
    ==========================================================
    LOGGED-IN APPLICATION
    ==========================================================
  */

  return (
    <div className="app-shell">

      {/* ====================================================
          GLOBAL HEADER
      ==================================================== */}

      <header className="app-header">

        <button
          type="button"
          className="app-brand"
          onClick={goToDashboard}
          aria-label="Go to CampusSOS dashboard"
        >
          <span
            className="brand-icon"
            aria-hidden="true"
          >
            🚨
          </span>

          <span className="brand-name">
            CampusSOS
          </span>

          <span className="portal-name">
            {user.role === "management"
              ? "Management Portal"
              : "Student Portal"}
          </span>
        </button>


        <div className="app-header-right">

          <div className="app-user">
            <strong>
              {user.name ||
                user.rollNumber ||
                "User"}
            </strong>

            <span>
              {user.email ||
                user.rollNumber ||
                ""}
            </span>
          </div>


          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </header>


      {/* ====================================================
          GLOBAL ERROR
      ==================================================== */}

      {error && (
        <div
          className="global-error"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}


      {/* ====================================================
          INITIAL REPORT LOADING
      ==================================================== */}

      {loading ? (
        <main className="loading-state">
          <div
            className="loading-spinner"
            aria-hidden="true"
          />

          <h2>
            Loading reports...
          </h2>

          <p>
            Please wait while CampusSOS loads
            the latest reports.
          </p>
        </main>
      ) : (
        <>
          {/* =================================================
              STUDENT APPLICATION
          ================================================= */}

          {user.role === "student" && (
            <>
              {screen === "dashboard" && (
                <StudentDashboard
                  reports={reports}
                  user={user}
                  onReportIssue={() => {
                    setError("")
                    setScreen("report")
                  }}
                  onViewReport={
                    handleStudentViewReport
                  }
                />
              )}


              {screen === "report" && (
                <ReportIssue
                  user={user}
                  onBack={goToDashboard}
                  onCreated={
                    handleCreateReport
                  }
                />
              )}


              {screen === "student-details" &&
                selectedReport && (
                  <StudentReportDetails
                    report={selectedReport}
                    onBack={goToDashboard}
                  />
                )}
            </>
          )}


          {/* =================================================
              MANAGEMENT APPLICATION
          ================================================= */}

          {user.role === "management" && (
            <>
              {screen === "dashboard" && (
                <ManagementDashboard
                  reports={reports}
                  onViewReport={
                    handleManagementViewReport
                  }
                />
              )}


              {screen === "management-details" &&
                selectedReport && (
                  <ManagementReportDetails
                    report={selectedReport}
                    onBack={goToDashboard}
                    onUpdated={
                      handleReportUpdated
                    }
                    onDeleted={
                      handleReportDeleted
                    }
                  />
                )}
            </>
          )}
        </>
      )}
    </div>
  )
}


export default App