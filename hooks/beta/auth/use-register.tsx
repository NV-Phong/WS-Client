"use client";

import { useAuth } from "./use-auth";
import { register } from "@/services/api";
import { toast } from "sonner";

export function useRegister() {
   const {
      setIsSubmitting,
      username,
      setUsername,
      password,
      setPassword,
      email,
      setEmail,
      displayName,
      setDisplayName,
   } = useAuth();

   const handleRegister = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
         const response = await register(
            username,
            password,
            email,
            displayName
         );
         if (response.status === 201) {
            toast.success("Register Successfully", {
               description: "Let login to unleash your dreams.",
            });
            setTimeout(() => {
               window.location.reload();
            }, 1500);
         }
      } catch (error: any) {
         toast.error("Register Failed", {
            description: error.response?.data?.message || "We have a problem, Let's try again later 😭",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   return {
      username,
      password,
      email,
      displayName,
      setUsername,
      setPassword,
      setEmail,
      setDisplayName,
      handleRegister,
   };
}