"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
   const [activeItem, setActiveItem] = useState("HOME");

   const menuItems = ["HOME", "ABOUT", "SKILLS", "EXPERIENCE", "AUTH"];

   return (
      // <div className="fixed bottom-4 left-0 right-0 flex justify-center w-full z-50">
      <div className="fixed top-3 left-0 right-0 flex justify-center w-full z-50">
         <div className="flex items-center px-1.5 py-1.5 bg-black rounded-full">
            {menuItems.map((item) => (
               <Link
                  key={item}
                  href={`/${item === "HOME" ? "" : item.toLowerCase()}`}
                  onClick={() => setActiveItem(item)}
                  className={cn(
                     "px-5 py-2 mx-0.5 text-[12px] font-medium text-white transition-colors rounded-full",
                     activeItem === item
                        ? "bg-white text-black"
                        : "hover:bg-gray-800"
                  )}
               >
                  {item}
               </Link>
            ))}
         </div>
      </div>
   );
}
