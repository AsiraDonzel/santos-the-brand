import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightEffectProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightEffect: React.FC<SpotlightEffectProps> = ({ children, className = "" }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Content Layer (Dimmed/Blurred by default or obscured) */}
      <div className="relative z-10 transition-all duration-500 filter grayscale group-hover:grayscale-0 w-full h-full">
        {children}
      </div>

      {/* Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-30"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.15), transparent 40%)`,
        }}
      />

      {/* High Clarity Reveal Mask (Optional advanced effect) */}
      {/* This simulates a flashlight revealing color/clarity in a dark room */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-primary-950/40 transition-opacity duration-500 group-hover:bg-primary-950/20"
        style={{
          maskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black, transparent)`,
          opacity: isHovered ? 0 : 0.6 // Invert logic: show dim layer, hide it under spotlight
        }}
      />
    </div>
  );
};

export default SpotlightEffect;