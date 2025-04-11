"use client";

import { useState } from "react";
import axios from "@/services/api";
import { showToast } from "@/lib/toast-config";

interface CreateWorkspaceData {
   workspaceName: string;
   workspaceDescription: string;
}

interface CreateWorkspaceResponse {
   message: string;
   data: {
      IDWorkspace: string;
      WorkspaceName: string;
      WorkspaceDescription: string;
      IsDeleted: number;
   };
}

export function useCreateWorkspace() {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   const createWorkspace = async (data: CreateWorkspaceData) => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await axios.post<CreateWorkspaceResponse>(
            `${process.env.NEXT_PUBLIC_API_SERVER}/workspace`,
            {
               workspaceName: data.workspaceName,
               workspaceDescription: data.workspaceDescription,
            }
         );

         if (response.status === 201) {
            showToast.success("Tạo workspace thành công");
            return response.data.data;
         }
      } catch (error: any) {
         const errorMessage =
            error.response?.data?.message ||
            "Không thể tạo workspace. Vui lòng thử lại sau.";
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

interface CreateTaskData {
   idProject: string;
   idAssignee: string;
   status: string;
   taskName: string;
   priority: string;
   startDay: string;
   endDay: string;
   dueDay: string;
   tag: { tagName: string }[];
}

interface CreateTaskResponse {
   message: string;
   data: {
      idProject: string;
      idAssignee: string;
      status: string;
      tag: {
         tagName: string;
         isDeleted: boolean;
         _id: string;
         idTag: string;
      }[];
      taskName: string;
      priority: string;
      startDay: string;
      endDay: string;
      dueDay: string;
      isDeleted: boolean;
      _id: string;
      createAt: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
   };
}

export function useCreateTask() {
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);

   const createTask = async (data: CreateTaskData) => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await axios.post<CreateTaskResponse>(
            `${process.env.NEXT_PUBLIC_API_SERVER}/task`,
            {
               idProject: data.idProject,
               idAssignee: data.idAssignee,
               status: data.status,
               taskName: data.taskName,
               priority: data.priority,
               startDay: data.startDay,
               endDay: data.endDay,
               dueDay: data.dueDay,
               tag: data.tag,
            }
         );

         if (response.status === 201) {
            showToast.success("Task created successfully");
            return response.data.data;
         }
      } catch (error: any) {
         const errorMessage =
            error.response?.data?.message ||
            "Unable to create task. Please try again later.";
         setError(errorMessage);
         showToast.error("Error", errorMessage);
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   return {
      createTask,
      isLoading,
      error,
   };
}
