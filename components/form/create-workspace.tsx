'use client';
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPortal } from "react-dom";
import { useCreateWorkspace } from "@/hooks/workspace/use-create-workspace";

interface CreateWorkspacePopoverProps {
   children: React.ReactNode;
   onWorkspaceCreated?: () => void;
}

export function CreateWorkspacePopover({ children, onWorkspaceCreated }: CreateWorkspacePopoverProps) {
   const [open, setOpen] = React.useState(false);
   const [workspaceName, setWorkspaceName] = React.useState("");
   const [workspaceDescription, setWorkspaceDescription] = React.useState("");
   const { createWorkspace, isLoading } = useCreateWorkspace();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
         await createWorkspace({
            workspaceName: workspaceName,
            workspaceDescription: workspaceDescription
         });
         
         // Reset form
         setWorkspaceName("");
         setWorkspaceDescription("");
         
         // Close popover
         setOpen(false);
         
         // Callback if provided
         if (onWorkspaceCreated) {
            onWorkspaceCreated();
         }
      } catch (error) {
         // Error is already handled by the hook
         console.error("Failed to create workspace:", error);
      }
   };

   return (
      <>
         {open && createPortal(
            <div 
               className="fixed inset-0 bg-background/30 backdrop-blur-[10px] z-[49]"
               onClick={() => setOpen(false)}
               style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            />,
            document.body
         )}
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               {children}
            </PopoverTrigger>
            <PopoverContent 
               className="w-80 mr-4 bg-background z-[51] relative" 
               side="right" 
               align="start"
               sideOffset={5}
            >
               <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="space-y-2">
                     <h4 className="font-medium leading-none">CREATE NEW WORKSPACE</h4>
                     <p className="text-sm text-muted-foreground">
                        Create a new workspace to manage your notes and schedule.
                     </p>
                  </div>
                  <div className="grid gap-3">
                     <div className="items-center gap-4">
                        <Label htmlFor="name" className="pb-1">Name</Label>
                        <Input
                           id="name"
                           value={workspaceName}
                           onChange={(e) => setWorkspaceName(e.target.value)}
                           placeholder="Workspace Name"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="description" className="pb-1">Desciption</Label>
                        <Textarea
                           id="description"
                           value={workspaceDescription}
                           onChange={(e) => setWorkspaceDescription(e.target.value)}
                           placeholder="Workspace Description"
                           disabled={isLoading}
                        />
                     </div>
                     <div className="flex justify-between gap-2">
                        <Button 
                           type="button" 
                           variant="outline" 
                           className="w-2/5" 
                           onClick={() => setOpen(false)}
                           disabled={isLoading}
                        >
                           Cancel
                        </Button>
                        <Button 
                           type="submit" 
                           className="w-2/5"
                           disabled={isLoading}
                        >
                           {isLoading ? "Creating..." : "Create"}
                        </Button>
                     </div>
                  </div>
               </form>
            </PopoverContent>
         </Popover>
      </>
   );
} 