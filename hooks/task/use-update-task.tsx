import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// Define Task type directly
export interface Task {
  IDTask: string;
  TaskName: string;
  TaskDescription?: string;
  IDProject: string;
  IDStatus?: string;
  IDTag?: number;
  IDAssignee?: string;
  Priority?: 'Low' | 'Medium' | 'High';
  StartDay?: string;
  EndDay?: string;
  DueDay?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  IsDeleted?: boolean;
}

export function useUpdateTask() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Prepare data to match the structure expected by the backend
    const formattedData = {
      TaskName: updatedData.TaskName,
      TaskDescription: updatedData.TaskDescription,
      IDStatus: updatedData.IDStatus,
      IDTag: updatedData.IDTag,
      IDAssignee: updatedData.IDAssignee,
      Priority: updatedData.Priority,
      StartDay: updatedData.StartDay,
      EndDay: updatedData.EndDay,
      DueDay: updatedData.DueDay
    };

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/task/${taskId}`,
        formattedData
      );

      if (response.status === 200) {
        setSuccess(true);
        toast.success("Task updated", {
          description: "Task has been updated successfully.",
        });
      } else {
        setError(response.data.message || "Failed to update task");
        toast.error("Task update failed", {
          description: response.data.message || "Failed to update task",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating the task";
      setError(errorMessage);
      toast.error("Task update failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTask, isLoading, error, success };
}
