"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TextReveal } from "./TextReveal";
import { useLang } from "./LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqsData: Record<"en" | "id", FAQItem[]> = {
  en: [
    {
      question: "What is 3IN1 Tech Sprint?",
      answer: "3IN1 Tech Sprint is an intensive 2-day innovation competition focused on developing sustainable technological solutions for real-world problems. We feature three main tracks: UI/UX Design, Data Automation, and System Analyst.",
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
    },
  ],
  id: [
    {
      question: "Apa itu 3IN1 Tech Sprint?",
      answer: "3IN1 Tech Sprint adalah kompetisi inovasi intensif selama 2 hari yang berfokus pada pengembangan solusi teknologi berkelanjutan untuk permasalahan nyata. Kami menghadirkan tiga trek utama: UI/UX Design, Data Automation, dan System Analyst.",
    },
    {
      question: "Siapa yang dapat berpartisipasi dalam acara ini?",
      answer: "Acara ini terbuka untuk mahasiswa dan pelajar aktif yang memiliki minat di bidang teknologi, desain, analisis sistem, dan otomasi data. Kamu dapat mendaftar sebagai tim beranggotakan 3 orang.",
    },
    {
      question: "Apakah ada biaya pendaftaran?",
      answer: "Terdapat periode pendaftaran tertentu. Pantau terus pengumuman pendaftaran kami untuk mengetahui periode Early Bird dan harga spesial untuk pendaftar awal.",
    },
    {
      question: "Bagaimana cara mendaftar sebagai peserta?",
      answer: "Kamu bisa mendaftar melalui tombol 'Daftar' di halaman utama situs ini. Pastikan kamu telah menyiapkan data diri dan informasi anggota tim sebelum mengisi formulir.",
    },
    {
      question: "Apakah peserta perlu memiliki pengalaman IT sebelumnya?",
      answer: "Tidak diwajibkan, namun pengalaman dasar akan sangat membantu. Kompetisi ini juga menjadi tempat yang tepat untuk belajar dan mengasah kemampuanmu bersama rekan tim.",
    },
  ],
};

const uiText = {
  en: {
    heading: "FAQ",
    subheading: "Find answers to frequently asked questions.",
  },
  id: {
    heading: "FAQ",
    subheading: "Temukan jawaban atas pertanyaan yang sering diajukan.",
  },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { lang } = useLang();

  const faqs = faqsData[lang];
  const tx = uiText[lang];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow for FAQ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-500/10 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0 transition-colors"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold dark:font-light tracking-widest text-black dark:text-gray-300 uppercase flex items-center justify-center gap-3 transition-colors">
            <TextReveal text={tx.heading} />
          </h2>
          <p className="text-black/70 dark:text-gray-400 font-medium dark:font-light mt-4 transition-colors">
            {tx.subheading}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-2xl transition-all duration-300 ${openIndex === index ? "bg-black/[0.04] dark:bg-white/[0.04] border-blue-500/30" : "bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:border-black/10 dark:hover:border-white/10"}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`pr-4 text-base md:text-lg font-bold dark:font-light transition-colors ${openIndex === index ? "text-blue-600 dark:text-white" : "text-black dark:text-gray-300"}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-blue-600 dark:text-blue-400" : "text-black/50 dark:text-gray-400"}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-6 pb-5 text-black/70 dark:text-gray-400 font-medium dark:font-light text-sm md:text-base leading-relaxed transition-colors">
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
