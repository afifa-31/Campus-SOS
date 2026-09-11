const API_URL =
  "https://6aa38c62e7ae868cdf7b048e.mockapi.io/api/p1/reports"


function getErrorMessage(error, fallback) {
  if (
    error &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message
  }

  return fallback
}


async function parseResponse(response, fallbackMessage) {
  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const serverMessage =
      data &&
      typeof data.message === "string"
        ? data.message.trim()
        : ""

    throw new Error(
      serverMessage ||
        `${fallbackMessage} (${response.status}).`
    )
  }

  return data
}


function validateReportId(id) {
  if (
    id === null ||
    id === undefined ||
    String(id).trim() === ""
  ) {
    throw new Error(
      "Invalid report ID."
    )
  }

  return encodeURIComponent(
    String(id).trim()
  )
}


/*
============================================================
GET ALL REPORTS
============================================================
*/

export async function getReports() {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.onLine === false
    ) {
      throw new Error(
        "You appear to be offline. Please reconnect and try again."
      )
    }

    const response = await fetch(
      API_URL,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )

    const data =
      await parseResponse(
        response,
        "Failed to load reports."
      )

    if (!Array.isArray(data)) {
      throw new Error(
        "Invalid report data received from the server."
      )
    }

    return data
  } catch (error) {
    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Unable to connect to CampusSOS. Please check your internet connection."
      )
    }

    throw new Error(
      getErrorMessage(
        error,
        "Failed to load reports. Please try again."
      )
    )
  }
}


/*
============================================================
CREATE REPORT
============================================================
*/

export async function createReport(
  report
) {
  try {
    if (
      !report ||
      typeof report !== "object"
    ) {
      throw new Error(
        "Invalid report data."
      )
    }

    if (
      typeof report.title !== "string" ||
      report.title.trim().length < 5 ||
      report.title.trim().length > 100
    ) {
      throw new Error(
        "Invalid issue title."
      )
    }

    if (
      typeof report.location !== "string" ||
      report.location.trim().length < 3 ||
      report.location.trim().length > 100
    ) {
      throw new Error(
        "Invalid location."
      )
    }

    if (
      typeof report.description !== "string" ||
      report.description.trim().length < 10 ||
      report.description.trim().length > 400
    ) {
      throw new Error(
        "Invalid description."
      )
    }

    if (
      !report.userId ||
      String(report.userId).trim() === ""
    ) {
      throw new Error(
        "Invalid student account."
      )
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.onLine === false
    ) {
      throw new Error(
        "You appear to be offline. Please reconnect and try again."
      )
    }

    const payload = {
      ...report,
      title: report.title.trim(),
      location: report.location.trim(),
      description:
        report.description.trim(),
      status: "Open",
      priority: null,
    }

    const response = await fetch(
      API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    const data =
      await parseResponse(
        response,
        "Failed to create report."
      )

    if (
      !data ||
      typeof data !== "object" ||
      !data.id
    ) {
      throw new Error(
        "The server returned an invalid report."
      )
    }

    return data
  } catch (error) {
    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Unable to submit the report. Please check your internet connection."
      )
    }

    throw new Error(
      getErrorMessage(
        error,
        "Failed to create report. Please try again."
      )
    )
  }
}


/*
============================================================
UPDATE REPORT
============================================================
*/

export async function updateReport(
  id,
  updates
) {
  try {
    const reportId =
      validateReportId(id)

    if (
      !updates ||
      typeof updates !== "object"
    ) {
      throw new Error(
        "Invalid report update data."
      )
    }

    const allowedStatuses = [
      "Open",
      "In Review",
      "Resolved",
    ]

    const allowedPriorities = [
      "High",
      "Medium",
      "Low",
    ]

    if (
      updates.status !== undefined &&
      !allowedStatuses.includes(
        updates.status
      )
    ) {
      throw new Error(
        "Invalid status."
      )
    }

    if (
      updates.priority !== undefined &&
      updates.priority !== null &&
      !allowedPriorities.includes(
        updates.priority
      )
    ) {
      throw new Error(
        "Invalid priority."
      )
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.onLine === false
    ) {
      throw new Error(
        "You appear to be offline. Please reconnect and try again."
      )
    }

    const payload = {
      ...updates,
    }

    if (
      typeof payload.title === "string"
    ) {
      payload.title =
        payload.title.trim()

      if (
        payload.title.length < 5 ||
        payload.title.length > 100
      ) {
        throw new Error(
          "Invalid issue title."
        )
      }
    }

    if (
      typeof payload.location === "string"
    ) {
      payload.location =
        payload.location.trim()

      if (
        payload.location.length < 3 ||
        payload.location.length > 100
      ) {
        throw new Error(
          "Invalid location."
        )
      }
    }

    if (
      typeof payload.description ===
      "string"
    ) {
      payload.description =
        payload.description.trim()

      if (
        payload.description.length <
          10 ||
        payload.description.length >
          400
      ) {
        throw new Error(
          "Invalid description."
        )
      }
    }

    const response = await fetch(
      `${API_URL}/${reportId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    const data =
      await parseResponse(
        response,
        "Failed to update report."
      )

    if (
      !data ||
      typeof data !== "object" ||
      !data.id
    ) {
      throw new Error(
        "The server returned an invalid updated report."
      )
    }

    return data
  } catch (error) {
    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Unable to update the report. Please check your internet connection."
      )
    }

    throw new Error(
      getErrorMessage(
        error,
        "Failed to update report. Please try again."
      )
    )
  }
}


/*
============================================================
DELETE REPORT
============================================================
*/

export async function deleteReport(
  id
) {
  try {
    const reportId =
      validateReportId(id)

    if (
      typeof navigator !== "undefined" &&
      navigator.onLine === false
    ) {
      throw new Error(
        "You appear to be offline. Please reconnect and try again."
      )
    }

    const response = await fetch(
      `${API_URL}/${reportId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    )

    await parseResponse(
      response,
      "Failed to delete report."
    )

    return true
  } catch (error) {
    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Unable to delete the report. Please check your internet connection."
      )
    }

    throw new Error(
      getErrorMessage(
        error,
        "Failed to delete report. Please try again."
      )
    )
  }
}