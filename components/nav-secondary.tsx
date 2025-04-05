"use client"

import { useState } from "react"
import { Icon } from "@/components/ui-engineer/Icon"
import { useNavigation } from "@/components/context/navigation-context"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
}: {
  items: {
    title: string
    url: string
    icon: string
  }[]
}) {
  const { activeItem, setActiveItem, activeSection, setActiveSection } = useNavigation()
  const [hoveredItem, setHoveredItem] = useState<string>("")

  const handleItemClick = (title: string) => {
    setActiveItem(title)
    setActiveSection("secondary")
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold text-muted-foreground">Settings</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem 
            key={item.title}
            className="group relative my-1 overflow-hidden"
          >
            <SidebarMenuButton 
              tooltip={item.title}
              onClick={() => handleItemClick(item.title)}
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem("")}
              className={`relative w-full rounded-lg transition-all duration-300 ease-out 
                ${activeItem === item.title && activeSection === "secondary"
                  ? "bg-gradient-to-r from-primary/8 via-primary/5 to-transparent shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)] hover:shadow-[0_4px_12px_-3px_rgba(var(--primary),0.35)]" 
                  : "hover:bg-muted/40"
                }
              `}
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 rounded-lg transition-opacity duration-300
                ${activeItem === item.title && activeSection === "secondary" ? "opacity-100" : "opacity-0"}
              `}>
                <div className="absolute inset-[1px] rounded-lg bg-background" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/8 via-primary/5 to-transparent" />
              </div>

              {/* Indicator bar with gradient and glow */}
              <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-all duration-300 
                ${activeItem === item.title && activeSection === "secondary"
                  ? "bg-gradient-to-b from-primary via-primary/90 to-primary/70 shadow-[0_0_10px_rgba(var(--primary),0.4)]" 
                  : "bg-transparent"
                }`} 
              />
              
              {/* Shine effect */}
              <div className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full`} />
              
              {/* Content container */}
              <div className="relative flex items-center gap-3 px-4 py-2.5">
                <div className="relative">
                  <Icon 
                    name={item.icon} 
                    size={20}
                    className={`transition-all duration-300
                      ${activeItem === item.title && activeSection === "secondary"
                        ? "scale-110 transform" 
                        : hoveredItem === item.title 
                          ? "scale-105" 
                          : ""
                      }`}
                    color={activeItem === item.title && activeSection === "secondary" ? "var(--primary)" : "var(--muted-foreground)"} 
                  />
                </div>
                <span className={`font-medium tracking-wide transition-all duration-300 
                  ${activeItem === item.title && activeSection === "secondary"
                    ? "text-primary translate-x-0.5" 
                    : hoveredItem === item.title
                      ? "text-muted-foreground/90 translate-x-0.5"
                      : "text-muted-foreground"
                  }`}>
                  {item.title}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
