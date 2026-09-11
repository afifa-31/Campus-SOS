import PriorityBadge from "./PriorityBadge"


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


function ReportCard({
  report,
  onClick,
  showReporter = false,
}) {
  if (
    !report ||
    typeof report !== "object"
  ) {
    return null
  }


  const title =
    typeof report.title === "string" &&
    report.title.trim() !== ""
      ? report.title.trim()
      : "Untitled Report"


  const location =
    typeof report.location === "string" &&
    report.location.trim() !== ""
      ? report.location.trim()
      : "Location unavailable"


  const description =
    typeof report.description === "string" &&
    report.description.trim() !== ""
      ? report.description.trim()
      : "No description available."


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


  const reporterName =
    typeof report.reporterName === "string" &&
    report.reporterName.trim() !== ""
      ? report.reporterName.trim()
      : "Unknown student"


  const reporterEmail =
    typeof report.reporterEmail === "string" &&
    report.reporterEmail.trim() !== ""
      ? report.reporterEmail.trim()
      : "Email unavailable"


  const userId =
    report.userId !== null &&
    report.userId !== undefined &&
    String(report.userId).trim() !== ""
      ? String(report.userId)
      : "Unavailable"


  const reportId =
    report.id !== null &&
    report.id !== undefined &&
    String(report.id).trim() !== ""
      ? String(report.id)
      : "Unavailable"


  return (
    <article
      className="report-card"
      onClick={() => {
        if (
          typeof onClick === "function"
        ) {
          onClick(report)
        }
      }}
    >

      {/* ==================================================
          TOP SECTION
          ================================================== */}

      <div className="report-card-header">

        <div className="report-card-title">

          <span className="report-label">
            REPORT #{reportId}
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


      {/* ==================================================
          DESCRIPTION
          ================================================== */}

      <p className="report-card-description">
        {description}
      </p>


      {/* ==================================================
          REPORT INFORMATION
          ================================================== */}

      <div className="report-card-meta">

        <div className="report-meta-item">

          <span>
            Location
          </span>

          <strong>
            {location}
          </strong>

        </div>


        <div className="report-meta-item">

          <span>
            Priority
          </span>

          <strong>
            <PriorityBadge
              priority={priority}
            />
          </strong>

        </div>


        <div className="report-meta-item">

          <span>
            Submitted
          </span>

          <strong>
            {formatDate(
              report.createdAt
            )}
          </strong>

        </div>

      </div>


      {/* ==================================================
          REPORTER INFORMATION
          ================================================== */}

      {showReporter && (
        <div className="reporter-section">

          <div className="reporter-header">
            <span>
              REPORTED BY
            </span>
          </div>


          <div className="reporter-details">

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

          </div>

        </div>
      )}


      {/* ==================================================
          VIEW BUTTON
          ================================================== */}

      <div className="report-card-footer">

        <button
          type="button"
          className="secondary-button"
          onClick={(event) => {
            event.stopPropagation()

            if (
              typeof onClick === "function"
            ) {
              onClick(report)
            }
          }}
        >
          View Details →
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


/*
============================================================
DATE FORMATTER
============================================================
*/

function formatDate(
  value
) {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return "Date unavailable"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable"
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )
}


export default ReportCard