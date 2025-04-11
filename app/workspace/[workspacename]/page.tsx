"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGetNotes } from "@/hooks/beta/note/use-get-note";

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
         setWorkspaceName(workspaceSlug.replace(/-/g, ' '));
      }
   }, [workspaceSlug]);

   const { notes, isLoading, error } = useGetNotes(workspaceId || "");

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
                        ) : isLoading ? (
                           <div className="text-center py-8">
                              <p className="text-muted-foreground">Đang tải ghi chú...</p>
                           </div>
                        ) : error ? (
                           <div className="text-center py-8">
                              <p className="text-muted-foreground">{error}</p>
                           </div>
                        ) : notes.length > 0 ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {notes.map((note) => (
                                 <Card key={note._id}>
                                    <CardHeader>
                                       <CardTitle>{note.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                       <p>{note.content}</p>
                                       {note.attachment.length > 0 && (
                                          <div className="mt-4">
                                             <h4 className="font-semibold">Attachments:</h4>
                                             <ul>
                                                {note.attachment.map((file) => (
                                                   <li key={file._id}>
                                                      <a href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                                         {file.fileName} ({file.fileType})
                                                      </a>
                                                   </li>
                                                ))}
                                             </ul>
                                          </div>
                                       )}
                                    </CardContent>
                                 </Card>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-8">
                              <p className="text-muted-foreground">Không có ghi chú nào.</p>
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
