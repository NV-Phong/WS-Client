"use client";

// ...existing imports...
import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface Access {
  idCollaborator: string;
  permission: string;
}

interface CreateProjectData {
  projectName: string;
  projectDescription: string;
  idTeam: string;
  access: Access[];
}

interface CreateProjectResponse {
  message: string;
  data: {
    idProject: string;
    projectName: string;
    projectDescription: string;
    idTeam: string;
    access: Access[];
  };
}

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (data: CreateProjectData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CreateProjectResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/project`,
        data
      );

      if (response.status === 201) {
        showToast.success("Tạo project thành công");
        return response.data.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tạo project. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
    error
  };
}
