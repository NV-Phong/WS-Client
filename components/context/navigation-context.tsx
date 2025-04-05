"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface NavigationContextType {
  activeItem: string
  setActiveItem: (item: string) => void
  activeSection: "main" | "documents" | "secondary"
  setActiveSection: (section: "main" | "documents" | "secondary") => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [activeSection, setActiveSection] = useState<"main" | "documents" | "secondary">("main")

  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem, activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
} 