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
import { TaskSelector } from "./task-selector"; // Import TaskSelector
import { createPortal } from "react-dom";
import { useCreateTask } from "@/hooks/beta/task/use-create-task"; // Use the task creation hook
import Cookies from "js-cookie"; // Import Cookies

const priorities = [
   { value: "urgent", label: "Urgent" },
   { value: "high", label: "High" },
   { value: "medium", label: "Medium" },
   { value: "low", label: "Low" },
];

interface CreateTaskPopoverProps {
   children: React.ReactNode;
   onTaskCreated?: () => void;
}

export function CreateTaskPopover({ children, onTaskCreated }: CreateTaskPopoverProps) {
   const [open, setOpen] = React.useState(false);
   const [taskName, setTaskName] = React.useState("");
   const [taskDescription, setTaskDescription] = React.useState("");
   const [priority, setPriority] = React.useState("medium"); // Add state for priority
   const { createTask, isLoading } = useCreateTask();

   const capitalizePriority = (value: string) => {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const idProject = Cookies.get("IDProject");
      if (!idProject) {
         console.error("Project ID not found in cookies.");
         return;
      }

      try {
         await createTask({
            idProject,
            idAssignee: "67f69e24b94678ef4e0d910d",
            status: "67f69e24b94678ef4e0d910d",
            taskName,
            priority: capitalizePriority(priority), // Transform priority
            startDay: new Date().toISOString(),
            endDay: new Date().toISOString(),
            dueDay: new Date().toISOString(),
            tag: [],
         });
         setTaskName("");
         setTaskDescription("");
         setPriority("medium"); // Reset priority
         setOpen(false);
         if (onTaskCreated) onTaskCreated();
      } catch (error) {
         console.error("Error creating task:", error);
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
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 mr-4 bg-background z-[51] relative" side="right" align="start" sideOffset={5}>
               <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="space-y-2">
                     <h4 className="font-medium leading-none">CREATE NEW TASK</h4>
                     <p className="text-sm text-muted-foreground">
                        Create a new task for your project.
                     </p>
                  </div>
                  <div className="grid gap-3">
                     <div className="items-center gap-4">
                        <Label htmlFor="taskName" className="pb-1">Task Name</Label>
                        <Input
                           id="taskName"
                           value={taskName}
                           onChange={(e) => setTaskName(e.target.value)}
                           placeholder="Enter task name"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="taskDescription" className="pb-1">Task Description</Label>
                        <Textarea
                           id="taskDescription"
                           value={taskDescription}
                           onChange={(e) => setTaskDescription(e.target.value)}
                           placeholder="Enter task description"
                           className="resize-none"
                           rows={3}
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="priority" className="pb-1">Priority</Label>
                        <TaskSelector
                           value={priority}
                           onValueChange={(value) => setPriority(value)}
                           options={priorities}
                           placeholder="Select priority"
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