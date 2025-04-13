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
import { useCreateWorkspace } from "@/hooks/project/use-create-project";

interface CreateWorkspacePopoverProps {
   children: React.ReactNode;
   onSuccess?: () => void;
   teamId: string;
}

export function CreateProjectPopover({ children, onSuccess, teamId }: CreateWorkspacePopoverProps) {
   const [open, setOpen] = React.useState(false);
   const [projectName, setProjectName] = React.useState("");
   const [projectDescription, setProjectDescription] = React.useState("");
   const { createWorkspace, isLoading } = useCreateWorkspace();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
         await createWorkspace({
            projectName: projectName,
            projectDescription: projectDescription,
            IDTeam: teamId
         });
         
         // Reset form
         setProjectName("");
         setProjectDescription("");
         
         // Close popover
         setOpen(false);
         
         // Callback if provided
         if (onSuccess) {
            onSuccess();
         }
      } catch (error) {
         // Error is already handled by the hook
         console.error("Failed to create project:", error);
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
                     <h4 className="font-medium leading-none">CREATE NEW PROJECT</h4>
                     <p className="text-sm text-muted-foreground">
                        Create a new project to manage your notes and schedule.
                     </p>
                  </div>
                  <div className="grid gap-3">
                     <div className="items-center gap-4">
                        <Label htmlFor="name" className="pb-1">Name</Label>
                        <Input
                           id="name"
                           value={projectName}
                           onChange={(e) => setProjectName(e.target.value)}
                           placeholder="Project Name"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="description" className="pb-1">Description</Label>
                        <Textarea
                           id="description"
                           value={projectDescription}
                           onChange={(e) => setProjectDescription(e.target.value)}
                           placeholder="Project Description"
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