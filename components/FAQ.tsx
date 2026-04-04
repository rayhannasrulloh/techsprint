"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TextReveal } from "./TextReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is 3IN1 Tech Sprint?",
    answer: "3IN1 Tech Sprint is an intensive 2-day innovation competition focused on developing sustainable technological solutions for real-world problems. We feature three main tracks: UI/UX, Data Automation, and System Analyst.",
  },
  {
    question: "Who can participate in this event?",
    answer: "This event is open to active university and high school students with an interest in technology, design, system analysis, and data automation. You can register as a team of 3 members.",
  },
  {
    question: "Is there a registration fee?",
    answer: "There are specific registration periods. Please stay tuned to our registration announcements to learn about early bird periods and special pricing for early registrations.",
  },
  {
    question: "How do I register as a participant?",
    answer: "You can register via the 'Register' button on the homepage of this website. Ensure you have prepared your personal and team member details before filling out the form.",
  },
  {
    question: "Do participants need prior IT experience?",
    answer: "It is not mandatory, but basic experience will be very helpful. This competition is also a great place to learn and hone your skills hands-on with your teammates.",
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow for FAQ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-widest text-gray-300 uppercase flex items-center justify-center gap-3">
            <TextReveal text="FAQ" />
          </h2>
          <p className="text-gray-400 font-light mt-4">
            Find answers to frequently asked questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${openIndex === index ? "bg-white/[0.04] border-blue-500/30" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`pr-4 text-base md:text-lg font-light ${openIndex === index ? "text-white" : "text-gray-300"}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-blue-400" : ""}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-6 pb-5 text-gray-400 font-light text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
