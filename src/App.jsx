import {
  useCallback,
  useEffect,
  useState,
} from "react"


import Login from "./pages/Login"
import StudentDashboard from "./pages/StudentDashboard"
import ReportIssue from "./pages/ReportIssue"
import StudentReportDetails from "./pages/StudentReportDetails"

import ManagementDashboard from "./pages/ManagementDashboard"
import ManagementReportDetails from "./pages/ManagementReportDetails"


import {
  getCurrentUser,
  logout,
} from "./services/auth"


import {
  getReports,
} from "./services/reportsApi"



function App() {

  const [user, setUser] =
    useState(getCurrentUser)

  const [loginRole, setLoginRole] =
    useState("student")

  const [screen, setScreen] =
    useState("dashboard")

  const [selectedReport, setSelectedReport] =
    useState(null)


  const [reports, setReports] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  /* LOAD REPORTS */

  const loadReports =
    useCallback(async () => {

      setLoading(true)
      setError("")

      try {

        const data =
          await getReports()

        const normalized =
          Array.isArray(data)
            ? data.map(normalizeReport)
            : []

        setReports(normalized)

      } catch (err) {

        setError(
          err.message ||
            "Unable to load reports."
        )

      } finally {

        setLoading(false)

      }

    }, [])


  useEffect(() => {

    if (user) {
      loadReports()
    }

  }, [user, loadReports])


  /* LOGIN */

  function handleLogin(loggedInUser) {

    setUser(loggedInUser)

    setSelectedReport(null)

    setScreen("dashboard")

  }


  /* LOGOUT */

  function handleLogout() {

    logout()

    setUser(null)

    setReports([])

    setSelectedReport(null)

    setScreen("dashboard")

  }


  /* STUDENT REPORT */

  function openStudentReport(report) {

    if (!user) {
      return
    }

    /*
      SECURITY CHECK:
      Student can only open
      their own report.
    */

    if (report.userId !== user.id) {
      return
    }

    setSelectedReport(report)

    setScreen("student-details")

  }


  /* MANAGEMENT REPORT */

  function openManagementReport(report) {

    setSelectedReport(report)

    setScreen("management-details")

  }


  /* CREATE REPORT */

  function handleReportCreated(
    createdReport
  ) {

    const normalized =
      normalizeReport(
        createdReport
      )

    setReports((previous) => [
      normalized,
      ...previous,
    ])

    setSelectedReport(normalized)

    setScreen(
      "student-details"
    )

  }


  /* UPDATE REPORT */

  function handleReportUpdated(
    updatedReport
  ) {

    const normalized =
      normalizeReport(
        updatedReport
      )

    setReports((previous) =>
      previous.map((report) =>
        report.id === normalized.id
          ? normalized
          : report
      )
    )

    setSelectedReport(
      normalized
    )

  }


  /* DELETE REPORT */

  function handleReportDeleted(
    deletedReportId
  ) {

    setReports((previous) =>
      previous.filter(
        (report) =>
          report.id !==
          deletedReportId
      )
    )

    setSelectedReport(null)

    setScreen("dashboard")

  }


  /* LOGIN SCREEN */

  if (!user) {

    return (
      <Login
        role={loginRole}

        onLogin={handleLogin}

        onSwitchRole={() =>
          setLoginRole(
            (previous) =>
              previous === "student"
                ? "management"
                : "student"
          )
        }
      />
    )

  }


  /* =========================
     STUDENT
     ========================= */

  if (user.role === "student") {

    /* REPORT FORM */

    if (screen === "report") {

      return (
        <ReportIssue
          user={user}

          onBack={() =>
            setScreen(
              "dashboard"
            )
          }

          onCreated={
            handleReportCreated
          }
        />
      )

    }


    /* REPORT DETAILS */

    if (
      screen ===
      "student-details"
    ) {

      return (
        <StudentReportDetails
          report={
            selectedReport
          }

          onBack={() => {

            setSelectedReport(
              null
            )

            setScreen(
              "dashboard"
            )

          }}
        />
      )

    }


    /* STUDENT DASHBOARD */

    return (
      <StudentDashboard

        user={user}

        reports={reports}

        loading={loading}

        error={error}

        onRetry={loadReports}

        onReportIssue={() =>
          setScreen("report")
        }

        onViewReport={
          openStudentReport
        }

        onLogout={
          handleLogout
        }

      />
    )

  }


  /* =========================
     MANAGEMENT
     ========================= */

  if (
    user.role ===
    "management"
  ) {

    /* MANAGEMENT DETAILS */

    if (
      screen ===
      "management-details"
    ) {

      return (
        <ManagementReportDetails

          report={
            selectedReport
          }

          onBack={() => {

            setSelectedReport(
              null
            )

            setScreen(
              "dashboard"
            )

          }}

          onUpdated={
            handleReportUpdated
          }

          onDeleted={
            handleReportDeleted
          }

        />
      )

    }


    /* MANAGEMENT DASHBOARD */

    return (
      <ManagementDashboard

        reports={reports}

        loading={loading}

        error={error}

        onRetry={loadReports}

        onViewReport={
          openManagementReport
        }

        onLogout={
          handleLogout
        }

      />
    )

  }


  return null
}



/* NORMALIZE REPORT */

function normalizeReport(
  report
) {

  return {

    ...report,

    status:
      report.status ||
      "Open",

    priority:
      report.priority ||
      null,

  }

}


export default App