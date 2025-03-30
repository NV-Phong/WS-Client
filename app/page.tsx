"use client";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import Particles from "@/components/magicui/particles";
import StickyNotes from "@/components/ui-engineer/sticky-notes";
// import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spotlight } from "@/components/aceternity/spotlight-new";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
   const { resolvedTheme } = useTheme();
   const [color, setColor] = useState("#ffffff");

   useEffect(() => {
      setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
   }, [resolvedTheme]);

   return (
      <div className="relative min-h-screen">
         <Spotlight />

         <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="fixed top-4 right-4 z-50">
               {/* <div className="z-50">
                  <ModeToggle />
               </div> */}
            </div>
            <div className="z-49">
               <StickyNotes />
            </div>

            <div className="flex flex-col items-center justify-center">
               <div className="mb-9 max-w-7xl mx-auto w-full pt-20 md:pt-0 text-center">
                  <h1 className="h-40 text-xl md:text-3xl font-bold text-neutral-800">
                     Wellcome To
                     <GradualSpacing
                        className="font-display text-center text-5xl font-bold -tracking-widest text-neutral-900 md:text-7xl md:leading-[5rem]"
                        text="WorkSpace"
                     />
                     <br />
                  </h1>
                  <p className="font-normal text-base text-neutral-700 max-w-3xl mx-auto">
                     This website is designed to provide a seamless and
                     efficient platform for collaboration, productivity, and
                     innovation. Whether you&apos;re managing projects, sharing
                     ideas, or organizing tasks, WorkSpace offers intuitive
                     tools and features to streamline your workflow and connect
                     with your team in real-time. Join us to transform the way
                     you work and unlock your full potential!
                  </p>
               </div>
            </div>

            <Particles
               className="absolute inset-0 z-0"
               quantity={100}
               ease={80}
               color={color}
               refresh
            />
         </div>
      </div>
   );
}
