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
    <Card className="darkp text-white flex flex-col border-none justify-start bg-black w-full">
      <CardHeader className="mx-auto text-center">
        <CardTitle className="text-white text-2xl"></CardTitle>
        <CardDescription className="text-lg"></CardDescription>
      </CardHeader>
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
              <input
                type="email"
                className="h-14 bg-black text-white border border-gray-700 rounded-lg px-4 focus:outline-none focus:ring-4 focus:ring-white"
                name="email"
                placeholder="Email Address"
                required
              ></input>
            </div>
            <div className="flex flex-col space-y-1.5 relative">
              <Label
                htmlFor="Full_Name"
                className="mt-4 font-extrabold text-lg"
              >
                Full Name
              </Label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="h-14 bg-black text-white border border-gray-700 rounded-lg px-4 focus:outline-none focus:ring-4 focus:ring-white"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5 relative">
              <Label htmlFor="Message" className="mt-4 font-extrabold text-lg">
                Message
              </Label>
              <textarea
                placeholder="Your Message"
                className="h-28 bg-black text-white border border-gray-700 rounded-lg px-4 focus:outline-none focus:ring-4 focus:ring-white"
                name="message"
                rows="10"
                required
              ></textarea>
            </div>
          </div>
          <CardFooter className="flex justify-start gap-2 mt-4">
            <Button
              type="submit"
              id="submit"
              variant="outline"
              className="hover:text-black text-white bg-black hover:bg-white font-bold"
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
