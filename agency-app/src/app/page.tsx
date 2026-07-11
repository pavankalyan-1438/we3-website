'use client';

import { useRef, useEffect } from 'react';
import { useInView, motion } from 'framer-motion';
import { useNav } from '@/components/navigation/NavContext';
import { NavCapsule } from '@/components/navigation/NavCapsule';
import { NavItem } from '@/components/navigation/NavItem';

export default function Home() {
  const { isProjectsInView, setIsProjectsInView } = useNav();
  const projectsRef = useRef<HTMLElement>(null);
  const inView = useInView(projectsRef, { margin: "-200px 0px" });

  useEffect(() => {
    setIsProjectsInView(inView);
  }, [inView, setIsProjectsInView]);

  return (
    <main className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-neutral-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)]" />
        <div className="text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40"
          >
            Liquid Glass
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl text-neutral-400 max-w-lg mx-auto"
          >
            Scroll down to see the premium navigation interaction.
          </motion.p>
        </div>
      </section>

      {/* Spacer Sections */}
      <section className="h-[80vh] flex items-center justify-center bg-black">
        <h2 className="text-4xl text-white/50">About Us</h2>
      </section>

      <section className="h-[80vh] flex items-center justify-center bg-black">
        <h2 className="text-4xl text-white/50">Our Services</h2>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="min-h-screen py-32 flex flex-col items-center bg-neutral-900 relative">
        <div className="w-full max-w-5xl px-8 flex flex-col items-start relative z-20">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-5xl font-bold text-white">Featured</h2>
            
            {/* The destination for the "Projects" pill when scrolled here */}
            <div className="relative w-[100px] h-[40px]">
              {isProjectsInView && (
                <motion.div layoutId="projects-capsule" className="absolute inset-0">
                  <NavCapsule className="px-4 py-2 bg-white/20">
                    <span className="text-white font-medium">Projects</span>
                  </NavCapsule>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="h-[50vh] flex items-center justify-center bg-black">
        <h2 className="text-2xl text-white/30">End of Page</h2>
      </section>
      
    </main>
  );
}
