import { useEffect, useState } from "react"

const DRAFT_KEY = "campusSOSFormDraft"

const INITIAL_FORM = {
  title: "",
  location: "",
  description: "",
}

function validateTitle(value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return "Invalid issue title. Issue title is required."
  }

  if (trimmed.length < 5) {
    return "Invalid issue title. Enter at least 5 characters."
  }

  if (trimmed.length > 100) {
    return "Invalid issue title. Maximum 100 characters."
  }

  return ""
}

function validateLocation(value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return "Invalid location. Location is required."
  }

  if (trimmed.length < 3) {
    return "Invalid location. Enter at least 3 characters."
  }

  if (trimmed.length > 100) {
    return "Invalid location. Maximum 100 characters."
  }

  return ""
}

function validateDescription(value) {
  const trimmed = value.trim()

  if (!trimmed) {
    return "Invalid description. Description is required."
  }

  if (trimmed.length < 10) {
    return "Invalid description. Enter at least 10 characters."
  }

  if (trimmed.length > 400) {
    return "Invalid description. Maximum 400 characters."
  }

  return ""
}

function ReportIssue({
  user,
  onBack,
  onCreated,
}) {
  const [formData, setFormData] =
    useState(INITIAL_FORM)

  const [errors, setErrors] =
    useState({})

  const [serverError, setServerError] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [draftLoaded, setDraftLoaded] =
    useState(false)


  /*
    ==========================================================
    RESTORE SAVED DRAFT
    ==========================================================
  */

  useEffect(() => {
    try {
      const savedDraft =
        localStorage.getItem(DRAFT_KEY)

      if (!savedDraft) {
        setDraftLoaded(true)
        return
      }

      const parsed =
        JSON.parse(savedDraft)

      if (
        !parsed ||
        typeof parsed !== "object"
      ) {
        localStorage.removeItem(DRAFT_KEY)
        setDraftLoaded(true)
        return
      }

      setFormData({
        title:
          typeof parsed.title === "string"
            ? parsed.title
            : "",
        location:
          typeof parsed.location === "string"
            ? parsed.location
            : "",
        description:
          typeof parsed.description === "string"
            ? parsed.description
            : "",
      })
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    } finally {
      setDraftLoaded(true)
    }
  }, [])


  /*
    ==========================================================
    SAVE DRAFT

    We do not save a draft until the initial draft restoration
    has finished. This prevents the initial empty state from
    accidentally overwriting a saved draft.
    ==========================================================
  */

  useEffect(() => {
    if (!draftLoaded || loading) {
      return
    }

    const hasContent =
      Object.values(formData).some(
        (value) =>
          value.trim() !== ""
      )

    if (hasContent) {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify(formData)
        )
      } catch {
        /*
          Draft persistence should never crash
          the report form.
        */
      }
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [
    formData,
    draftLoaded,
    loading,
  ])


  /*
    ==========================================================
    UPDATE FIELD
    ==========================================================
  */

  function updateField(
    field,
    value
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))

    setServerError("")

    /*
      Revalidate the field immediately if it
      already has an error.
    */

    setErrors((previous) => {
      if (!previous[field]) {
        return previous
      }

      let nextError = ""

      if (field === "title") {
        nextError =
          validateTitle(value)
      }

      if (field === "location") {
        nextError =
          validateLocation(value)
      }

      if (field === "description") {
        nextError =
          validateDescription(value)
      }

      return {
        ...previous,
        [field]: nextError,
      }
    })
  }


  /*
    ==========================================================
    VALIDATE COMPLETE FORM
    ==========================================================
  */

  function validateForm() {
    const nextErrors = {}

    const titleError =
      validateTitle(formData.title)

    if (titleError) {
      nextErrors.title = titleError
    }

    const locationError =
      validateLocation(
        formData.location
      )

    if (locationError) {
      nextErrors.location =
        locationError
    }

    const descriptionError =
      validateDescription(
        formData.description
      )

    if (descriptionError) {
      nextErrors.description =
        descriptionError
    }

    return nextErrors
  }


  /*
    ==========================================================
    SUBMIT

    IMPORTANT:
    This component does NOT call createReport() directly.

    App.jsx owns the API creation so there can only be
    one POST for a submission.
    ==========================================================
  */

  async function handleSubmit(event) {
    event.preventDefault()

    /*
      Double-click protection.
    */

    if (loading) {
      return
    }

    setServerError("")

    const nextErrors =
      validateForm()

    setErrors(nextErrors)

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return
    }

    const report = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      description:
        formData.description.trim(),

      userId: user.id,
      reporterName:
        user.name ||
        user.rollNumber ||
        "Student",

      reporterEmail:
        user.email || "",

      status: "Open",
      priority: null,
      createdAt:
        new Date().toISOString(),
    }

    try {
      setLoading(true)

      /*
        App.jsx performs the genuine POST request.
      */

      await onCreated(report)

      /*
        Only clear the draft after the API
        operation succeeds.
      */

      localStorage.removeItem(
        DRAFT_KEY
      )

      setFormData(INITIAL_FORM)
      setErrors({})
      setServerError("")
    } catch (err) {
      /*
        App.jsx already receives the API error.
        We display it here too so the form remains
        usable if App rejects the request.
      */

      setServerError(
        err?.message ||
          "Unable to submit the report. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }


  /*
    ==========================================================
    CANCEL
    ==========================================================
  */

  function handleBack() {
    if (loading) {
      return
    }

    onBack()
  }


  return (
    <main className="app-page report-page">

      <section className="form-container">

        <div className="form-header">
          <p className="eyebrow">
            NEW REPORT
          </p>

          <h1>
            Report a Campus Issue
          </h1>

          <p>
            Tell campus management what
            happened and where the problem
            is. Management will review the
            issue and assign the appropriate
            priority.
          </p>
        </div>


        <form
          className="report-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="form-field">

            <label htmlFor="issue-title">
              Issue Title{" "}
              <span aria-hidden="true">
                *
              </span>
            </label>

            <input
              id="issue-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              onBlur={() => {
                const error =
                  validateTitle(
                    formData.title
                  )

                setErrors((previous) => ({
                  ...previous,
                  title: error,
                }))
              }}
              placeholder="Example: Water leakage"
              maxLength={100}
              autoComplete="off"
              aria-invalid={Boolean(
                errors.title
              )}
              aria-describedby={
                errors.title
                  ? "issue-title-error"
                  : undefined
              }
            />

            <div className="field-meta">
              <span>
                {formData.title.length}/100
              </span>
            </div>

            {errors.title && (
              <p
                id="issue-title-error"
                className="field-error"
              >
                {errors.title}
              </p>
            )}

          </div>


          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="form-field">

            <label htmlFor="issue-location">
              Location{" "}
              <span aria-hidden="true">
                *
              </span>
            </label>

            <input
              id="issue-location"
              name="location"
              type="text"
              value={formData.location}
              onChange={(event) =>
                updateField(
                  "location",
                  event.target.value
                )
              }
              onBlur={() => {
                const error =
                  validateLocation(
                    formData.location
                  )

                setErrors((previous) => ({
                  ...previous,
                  location: error,
                }))
              }}
              placeholder="Example: Block B - First Floor"
              maxLength={100}
              autoComplete="off"
              aria-invalid={Boolean(
                errors.location
              )}
              aria-describedby={
                errors.location
                  ? "issue-location-error"
                  : undefined
              }
            />

            <div className="field-meta">
              <span>
                {formData.location.length}/100
              </span>
            </div>

            {errors.location && (
              <p
                id="issue-location-error"
                className="field-error"
              >
                {errors.location}
              </p>
            )}

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-field">

            <div className="label-row">

              <label htmlFor="issue-description">
                Description{" "}
                <span aria-hidden="true">
                  *
                </span>
              </label>

              <span>
                {formData.description.length}/400
              </span>

            </div>

            <textarea
              id="issue-description"
              name="description"
              rows={7}
              value={formData.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              onBlur={() => {
                const error =
                  validateDescription(
                    formData.description
                  )

                setErrors((previous) => ({
                  ...previous,
                  description: error,
                }))
              }}
              placeholder="Describe the problem clearly..."
              maxLength={400}
              aria-invalid={Boolean(
                errors.description
              )}
              aria-describedby={
                errors.description
                  ? "issue-description-error"
                  : undefined
              }
            />

            {errors.description && (
              <p
                id="issue-description-error"
                className="field-error"
              >
                {errors.description}
              </p>
            )}

          </div>


          {/* =================================================
              MANAGEMENT PRIORITY INFO
          ================================================= */}

          <div className="info-box">

            <span
              aria-hidden="true"
            >
              ℹ️
            </span>

            <p>
              <strong>
                Priority is assigned by management.
              </strong>{" "}
              You do not need to select a
              priority for your report.
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {serverError && (
            <div
              className="error-message"
              role="alert"
            >
              <strong>
                Submission failed:
              </strong>{" "}
              {serverError}
            </div>
          )}


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={handleBack}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Report"}
            </button>

          </div>

        </form>

      </section>

    </main>
  )
}

export default ReportIssue