import BoxReveal from "@/components/magicui/box-reveal";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useAuth } from "@/hooks/auth/use-auth";
// import { useRegister } from "@/hooks/auth/use-register";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

export default function RegisterForm() {
   // const { isSubmitting, handleCancel } = useAuth();
   // const {
   //    username,
   //    password,
   //    email,
   //    displayName,
   //    setUserName,
   //    setPassword,
   //    setEmail,
   //    setDisplayName,
   //    handleRegister,
   // } = useRegister();
   return (
      <form
      // onSubmit={handleRegister}
      >
         <TabsContent value="register">
            {/* <Card className="shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg"> */}
            <Card className="bg-background shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg">
               <CardHeader>
                  <BoxReveal boxColor={"#FF9999"} duration={0.3}>
                     <CardTitle className="mb-1 text-xl text-[#FF9999]">REGISTER</CardTitle>
                  </BoxReveal>
                  <BoxReveal boxColor={"#FF9999"} duration={0.3}>
                     <CardDescription>
                        Create Your Account to Unleash Your Dreams
                     </CardDescription>
                  </BoxReveal>
               </CardHeader>
               <CardContent className="space-y-5">
                  <div className="space-y-1">
                     <Label htmlFor="username">UserName</Label>
                     <Input
                        className="text-sm"
                        // value={username}
                        // onChange={(event) => setUserName(event.target.value)}
                        placeholder="Enter Your UserName"
                     />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        className="text-sm"
                        type="email"
                        // value={email}
                        // onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter Your Email"
                     />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        className="text-sm"
                        type="password"
                        // value={password}
                        // onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter Your Password"
                     />
                  </div>
                  <div className="space-y-1">
                     <Label htmlFor="displayname">Display Name</Label>
                     <Input
                        className="text-sm"
                        type="text"
                        // value={displayName}
                        // onChange={(event) => setDisplayName(event.target.value)}
                        placeholder="Enter Your Display name"
                     />
                  </div>
               </CardContent>
               <CardFooter className="align justify-between">
                  <Button
                     className="w-2/5"
                     variant="outline"
                     type="button"
                     // onClick={handleCancel}
                  >
                     Cancel
                  </Button>
                  <Button
                     className="w-2/5"
                     type="submit"
                     // disabled={isSubmitting}
                  >
                     Register
                  </Button>
               </CardFooter>
            </Card>
         </TabsContent>
      </form>
   );
}
