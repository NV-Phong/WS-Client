"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface CreateTeamData {
  teamName: string;
  teamDescription: string;
}

interface CreateTeamResponse {
  message: string;
  data: {
    IDTeam: string;
    TeamName: string;
    TeamDescription: string;
    TeamSize: number;
    IsDeleted: number;
  };
}

export function useCreateTeam() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = async (data: CreateTeamData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CreateTeamResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/team`,
        {
          teamName: data.teamName,
          teamDescription: data.teamDescription
        }
      );

      if (response.status === 201) {
        showToast.success("Tạo team thành công");
        return response.data.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tạo team. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTeam,
    isLoading,
    error
  };
} 