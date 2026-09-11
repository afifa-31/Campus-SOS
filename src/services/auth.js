const SESSION_KEY = "campusSOSUser"
const ACCOUNTS_KEY = "campusSOSAccounts"

const MANAGEMENT_EMAIL =
  "management@campussos.com"

const MANAGEMENT_PASSWORD =
  "admin123"


/*
============================================================
VALIDATION HELPERS
============================================================
*/

export function validateRollNumber(
  value
) {
  const rollNumber =
    typeof value === "string"
      ? value.trim()
      : ""

  if (!rollNumber) {
    return "Invalid roll number. Roll number is required."
  }

  if (
    rollNumber.length < 4 ||
    rollNumber.length > 20
  ) {
    return "Invalid roll number. Use 4–20 characters."
  }

  if (
    !/^[A-Za-z0-9]+$/.test(
      rollNumber
    )
  ) {
    return "Invalid roll number. Use letters and numbers only."
  }

  return ""
}


export function validateEmail(
  value
) {
  const email =
    typeof value === "string"
      ? value.trim()
      : ""

  if (!email) {
    return "Invalid email. Email is required."
  }

  if (
    email.length > 254
  ) {
    return "Invalid email. Email is too long."
  }

  /*
    Practical email validation for this
    frontend demo.
  */

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (
    !emailPattern.test(email)
  ) {
    return "Invalid email address."
  }

  return ""
}


export function validatePassword(
  value
) {
  if (
    typeof value !== "string" ||
    !value
  ) {
    return "Invalid password. Password is required."
  }

  if (
    value.length > 50
  ) {
    return "Invalid password. Maximum 50 characters."
  }

  return ""
}


/*
============================================================
LOCAL STORAGE HELPERS
============================================================
*/

function readAccounts() {
  try {
    const stored =
      localStorage.getItem(
        ACCOUNTS_KEY
      )

    if (!stored) {
      return []
    }

    const parsed =
      JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (account) =>
        account &&
        typeof account === "object"
    )
  } catch {
    return []
  }
}


function saveAccounts(accounts) {
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify(accounts)
  )
}


/*
============================================================
SIGN UP
============================================================
*/

export function signup(
  rollNumber,
  email,
  password,
  confirmPassword
) {
  const cleanRollNumber =
    typeof rollNumber === "string"
      ? rollNumber.trim()
      : ""

  const cleanEmail =
    typeof email === "string"
      ? email.trim().toLowerCase()
      : ""

  const rollError =
    validateRollNumber(
      cleanRollNumber
    )

  if (rollError) {
    throw new Error(rollError)
  }

  const emailError =
    validateEmail(cleanEmail)

  if (emailError) {
    throw new Error(emailError)
  }

  const passwordError =
    validatePassword(password)

  if (passwordError) {
    throw new Error(passwordError)
  }

  const confirmError =
    validatePassword(confirmPassword)

  if (confirmError) {
    throw new Error(
      "Invalid confirm password. Please enter your password again."
    )
  }

  if (
    password !== confirmPassword
  ) {
    throw new Error(
      "Invalid confirm password. Passwords do not match."
    )
  }

  /*
    The management account is reserved.
  */

  if (
    cleanEmail ===
    MANAGEMENT_EMAIL
  ) {
    throw new Error(
      "This email is reserved for management."
    )
  }

  const accounts =
    readAccounts()

  const rollExists =
    accounts.some(
      (account) =>
        String(
          account.rollNumber || ""
        ).toLowerCase() ===
        cleanRollNumber.toLowerCase()
    )

  if (rollExists) {
    throw new Error(
      "An account with this roll number already exists."
    )
  }

  const emailExists =
    accounts.some(
      (account) =>
        String(
          account.email || ""
        ).toLowerCase() ===
        cleanEmail
    )

  if (emailExists) {
    throw new Error(
      "An account with this email already exists."
    )
  }

  /*
    Each student's ID is deterministic.
    This is important because reports use
    userId to identify the reporter.
  */

  const account = {
    id:
      `student-${cleanRollNumber}`,
    name:
      cleanRollNumber,
    rollNumber:
      cleanRollNumber,
    email:
      cleanEmail,
    password,
    role: "student",
  }

  saveAccounts([
    ...accounts,
    account,
  ])

  return {
    id: account.id,
    name: account.name,
    rollNumber:
      account.rollNumber,
    email: account.email,
    role: account.role,
  }
}


