"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
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

export const fetchTeams = async () => {
  try {
    const response = await axios.get<TeamResponse>(`${process.env.NEXT_PUBLIC_API_SERVER}/team`);
    
    if (response.status === 200) {
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Không thể lấy danh sách team. Vui lòng thử lại sau.";
    showToast.error("Lỗi", errorMessage);
    return [];
  }
};

export function useGetTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTeams = async () => {
    setIsLoading(true);
    setError(null);
    const data = await fetchTeams();
    setTeams(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getTeams();
  }, []);

  return {
    teams,
    isLoading,
    error,
    refetch: getTeams
  };
}