'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextType {
  value: string | undefined
  onValueChange: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextType>({
  value: undefined,
  onValueChange: () => {},
})

function Accordion({
  type,
  collapsible,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: {
  type: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (collapsible && currentValue === newValue) {
      setInternalValue(undefined)
      onValueChange?.("")
    } else {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }
  }

  return (
    <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  value,
  children,
  className,
  ...props
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("border-b border-white/10", className)}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  )
}

function AccordionTrigger({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { value, onValueChange } = React.useContext(AccordionContext)
  const itemValue = (props as any)["data-value"] || 
    (React.Children.toArray(children).find((child: any) => child?.props?.["data-value"]) as any)?.props?.["data-value"]

  // Get the value from parent AccordionItem
  const parentRef = React.useRef<HTMLButtonElement>(null)
  const [itemVal, setItemVal] = React.useState<string>("")

  React.useEffect(() => {
    const el = parentRef.current?.closest("[data-value]")
    if (el) {
      setItemVal(el.getAttribute("data-value") || "")
    }
  }, [])

  const isOpen = value === itemVal

  return (
    <button
      ref={parentRef}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-foreground/80 w-full text-left",
        className
      )}
      onClick={() => itemVal && onValueChange(itemVal)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { value } = React.useContext(AccordionContext)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [itemVal, setItemVal] = React.useState<string>("")
  const [contentHeight, setContentHeight] = React.useState(0)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = containerRef.current?.closest("[data-value]")
    if (el) {
      setItemVal(el.getAttribute("data-value") || "")
    }
  }, [])

  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children])

  const isOpen = value === itemVal

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden transition-all duration-200", className)}
      style={{ maxHeight: isOpen ? contentHeight : 0, opacity: isOpen ? 1 : 0 }}
      {...props}
    >
      <div ref={contentRef} className="pb-4 pt-0 text-sm">
        {children}
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
