"use client";
import LoginForm from "@/components/form/login";
import RegisterForm from "@/components/form/register";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
   return (
      <div>
         {/* <Header /> */}
         <div className="flex items-center justify-center mt-[75px]">
            <Tabs defaultValue="login" className="w-[400px]">
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
      </div>
   );
}
