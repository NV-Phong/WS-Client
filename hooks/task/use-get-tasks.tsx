"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";
import Cookies from "js-cookie";

interface Project {
  IDProject: string;
  IDTeam: string;
  ProjectName: string;
  ProjectDescription: string;
  IsDeleted: number;
}

interface Status {
  IDStatus: string;
  IDProject: string;
  Status: string;
  StatusOrder: number;
  IsDeleted: number;
}

interface Task {
  IDTask: string;
  IDStatus: string;
  IDTag: string | null;
  IDAssignee: string | null;
  TaskName: string;
  TaskDescription: string;
  Priority: string;
  CreateAt: string;
  StartDay: string | null;
  EndDay: string | null;
  DueDay: string | null;
  IsDeleted: number;
  project: Project;
  status: Status;
  tag: any | null;
  assignee: any | null;
  attachments: any[];
}

interface TaskResponse {
  success: boolean;
  data: Task[];
  message: string;
}

export function useGetTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const projectId = Cookies.get("IDProject");

      if (!projectId) {
        throw new Error("Không tìm thấy Project ID");
      }

      const response = await axios.get<TaskResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/task/${projectId}`
      );

      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lấy danh sách tasks. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    reload: fetchTasks,
  };
}
