"use client"

import { useState } from "react"
import { Icon } from "@/components/ui-engineer/Icon"
import { useNavigation } from "@/components/context/navigation-context"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
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
    setActiveSection("main")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu className="relative">
          <div className="absolute -left-4 -right-4 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-40" />
          <SidebarMenuItem className="flex items-center gap-2">
            {/* <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-center text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Icon name="circle-plus" size={20} color="var(--muted-foreground)" />
              <span className="font-semibold">Quick Create</span>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
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
                  ${activeItem === item.title && activeSection === "main"
                    ? "bg-gradient-to-r from-primary/8 via-primary/5 to-transparent shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)] hover:shadow-[0_4px_12px_-3px_rgba(var(--primary),0.35)]" 
                    : "hover:bg-muted/40"
                  }
                `}
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-lg transition-opacity duration-300
                  ${activeItem === item.title && activeSection === "main" ? "opacity-100" : "opacity-0"}
                `}>
                  <div className="absolute inset-[1px] rounded-lg bg-background" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/8 via-primary/5 to-transparent" />
                </div>

                {/* Indicator bar with gradient and glow */}
                <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-all duration-300 
                  ${activeItem === item.title && activeSection === "main"
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
                        ${activeItem === item.title && activeSection === "main"
                          ? "scale-110 transform" 
                          : hoveredItem === item.title 
                            ? "scale-105" 
                            : ""
                        }`}
                      color={activeItem === item.title && activeSection === "main" ? "var(--primary)" : "var(--muted-foreground)"} 
                    />
                  </div>
                  <span className={`font-medium tracking-wide transition-all duration-300 
                    ${activeItem === item.title && activeSection === "main"
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
