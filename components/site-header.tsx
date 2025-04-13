'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateWorkspacePopover } from "@/components/form/create-workspace";
import { Toast } from "./v0/custom-toast";
import { useToast } from "@/contexts/toast-context";

interface SiteHeaderProps {
  title?: string;
  showSidebar?: boolean;
  showNewWorkspace?: boolean;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  onWorkspaceCreated?: () => void;
}

export function SiteHeader({
  title = "Workspace",
  showSidebar = true,
  showNewWorkspace = true,
  rightContent,
  centerContent,
  onWorkspaceCreated
}: SiteHeaderProps) {
   const { state, showToast, handleSave, handleReset } = useToast();
   
   return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) relative">
         <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            {showSidebar && (
              <>
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
              </>
            )}
            <h1 className="text-base font-medium">{title}</h1>
            
            <div className="flex-1 flex items-center justify-center">
               {centerContent || (showToast && (
                  <Toast state={state} onSave={handleSave} onReset={handleReset} />
               ))}
            </div>
            
            <div className="flex items-center gap-2">
               {rightContent || (showNewWorkspace && (
                  <CreateWorkspacePopover onWorkspaceCreated={onWorkspaceCreated}>
                     <Button variant="outline" size="sm">
                        New Workspace
                     </Button>
                  </CreateWorkspacePopover>
               ))}
            </div>
         </div>
      </header>
   );
}
