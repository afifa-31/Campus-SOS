const SESSION_KEY = "campusSOSUser"

const MANAGEMENT_EMAIL = "management@campussos.com"
const MANAGEMENT_PASSWORD = "admin123"

export function login(identifier, password, role) {
  const cleanIdentifier = identifier.trim()

  if (!cleanIdentifier || !password) {
    throw new Error("Please enter your login details.")
  }

  // -------------------------
  // MANAGEMENT LOGIN
  // -------------------------

  if (role === "management") {
    if (
      cleanIdentifier.toLowerCase() !==
        MANAGEMENT_EMAIL.toLowerCase() ||
      password !== MANAGEMENT_PASSWORD
    ) {
      throw new Error("Invalid management login details.")
    }

    const managementUser = {
      id: "management",
      name: "Campus Management",
      email: MANAGEMENT_EMAIL,
      role: "management",
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(managementUser)
    )

    return managementUser
  }

  // -------------------------
  // STUDENT LOGIN
  // -------------------------

  if (role === "student") {
    /*
      For the hackathon demo, any non-empty
      student roll number can be used.

      Example:
      23A81A0501
      23A81A0502
      23A81A0515
    */

    if (cleanIdentifier.length < 4) {
      throw new Error("Please enter a valid roll number.")
    }

    const studentUser = {
      id: cleanIdentifier.toUpperCase(),
      name: cleanIdentifier.toUpperCase(),
      email: `${cleanIdentifier.toLowerCase()}@pvpsit.com`,
      role: "student",
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(studentUser)
    )

    return studentUser
  }

  throw new Error("Invalid user role.")
}

export function getCurrentUser() {
  const savedUser = localStorage.getItem(SESSION_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}