/*
============================================================
LOGIN
============================================================
*/

export function login(
  identifier,
  password,
  role = "student"
) {
  const cleanIdentifier =
    typeof identifier === "string"
      ? identifier.trim()
      : ""

  const passwordError =
    validatePassword(password)

  if (passwordError) {
    throw new Error(passwordError)
  }

  /*
    MANAGEMENT LOGIN
  */

  if (role === "management") {
    const emailError =
      validateEmail(
        cleanIdentifier
      )

    if (emailError) {
      throw new Error(
        "Invalid management email."
      )
    }

    if (
      cleanIdentifier.toLowerCase() !==
      MANAGEMENT_EMAIL
    ) {
      throw new Error(
        "Invalid management email or password."
      )
    }

    if (
      password !==
      MANAGEMENT_PASSWORD
    ) {
      throw new Error(
        "Invalid management email or password."
      )
    }

    const managementUser = {
      id: "management",
      name: "Campus Management",
      email:
        MANAGEMENT_EMAIL,
      role: "management",
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(
        managementUser
      )
    )

    return managementUser
  }


  /*
    STUDENT LOGIN

    Students can use either:
    - email
    - roll number
  */

  if (role !== "student") {
    throw new Error(
      "Invalid login role."
    )
  }

  if (!cleanIdentifier) {
    throw new Error(
      "Invalid email or roll number. This field is required."
    )
  }

  const accounts =
    readAccounts()

  const identifierLower =
    cleanIdentifier.toLowerCase()

  const account =
    accounts.find(
      (item) => {
        const accountEmail =
          String(
            item.email || ""
          ).toLowerCase()

        const accountRoll =
          String(
            item.rollNumber || ""
          ).toLowerCase()

        return (
          accountEmail ===
            identifierLower ||
          accountRoll ===
            identifierLower
        )
      }
    )

  if (!account) {
    throw new Error(
      "Account not found. Create an account first."
    )
  }

  if (
    password !== account.password
  ) {
    throw new Error(
      "Invalid email/roll number or password."
    )
  }

  const studentUser = {
    id: account.id,
    name:
      account.name ||
      account.rollNumber,
    rollNumber:
      account.rollNumber,
    email:
      account.email,
    role: "student",
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(
      studentUser
    )
  )

  return studentUser
}


/*
============================================================
CURRENT USER
============================================================
*/

export function getCurrentUser() {
  try {
    const stored =
      localStorage.getItem(
        SESSION_KEY
      )

    if (!stored) {
      return null
    }

    const user =
      JSON.parse(stored)

    if (
      !user ||
      typeof user !== "object" ||
      !user.id ||
      !user.role
    ) {
      localStorage.removeItem(
        SESSION_KEY
      )

      return null
    }

    if (
      user.role === "student" &&
      (!user.email ||
        !user.rollNumber)
    ) {
      localStorage.removeItem(
        SESSION_KEY
      )

      return null
    }

    if (
      user.role === "management" &&
      user.email !==
        MANAGEMENT_EMAIL
    ) {
      localStorage.removeItem(
        SESSION_KEY
      )

      return null
    }

    return user
  } catch {
    try {
      localStorage.removeItem(
        SESSION_KEY
      )
    } catch {
      // Ignore storage cleanup errors.
    }

    return null
  }
}


/*
============================================================
LOGOUT
============================================================
*/

export function logout() {
  try {
    localStorage.removeItem(
      SESSION_KEY
    )
  } catch {
    /*
      Logout should never crash the
      application.
    */
  }
}