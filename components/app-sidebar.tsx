"use client";

import * as React from "react";
import {
   IconCamera,
   IconChartBar,
   IconDashboard,
   IconDatabase,
   IconFileAi,
   IconFileDescription,
   IconFileWord,
   IconFolder,
   IconHelp,
   IconListDetails,
   IconReport,
   IconSearch,
   IconSettings,
   IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import Logo from "@/components/ui-engineer/logo";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
   navMain: [
      {
         title: "Dashboard",
         url: "#",
         icon: IconDashboard,
      },
      {
         title: "Lifecycle",
         url: "#",
         icon: IconListDetails,
      },
      {
         title: "Analytics",
         url: "#",
         icon: IconChartBar,
      },
      {
         title: "Projects",
         url: "#",
         icon: IconFolder,
      },
      {
         title: "Team",
         url: "#",
         icon: IconUsers,
      },
   ],
   navClouds: [
      {
         title: "Capture",
         icon: IconCamera,
         isActive: true,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
      {
         title: "Proposal",
         icon: IconFileDescription,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
      {
         title: "Prompts",
         icon: IconFileAi,
         url: "#",
         items: [
            {
               title: "Active Proposals",
               url: "#",
            },
            {
               title: "Archived",
               url: "#",
            },
         ],
      },
   ],
   navSecondary: [
      {
         title: "Settings",
         url: "#",
         icon: IconSettings,
      },
      {
         title: "Get Help",
         url: "#",
         icon: IconHelp,
      },
      {
         title: "Search",
         url: "#",
         icon: IconSearch,
      },
   ],
   documents: [
      {
         name: "Data Library",
         url: "#",
         icon: IconDatabase,
      },
      {
         name: "Reports",
         url: "#",
         icon: IconReport,
      },
      {
         name: "Word Assistant",
         url: "#",
         icon: IconFileWord,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                     <a href="#">
                        <Logo width={20} height={20} color="var(--primary)" />
                        <span className="text-base font-semibold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                           WorkSpace
                        </span>
                     </a>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
      </Sidebar>
   );
}
