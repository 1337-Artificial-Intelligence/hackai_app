// import Image from "next/image";
import React from "react";
import { Timeline } from "./ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Thursday 16 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">17:00 Check-in</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">18:30 Opening Keynote</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">20:00 Campus tour</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">21:00 Animation</p>
        </div>
      ),
    },
    {
      title: "Friday 17 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">10:00 AI Conference - Aicha Karite</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">11:00 Coffee break & Networking session</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">11:30 AI Conference - Soufiane Hayou</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:30 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:15 Presentation of challenges</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:45 Training & cluster initialization</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">16:45 Start hacking</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
        </div>
      ),
    },
    {
      title: "Saturday 18 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">08:00 Evaluation</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:00 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">19:00 Dinner</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">20:00 Evaluation</p>
        </div>
      ),
    },
    {
      title: "Sunday 19 May",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">07:00 Breakfast</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">08:00 Submitting final report</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">09:15 Judging</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">12:00 Lunch</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">13:00 AI Conference - Amine Mohamed ABOUSSALAH</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">14:00 Coffee Break & Networking Session</p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm md:text-base font-normal mb-6 sm:mb-8">15:00 Distribution of awards</p>
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
