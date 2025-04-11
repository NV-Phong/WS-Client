import * as React from "react";

interface FormData {
   taskHeader: string;
   taskDescription: string;
   taskType: string;
   taskStatus: string;
   assignee: string;
   priority: string;
}

export function useCreateTaskForm(onTaskCreated?: () => void) {
   const [open, setOpen] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [formData, setFormData] = React.useState<FormData>({
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

   return {
      open,
      setOpen,
      isLoading,
      formData,
      handleChange,
      handleSubmit,
   };
}
