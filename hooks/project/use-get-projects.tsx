"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface Project {
  IDProject: string;
  IDTeam: string;
  ProjectName: string;
  ProjectDescription: string;
  IsDeleted: number;
}

interface ProjectResponse {
  message: string;
  data: Project[];
}

export function useGetProjects(teamId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ProjectResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/project/${teamId}`
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

  useEffect(() => {
    if (teamId) {
      fetchProjects();
    }
  }, [teamId]);

  return {
    projects,
    isLoading,
    error,
    reload: fetchProjects // Expose reload function
  };
}