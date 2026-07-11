'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LayoutGroup } from 'framer-motion';

interface NavContextType {
  isProjectsInView: boolean;
  setIsProjectsInView: (inView: boolean) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [isProjectsInView, setIsProjectsInView] = useState(false);

  return (
    <NavContext.Provider value={{ isProjectsInView, setIsProjectsInView }}>
      <LayoutGroup>
        {children}
      </LayoutGroup>
    </NavContext.Provider>
  );
}

export function useNav() {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
}
