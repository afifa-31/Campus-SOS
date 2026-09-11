import { useEffect, useState } from "react"

import Login from "./pages/Login"
import StudentDashboard from "./pages/StudentDashboard"
import ManagementDashboard from "./pages/ManagementDashboard"
import ReportIssue from "./pages/ReportIssue"
import StudentReportDetails from "./pages/StudentReportDetails"
import ManagementReportDetails from "./pages/ManagementReportDetails"

import {
  getCurrentUser,
  login,
  logout,
} from "./services/auth"

import {
  getReports,
  createReport,
  updateReport,
} from "./services/reportsApi"


function App() {

  const [user, setUser] =
    useState(getCurrentUser())

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


  /* =====================================================
     LOAD REPORTS
  ===================================================== */

  useEffect(() => {

    if (!user) {
      return
    }

    async function loadReports() {

      try {

        setLoading(true)
        setError("")

        const data =
          await getReports()

        const normalized =
          data.map((report) => ({
            ...report,

            status:
              report.status || "Open",

            priority:
              report.priority || null,
          }))

        setReports(normalized)

      } catch (err) {

        setError(
          err.message ||
            "Unable to load reports."
        )

      } finally {

        setLoading(false)

      }
    }

    loadReports()

  }, [user])


  /* =====================================================
     LOGIN
  ===================================================== */

  function handleLogin(loggedInUser) {

    setUser(loggedInUser)

    setScreen("dashboard")

    setSelectedReport(null)

    setError("")
  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function handleLogout() {

    logout()

    setUser(null)

    setReports([])

    setSelectedReport(null)

    setScreen("dashboard")

    setError("")
  }


  /* =====================================================
     CREATE REPORT
  ===================================================== */

  async function handleCreateReport(
    reportData
  ) {

    const createdReport =
      await createReport(reportData)

    const normalizedReport = {
      ...createdReport,

      status:
        createdReport.status ||
        "Open",

      priority:
        createdReport.priority ||
        null,
    }

    setReports((previous) => [
      normalizedReport,
      ...previous,
    ])

    setScreen("dashboard")
  }


  /* =====================================================
     UPDATE REPORT
  ===================================================== */

  function handleReportUpdated(
    updatedReport
  ) {

    const normalizedReport = {
      ...updatedReport,

      status:
        updatedReport.status ||
        "Open",

      priority:
        updatedReport.priority ||
        null,
    }

    setReports((previous) =>
      previous.map((report) =>
        report.id === normalizedReport.id
          ? normalizedReport
          : report
      )
    )

    setSelectedReport(
      normalizedReport
    )
  }


  /* =====================================================
     DELETE REPORT
  ===================================================== */

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


  /* =====================================================
     LOGIN SCREEN
  ===================================================== */

  if (!user) {

    return (
      <Login
        role={loginRole}
        onLogin={handleLogin}
        onSwitchRole={() =>
          setLoginRole(
            loginRole === "student"
              ? "management"
              : "student"
          )
        }
      />
    )
  }


  /* =====================================================
     APP
  ===================================================== */

  return (
    <div className="app-shell">

      {/* =================================================
          GLOBAL HEADER
      ================================================= */}

      <header className="app-header">

        <button
          type="button"
          className="app-brand"
          onClick={() => {
            setSelectedReport(null)
            setScreen("dashboard")
          }}
        >

          <span className="brand-icon">
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
              {user.name}
            </strong>

            <span>
              {user.email}
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


      {/* =================================================
          GLOBAL ERROR
      ================================================= */}

      {error && (
        <div className="global-error">
          {error}
        </div>
      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="loading-state">
          <div className="loading-spinner"></div>

          <p>
            Loading reports...
          </p>
        </div>

      ) : (

        /* =================================================
           STUDENT
        ================================================= */

        user.role === "student" ? (

          <>

            {screen === "dashboard" && (

              <StudentDashboard
                reports={reports}
                user={user}

                onReportIssue={() =>
                  setScreen("report")
                }

                onViewReport={(report) => {

                  setSelectedReport(
                    report
                  )

                  setScreen(
                    "student-details"
                  )
                }}
              />

            )}


            {screen === "report" && (

              <ReportIssue
                user={user}

                onBack={() =>
                  setScreen("dashboard")
                }

                onCreated={
                  handleCreateReport
                }
              />

            )}


            {screen ===
              "student-details" &&
              selectedReport && (

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

              )}

          </>

        ) : (

          /* =================================================
             MANAGEMENT
          ================================================= */

          <>

            {screen === "dashboard" && (

              <ManagementDashboard
                reports={reports}

                onViewReport={(report) => {

                  setSelectedReport(
                    report
                  )

                  setScreen(
                    "management-details"
                  )
                }}
              />

            )}


            {screen ===
              "management-details" &&
              selectedReport && (

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

              )}

          </>

        )

      )}

    </div>
  )
}


export default App