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
      [
        "/assets/profiles/speakers/achraf.jpeg",
        "Achraf Mamdouh",
        "Senior Software Engineer @ Google",
      ],
      [
        "/assets/profiles/speakers/jawad.jpeg",
        "Jawad Alaoui",
        "Software Engineer and CEO @ Norma",
      ],
      [
        "/assets/profiles/speakers/mehdi.png",
        "Mehdi Bennani",
        "Research Engineer @ Google DeepMind",
      ],
    ],
    []
  );

  const jury = useMemo(
    () => [
      [
        "/assets/profiles/extern/sara.jpeg",
        "Sara El-Ateif",
        "AI Google Developer Expert / Assistant Professor @ ENSIASDT",
      ],
      [
        "/assets/profiles/speakers/jawad.jpeg",
        "Jawad Alaoui",
        "Software Engineer and CEO @ Norma",
      ],
    ],
    []
  );

  const mentors = useMemo(
    () => [
      [
        "/assets/profiles/1337ai/otman.png",
        "Otmane El Bourki",
        "AI Engineer @ Impactera ",
      ],
        
      [
        "/assets/profiles/1337ai/jawaher.png",
        "Jawaher chennak",
        "1337 student / Ai engineer / Phd student @ UM5",
      ],
      [
        "/assets/profiles/extern/khadija.png",
        "Khadija Bayoud",
        "Data Scientist @ ToumAI Analytics",
      ],
      [
        "/assets/profiles/extern/nouamane.jpeg",
        "Nouamane Tazi",
        "ML engineer @ Hugging Face",
      ],
      [
        "/assets/profiles/1337ai/kbenlyaz.jpg",
        "Khalid Benlyazid",
        "1337 student / AI engineer @ AI Exploration LAB",
      ],
      [
        "/assets/profiles/extern/makourri.png",
        "Mohamed Mekkouri",
        "Machine Learning Engineer @ Hugging Face",
      ],
      [
        "/assets/profiles/extern/affaf.png",
        "Afaf El Wafi",
        "Data Scientist @ MP DATA",
      ],
      [
        "/assets/profiles/1337ai/moujar.jpeg",
        "Abderrahmane Moujar",
        "Research Engineer @ AI Exploration LAB",
      ],
      [
        "/assets/profiles/extern/kawtar.jpeg",
        "kawtar zerhouni",
        "Research Developer @ Leyton",
      ],
      [
        "/assets/profiles/1337ai/mounia.png",
        "Mounia El Koraichi",
        "1337 student / Data scientist @ UM6P",
      ],
      [
        "/assets/profiles/extern/ihssan.png",
        "Ihssane Nedjoui",
        "Software Engineering and AI student @ ENSA",
      ],
      [
        "/assets/profiles/extern/yassir.png",
        "Yassir Bendou",
        "Research scientist @ Sigma Nova",
      ],
      [
        "/assets/profiles/extern/imane.png",
        "Imane Momayiz",
        "Senior Data Scientist - Cofounder @AtlasIA",
      ],
      [
        "/assets/profiles/extern/m_aymen.png",
        "Mohamed Aymane Farhi",
        "NLP Engineer @ Clear Global",
      ],
      [
        "/assets/profiles/extern/yassine.png",
        "Yassine El Kheir",
        "PhD Student - Speech ML Researcher @ DFKI",
      ],
      [
        "/assets/profiles/extern/abdeljalil_.png",
        "Abdeljalil Elmajjodi",
        "ML Engineer @ AtlasIA",
      ],
    ],
    []
  );

  const organizers = useMemo(
    () => [
      [
        "/assets/profiles/extern/khawela.png",
        "Khaoula Alaoui Belghiti",
        "PhD Student @ ESI",
      ],
      [
        "/assets/profiles/1337ai/aabouelm.jpg",
        "Ahmed Abouelmawahib",
        "Student Activities Coordinator @ 1337",
      ],
      [
        "/assets/profiles/1337ai/moujar.jpeg",
        "Abderrahmane Moujar",
        "Research Engineer @ AI Exploration LAB",
      ],
      [
        "/assets/profiles/1337ai/mounia.png",
        "Mounia El Koraichi",
        "1337 student / Data scientist @ UM6P",
      ],
      [
        "/assets/profiles/1337ai/kbenlyaz.jpg",
        "Khalid Benlyazid",
        "1337 student / AI engineer @ AI Exploration LAB",
      ],
      [
        "/assets/profiles/1337ai/jawaher.png",
        "Jawaher chennak",
        "1337 student / Ai engineer / Phd student @ UM5",
      ],
      [
        "/assets/profiles/1337ai/issam.jpeg",
        "Issam laafar",
        "Frontend Developer / student @ 1337",
      ],
      [
        "/assets/profiles/1337ai/mossaab.jpeg",
        "Mossaab amimar",
        "Full Stack Developer / student @ 1337",
      ],
      [
        "/assets/profiles/1337ai/imran.jpg",
        "Imran Baali",
        "Frontend Developer / student @ 1337",
      ],
      [
        "/assets/profiles/1337ai/yahya.jpeg",
        "Yahya ICHAKDI",
        "Academic Relations @ Um6p SOLE",
      ],
      [
        "/assets/profiles/extern/nouamane.jpeg",
        "Nouamane Tazi",
        "ML engineer @ Hugging Face",
      ],
      [
        "/assets/profiles/1337ai/hbarrak.jpeg",
        "Hamza Barrak",
        "Student @ 1337",
      ],
      [
        "/assets/profiles/1337ai/noureddin.png",
        "Noureddine tahadout",
        "Designer / Student @ 1337",
      ],
      [
        "/assets/profiles/extern/ihssan.png",
        "Ihssane Nedjoui",
        "Software Engineering and AI student @ ENSA",
      ],
      [
        "/assets/profiles/extern/abdeljalil_.png",
        "Abdeljalil Elmajjodi",
        "ML Engineer @ AtlasIA",
      ],
    ],
    []
  );

  // className="Headline text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
  // initial={{ opacity: 0, y: 50 }}
  // whileInView={{ opacity: 1, y: 0 }}
  // viewport={{ once: true, amount: 0.2 }}
  // transition={{ duration: 0.8, ease: "easeOut" }}

  return (
    <section className="bg-white dark:bg-black/50">
      <MembersSection
        title={
          <div className="overflow-x-hidden Testimonies mt-16 w-full flex flex-col justify-center items-center">
            <h1
              className="Headline text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Speakers
            </h1>
          </div>
        }
      >
        {speakers.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))}
      </MembersSection>

      {/* Jury Section */}
      <MembersSection
        title={
          <div className="overflow-x-hidden Testimonies mt-16 w-full flex flex-col justify-center items-center">
            <h1
              className="Headline text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Jury
            </h1>
          </div>
        }
      >
        {/* <p className="text-gray-200 text-lg lg:text-xl font-medium max-w-2xl mx-auto"></p> */}
        {jury.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))}
      </MembersSection>

      {/* Mentors Section */}
      <MembersSection
        title={
          <div className="overflow-x-hidden Testimonies mt-16 w-full flex flex-col justify-center items-center">
            <h1
              className="Headline text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Mentors
            </h1>
          </div>
        }
      >
        {mentors.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))}
      </MembersSection>

      {/* Organizers Section */}
      <MembersSection
        title={
          <div className="overflow-x-hidden Testimonies mt-16 w-full flex flex-col justify-center items-center">
            <h1
              className="Headline text-3xl sm:text-4xl underline-offset-8 md:text-5xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-200 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Organizers
            </h1>
          </div>
        }
      >
        {organizers.map(([img, name, role]) => (
          <TeamMember key={name} img={img} name={name} role={role} />
        ))}
      </MembersSection>
    </section>
  );
}
