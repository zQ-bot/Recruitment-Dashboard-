"use client"

import * as React from "react"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue>({})

export function Select({ children, value, onValueChange }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ className = "", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-md border border-line bg-surface px-3 py-2.5 text-left text-sm text-foreground focus:border-ai focus:outline-none ${className}`.trim()}
      {...props}
    >
      {children}
      <span className="ml-2 text-faint">▾</span>
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  return <span>{context.value ? context.value : placeholder}</span>
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(SelectContext)
  return (
    <div className="mt-2 rounded-md border border-line bg-surface p-2 shadow-sm">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ value?: string; children?: React.ReactNode; onSelect?: () => void }>(child)) {
          return React.cloneElement(child, {
            onSelect: () => context.onValueChange?.(child.props.value ?? ""),
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectItem({ value, children, onSelect }: { value: string; children: React.ReactNode; onSelect?: () => void }) {
  const context = React.useContext(SelectContext)
  const selected = context.value === value
  return (
    <button
      type="button"
      onClick={() => {
        context.onValueChange?.(value)
        onSelect?.()
      }}
      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${selected ? "bg-ai-tint text-ai" : "hover:bg-line-2"}`.trim()}
    >
      {children}
    </button>
  )
}
