"use client";

import { useState, useEffect } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface Attachment {
  fileName: string;
  fileType: string;
  fileURL: string;
  _id: string;
}

interface Note {
  IDWidget: string;
  IDAuthor: string;
  title: string;
  content: string;
  isDeleted: boolean;
  attachment: Attachment[];
  _id: string;
  createAt: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface NotesResponse {
  message: string;
  data: Note[];
}

export function useGetNotes(widgetId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get<NotesResponse>(
          `${process.env.NEXT_PUBLIC_API_SERVER}/note`
        );

        if (response.status === 200) {
          setNotes(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Không thể lấy danh sách ghi chú. Vui lòng thử lại sau.";
        setError(errorMessage);
        showToast.error("Lỗi", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (widgetId) {
      fetchNotes();
    }
  }, [widgetId]);

  return {
    notes,
    isLoading,
    error
  };
}