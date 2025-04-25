// import Image from "next/image";
import React from "react";
import { Timeline } from "./ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Tuesday 22 May 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">17:00 Check-in</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">20:00 Campus tour</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">21:00 Coffee break & Animation</p>
        </div>
      ),
    },
    {
      title: "Friday 23 May 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">09:00 Opening keynote</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">09:30 AI Conference</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">10:30 Coffee break & Networking session</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">11:00 AI Conference 2</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:00 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:15 Presentation of challenges</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">16:00 Start hacking</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
        </div>
      ),
    },
    {
      title: "Saturday 24 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">08:00 Evaluation</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:00 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">22:00 Submitting final report</p>
        </div>
      ),
    },
    {
      title: "Sunday 25 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">09:15 Judging</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:00 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">14:00 Coffee Break & Networking Session</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:00 Distribution of awards</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:45 Coffee break</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">End of the Hackathon</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-10">
      <Timeline data={data} />
    </div>
  );
}
