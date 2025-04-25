import React from "react";
import { LampDemo } from "../components/ui/lamp";
import { Cover } from "../components/ui/cover";
import { TextHoverEffect } from "../components/ui/text-hover-effect";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import FAQ from "../components/Faq";
import { TimelineDemo } from "../components/TimelineComponent";
import { AuroraBackground } from "../components/ui/aurora-background";
import { BackgroundLines } from "../components/ui/background-lines";
import { BackgroundBeams } from "../components/ui/background-beams";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import BrandsCarousel from "../components/Brands";
import ContactUs from "../components/ContactUs";

import Staff from "../components/Staff";
import Prizes from "../components/Prizes";

export default function Home() {
  const testimonials = [
    {
      quote:
        "The hackathon was great. Everyone did a great job from the organizing students to the participants. I hope it would be organized again in the future",
      name: "-- Mustapha Ajeghrir",
      title: "AI Researcher @ Hrflow.ai",
    },
    {
      quote:
        "Nothing but all of u guys were incredible human being loving supporting and inspiring. Thank you all from the bottom of my heart.",
      name: "Participant",
      title: "",
    },
    {
      quote:
        "I was really impressed, you guys took care of every details, we felt like we are home.",
      name: "Participant",
      title: "",
    },
    {
      quote:
        "The event was exceptionally well-organized, providing a seamless and enjoyable experience for us I enjoyed meeting interesting people i really loved the experience .",
      name: "Participant",
      title: "",
    },
    {
      quote:
        "The mentors were very helpful and available 24/7 to answer all of our questions. Thanking them won't be enough compared to the efforts they've put in.",
      name: "Participant",
      title: "",
    },
  ];
  const words = `Hack AI Morocco 2025: Unleashing Innovation and Creativity in a 4-Day Hackathon!`;
  return (
    <div className="dark bg-black pb-10 md:px-6 px-3 ">
      <nav className="bg-black  w-full  py-3 flex justify-between relative z-10 top-0 items-center">
        <div className="max-w-7xl w-full  mx-auto flex justify-between items-center">
          <img src="/assets/logo_l.png" className="md:w-48 w-36" alt="" />

          <Link
            // open this https://forms.gle/oBn1QXJRXZ7b33wPA in new tab
            to="https://forms.gle/oBn1QXJRXZ7b33wPA"
            target="_blank"
            className="inline-flex md:h-12 h-9 animate-shimmer items-center cursor-pointer justify-center rounded-md border border-white bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Login
          </Link>
        </div>
      </nav>
      <div className="min-h-screen max-w-7xl w-full z-[9000] mx-auto px-3 flex flex-col justify-center items-center">
        <div className="w-full font-extrabold relative z-10 -mt-36">
          <TextHoverEffect text="HACK AI" />
        </div>
        <div className="md:px-10  relative z-10 lg:-mt-24 md:-mt-16  -mt-10  px-1   texr-center">
          <TextGenerateEffect className="text-center z-[9000]" words={words} />;
        </div>
        <div className="w-full flex relative z-10 justify-center items-center">
          <Link
            // to="/sign"
            to="https://forms.gle/oBn1QXJRXZ7b33wPA"
            target="_blank"
            className="inline-flex h-12 animate-shimmer items-center cursor-pointer justify-center rounded-md border border-white bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Login
          </Link>
        </div>
      </div>
      <BackgroundBeams />
      {/* </BackgroundLines> */}
      <div className="overflow-x-hidden max-w-7xl w-full mx-auto px-3 Testimonies flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} // Triggers when 20% is visible
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          What is Hack AI Morocco?
        </h1>
        {/* <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"> */}
        <p className="text-gray-200 mt-10 md:p-6 p-2 md:text-lg text-base">
          <span className="font-extrabold">Hack AI Morocco</span> is a{" "}
          <span className="font-extrabold">
            4-Days AI hackathon like no other{" "}
          </span>
          Students from all over Morocco will come together for a unique
          experience full of unexpected challenges surprises, and learning. You
          won’t know what’s coming next—but that’s the fun part. Get ready to
          think fast, work smart, and push your limits!
        </p>

        {/* , surprises, and learning. You won’t know what’s coming next—but that’s the fun part. Get ready to think fast, work smart, and push your limits! */}

        {/* </div> */}
      </div>

      <div className=" md:p-6 p-2 overflow-x-hidden  max-w-7xl w-full mx-auto px-3 Testimonies mt-64 flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl  font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} // Triggers when 20% is visible
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Announcement
          </h1>
          
          <div className="mt-6 w-full flex justify-center">
            <iframe
            className="w-full max-w-4xl aspect-video rounded-lg"
            src="https://player.vimeo.com/video/1078694431?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            title="HACK AI 2025"
            ></iframe>
          </div>
          </div>

          <div className="md:p-6 p-2 overflow-x-hidden Testimonies mt-64 w-full flex flex-col justify-center items-center">
          <h1
            className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} // Triggers when 20% is visible
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          2025 Planning
        </h1>
      </div>
      <div className="mt-10 w-full">
        <TimelineDemo />
      </div>

      <div className="Testimonies 10 max-w-7xl w-full mx-auto px-3 flex flex-col justify-center items-center">
        <div className="w-full mt-10">
          <Staff />
        </div>
      </div>

      <div className="overflow-x-hidden Testimonies mt-64 w-full flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Testimonies
        </h1>
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          className="mt-10"
        />
      </div>

      <div className="h-[20rem] mt-64 w-full flex-col dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <p className="text-xl !text-white text-center max-w-7xl w-full mx-auto px-3 md:p-6 p-3 font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Unlock your potential at Hack AI – where bold ideas and cutting-edge
          innovation converge to shape the future of technology.
        </p>
        <Link
          // to="/sign"
          to="https://forms.gle/oBn1QXJRXZ7b33wPA"
          target="_blank"
          className="shadow-[0_0_0_3px_#000000_inset] bg-white px-6 py-2 bg-transparent border border-black dark:border-white dark:text-black text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
        >
          Login
        </Link>
      </div>

      <div className="Testimonies mt-64 max-w-7xl w-full mx-auto px-2 flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl  underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Official Partners
        </h1>
        <div className="w-full mt-10">
          <BrandsCarousel />
        </div>
      </div>

      <div className="Testimonies mt-64 max-w-7xl w-full mx-auto px-2 flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl  underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Prizes
        </h1>
        <div className="w-full mt-10">
          <Prizes />
        </div>
      </div>

      <div className="Testimonies mt-64 max-w-7xl w-full mx-auto px-2 flex flex-col justify-center items-center">
        <h1
          className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          FAQ
        </h1>
        {/* <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"> */}

        <div className="mt-10 w-full">
          <FAQ />
        </div>
      </div>

      <div className="Testimonies mt-64 max-w-7xl w-full mx-auto px-2 flex flex-col justify-center items-center ">
        <h1
          className="text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} // Triggers when 20% is visible
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Contact Us
        </h1>
        <p className="text-white mt-3 w-full text-center text-lg font-bold">
          {" "}
          Do you have any questions? Do not hesitate to contact us.
        </p>
        {/* <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"> */}
        <div className="w-full mt-10">
          <ContactUs />
        </div>
      </div>
      <div className="footer mt-64 max-w-7xl w-full mx-auto px-2 flex flex-col justify-center items-center">
        <Footer />
      </div>
    </div>
  );
}
