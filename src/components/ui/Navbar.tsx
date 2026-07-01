'use client';

import { useEffect, useState } from 'react';

const sectionLabels = ['Home', 'About', 'Work', 'Experience', 'Contact'];

// Maps physical section index (0-5) to navbar label index (0-4)
const getNavIndex = (sectionIndex: number) => {
  if (sectionIndex <= 2) return sectionIndex; // Home, About, Projects
  if (sectionIndex === 3) return 2; // MinorProjects maps to 'Work'
  return sectionIndex - 1; // Experience(4)->3, Contact(5)->4
};

// Maps navbar label index (0-4) to physical section index (0-5)
const getTargetSection = (navIndex: number) => {
  if (navIndex <= 2) return navIndex;
  return navIndex + 1;
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleSectionChange = (e: CustomEvent) => {
      setActiveSection(e.detail.index);
    };
    window.addEventListener(
      'sectionChange',
      handleSectionChange as EventListener
    );
    return () =>
      window.removeEventListener(
        'sectionChange',
        handleSectionChange as EventListener
      );
  }, []);

  const handleClick = (index: number) => {
    const goTo = (window as any).__goToSection;
    const getCurrent = (window as any).__getCurrentSection;
    if (goTo && getCurrent) {
      const current = getCurrent();
      const targetSection = getTargetSection(index);
      if (current !== targetSection) {
        goTo(targetSection, targetSection > current ? 1 : -1);
      }
    }
  };

  const currentNavIndex = getNavIndex(activeSection);

  return (
    <>
      {/* Desktop Vertical Navigation */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3 pointer-events-auto">
        {sectionLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group flex items-center gap-3 cursor-pointer"
          >
            {/* Label */}
            <span
              className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                hoveredIndex === index || currentNavIndex === index
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2'
              } ${currentNavIndex === index ? 'text-[#c4a35a]' : 'text-white/50'}`}
            >
              {label}
            </span>

            {/* Dot */}
            <span
              className={`block rounded-full transition-all duration-500 ${
                currentNavIndex === index
                  ? 'w-3 h-3 bg-[#c4a35a]'
                  : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
