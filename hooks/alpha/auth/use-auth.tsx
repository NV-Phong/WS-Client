"use client";

import { checkTokenAndRedirect } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
   const router = useRouter();

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [displayName, setDisplayName] = useState("");
   const [email, setEmail] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleCancel = () => {
      router.push("/");
   };

   useEffect(() => {
      checkTokenAndRedirect(router);
   }, [router]);

   return {
      router,
      username,
      setUsername,
      password,
      setPassword,
      displayName,
      setDisplayName,
      email,
      setEmail,
      isSubmitting,
      setIsSubmitting,
      handleCancel,
   };
}