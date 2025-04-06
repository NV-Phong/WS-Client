"use client"

import { useState } from "react"
import { Icon } from "@/components/ui-engineer/Icon"
import { useNavigation } from "@/components/context/navigation-context"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavTaskManager({
  items,
}: {
  items: {
    name: string
    url: string
    icon: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const { activeItem, setActiveItem, activeSection, setActiveSection } = useNavigation()
  const [hoveredItem, setHoveredItem] = useState<string>("")
  const router = useRouter()

  const handleItemClick = (name: string, url: string) => {
    setActiveItem(name)
    setActiveSection("documents")
    router.push(url)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="font-semibold text-muted-foreground">Task Manager</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="group relative my-1 overflow-hidden">
            <SidebarMenuButton 
              asChild
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem("")}
              onClick={() => handleItemClick(item.name, item.url)}
              className={`relative w-full rounded-lg transition-all duration-300 ease-out 
                ${activeItem === item.name && activeSection === "documents"
                  ? "bg-gradient-to-r from-primary/8 via-primary/5 to-transparent shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)] hover:shadow-[0_4px_12px_-3px_rgba(var(--primary),0.35)]" 
                  : "hover:bg-muted/40"
                }
              `}
            >
              <div className="flex w-full items-center">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-lg transition-opacity duration-300
                  ${activeItem === item.name && activeSection === "documents" ? "opacity-100" : "opacity-0"}
                `}>
                  <div className="absolute inset-[1px] rounded-lg bg-background" />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/8 via-primary/5 to-transparent" />
                </div>

                {/* Indicator bar with gradient and glow */}
                <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg transition-all duration-300 
                  ${activeItem === item.name && activeSection === "documents"
                    ? "bg-gradient-to-b from-primary via-primary/90 to-primary/70 shadow-[0_0_10px_rgba(var(--primary),0.4)]" 
                    : "bg-transparent"
                  }`} 
                />
                
                {/* Shine effect */}
                <div className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full`} />
                
                {/* Content container */}
                <div className="relative flex w-full items-center gap-3 px-4 py-2.5">
                  <div className="relative">
                    <Icon 
                      name={item.icon} 
                      size={20}
                      className={`transition-all duration-300
                        ${activeItem === item.name && activeSection === "documents"
                          ? "scale-110 transform" 
                          : hoveredItem === item.name 
                            ? "scale-105" 
                            : ""
                        }`}
                      color={activeItem === item.name && activeSection === "documents" ? "var(--primary)" : "var(--muted-foreground)"} 
                    />
                  </div>
                  <span className={`font-medium tracking-wide transition-all duration-300 
                    ${activeItem === item.name && activeSection === "documents"
                      ? "text-primary translate-x-0.5" 
                      : hoveredItem === item.name
                        ? "text-muted-foreground/90 translate-x-0.5"
                        : "text-muted-foreground"
                    }`}>
                    {item.name}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <Icon name="dots" size={20} color="var(--muted-foreground)" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Icon name="folder" size={20} color="var(--muted-foreground)" />
                  <span className="font-semibold text-muted-foreground">Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="share" size={20} color="var(--muted-foreground)" />
                  <span className="font-semibold text-muted-foreground">Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Icon name="trash" size={20} color="var(--muted-foreground)" />
                  <span className="font-semibold text-muted-foreground">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
