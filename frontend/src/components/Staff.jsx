import React, { useMemo } from "react";
import TeamMember from "./sub-components/TeamMember";
import MembersSection from "./sub-components/MembersSection";

const avatars = [
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png",
  "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png",
];

export default function Staff() {
  const getRandomImage = () =>
    avatars[Math.floor(Math.random() * avatars.length)];

  const speakers = useMemo(
    () => [
      [getRandomImage(), "Achraf Mamdouh", "SWE Google"],
    ],
    []
  );
  
  const jury = useMemo(
    () => [
      [getRandomImage(), "Achraf Mamdouh", "SWE Google"],
    ],
    []
  );
  
  const mentors = useMemo(
    () => [
      ["/assets/profiles/1337ai/amoujar.jpg", "Abderrahmane Moujar", "Technical Program Chair"],
      [getRandomImage(), "Achraf Mamdouh", "SWE Google"],
      ["/assets/profiles/1337ai/mel-kora.jpg", "Mounia El Koraichi", "Sponsorship Director"],
      ["/assets/profiles/1337ai/jchennak.jpg", "Jawaher Chennak", "Operations Manager"],
      ["/assets/profiles/extern/nouamane.jpeg", "Nouamane Tazi", "ML engineer @ Hugging Face"],
    ],
    []
  );
  
  const organizers = useMemo(
    () => [
      ['/assets/profiles/1337ai/aabouelm.jpg', "Ahmed Abouelmawahib", "Student Activities Coordinator @ 1337"],
      ["/assets/profiles/1337ai/amoujar.jpg", "Abderrahmane Moujar", "Technical Program Chair"],
      ["/assets/profiles/1337ai/mel-kora.jpg", "Mounia El Koraichi", "Sponsorship Director"],
      ["/assets/profiles/1337ai/kbenlyaz.jpg", "Khalid Benlyazid", "Volunteer Coordinator"],
      ["/assets/profiles/1337ai/jchennak.jpg", "Jawaher Chennak", "Operations Manager"],
      ["/assets/profiles/1337ai/issam.jpeg", "Issam laafar", "Operations Manager"],
      ["/assets/profiles/1337ai/mossaab.jpeg", "Mossaab amimar", "Operations Manager"],
      ["/assets/profiles/1337ai/yahya.jpeg", "Yahya ICHAKDI", "Academic Relations"],
      ["/assets/profiles/extern/nouamane.jpeg", "Nouamane Tazi", "Communications Lead"],
      [getRandomImage(), "Noureddine tahadout", "Communications Lead"],
      ["/assets/profiles/1337ai/hbarrak.jpeg", "Hamza Barrak", "Industry Relations"],
    ],
    []
  );

  return (
    <section className="bg-white dark:bg-black/50">
      {/* Speakers Section */}
      <MembersSection title="Speakers">
        {/* to be announced soon */}
        <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
          🎉 Speakers to be announced soon! Stay tuned for exciting updates. 🎤
        </p>

        {/* {speakers.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))} */}
      </MembersSection>

      {/* Jury Section */}
      <MembersSection title="Jury">
        {/* {jury.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))} */}
        <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
          🎉 Jury to be announced soon! Stay tuned for exciting updates. 👨‍⚖️
        </p>
      </MembersSection>

      {/* Mentors Section */}
      <MembersSection title="Mentors">
        {/* {mentors.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))} */}
        <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
          🎉 Mentors to be announced soon! Stay tuned for exciting updates. 👨‍🏫
        </p>
      </MembersSection>

      {/* Organizers Section */}
      <MembersSection title="Organizers">
        {/* {organizers.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
          ))} */}
        <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto">
          🎉 Mentors to be announced soon! Stay tuned for exciting updates. 👨 

        </p>
      </MembersSection>
    </section>
  );
}
