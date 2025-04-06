import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GradientBackground from "@/components/ui-engineer/gradient-background";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProvider } from "@/components/context/navigation-context"
import { ToastProvider } from "@/contexts/toast-context";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
   title: "WorkSpace",
   description: "Generated by NV-Phong",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
         className="scrollbar-hide selection:bg"
      >
         <body>
            <NavigationProvider>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="pastel-pink"
                  enableSystem
                  disableTransitionOnChange
                  themes={["light", "dark", "pastel-pink"]}
               >
                  <ToastProvider>
                     {children}
                  </ToastProvider>
                  <SpeedInsights />
                  <Analytics />
                  {/* <Navbar /> */}
                  <GradientBackground/>
                  <Toaster />
                  {/* <ModeToggle /> */}
               </ThemeProvider>            
            </NavigationProvider>
         </body>
      </html>
   );
}
