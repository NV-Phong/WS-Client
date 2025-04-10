import * as React from "react";
import Cookies from "js-cookie"; // Thêm import js-cookie
import { ChevronsUpDown, Loader2, User } from "lucide-react"; // Added default icon
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { CreateTeamPopover } from "./form/create-team";
import { Button } from "./ui/button";

export function TeamSwitcher({
   teams,
   isLoading,
}: {
   teams: {
      name: string;
      logo: React.ElementType;
      plan: string;
      idteam: string;
   }[];
   isLoading?: boolean;
}) {
   const { isMobile } = useSidebar();
   const [activeTeam, setActiveTeam] = React.useState<{
      name: string;
      logo: React.ElementType;
      plan: string;
      idteam: string;
   } | null>(null);

   // Khi component được mount, lấy thông tin team từ Cookies
   React.useEffect(() => {
      const storedTeamId = Cookies.get("IDTeam");
      if (storedTeamId) {
         const storedTeam = teams.find((team) => team.idteam === storedTeamId);
         if (storedTeam) {
            setActiveTeam(storedTeam);
         }
      } else if (teams.length > 0) {
         setActiveTeam(teams[0]);
      }
   }, [teams]);

   const handleTeamSelect = (team: {
      name: string;
      logo: React.ElementType;
      plan: string;
      idteam: string;
   }) => {
      setActiveTeam(team);
      // Lưu IDTeam vào cookie với thời hạn 7 ngày
      Cookies.set("IDTeam", team.idteam, {
         expires: 7,
         path: "/",
         secure: true,
         sameSite: "strict",
      });
      // Lưu thêm thông tin team name để dễ dàng hiển thị
      Cookies.set("TeamName", team.name, {
         expires: 7,
         path: "/",
         secure: true,
         sameSite: "strict",
      });
      // Reload trang để cập nhật dữ liệu với team mới
      window.location.reload();
   };

   if (isLoading) {
      return (
         <SidebarMenu>
            <SidebarMenuItem>
               <SidebarMenuButton size="lg" disabled>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Teams is loading...</span>
               </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      );
   }

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        {activeTeam?.logo ? (
                           <activeTeam.logo className="size-4" />
                        ) : (
                           <div className="size-4"></div>
                        )}
                     </div>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                           {activeTeam?.name || "You don't have any team"}
                        </span>
                        <span className="truncate text-xs">
                           {activeTeam?.plan || "Your team doesn't have any description"}
                        </span>
                     </div>
                     <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background"
                  align="start"
                  side={isMobile ? "bottom" : "bottom"}
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                     Teams
                  </DropdownMenuLabel>
                  {teams.length === 0 ? (
                     <div className="p-2 text-sm text-muted-foreground">
                        You don&apos;t have any team
                     </div>
                  ) : (
                     teams.map((team, index) => (
                        <DropdownMenuItem
                           key={team.idteam}
                           onClick={() => handleTeamSelect(team)}
                           className="gap-2 p-2"
                        >
                           <div className="flex size-6 items-center justify-center rounded-sm border">
                              <team.logo className="size-4 shrink-0" />
                           </div>
                           {team.name}
                           <DropdownMenuShortcut>
                              ⌘{index + 1}
                           </DropdownMenuShortcut>
                        </DropdownMenuItem>
                     ))
                  )}
                  <DropdownMenuSeparator />
                  <div className="p-2">
                     <CreateTeamPopover
                        onTeamCreated={() => {
                           // Refresh teams list
                           window.location.reload();
                        }}
                     >
                        <Button className="w-full">Create New Team</Button>
                     </CreateTeamPopover>
                  </div>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}