"use client";

import * as React from "react";
import { NavTaskManager } from "@/components/nav-task-manager";
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
import { TeamSwitcher } from "@/components/team-switcher";
import { Users } from "lucide-react";
import { useGetTeams } from "@/hooks/beta/team/use-get-teams";

const data = {
   user: {
      name: "NV-Phong",
      email: "ui.engineer.workspace@gmail.com",
      avatar: "/logo.svg",
   },
   navMain: [
      {
         title: "Space Engineer",
         url: "/workspace",
         icon: "saturn-02-solid-sharp",
      },
      {
         title: "Lifecycle",
         url: "#",
         icon: "analytics-up-solid-rounded",
      },
      {
         title: "Projects",
         url: "#",
         icon: "ai-browser-solid-rounded",
      },
      {
         title: "Team",
         url: "#",
         icon: "ai-network-solid-rounded",
      },
   ],
   navClouds: [
      {
         title: "Capture",
         icon: "camera",
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
         icon: "file-description",
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
         icon: "file-ai",
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
         icon: "setting-06-solid-rounded",
      }
   ],
   documents: [
      {
         name: "Project",
         url: "/task-manager",
         icon: "ai-innovation-01-solid-rounded",
      },
      {
         name: "Reports",
         url: "#",
         icon: "apple-stocks-solid-rounded",
      },
      {
         name: "Chats",
         url: "#",
         icon: "bubble-chat-solid-rounded",
      },
      {
         name: "Word Assistant",
         url: "#",
         icon: "ai-scan-solid-rounded",
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { teams } = useGetTeams();
   
   const formattedTeams = teams.map(team => ({
      name: team.teamName,
      logo: Users,
      plan: team.teamDescription,
      idteam: team._id
   }));

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
            <TeamSwitcher teams={formattedTeams} />
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
            <NavTaskManager items={data.documents} />
            <NavSecondary items={data.navSecondary} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
      </Sidebar>
   );
}
