"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";
import Cookies from "js-cookie";

interface CreateProjectData {
   projectName: string; // Updated key
   projectDescription: string; // Updated key
   IDTeam: string;
}

interface CreateProjectResponse {
   message: string;
   data: {
      IDProject: string;
      ProjectName: string;
      ProjectDescription: string;
      IsDeleted: number;
   };
}

export function useCreateWorkspace() {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   const createWorkspace = async (data: CreateProjectData) => {
      setIsLoading(true);
      setError(null);

      try {
         const IDTeam = Cookies.get("IDTeam"); // Retrieve IDTeam from cookies
         if (!IDTeam) {
            throw new Error("IDTeam không tồn tại trong cookies.");
         }

         const response = await axios.post<CreateProjectResponse>(
            `${process.env.NEXT_PUBLIC_API_SERVER}/project`, // Updated endpoint
            {
               projectName: data.projectName, // Updated key
               projectDescription: data.projectDescription, // Updated key
               IDTeam, // Include IDTeam in the payload
            }
         );

         if (response.status === 201) {
            showToast.success("Tạo project thành công");
            return response.data.data;
         }
      } catch (error: any) {
         const errorMessage =
            error.response?.data?.message ||
            "Không thể tạo project. Vui lòng thử lại sau.";
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
      error,
   };
}
