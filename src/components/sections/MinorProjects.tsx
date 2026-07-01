'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

const minorProjects = [
  {
    id: 'buildfromit',
    name: 'BuildFromIt',
    desc: 'Upload an image of any furniture piece to instantly find cheaper alternatives, see the best price comparisons, get a generated 3D model, and receive step-by-step assembly instructions to build it yourself.',
    link: 'https://buildfromit.vercel.app/',
    tech: 'NEXT.JS / 3D MODELING / AI',
  },
  {
    id: 'automation',
    name: 'Automation Workflow',
    desc: 'Engineered autonomous AI-driven workflows and integrations utilizing LangChain, Supabase, and OpenAI to automate content production, business processes, and email marketing pipelines.',
    link: '',
    tech: 'LANGCHAIN / SUPABASE / OPENAI',
  },
  {
    id: 'safecircle',
    name: 'SafeCircle',
    desc: 'A digital safety platform focused on women empowerment and community awareness. Provides real-time safety alerts, trusted contacts management, and community-driven safety reporting. Achieved a 95 PageSpeed score.',
    link: 'https://yoursafecircle.vercel.app/',
    tech: 'REACT / FIREBASE / MAPS API',
  },
  {
    id: 'petdhoond',
    name: 'PetDhoond',
    desc: 'A community-driven pet adoption marketplace connecting shelters and pet owners. Designed for discovery, adoption requests, and community engagement around animal welfare. Achieved a 100 PageSpeed score.',
    link: '',
    tech: 'NEXT.JS / TAILWIND / SUPABASE',
  },

];

export default function MinorProjects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const animatingRef = useRef(false);
  const boundaryTime = useRef<number | null>(null);
  const activeIdxRef = useRef(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Keep activeIdxRef in sync with state
  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  const navigate = useCallback((dir: number) => {
    const current = activeIdxRef.current;
    const next = current + dir;
    if (next < 0 || next >= minorProjects.length) return;
    if (animatingRef.current) return;
    animatingRef.current = true;

    const currentCard = cardsRef.current[current];
    const nextCard = cardsRef.current[next];

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIdx(next);
        // Reset off-screen card position for future animations
        if (currentCard) gsap.set(currentCard, { x: dir === 1 ? '-110vw' : '110vw' });
        setTimeout(() => {
          animatingRef.current = false;
        }, 400);
      },
    });

    if (currentCard && nextCard) {
      // Position the incoming card just off-screen
      gsap.set(nextCard, { x: dir === 1 ? '110vw' : '-110vw', opacity: 1 });
      tl.to(currentCard, { x: dir === 1 ? '-110vw' : '110vw', duration: 0.7, ease: 'power3.inOut' }, 0);
      tl.to(nextCard, { x: 0, duration: 0.7, ease: 'power3.inOut' }, 0);
    }
  }, []);

  // Set initial positions
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, {
        x: i === 0 ? 0 : '110vw',
        opacity: 1,
      });
    });
  }, []);

  // Register scroll consumer — section index 3
  useEffect(() => {
    const SECTION_INDEX = 3;

    (window as any).__consumeScroll_MinorProjects = (dir: number, sectionIndex: number): boolean => {
      if (sectionIndex !== SECTION_INDEX) return false;

      const idx = activeIdxRef.current;
      const atStart = idx === 0 && dir === -1;
      const atEnd = idx === minorProjects.length - 1 && dir === 1;

      if (atStart || atEnd) {
        // At a boundary — absorb for 800ms then let ScrollEngine transition
        if (boundaryTime.current === null) {
          boundaryTime.current = Date.now();
          return true;
        }
        if (Date.now() - boundaryTime.current < 800) return true;
        boundaryTime.current = null;
        return false; // pass scroll to ScrollEngine
      }

      boundaryTime.current = null;
      navigate(dir);
      return true;
    };

    return () => {
      delete (window as any).__consumeScroll_MinorProjects;
    };
  }, [navigate]);

  return (
    <section className="section bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-12 left-8 md:left-24 z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4a35a]">
          University &amp; Hackathons
        </p>
      </div>

      {/* Card Stack */}
      <div className="relative w-full h-full flex items-center px-8 md:px-24 overflow-hidden">
        {minorProjects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute inset-x-0 px-8 md:px-24 flex flex-col items-start gap-6"
          >
            {/* Project number */}
            <span className="font-heading text-6xl md:text-8xl font-bold text-white/5 select-none leading-none">
              0{i + 1}
            </span>

            <div className="flex flex-col gap-4 -mt-4">
              <h3 className="font-heading text-4xl md:text-6xl font-bold uppercase text-[#e8e4de]">
                {project.name}
              </h3>
              <p className="font-mono text-xs tracking-widest text-[#c4a35a]">
                {project.tech}
              </p>
              <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">
                {project.desc}
              </p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 self-start px-6 py-3 border border-[#c4a35a] text-[#c4a35a] font-mono text-xs uppercase tracking-widest hover:bg-[#c4a35a] hover:text-black transition-colors duration-300"
                >
                  View Project →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-8 md:left-24 flex items-center gap-3">
        <div className="flex gap-2">
          {minorProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i - activeIdx)}
              className={`h-px transition-all duration-500 ${i === activeIdx ? 'w-10 bg-[#c4a35a]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/25">
          {activeIdx + 1} / {minorProjects.length}
        </span>
      </div>

      {/* Decorative right edge */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-white/5" />
    </section>
  );
}
