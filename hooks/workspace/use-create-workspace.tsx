"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface CreateWorkspaceData {
  workspaceName: string;
  workspaceDescription: string;
}

interface CreateWorkspaceResponse {
  message: string;
  data: {
    IDWorkspace: string;
    WorkspaceName: string;
    WorkspaceDescription: string;
    IsDeleted: number;
  };
}

export function useCreateWorkspace() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createWorkspace = async (data: CreateWorkspaceData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CreateWorkspaceResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/workspace`,
        {
          workspaceName: data.workspaceName,
          workspaceDescription: data.workspaceDescription
        }
      );

      if (response.status === 201) {
        showToast.success("Tạo workspace thành công");
        return response.data.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tạo workspace. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createWorkspace,
    isLoading,
    error
  };
} 