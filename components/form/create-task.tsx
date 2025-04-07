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
import { TaskSelector } from "./task-selector";
import { createPortal } from "react-dom";

interface CreateTaskPopoverProps {
   children: React.ReactNode;
   onTaskCreated?: () => void;
}

// Định nghĩa các loại task
const taskTypes = [
   { value: "feature", label: "Feature" },
   { value: "bug", label: "Bug" },
   { value: "improvement", label: "Improvement" },
   { value: "documentation", label: "Documentation" },
];

// Định nghĩa các trạng thái task
const taskStatuses = [
   { value: "todo", label: "To Do" },
   { value: "in progress", label: "In Progress" },
   { value: "in review", label: "In Review" },
   { value: "done", label: "Done" }
];

// Định nghĩa danh sách người dùng
const assignees = [
   { value: "eddie", label: "Eddie Lake" },
   { value: "jamik", label: "Jamik Tashpulatov" },
   { value: "emily", label: "Emily Whalen" },
   { value: "sarah", label: "Sarah Chen" },
   { value: "david", label: "David Kim" },
];

// Định nghĩa các mức độ ưu tiên
const priorities = [
   { value: "urgent", label: "Urgent" },
   { value: "high", label: "High" },
   { value: "medium", label: "Medium" },
   { value: "low", label: "Low" },
];

export function CreateTaskPopover({ children, onTaskCreated }: CreateTaskPopoverProps) {
   const [open, setOpen] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [formData, setFormData] = React.useState({
      taskHeader: "",
      taskDescription: "",
      taskType: "",
      taskStatus: "todo",
      assignee: "",
      priority: "low",
   });

   const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
         console.log(formData);
         
         // Reset form
         setFormData({
            taskHeader: "",
            taskDescription: "",
            taskType: "",
            taskStatus: "todo",
            assignee: "",
            priority: "low",
         });
         
         // Close popover
         setOpen(false);
         
         // Callback if provided
         if (onTaskCreated) {
            onTaskCreated();
         }
      } catch (error) {
         console.error("Error creating task:", error);
      } finally {
         setIsLoading(false);
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
                        <Label htmlFor="taskHeader" className="pb-1">Task Name</Label>
                        <Input
                           id="taskHeader"
                           value={formData.taskHeader}
                           onChange={(e) => handleChange("taskHeader", e.target.value)}
                           placeholder="Enter task header"
                           required
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="taskDescription" className="pb-1">Task Description</Label>
                        <Textarea
                           id="taskDescription"
                           value={formData.taskDescription}
                           onChange={(e) => handleChange("taskDescription", e.target.value)}
                           placeholder="Enter task description"
                           className="resize-none"
                           rows={3}
                           disabled={isLoading}
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="taskType" className="pb-1">Task Type</Label>
                        <TaskSelector
                           value={formData.taskType}
                           onValueChange={(value) => handleChange("taskType", value)}
                           options={taskTypes}
                           placeholder="Select task type"
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="priority" className="pb-1">Priority</Label>
                        <TaskSelector
                           value={formData.priority}
                           onValueChange={(value) => handleChange("priority", value)}
                           options={priorities}
                           placeholder="Select priority"
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="taskStatus" className="pb-1">Status</Label>
                        <TaskSelector
                           value={formData.taskStatus}
                           onValueChange={(value) => handleChange("taskStatus", value)}
                           options={taskStatuses}
                           placeholder="Select status"
                        />
                     </div>
                     <div className="items-center gap-4">
                        <Label htmlFor="assignee" className="pb-1">Assignee</Label>
                        <TaskSelector
                           value={formData.assignee}
                           onValueChange={(value) => handleChange("assignee", value)}
                           options={assignees}
                           placeholder="Select assignee"
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