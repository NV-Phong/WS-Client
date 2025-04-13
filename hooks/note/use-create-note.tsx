"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";
import Cookies from "js-cookie";

interface CreateNoteData {
    WidgetType: string;
    Width: number;
    Height: number;
    Color: string;
    PositionX: number;
    PositionY: number;
    Title: string;
    Content: string;
}

interface CreateNoteResponse {
    message: string;
    data: {
        IDNote: string;
        // ...other response fields...
    };
}

export function useCreateNote() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createNote = async (data: CreateNoteData) => {
        setIsLoading(true);
        setError(null);

        try {
            const IDWorkSpace = Cookies.get("IDWorkspace");
            if (!IDWorkSpace) {
                throw new Error("IDWorkSpace không tồn tại trong cookies.");
            }

            const response = await axios.post<CreateNoteResponse>(
                `${process.env.NEXT_PUBLIC_API_SERVER}/note`,
                {
                    IDWorkSpace,
                    WidgetType: "Note",
                    Width: data.Width,
                    Height: data.Height,
                    Color: data.Color,
                    PositionX: data.PositionX,
                    PositionY: data.PositionY,
                    Title: data.Title,
                    Content: data.Content
                }
            );

            if (response.status === 201) {
                showToast.success("Tạo note thành công");
                return response.data.data;
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Không thể tạo note. Vui lòng thử lại sau.";
            setError(errorMessage);
            showToast.error("Lỗi", errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createNote,
        isLoading,
        error,
    };
}
