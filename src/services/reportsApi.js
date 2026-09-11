const API_URL =
  "https://6aa38c62e7ae868cdf7b048e.mockapi.io/api/p1/reports"


export async function getReports() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Failed to fetch reports.")
  }

  return response.json()
}


export async function createReport(report) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(report),
  })

  if (!response.ok) {
    throw new Error("Failed to create report.")
  }

  return response.json()
}


export async function updateReport(id, updates) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updates),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update report.")
  }

  return response.json()
}


export async function deleteReport(id) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete report.")
  }

  return true
}