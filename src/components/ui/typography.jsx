import React from "react"

export function TypographyH1({ children, className = "" }) {
  return (
    <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className = "" }) {
  return (
    <h2 className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`}>
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className = "" }) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className = "" }) {
  return (
    <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
      {children}
    </h4>
  )
}

export function TypographyP({ children, className = "" }) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  )
}

export function TypographyBlockquote({ children, className = "" }) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  )
}

export function TypographyTable({ headers = [], rows = [], className = "" }) {
  return (
    <div className={`my-6 w-full overflow-y-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headers.map((header, idx) => (
              <th key={idx} className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="m-0 border-t p-0 even:bg-muted">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TypographyList({ items = [], className = "" }) {
  return (
    <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  )
}

export function TypographyInlineCode({ children, className = "" }) {
  return (
    <code className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}>
      {children}
    </code>
  )
}

export function TypographyLead({ children, className = "" }) {
  return (
    <p className={`text-xl text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}

export function TypographyLarge({ children, className = "" }) {
  return (
    <div className={`text-lg font-semibold ${className}`}>
      {children}
    </div>
  )
}

export function TypographySmall({ children, className = "" }) {
  return (
    <small className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </small>
  )
}

export function TypographyMuted({ children, className = "" }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}
