"use client";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import Particles from "@/components/magicui/particles";
import StickyNotes from "@/components/ui-engineer/sticky-notes";
import GradientBackground from "@/components/ui-engineer/gradient-background";
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
         <GradientBackground />
         
         <div className="relative z-10 flex items-center justify-center min-h-screen">
            <Spotlight />
            <StickyNotes />
            
            {/* <ModeToggle /> */}

            <div className="flex flex-col items-center justify-center">
               <div className="mb-9 max-w-7xl mx-auto w-full pt-20 md:pt-0 text-center">
                  <h1 className="h-40 text-xl md:text-5xl font-bold text-neutral-800">
                     Hi there ! I&apos;m
                     <GradualSpacing
                        className="font-display text-center text-5xl font-bold -tracking-widest text-neutral-900 md:text-7xl md:leading-[5rem]"
                        text="WorkSpace"
                     />
                     <br />
                  </h1>
                  <p className="font-normal text-base text-neutral-700 max-w-3xl mx-auto">
                     I&apos;m on a journey to become a Full-Stack developer.
                     With my knowledge of UI/UX design. I enjoy solving
                     Front-End problems and creating the best user experience
                     for users. I also spend time learning new technologies and
                     best practices to become a better engineer. I like to learn
                     about process automation or applying AI to improve work
                     productivity.
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
