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
import { useState } from "react";
import { useCreateTeam } from "@/hooks/team/use-create-team";

interface CreateTeamPopoverProps {
   children: React.ReactNode;
   onTeamCreated: () => void;
}

export function CreateTeamPopover({ children, onTeamCreated }: CreateTeamPopoverProps) {
   const { createTeam } = useCreateTeam();
   const [isOpen, setIsOpen] = useState(false);
   const [teamName, setTeamName] = React.useState("");
   const [teamDescription, setTeamDescription] = React.useState("");
   const [isLoading, setIsLoading] = React.useState(false);

   const handleCreateTeam = async (data: { teamName: string; teamDescription: string }) => {
      try {
         setIsLoading(true);
         await createTeam(data);
         setIsOpen(false);
         onTeamCreated(); // Call the refetch function after successful creation
      } catch (error) {
         console.error("Failed to create team:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await handleCreateTeam({ teamName, teamDescription });
   };

   return (
      <>
         {isOpen && createPortal(
            <div 
               className="fixed inset-0 bg-background/30 backdrop-blur-[10px] z-[49]"
               onClick={() => setIsOpen(false)}
               style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            />,
            document.body
         )}
         <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                     <h4 className="font-medium leading-none">CREATE NEW TEAM</h4>
                     <p className="text-sm text-muted-foreground">
                        Create a new team to organize your work.
                     </p>
                  </div>
                  <div className="grid gap-3">
                     <div className="items-center gap-4">
                        <Label htmlFor="name" className="pb-1">Name</Label>
                        <Input
                           id="name"
                           value={teamName}
                           onChange={(e) => setTeamName(e.target.value)}
                           placeholder="Team Name"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="description" className="pb-1">Description</Label>
                        <Textarea
                           id="description"
                           value={teamDescription}
                           onChange={(e) => setTeamDescription(e.target.value)}
                           placeholder="Team Description"
                           disabled={isLoading}
                        />
                     </div>
                     <div className="flex justify-between gap-2">
                        <Button 
                           type="button" 
                           variant="outline" 
                           className="w-2/5" 
                           onClick={() => setIsOpen(false)}
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