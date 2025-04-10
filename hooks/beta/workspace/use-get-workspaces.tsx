"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

// Định nghĩa kiểu dữ liệu cho workspace
interface Workspace {
  IDWorkspace: string;
  WorkSpaceName: string;
  WorkSpaceDescription: string;
}

interface WorkspaceResponse {
  message: string;
  data: Workspace[];
}

export function useGetWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get<WorkspaceResponse>(
          `${process.env.NEXT_PUBLIC_API_SERVER}/workspace`
        );

        if (response.status === 200) {
          setWorkspaces(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Không thể lấy danh sách workspace. Vui lòng thử lại sau.";
        setError(errorMessage);
        showToast.error("Lỗi", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    isLoading,
    error
  };
} 