"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function WorkspaceDetail() {
   const params = useParams();
   const router = useRouter();
   const [workspaceId, setWorkspaceId] = useState<string | null>(null);
   const [workspaceName, setWorkspaceName] = useState<string>("");
   const workspaceSlug = params.workspacename as string;

   useEffect(() => {
      const storedWorkspaceId = Cookies.get("IDWorkspace");
      const storedWorkspaceName = Cookies.get("WorkSpaceName");
      if (storedWorkspaceId) {
         setWorkspaceId(storedWorkspaceId);
      }
      if (storedWorkspaceName) {
         setWorkspaceName(storedWorkspaceName);
      } else {
         // Nếu không có cookie, sử dụng tên từ URL
         setWorkspaceName(workspaceSlug.replace(/-/g, ' '));
      }
   }, [workspaceSlug]);

   const handleBackToWorkspaces = () => {
      router.push('/workspace');
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
               title={`WORKSPACE • ${workspaceName}`}
               showNewWorkspace={false}
               rightContent={
                  <Button variant="outline" size="sm" onClick={handleBackToWorkspaces}>
                     Back to Workspaces
                  </Button>
               }
            />
            <div className="flex flex-1 flex-col">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                     <div className="px-4 lg:px-6">
                        {!workspaceId ? (
                           <div className="text-center py-8">
                              <p className="text-muted-foreground">Không tìm thấy thông tin workspace</p>
                           </div>
                        ) : (
                           <Card>
                              <CardHeader>
                                 <CardTitle>{workspaceName}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <p>Workspace Details</p>
                                 {/* Thêm nội dung chi tiết workspace ở đây */}
                              </CardContent>
                           </Card>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
