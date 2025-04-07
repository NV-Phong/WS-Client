"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
import { useDeleteWorkspace } from "@/hooks/workspace/use-delete-workspace";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui-engineer/Icon";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/contexts/toast-context";
import Cookies from "js-cookie";
import { slugifyProjectName } from "@/lib/utils";

export default function WorkSpace() {
   const { workspaces, isLoading, error } = useGetWorkspaces();
   const { deleteWorkspace, isLoading: isDeleting } = useDeleteWorkspace();
   const { handleWorkspaceDeleted } = useToast();

   const handleDeleteWorkspace = async (workspaceId: string) => {
      try {
         await deleteWorkspace(workspaceId);
         handleWorkspaceDeleted();
         // Không cần router.refresh() vì chúng ta sẽ reload trang sau khi nhấn Save
      } catch (error) {
         console.error("Failed to delete workspace:", error);
      }
   };

   return (
      <SidebarProvider
         style={
            {
               "--sidebar-width": "calc(var(--spacing) * 72)",
               "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
         }
      >
         <AppSidebar variant="inset" />
         <SidebarInset>
            <SiteHeader 
               title="Workspace"
               showNewWorkspace={true}
            />
            <div className="flex flex-1 flex-col">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                     <div className="px-4 lg:px-6">
                        {isLoading ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[1, 2, 3].map((i) => (
                                 <div key={i} className="aspect-square">
                                    <Card className="h-full">
                                       <CardHeader>
                                          <Skeleton className="h-4 w-3/4" />
                                          <Skeleton className="h-4 w-1/2" />
                                       </CardHeader>
                                       <CardContent>
                                          <Skeleton className="h-20 w-full" />
                                       </CardContent>
                                    </Card>
                                 </div>
                              ))}
                           </div>
                        ) : error ? (
                           <div className="text-red-500">{error}</div>
                        ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {workspaces.map((workspace) => (
                                 <div
                                    key={workspace.IDWorkspace}
                                    className="aspect-square"
                                 >
                                    <Card className="h-full flex flex-col p-6 gap-0 relative">
                                       <div className="absolute right-4 top-4">
                                          <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="icon"
                                                   className="h-8 w-8 p-0"
                                                   disabled={isDeleting}
                                                >
                                                   <Icon
                                                      name="setup-01-solid-standard"
                                                      size={20}
                                                      className="opacity-70 hover:opacity-100"
                                                   />
                                                </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                   Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                   className="text-red-600"
                                                   onClick={() => handleDeleteWorkspace(workspace.IDWorkspace)}
                                                   disabled={isDeleting}
                                                >
                                                   {isDeleting ? "Đang xóa..." : "Remove"}
                                                </DropdownMenuItem>
                                             </DropdownMenuContent>
                                          </DropdownMenu>
                                       </div>
                                       <CardHeader className="flex-none p-0 space-y-1.5 bg-gradient-to-r from-primary to-transparent bg-clip-text text-transparent">
                                          <CardTitle className="text-xl font-semibold">
                                             {workspace.WorkSpaceName}
                                          </CardTitle>
                                       </CardHeader>
                                       <CardContent className="flex flex-col flex-1 p-0">
                                          <div>
                                             <CardDescription className="text-sm font-medium">
                                                Workspace Details
                                             </CardDescription>
                                             <div className="mt-2 h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
                                                <p className="text-sm text-muted-foreground">
                                                   {workspace.WorkSpaceDescription}
                                                </p>
                                             </div>
                                          </div>
                                          <div className="mt-auto pt-4 border-t">
                                             <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={() => {
                                                   Cookies.set("IDWorkspace", workspace.IDWorkspace);
                                                   Cookies.set("WorkSpaceName", workspace.WorkSpaceName);
                                                   const slugifiedName = slugifyProjectName(workspace.WorkSpaceName);
                                                   window.location.href = `/workspace/${slugifiedName}`;
                                                }}
                                             >
                                                Open
                                             </Button>
                                          </div>
                                       </CardContent>
                                    </Card>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
