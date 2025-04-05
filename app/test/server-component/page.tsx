import React from "react";
import { fetchData } from "@/services/root";
import { Toaster } from "sonner";
import { UseRoot } from "@/hooks/use-root";

export default async function ServerComponent() {
   const response = await fetchData();

   return (
      <div>
         <Toaster position="bottom-right" />
         <div>
            {response.data}
         </div>
         <UseRoot 
            key={`${response.message}`}
            message={response.message}
            error={response.error}
         />
      </div>
   );
}
