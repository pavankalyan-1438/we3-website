'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';

interface NavCapsuleProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function NavCapsule({ children, className, id }: NavCapsuleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the capsule
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <motion.div
      id={id}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex items-center rounded-full overflow-hidden',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
        'transition-colors duration-500 ease-out',
        className
      )}
    >
      {/* Glossy top edge highlight */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" style={{ clipPath: 'inset(0 0 80% 0)' }} />
      
      {/* Interactive mouse reflection */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(100px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-between w-full px-2 py-1">
        {children}
      </div>
    </motion.div>
  );
}
