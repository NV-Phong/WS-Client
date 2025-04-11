"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface Access {
  idCollaborator: string;
  permission: string;
  isDeleted: boolean;
  _id: string;
}

interface Project {
  _id: string;
  idTeam: string;
  projectName: string;
  projectDescription: string;
  isDeleted: boolean;
  access: Access[];
  tag: any[];
  status: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ProjectResponse {
  message: string;
  data: Project[];
}

export function useGetProjects(teamId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<ProjectResponse>(
          `${process.env.NEXT_PUBLIC_API_SERVER}/project`
        );

        if (response.status === 200) {
          setProjects(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Không thể lấy danh sách projects. Vui lòng thử lại sau.";
        setError(errorMessage);
        showToast.error("Lỗi", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchProjects();
    }
  }, [teamId]);

  return {
    projects,
    isLoading,
    error
  };
}

interface Tag {
  tagName: string;
  isDeleted: boolean;
  _id: string;
  idTag: string;
}

interface Task {
  _id: string;
  idProject: string;
  idAssignee: string;
  status: string;
  tag: Tag[];
  taskName: string;
  priority: string;
  startDay: string;
  endDay: string;
  dueDay: string;
  isDeleted: boolean;
  createAt: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface TaskResponse {
  message: string;
  data: Task[];
}

export function useGetTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<TaskResponse>(
          `${process.env.NEXT_PUBLIC_API_SERVER}/task`
        );

        if (response.status === 200) {
          setTasks(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Không thể lấy danh sách tasks. Vui lòng thử lại sau.";
        setError(errorMessage);
        showToast.error("Lỗi", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return {
    tasks,
    isLoading,
    error
  };
}