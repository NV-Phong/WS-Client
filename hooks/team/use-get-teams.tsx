"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { showToast } from "@/lib/toast-config";

// Định nghĩa kiểu dữ liệu cho team
interface Leader {
  IDUser: string;
  Username: string;
  Email: string;
  DisplayName: string;
  Avatar: string | null;
  Cover: string | null;
  IsDeleted: number;
}

interface Team {
  IDTeam: string;
  TeamName: string;
  TeamSize: number;
  TeamDescription: string;
  IsDeleted: number;
  leader: Leader;
}

interface TeamResponse {
  message: string;
  data: Team[];
}

export function useGetTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<TeamResponse>(`${process.env.NEXT_PUBLIC_API_SERVER}/team`);
      
      if (response.status === 200) {
        setTeams(response.data.data);
        showToast.success("Lấy danh sách team thành công");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể lấy danh sách team. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    isLoading,
    error,
    refetch: fetchTeams
  };
} 