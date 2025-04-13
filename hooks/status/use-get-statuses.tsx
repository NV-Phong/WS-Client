"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";
import Cookies from "js-cookie";

interface Status {
  IDStatus: string;
  Status: string;
  StatusOrder: number;
  IsDeleted: number;
}

interface StatusResponse {
  message: string;
  IDProject: string;
  data: Status[];
}

export function useGetStatuses() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const projectId = Cookies.get('IDProject');
      
      if (!projectId) {
        throw new Error('Không tìm thấy Project ID');
      }

      const response = await axios.get<StatusResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/status/${projectId}`
      );

      if (response.status === 200) {
        // Sort statuses by StatusOrder before setting state
        const sortedStatuses = response.data.data.sort((a, b) => a.StatusOrder - b.StatusOrder);
        setStatuses(sortedStatuses);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Không thể lấy danh sách status. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  return {
    statuses,
    isLoading,
    error,
    reload: fetchStatuses
  };
}