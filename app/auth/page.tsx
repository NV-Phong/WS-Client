"use client";
import LoginForm from "@/components/form/login";
import RegisterForm from "@/components/form/register";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StickyNote from "@/components/ui-engineer/sticky-note";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Auth() {
   const [currentTab, setCurrentTab] = useState("login");

   return (
      <div className="relative">
         {/* <Header /> */}
         <div className="flex items-center justify-center mt-[75px]">
            <Tabs defaultValue="login" className="w-[400px]" onValueChange={setCurrentTab}>
               <div className="flex justify-center">
                  {/* <TabsList className="grid w-full grid-cols-2 mb-3"> */}
                  <TabsList className="">
                     <TabsTrigger value="login" className="text-[#FF9999]">LOGIN</TabsTrigger>
                     <TabsTrigger value="register" className="text-[#FF9999]">REGISTER</TabsTrigger>
                  </TabsList>
               </div>
               <LoginForm />
               <RegisterForm />
            </Tabs>
         </div>

         {/* Decorative Sticky Notes */}
         <AnimatePresence mode="wait">
            <StickyNote
               key="welcome"
               text="Chào mừng bạn đến với hệ thống! Hãy đăng nhập hoặc đăng ký để bắt đầu."
               date="Welcome"
               timeAgo="Just now"
               initialX={50}
               initialY={-500}
               rotation={-8}
               zIndex={1}
               animation="flyIn"
            />
         </AnimatePresence>
         
         {/* <StickyNote
            text="Đăng ký ngay để nhận được nhiều ưu đãi hấp dẫn và trải nghiệm đầy đủ tính năng của hệ thống."
            date="Register"
            timeAgo="2 mins ago"
            initialX={200}
            initialY={-400}
            rotation={5}
            zIndex={2}
         /> */}

         {/* Notes chỉ hiển thị khi ở tab Login */}
         <AnimatePresence mode="wait">
            {currentTab === "login" && (
               <StickyNote
                  key="login"
                  text="Đăng nhập để truy cập tài khoản của bạn và quản lý không gian làm việc của bạn một cách hiệu quả."
                  date="Login Note"
                  timeAgo="Just now"
                  initialX={200}
                  initialY={-350}
                  rotation={5}
                  zIndex={2}
                  animation="flyIn"
               />
            )}
         </AnimatePresence>

         <AnimatePresence mode="wait">
            {/* Notes chỉ hiển thị khi ở tab Register */}
            {currentTab === "register" && (
               <StickyNote
                  key="register"
                  text="Tạo tài khoản mới để bắt đầu hành trình của bạn với chúng tôi."
                  date="New Account"
                  timeAgo="Just now"
                  initialX={200}
                  initialY={-350}
                  rotation={-3}
                  zIndex={3}
                  animation="flyIn"
               />
            )}
         </AnimatePresence>
      </div>
   );
}
