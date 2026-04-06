"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ParticleCard, GlobalSpotlight } from './MagicBento';

export interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  color: string;
  nodeMarker: React.ReactNode;
}

export interface MagicTimelineProps {
  events: TimelineEvent[];
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicTimeline: React.FC<MagicTimelineProps> = ({
  events,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = false
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: 59, 130, 246;
            --border-color: rgba(0, 0, 0, 0.1); 
            --background-dark: rgba(255, 255, 255, 1);
            --white: #000000;
          }
          .dark .bento-section {
            --glow-color: ${glowColor};
            --border-color: rgba(255, 255, 255, 0.05); /* Techsprint sublte border */
            --background-dark: rgba(255, 255, 255, 0.02);
            --white: hsl(0, 0%, 100%);
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      {/* Renders the Vertical Timeline Layout */}
      <div 
        className="bento-section relative border-l-3 border-blue-500/30 ml-4 md:ml-10 space-y-12 pb-8 w-full select-none"
        ref={gridRef}
      >
        {events.map((item, index) => {
          const baseClassName = `card w-full p-6 md:p-8 rounded-2xl font-light overflow-hidden transition-all duration-500 ease-in-out hover:bg-black/5 dark:hover:bg-white/[0.04] ${
            enableBorderGlow ? 'card--border-glow' : ''
          }`;

          const cardStyle = {
            backgroundColor: 'var(--background-dark)',
            borderColor: 'var(--border-color)',
            color: 'var(--white)',
            '--glow-x': '50%',
            '--glow-y': '50%',
            '--glow-intensity': '0',
            '--glow-radius': '200px'
          } as React.CSSProperties;

          const content = (
            <>
              <span className={`text-xs md:text-sm font-normal tracking-wider uppercase mb-2 block z-10 relative ${item.color}`}>
                {item.date}
              </span>
              <h3 className="text-xl md:text-2xl font-bold dark:font-normal text-black dark:text-gray-100 mb-3 z-10 relative transition-colors">
                {item.title}
              </h3>
              <p className="text-black/70 dark:text-gray-400 font-medium dark:font-light text-sm md:text-base leading-relaxed z-10 relative transition-colors">
                {item.desc}
              </p>
            </>
          );

          return (
            <div key={index} className="relative pl-10 md:pl-16 group flex flex-col justify-center">
              {/* Glowing Node Marker */}
              <span className="absolute -left-5 md:-left-6 top-1 bg-white dark:bg-[#050814] p-2 rounded-full border-2 border-blue-500/30 group-hover:border-blue-500/50 transition-colors duration-300 z-20 pointer-events-none">
                {item.nodeMarker}
              </span>

              {enableStars ? (
                <ParticleCard
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {content}
                </ParticleCard>
              ) : (
                <div
                  className={baseClassName}
                  style={cardStyle}
                  ref={el => {
                    if (!el) return;
                    const handleMouseMove = (e: MouseEvent) => {
                      if (shouldDisableAnimations) return;
                      const rect = el.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;

                      if (enableTilt) {
                        const rotateX = ((y - centerY) / centerY) * -10;
                        const rotateY = ((x - centerX) / centerX) * 10;

                        gsap.to(el, {
                          rotateX,
                          rotateY,
                          duration: 0.1,
                          ease: 'power2.out',
                          transformPerspective: 1000
                        });
                      }
                      if (enableMagnetism) {
                        const magnetX = (x - centerX) * 0.05;
                        const magnetY = (y - centerY) * 0.05;
                        gsap.to(el, {
                          x: magnetX,
                          y: magnetY,
                          duration: 0.3,
                          ease: 'power2.out'
                        });
                      }
                    };

                    const handleMouseLeave = () => {
                      if (shouldDisableAnimations) return;
                      if (enableTilt) {
                        gsap.to(el, {
                          rotateX: 0,
                          rotateY: 0,
                          duration: 0.3,
                          ease: 'power2.out'
                        });
                      }
                      if (enableMagnetism) {
                        gsap.to(el, {
                          x: 0,
                          y: 0,
                          duration: 0.3,
                          ease: 'power2.out'
                        });
                      }
                    };

                    const handleClick = (e: MouseEvent) => {
                      if (!clickEffect || shouldDisableAnimations) return;
                      const rect = el.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const maxDistance = Math.max(
                        Math.hypot(x, y),
                        Math.hypot(x - rect.width, y),
                        Math.hypot(x, y - rect.height),
                        Math.hypot(x - rect.width, y - rect.height)
                      );

                      const ripple = document.createElement('div');
                      ripple.style.cssText = `
                        position: absolute;
                        width: ${maxDistance * 2}px;
                        height: ${maxDistance * 2}px;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                        left: ${x - maxDistance}px;
                        top: ${y - maxDistance}px;
                        pointer-events: none;
                        z-index: 1000;
                      `;

                      el.appendChild(ripple);
                      gsap.fromTo(
                        ripple,
                        { scale: 0, opacity: 1 },
                        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
                      );
                    };

                    el.addEventListener('mousemove', handleMouseMove);
                    el.addEventListener('mouseleave', handleMouseLeave);
                    el.addEventListener('click', handleClick);
                  }}
                >
                  {content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MagicTimeline;
