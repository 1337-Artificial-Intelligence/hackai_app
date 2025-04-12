import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b max-w-7xl w-full mx-auto border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-extrabold  text-white">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-100 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-gray-400">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Is it free?",
      answer: "Yes, applying and competing in the hackathon is free.",
    },
    {
      question: "Food ?",
      answer: "Breakfast/Lunch/Dinner",
    },
    {
      question: "Lodging?",
      answer: "Free at UM6P",
    },
    {
      question: "Skills needed?",
      answer:
        "Bac +4 in AI related degrees and having worked on AI projects before.",
    },
    {
      question: "When will I be contacted?",
      answer: "On May 8th, you'll be contacted by email.",
    },
    {
      question: "Will I need my laptop?",
      answer: "You will be given access to workstations, but we recommend that you also bring your PC.",
    },
  ];

  return (
    <div className="mx-auto p-4 w-full  py-8">
      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
