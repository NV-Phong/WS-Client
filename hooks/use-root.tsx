"use client";

import React from "react";
import { toast } from "sonner";

interface UseRootProps {
   message: string;
   error?: boolean;
}

export function UseRoot({ message, error = false }: UseRootProps) {
   const [isShown, setIsShown] = React.useState(false);

   React.useEffect(() => {
      if (!isShown) {
         if (error) {
            toast.error("Error", {
               description: message,
            });
         } else {
            toast.success("Success", {
               description: message,
            });
         }
         setIsShown(true);
      }
   }, [message, error, isShown]);

   return null;
} 