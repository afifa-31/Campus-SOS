import { useState } from "react"
import { login } from "../services/auth"

function Login({ role, onLogin, onSwitchRole }) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isManagement = role === "management"

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")

    if (!identifier.trim() || !password) {
      setError("Please enter your login details.")
      return
    }

    try {
      setLoading(true)

      const user = login(
        identifier,
        password,
        role
      )

      onLogin(user)
    } catch (err) {
      setError(
        err.message || "Login failed."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand-mark">
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

        <form onSubmit={handleSubmit}>
          <label htmlFor="identifier">
            {isManagement
              ? "Management Email"
              : "Student Roll Number"}
          </label>

          <input
            id="identifier"
            type={isManagement ? "email" : "text"}
            placeholder={
              isManagement
                ? "management@campussos.com"
                : "Enter your roll number"
            }
            value={identifier}
            onChange={(event) =>
              setIdentifier(event.target.value)
            }
            autoComplete="username"
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
          />

          {error && (
            <div className="error-message">
              {error}
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

        <div className="demo-hint">
          {isManagement ? (
            <>
              <strong>Management Demo</strong>
              <span>
                management@campussos.com / admin123
              </span>
            </>
          ) : (
            <>
              <strong>Student Demo</strong>
              <span>
                Enter any student roll number
                with a password.
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-button"
          onClick={onSwitchRole}
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