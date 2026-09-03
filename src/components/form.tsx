import { useCallback, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { cx } from "./ui"

/* ------------------------------------------------------------------ *
 * useForm — état, validation et soumission d'un formulaire
 * ------------------------------------------------------------------ */

export type FormErrors<T> = Partial<Record<keyof T, string>>
export type FormValidator<T> = (values: T) => FormErrors<T>

export type FieldProps = {
  id: string
  name: string
  value: string
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onBlur: () => void
}

export type Form<T> = {
  values: T
  errors: FormErrors<T>
  isValid: boolean
  isDirty: boolean
  submitted: boolean
  field: (key: keyof T & string) => FieldProps
  setValue: <K extends keyof T>(key: K, value: T[K]) => void
  setValues: (patch: Partial<T>) => void
  reset: (next?: T) => void
  handleSubmit: (event: FormEvent) => void
}

export function useForm<T extends Record<string, string>>({
  initial,
  validate,
  onSubmit,
}: {
  initial: T
  validate?: FormValidator<T>
  onSubmit: (values: T) => void
}): Form<T> {
  const [values, setInternalValues] = useState<T>(initial)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const allErrors = useMemo<FormErrors<T>>(
    () => (validate ? validate(values) : {}),
    [validate, values],
  )

  /* Une erreur ne s'affiche qu'après interaction ou tentative d'envoi. */
  const errors = useMemo<FormErrors<T>>(() => {
    const visible: FormErrors<T> = {}
    for (const key of Object.keys(allErrors) as (keyof T)[]) {
      if (submitted || touched[key]) visible[key] = allErrors[key]
    }
    return visible
  }, [allErrors, submitted, touched])

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setInternalValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const setValues = useCallback((patch: Partial<T>) => {
    setInternalValues(prev => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(
    (next?: T) => {
      setInternalValues(next ?? initial)
      setTouched({})
      setSubmitted(false)
    },
    [initial],
  )

  const field = useCallback(
    (key: keyof T & string): FieldProps => ({
      id: `field-${key}`,
      name: key,
      value: values[key],
      error: errors[key],
      onChange: event => setValue(key, event.target.value as T[keyof T & string]),
      onBlur: () => setTouched(prev => ({ ...prev, [key]: true })),
    }),
    [errors, setValue, values],
  )

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      setSubmitted(true)
      if (Object.keys(allErrors).length > 0) return
      onSubmit(values)
    },
    [allErrors, onSubmit, values],
  )

  return {
    values,
    errors,
    isValid: Object.keys(allErrors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initial),
    submitted,
    field,
    setValue,
    setValues,
    reset,
    handleSubmit,
  }
}

/* ------------------------------------------------------------------ *
 * Validateurs réutilisables
 * ------------------------------------------------------------------ */

export const required = (message = "Champ obligatoire") =>
  (value: string) => (value.trim() ? undefined : message)

export const email = (message = "Adresse e-mail invalide") =>
  (value: string) => (!value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? undefined : message)

export const phone = (message = "Numéro de téléphone invalide") =>
  (value: string) => (!value.trim() || /^[+0-9 ().-]{8,20}$/.test(value) ? undefined : message)

export const minLength = (size: number, message?: string) =>
  (value: string) =>
    value.trim().length >= size
      ? undefined
      : (message ?? `${size} caractères minimum`)

type Rule = (value: string) => string | undefined

/** Compose un validateur à partir de règles par champ. */
export function buildValidator<T extends Record<string, string>>(
  rules: Partial<Record<keyof T, Rule[]>>,
): FormValidator<T> {
  return (values: T) => {
    const errors: FormErrors<T> = {}
    for (const key of Object.keys(rules) as (keyof T)[]) {
      for (const rule of rules[key] ?? []) {
        const message = rule(values[key] ?? "")
        if (message) {
          errors[key] = message
          break
        }
      }
    }
    return errors
  }
}

/* ------------------------------------------------------------------ *
 * Composants de saisie
 * ------------------------------------------------------------------ */

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <fieldset className={cx("border-t border-line pt-5 first:border-t-0 first:pt-0", className)}>
      <legend className="sr-only">{title}</legend>
      <p className="eyebrow mb-1">{title}</p>
      {description ? <p className="mb-3 text-xs text-ink-muted">{description}</p> : null}
      <div className="mt-3">{children}</div>
    </fieldset>
  )
}

export function FormGrid({ children, columns = 2 }: { children: ReactNode; columns?: 1 | 2 | 3 }) {
  return (
    <div
      className={cx(
        "grid grid-cols-1 gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  )
}

function Wrapper({
  id,
  label,
  hint,
  error,
  required: isRequired,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-1.5 flex items-center gap-1.5">
        {label}
        {isRequired ? <span className="text-brand">*</span> : null}
        {hint ? <span className="text-ink-faint normal-case">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.6875rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type BaseProps = FieldProps & {
  label: string
  hint?: string
  required?: boolean
  className?: string
}

export function TextField({
  label,
  hint,
  required: isRequired,
  className,
  error,
  type = "text",
  placeholder,
  ...field
}: BaseProps & { type?: string; placeholder?: string }) {
  return (
    <Wrapper id={field.id} label={label} hint={hint} error={error} required={isRequired} className={className}>
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className={cx("field h-9", error && "border-danger/60")}
      />
    </Wrapper>
  )
}

export function SelectField({
  label,
  hint,
  required: isRequired,
  className,
  error,
  options,
  placeholder,
  ...field
}: BaseProps & { options: readonly string[] | { value: string; label: string }[]; placeholder?: string }) {
  const items = options.map(option =>
    typeof option === "string" ? { value: option, label: option } : option,
  )
  return (
    <Wrapper id={field.id} label={label} hint={hint} error={error} required={isRequired} className={className}>
      <select
        {...field}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className={cx("field h-9", error && "border-danger/60")}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </Wrapper>
  )
}

export function TextAreaField({
  label,
  hint,
  required: isRequired,
  className,
  error,
  rows = 4,
  placeholder,
  ...field
}: BaseProps & { rows?: number; placeholder?: string }) {
  return (
    <Wrapper id={field.id} label={label} hint={hint} error={error} required={isRequired} className={className}>
      <textarea
        {...field}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className={cx("field resize-none leading-relaxed", error && "border-danger/60")}
      />
    </Wrapper>
  )
}

export function FormActions({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
      {children}
      {note ? <p className="ml-auto font-mono text-[0.625rem] text-ink-faint">{note}</p> : null}
    </div>
  )
}
