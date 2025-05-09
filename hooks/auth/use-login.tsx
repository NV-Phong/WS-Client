"use client";

import Cookies from "js-cookie";
import { useAuth } from "./use-auth";
import { login } from "@/services/api";
import { showToast } from "@/lib/toast-config";

export function useLogin() {
   const {
      username,
      setUsername,
      password,
      setPassword,
      setIsSubmitting,
      router,
   } = useAuth();

   const handleLogin = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
         const response = await login(username, password);
         if (response.status === 200) {
            Cookies.set("access_token", response.data.data.access_token, {
               expires: 7,
            });
            Cookies.set("refresh_token", response.data.data.refresh_token, {
               expires: 30,
            });
            showToast.success("Login Successfully", "Let go! to unleash your dreams.");
            router.push("/task-manager");
         }
      } catch (error: any) {
         showToast.error(
            "Login Failed",
            error.response?.data?.message || "We have a problem, Let's try again later 😭"
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleGithubLogin = () => {
      // router.push(`${process.env.NEXT_PUBLIC_GITHUB}`);
   };

   return {
      username,
      password,
      setUsername,
      setPassword,
      handleLogin,
      handleGithubLogin,
   };
}