"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface DeleteWorkspaceResponse {
  message: string;
  data: {
    IDWorkspace: string;
    WorkSpaceName: string;
    WorkSpaceDescription: string;
    IsDeleted: number;
  };
}

export function useDeleteWorkspace() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteWorkspace = async (workspaceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete<DeleteWorkspaceResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/workspace/${workspaceId}`
      );

      if (response.status === 200) {
        showToast.success("Xóa workspace thành công");
        return response.data.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể xóa workspace. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteWorkspace,
    isLoading,
    error
  };
} 