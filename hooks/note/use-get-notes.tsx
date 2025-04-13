"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface Note {
  IDNote: string;
  IDWidget: string;
  Author: string;
  Title: string;
  Content: string;
  CreatedAt: string;
  IsPublic: number;
  Thumbnail: string | null;
  IsDeleted: number;
}

interface NoteResponse {
  message: string;
  data: Note[];
}

export function useGetNotes(widgetId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<NoteResponse>(
        `${process.env.NEXT_PUBLIC_API_SERVER}/note`
      );

      if (response.status === 200) {
        setNotes(response.data.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể lấy danh sách notes. Vui lòng thử lại sau.";
      setError(errorMessage);
      showToast.error("Lỗi", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (widgetId) {
      fetchNotes();
    }
  }, [widgetId]);

  return {
    notes,
    isLoading,
    error,
    reload: fetchNotes
  };
}