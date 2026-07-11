'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function NavItem({ href, isActive, onClick, children, className }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full',
        isActive ? 'text-black' : 'text-white hover:text-white/80',
        className
      )}
    >
      {/* Liquid Active Highlight */}
      {isActive && (
        <motion.div
          layoutId="active-nav-highlight"
          className="absolute inset-0 bg-white/90 rounded-full mix-blend-screen shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}
      
      {/* Label */}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
