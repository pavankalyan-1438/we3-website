'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, useSpring, LayoutGroup } from 'framer-motion';
import { NavCapsule } from './NavCapsule';
import { NavItem } from './NavItem';
import { GooeyFilter } from './GooeyFilter';
import { Leaf, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useNav } from './NavContext';

export function LiquidNav() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname || '/');
  const { isProjectsInView } = useNav();

  // Spring physics for smooth scroll interpolation
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 20,
    mass: 0.5
  });

  // Calculate transforms for the separation effect
  // 0 -> 100px scroll triggers the split
  const logoX = useTransform(smoothScrollY, [0, 100], [0, -300]);
  const ctaX = useTransform(smoothScrollY, [0, 100], [0, 300]);
  
  // When splitting, the center links and projects pill should slightly separate if we want,
  // but let's keep them centered and merged, only splitting the Logo and CTA.
  // Wait, the prompt says: "Center: Home About Services Projects". 
  // So they stay together in the center.
  
  return (
    <>
      <GooeyFilter />
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        
        <div className="relative flex items-center justify-center pointer-events-auto gooey-filter">
          
          {/* Logo Capsule */}
          <motion.div style={{ x: logoX }} className="absolute z-20">
            <NavCapsule className="px-4 py-2 min-w-[120px] justify-center">
              <Leaf className="w-5 h-5 text-white mr-2" />
              <span className="font-semibold text-white">Agency</span>
            </NavCapsule>
          </motion.div>

          {/* Center Links Capsule */}
          <motion.div className="relative z-30 flex items-center gap-1">
            <NavCapsule className="px-2 py-2">
              <NavItem href="/" isActive={activePath === '/'} onClick={() => setActivePath('/')}>Home</NavItem>
              <NavItem href="/about" isActive={activePath === '/about'} onClick={() => setActivePath('/about')}>About</NavItem>
              <NavItem href="/services" isActive={activePath === '/services'} onClick={() => setActivePath('/services')}>Services</NavItem>
            </NavCapsule>
            
            {/* Projects Item - conditional rendering for layout morphing */}
            {!isProjectsInView && (
              <motion.div layoutId="projects-capsule" className="z-30">
                <NavCapsule className="px-2 py-2">
                  <NavItem href="#projects" isActive={activePath === '/projects'} onClick={() => setActivePath('/projects')}>
                    Projects
                  </NavItem>
                </NavCapsule>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Capsule */}
          <motion.div style={{ x: ctaX }} className="absolute z-20">
            <NavCapsule className="px-4 py-2 min-w-[140px] justify-center bg-white/10">
              <span className="font-semibold text-white mr-2">Contact Us</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </NavCapsule>
          </motion.div>

          {/* Background bridge elements for the Gooey filter to react to.
              The gooey filter needs solid shapes to blend. */}
          <motion.div style={{ x: logoX }} className="absolute inset-y-0 w-[120px] bg-black rounded-full -z-10" />
          <motion.div className="absolute inset-y-0 w-[400px] bg-black rounded-full -z-10" />
          <motion.div style={{ x: ctaX }} className="absolute inset-y-0 w-[140px] bg-black rounded-full -z-10" />
          
        </div>
      </div>
    </>
  );
}
