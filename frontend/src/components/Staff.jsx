import React, { useMemo } from "react";
import TeamMember from "./sub-components/TeamMember";

const avatars = [
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png"
];

export default function Staff() {
  const getRandomImage = () => avatars[Math.floor(Math.random() * avatars.length)];

  const speakers = useMemo(() => [
    [getRandomImage(), "Dr. Kevin Anderson", "ML Engineering Lead, Amazon"],
    [getRandomImage(), "Sophie Lee", "NLP Specialist, OpenAI"],
    [getRandomImage(), "Dr. Thomas Wright", "Research Director, Meta AI"],
  ], []);

  const jury = useMemo(() => [
    [getRandomImage(), "Dr. Kevin Anderson", "ML Engineering Lead, Amazon"],
    [getRandomImage(), "Sophie Lee", "NLP Specialist, OpenAI"],
    [getRandomImage(), "Dr. Thomas Wright", "Research Director, Meta AI"],
    [getRandomImage(), "Maria Garcia", "AI Ethics Consultant"],
    [getRandomImage(), "David Kim", "Computer Vision Expert, NVIDIA"],
  ], []);

  const mentors = useMemo(() => [
    [getRandomImage(), "Dr. Kevin Anderson", "ML Engineering Lead, Amazon"],
    [getRandomImage(), "Sophie Lee", "NLP Specialist, OpenAI"],
    [getRandomImage(), "Dr. Thomas Wright", "Research Director, Meta AI"],
    [getRandomImage(), "Maria Garcia", "AI Ethics Consultant"],
    [getRandomImage(), "David Kim", "Computer Vision Expert, NVIDIA"],
    [getRandomImage(), "Jennifer Taylor", "ML Operations Lead, Apple"],
    [getRandomImage(), "Dr. Ahmed Hassan", "Robotics Researcher, ETH Zurich"],
    [getRandomImage(), "Rachel Cohen", "AI Safety Specialist"],
    [getRandomImage(), "Dr. Alex Turner", "Reinforcement Learning Expert"],
    [getRandomImage(), "Nina Patel", "ML Infrastructure Lead, Twitter"],
    [getRandomImage(), "Dr. Marcus Silva", "AI Research Lead, DeepMind"],
    [getRandomImage(), "Laura Chen", "ML Platform Architect, Netflix"],
    [getRandomImage(), "Dr. James Wilson", "AI Governance Expert"],
    [getRandomImage(), "Sarah Thompson", "Computer Vision Researcher"],
    [getRandomImage(), "Dr. Michael Lee", "Quantum ML Specialist"],
  ], []);

  const organizers = useMemo(() => [
    [getRandomImage(), "Emily Chen", "Conference Chair"],
    [getRandomImage(), "Dr. John Smith", "Technical Program Chair"],
    [getRandomImage(), "Michelle Wong", "Sponsorship Director"],
    [getRandomImage(), "Daniel Park", "Operations Manager"],
    [getRandomImage(), "Anna Lopez", "Communications Lead"],
    [getRandomImage(), "Ryan Taylor", "Volunteer Coordinator"],
    [getRandomImage(), "Dr. Lisa Brown", "Academic Relations"],
    [getRandomImage(), "Mark Johnson", "Industry Relations"],
    [getRandomImage(), "Sarah Kim", "Event Logistics"],
    [getRandomImage(), "Chris Anderson", "Marketing Director"],
    [getRandomImage(), "Jessica Lee", "Registration Lead"],
    [getRandomImage(), "Michael Zhang", "Technical Support"],
    [getRandomImage(), "Amanda White", "Community Manager"],
    [getRandomImage(), "David Chen", "Security Coordinator"],
    [getRandomImage(), "Patricia Rodriguez", "Social Media Manager"],
    [getRandomImage(), "Thomas Lee", "Website Administrator"],
    [getRandomImage(), "Karen Wu", "Finance Director"],
    [getRandomImage(), "Robert Kim", "Documentation Lead"],
    [getRandomImage(), "Maria Santos", "Accessibility Coordinator"],
    [getRandomImage(), "James Wilson", "Workshop Coordinator"],
    [getRandomImage(), "Sophie Chen", "Student Outreach"],
    [getRandomImage(), "Alex Thompson", "Equipment Manager"],
  ], []);

  return (
    <section className="bg-white dark:bg-black/50">
      {/* Speakers Section */}
      <div className="my-8  mx-auto  rounded-md w-full lg:my-10 dark:bg-neutral-950 py-7">
        <div className="mx-auto mb-8 w-full lg:mb-16">
          <h2 className="mb-4 text-4xl text-center w-full tracking-tight font-extrabold text-gray-900 dark:text-white">
            Speakers
          </h2>
        </div>
        <div className="grid gap-8 lg:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {speakers.map(([img, name, role]) => (
            <TeamMember key={name} img={img} name={name} role={role} />
          ))}
        </div>
      </div>

      {/* Jury Section */}
      <div className="my-8  mx-auto  rounded-md w-full lg:my-10 dark:bg-neutral-950 py-7">
        <div className="mx-auto mb-8 w-full lg:mb-16">
          <h2 className="mb-4 text-4xl text-center w-full tracking-tight font-extrabold text-gray-900 dark:text-white">
            Jury
          </h2>
        </div>
        <div className="grid gap-8 lg:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {jury.map(([img, name, role]) => (
            <TeamMember key={name} img={img} name={name} role={role} />
          ))}
        </div>
      </div>

      {/* Mentors Section */}
      <div className="my-8  mx-auto  rounded-md w-full lg:my-10 dark:bg-neutral-950 py-7">
        <div className="mx-auto mb-8 w-full lg:mb-16">
          <h2 className="mb-4 text-4xl text-center w-full tracking-tight font-extrabold text-gray-900 dark:text-white">
            Mentors
          </h2>
        </div>
        <div className="grid gap-8 lg:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mentors.map(([img, name, role]) => (
            <TeamMember key={name} img={img} name={name} role={role} />
          ))}
        </div>
      </div>

      {/* Organizers Section */}
      <div className="my-8  mx-auto  rounded-md w-full lg:my-10 dark:bg-neutral-950 py-7">
        <div className="mx-auto mb-8 w-full lg:mb-16">
          <h2 className="mb-4 text-4xl text-center w-full tracking-tight font-extrabold text-gray-900 dark:text-white">
            Organizers
          </h2>
        </div>
        <div className="grid gap-8 lg:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {organizers.map(([img, name, role]) => (
            <TeamMember key={name} img={img} name={name} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}