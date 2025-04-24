import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
export default function ContactUs() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Card className="darkp text-white flex flex-col border-none justify-start  bg-black  w-full">
      {/* <CardHeader className="mx-auto text-center">
        <CardTitle className="text-white text-2xl">
          Login to your accont
        </CardTitle>
        <CardDescription className="text-lg">
          Do you have any questions? Do not hesitate to contact us.
        </CardDescription>
      </CardHeader> */}
      <CardContent>
        <form
          id="contact-form"
          action="https://formsubmit.co/contact@1337AI.org"
          method="POST"
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="full_Name"
                className="mt-4 font-extrabold text-lg"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="h-14 focus:outline-4 focus:outline-white focus:ring-4 focus:ring-white"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="subject" className="mt-4 font-extrabold text-lg">
                Subject
              </Label>
              <Input
                id="subject"
                className="h-14 focus:outline-4 focus:outline-white focus:ring-4 focus:ring-white"
                placeholder="Subject"
              />
            </div>
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="Message" className="mt-4 font-extrabold text-lg">
                Message
              </Label>
              <Textarea
                id="Message"
                className="h-28 focus:outline-4 focus:outline-white focus:ring-4 focus:ring-white"
                placeholder="Message"
              />
            </div>
          </div>
          <CardFooter className="flex justify-start gap-2">
            <Button
              type="submit"
              id="submit"
              variant="outline"
              className="hover:text-black text-white bg-black hover:bg-white font-bold"
            >
              Submit
            </Button>
            {/* <Button className="bg-red-500  text-white font-extrabold">
      Cancel
      </Button> */}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
