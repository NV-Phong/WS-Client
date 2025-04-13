"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";
import Cookies from "js-cookie";

interface TaskData {
  taskHeader: string;
  taskDescription: string;
  taskType: string;
  taskStatus: string;
  assignee: string;
  priority: string;
}

export function useCreateTask() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (taskData: TaskData) => {
    setIsLoading(true);
    setError(null);
    try {
      const projectId = Cookies.get('IDProject');
      
      if (!projectId) {
        throw new Error('Không tìm thấy Project ID');
      }

      // Format data to match API expectations
      const payload = {
        IDProject: projectId,
        IDStatus: taskData.taskStatus,
        TaskName: taskData.taskHeader,
        TaskDescription: taskData.taskDescription,
        Priority: taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1),
        Assignee: taskData.assignee || ""
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_SERVER}/task`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        showToast.success("Thành công", "Tạo task thành công");
        return response.data;
      } else {
        throw new Error('Phản hồi không thành công từ server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Không thể tạo task. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTask,
    isLoading,
    error
  };
}
