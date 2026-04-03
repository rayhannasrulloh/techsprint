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
    question: "Apa itu 3IN1 Tech Sprint?",
    answer: "3IN1 Tech Sprint adalah kompetisi inovasi interaktif selama 2 hari yang fokus pada pengembangan solusi teknologi berkelanjutan untuk masalah nyata. Kami memiliki tiga track utama: UI/UX, Data Automation, dan System Analyst.",
  },
  {
    question: "Siapa saja yang bisa mengikuti acara ini?",
    answer: "Acara ini terbuka untuk mahasiswa aktif maupun pelajar yang memiliki ketertarikan di bidang teknologi, desain, analisis sistem, dan otomasi data. Kamu bisa mendaftar secara tim dengan anggota 3 orang.",
  },
  {
    question: "Apakah ada biaya pendaftaran?",
    answer: "Terdapat periode pendaftaran tertentu. Silakan pantau terus informasi pendaftaran kami untuk mengetahui tentang periode early bird dan harga khusus untuk tim yang mendaftar lebih awal.",
  },
  {
    question: "Bagaimana cara mendaftar menjadi peserta?",
    answer: "Kamu bisa mendaftar melalui tombol 'Register' yang ada di halaman utama website ini. Pastikan kamu sudah menyiapkan data diri dan anggota tim sebelum mengisi formulir.",
  },
  {
    question: "Apakah peserta harus memiliki pengalaman IT sebelumnya?",
    answer: "Tidak wajib, tetapi pengalaman dasar akan sangat membantu. Kompetisi ini juga menjadi tempat yang baik untuk belajar dan mengasah kemampuan kamu secara langsung (hands-on) bersama teman satu tim.",
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
            Temukan jawaban untuk pertanyaan yang sering diajukan.
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
