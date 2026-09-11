import { useState } from "react"
import { login, signup } from "../services/auth"

const ROLL_NUMBER_REGEX = /^[A-Za-z0-9]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login({ role, onLogin, onSwitchRole }) {
  const [mode, setMode] = useState("login")

  const [identifier, setIdentifier] = useState("")
  const [email, setEmail] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const isManagement = role === "management"
  const isSignup = mode === "signup"

  function clearMessages() {
    setErrors({})
    setServerError("")
    setSuccessMessage("")
  }

  function validatePassword(value) {
    if (!value) {
      return "Invalid password. Password is required."
    }

    if (value.length > 50) {
      return "Invalid password. Maximum 50 characters."
    }

    return ""
  }

  function validateRollNumber(value) {
    const cleanValue = value.trim()

    if (!cleanValue) {
      return "Invalid roll number. Roll number is required."
    }

    if (cleanValue.length < 4 || cleanValue.length > 20) {
      return "Invalid roll number. Enter 4–20 characters."
    }

    if (!ROLL_NUMBER_REGEX.test(cleanValue)) {
      return "Invalid roll number. Use letters and numbers only."
    }

    return ""
  }

  function validateEmail(value) {
    const cleanValue = value.trim()

    if (!cleanValue) {
      return "Invalid email. Email is required."
    }

    if (!EMAIL_REGEX.test(cleanValue)) {
      return "Invalid email. Enter a valid email address."
    }

    if (cleanValue.length > 100) {
      return "Invalid email. Maximum 100 characters."
    }

    return ""
  }

  function validateLoginIdentifier(value) {
    const cleanValue = value.trim()

    if (!cleanValue) {
      return "Invalid login ID. Enter your email or roll number."
    }

    if (cleanValue.length > 100) {
      return "Invalid login ID. Maximum 100 characters."
    }

    /*
      Management must use its email.
    */
    if (isManagement) {
      return validateEmail(cleanValue)
    }

    /*
      Student can use either email or roll number.
    */
    if (cleanValue.includes("@")) {
      return validateEmail(cleanValue)
    }

    return validateRollNumber(cleanValue)
  }

  function validateSignupForm() {
    const nextErrors = {}

    const rollError =
      validateRollNumber(rollNumber)

    if (rollError) {
      nextErrors.rollNumber = rollError
    }

    const emailError =
      validateEmail(email)

    if (emailError) {
      nextErrors.email = emailError
    }

    const passwordError =
      validatePassword(password)

    if (passwordError) {
      nextErrors.password = passwordError
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Invalid confirmation. Please confirm your password."
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        "Invalid confirmation. Passwords do not match."
    }

    return nextErrors
  }

  function validateLoginForm() {
    const nextErrors = {}

    const identifierError =
      validateLoginIdentifier(identifier)

    if (identifierError) {
      nextErrors.identifier = identifierError
    }

    const passwordError =
      validatePassword(password)

    if (passwordError) {
      nextErrors.password = passwordError
    }

    return nextErrors
  }

  function handleLoginSubmit(event) {
    event.preventDefault()

    clearMessages()

    const nextErrors =
      validateLoginForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)

      const user = login(
        identifier.trim(),
        password,
        role
      )

      onLogin(user)
    } catch (err) {
      setServerError(
        err.message || "Invalid login details."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSignupSubmit(event) {
    event.preventDefault()

    clearMessages()

    const nextErrors =
      validateSignupForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)

      signup(
        rollNumber.trim(),
        email.trim(),
        password,
        confirmPassword
      )

      setSuccessMessage(
        "Account created successfully. You can now sign in."
      )

      setMode("login")

      setIdentifier(email.trim())
      setEmail("")
      setRollNumber("")
      setPassword("")
      setConfirmPassword("")
      setErrors({})
    } catch (err) {
      setServerError(
        err.message || "Unable to create account."
      )
    } finally {
      setLoading(false)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setIdentifier("")
    setEmail("")
    setRollNumber("")
    setPassword("")
    setConfirmPassword("")
    clearMessages()
  }

  function handleIdentifierChange(event) {
    const value = event.target.value

    setIdentifier(value)
    setServerError("")

    if (errors.identifier) {
      setErrors((current) => ({
        ...current,
        identifier: "",
      }))
    }
  }

  function handleRollNumberChange(event) {
    const value = event.target.value

    setRollNumber(value)
    setServerError("")

    if (errors.rollNumber) {
      setErrors((current) => ({
        ...current,
        rollNumber: "",
      }))
    }
  }

  function handleEmailChange(event) {
    const value = event.target.value

    setEmail(value)
    setServerError("")

    if (errors.email) {
      setErrors((current) => ({
        ...current,
        email: "",
      }))
    }
  }

  function handlePasswordChange(event) {
    const value = event.target.value

    setPassword(value)
    setServerError("")

    setErrors((current) => ({
      ...current,
      password: "",
      confirmPassword:
        current.confirmPassword &&
        value !== confirmPassword
          ? "Invalid confirmation. Passwords do not match."
          : "",
    }))
  }

  function handleConfirmPasswordChange(event) {
    const value = event.target.value

    setConfirmPassword(value)
    setServerError("")

    let confirmationError = ""

    if (!value) {
      confirmationError =
        "Invalid confirmation. Please confirm your password."
    } else if (value !== password) {
      confirmationError =
        "Invalid confirmation. Passwords do not match."
    }

    setErrors((current) => ({
      ...current,
      confirmPassword: confirmationError,
    }))
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand-mark" aria-hidden="true">
          🚨
        </div>

        <div className="login-heading">
          <p className="eyebrow">
            CAMPUS ISSUE SYSTEM
          </p>

          <h1>CampusSOS</h1>

          <p>
            {isManagement
              ? "Management Portal"
              : "Student Portal"}
          </p>
        </div>

        {!isManagement && (
          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === "login"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() =>
                switchMode("login")
              }
              disabled={loading}
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                mode === "signup"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() =>
                switchMode("signup")
              }
              disabled={loading}
            >
              Create Account
            </button>
          </div>
        )}

        {isSignup && !isManagement ? (
          <form onSubmit={handleSignupSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="signup-roll-number">
                Roll Number
              </label>

              <input
                id="signup-roll-number"
                type="text"
                placeholder="Enter your roll number"
                value={rollNumber}
                onChange={handleRollNumberChange}
                maxLength={20}
                autoComplete="username"
                aria-invalid={Boolean(errors.rollNumber)}
              />

              {errors.rollNumber && (
                <p className="field-error">
                  {errors.rollNumber}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="signup-email">
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={handleEmailChange}
                maxLength={100}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />

              {errors.email && (
                <p className="field-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={50}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
              />

              <div className="character-count">
                {password.length}/50
              </div>

              {errors.password && (
                <p className="field-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="signup-confirm-password">
                Confirm Password
              </label>

              <input
                id="signup-confirm-password"
                type="password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                maxLength={50}
                autoComplete="new-password"
                aria-invalid={Boolean(
                  errors.confirmPassword
                )}
              />

              {errors.confirmPassword && (
                <p className="field-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {serverError && (
              <div className="error-message" role="alert">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleLoginSubmit}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="identifier">
                {isManagement
                  ? "Management Email"
                  : "Email or Roll Number"}
              </label>

              <input
                id="identifier"
                type={
                  isManagement
                    ? "email"
                    : "text"
                }
                placeholder={
                  isManagement
                    ? "management@campussos.com"
                    : "Email or roll number"
                }
                value={identifier}
                onChange={handleIdentifierChange}
                maxLength={100}
                autoComplete="username"
                aria-invalid={Boolean(
                  errors.identifier
                )}
              />

              {errors.identifier && (
                <p className="field-error">
                  {errors.identifier}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={50}
                autoComplete="current-password"
                aria-invalid={Boolean(
                  errors.password
                )}
              />

              <div className="character-count">
                {password.length}/50
              </div>

              {errors.password && (
                <p className="field-error">
                  {errors.password}
                </p>
              )}
            </div>

            {serverError && (
              <div className="error-message" role="alert">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div
                className="success-message"
                role="status"
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
        )}

        <div className="demo-hint">
          {isManagement ? (
            <>
              <strong>Management Demo</strong>
              <span>
                management@campussos.com / admin123
              </span>
            </>
          ) : isSignup ? (
            <>
              <strong>New Student?</strong>
              <span>
                Create your account first, then sign
                in with your email or roll number.
              </span>
            </>
          ) : (
            <>
              <strong>Returning Student?</strong>
              <span>
                Sign in using the email or roll number
                you registered with.
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-button"
          onClick={onSwitchRole}
          disabled={loading}
        >
          {isManagement
            ? "← Student Login"
            : "Management Login →"}
        </button>
      </div>
    </main>
  )
}

export default Login