"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    // Initial calculation to prevent 1-second delay
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true; // Finished
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        return false;
      }
    };

    const isFinished = calculateTimeLeft();
    if (isFinished) return;

    const interval = setInterval(() => {
      const finished = calculateTimeLeft();
      if (finished) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex items-start gap-2 md:gap-4 text-center">
        {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
          <div key={label} className="flex items-start gap-2 md:gap-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-light text-black dark:text-white w-12 md:w-20 font-mono tracking-tighter">00</span>
              <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase mt-2">{label}</span>
            </div>
            {i !== 3 && <div className="text-3xl md:text-5xl font-light text-gray-700 animate-pulse mt-[-4px] md:mt-[-2px]">:</div>}
          </div>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-start gap-2 md:gap-4 text-center">
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-light text-white w-12 md:w-20 font-mono tracking-tighter">{formatNumber(timeLeft.days)}</span>
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase mt-2">Days</span>
      </div>
      <div className="text-3xl md:text-5xl font-light text-gray-700 animate-pulse mt-[-4px] md:mt-[-2px]">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-light text-white w-12 md:w-20 font-mono tracking-tighter">{formatNumber(timeLeft.hours)}</span>
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase mt-2">Hours</span>
      </div>
      <div className="text-3xl md:text-5xl font-light text-gray-700 animate-pulse mt-[-4px] md:mt-[-2px]">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-light text-white w-12 md:w-20 font-mono tracking-tighter">{formatNumber(timeLeft.minutes)}</span>
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase mt-2">Mins</span>
      </div>
      <div className="text-3xl md:text-5xl font-light text-gray-700 animate-pulse mt-[-4px] md:mt-[-2px]">:</div>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-5xl font-light text-white w-12 md:w-20 font-mono tracking-tighter">{formatNumber(timeLeft.seconds)}</span>
        <span className="text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase mt-2">Secs</span>
      </div>
    </div>
  );
}
