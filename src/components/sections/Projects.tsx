'use client';

import { useRef, useEffect, useCallback, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import FloatingDevice from '../canvas/FloatingDevice';

const projects = [
  {
    id: 'wifi',
    name: 'AI Wi-Fi CSI',
    tech: 'PYTORCH / PYTHON / SIGNAL PROCESSING',
    desc: 'Built an end-to-end signal processing and machine learning pipeline to perform non-intrusive Human Activity Recognition across 7 distinct gestures using Wi-Fi.',
    demoVideo: '/editeddemo.mp4',
    projectImage: '/wifi_thumbnail.png',
    longContent: (
      <div className="space-y-8 text-white/80 text-lg leading-relaxed font-sans">
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-white uppercase leading-tight mb-8">
          I just turned ordinary <span className="text-[#c4a35a]">Wi-Fi signals</span> into a camera.
        </h3>

        <p>
          Imagine tracking precise human movement and activities through solid walls in pitch-black darkness, with zero cameras or wearables. That is exactly what I built for my semester project: <strong className="text-white">a Deep Learning-Driven Wi-Fi CSI Activity Recognition Engine.</strong>
        </p>

        <p>
          By capturing Channel State Information (CSI) directly from commodity Wi-Fi devices, our system maps human gestures non-intrusively by analyzing how wireless radio frequencies distort around the body, bypassing the heavy privacy concerns of traditional tracking.
        </p>

        <div className="p-6 bg-white/5 border-l-4 border-[#c4a35a] my-8 rounded-r-lg">
          <p className="font-medium text-white">
            The absolute hardest part of wireless sensing is the <strong className="text-[#c4a35a]">Domain Shift problem</strong>: a model trained in one room completely fails when deployed on different hardware in a new environment.
          </p>
        </div>

        <p>To solve this cross-domain bottleneck, we engineered a multi-stage architecture:</p>

        <ul className="space-y-6 mt-4">
          <li className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-[#c4a35a] mt-2.5 flex-shrink-0" />
            <p><strong className="text-white">The 5-Second Zero-Shot Calibration:</strong> An unsupervised loop where the user remains still for 5 seconds at startup. The pipeline freezes that static environmental footprint and subtracts it on-the-fly from incoming streaming frames, instantly stripping away room-specific noise without retraining.</p>
          </li>
          <li className="flex flex-col gap-2">
            <h4 className="text-xl font-heading text-white uppercase mt-4 mb-2">The Stack:</h4>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 flex-shrink-0" />
              <p><strong className="text-white">The Pipeline:</strong> Decodes raw IQ tensors from Intel AX200 NICs, applying subcarrier linear subsampling and virtual antenna cross-interpolation.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 flex-shrink-0" />
              <p><strong className="text-white">The Ensemble:</strong> Combines a 2D CNN+BiLSTM with a low-overhead CNN+GRU network, utilizing soft voting to achieve a 98.4% cross-domain accuracy across 7 activities.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2.5 flex-shrink-0" />
              <p><strong className="text-white">Optimization:</strong> Applied SAM and SWA to locate ultra-flat basins in the loss landscape for smooth out-of-sample generalization.</p>
            </div>
          </li>
        </ul>

        <p className="pt-4">
          Deep dive engineering like this really shows the power of combining physical-layer signal processing with custom PyTorch architectures.
        </p>

        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-xl font-heading text-white uppercase mb-4">Future Roadmap:</h4>
          <p>
            I will be expanding this framework toward full through-the-wall tracking and real-time 2D human localisation to map the exact coordinates of where a person stands in a room.
          </p>
        </div>

        <div className="bg-black/40 p-6 rounded-lg border border-white/5 mt-8">
          <p className="text-sm text-white/60 italic">
            Our demo above captures a live test with a volunteer executing a localized hand gesture. The system subtracts room noise on the fly, instantly matching signal disturbances to classify the "Wave" action with 100% confidence.
            <br /><br />
            PS: The video is very VERY raw footage of the demo (I forgot to record the full length :)).
          </p>
        </div>


      </div>
    ),
    details: [],
  },
  {
    id: 'optivra',
    name: 'Optivra WMS',
    tech: 'NEXT.JS / SUPABASE / SQL',
    desc: 'Full-stack warehouse management platform supporting inventory tracking, order processing, and box labeling. Integrated directly with Shopify, Amazon, UPS, and DHL.',
    link: 'https://warenew.vercel.app',
    projectImage: '/optivraaa.jpeg',
    details: [
      'Engineered an event-driven architecture using PostgreSQL triggers to sync inventory across 4 channels in under 100ms.',
      'Built a custom label generation engine using React-PDF.',
      'Implemented Row Level Security (RLS) for multi-tenant isolation.',
    ],
  },
  {
    id: 'flowcare',
    name: 'FlowCare',
    link: 'https://flowcaree.vercel.app/',
    projectImage: '/flowcare.jpeg',
    tech: 'TYPESCRIPT / POSTGRESQL',
    desc: 'Childcare workforce and compliance platform. Automated scheduling engine ensures real-time child-to-teacher ratio monitoring and compliance.',
    details: [
      'Developed a real-time scheduling matrix that validates State compliance rules continuously.',
      'Reduced manual administrative workload for childcare centers by 40%.',
    ],
  },
];

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const subAnimating = useRef(false);

  // Preload all project images on mount to eliminate fallback flash
  useEffect(() => {
    projects.forEach((p) => {
      if (p.projectImage) {
        const img = new Image();
        img.src = p.projectImage;
      }
    });
  }, []);

  // Refs for unexpanded text animations
  const nameRef = useRef<HTMLHeadingElement>(null);
  const techRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const atBottomTime = useRef<number | null>(null);
  const boundaryTime = useRef<number | null>(null);



  const handleOverlayWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

    if (isAtBottom) {
      if (atBottomTime.current === null) {
        atBottomTime.current = Date.now();
      } else if (Date.now() - atBottomTime.current > 1200 && e.deltaY > 60) {
        // Only close after holding bottom for 1.2 seconds AND scrolling down again
        setIsExpanded(false);
        atBottomTime.current = null;
      }
    } else {
      atBottomTime.current = null;
    }
  };

  const updateContent = useCallback((index: number, direction: number) => {
    if (subAnimating.current || isExpanded) return;
    if (index < 0 || index >= projects.length) return;

    subAnimating.current = true;
    const project = projects[index];
    const elements = [nameRef.current, techRef.current, descRef.current];

    // Animate out
    gsap.to(elements, {
      y: direction * -30,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        if (nameRef.current) nameRef.current.textContent = project.name;
        if (techRef.current) techRef.current.textContent = project.tech;
        if (descRef.current) descRef.current.textContent = project.desc;
        if (counterRef.current) counterRef.current.textContent = `0${index + 1}`;

        setActiveIdx(index);

        // Animate in
        gsap.fromTo(
          elements,
          { y: direction * 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
            onComplete: () => {
              // Add a 600ms cooldown to swallow trackpad momentum scrolls
              setTimeout(() => {
                subAnimating.current = false;
              }, 600);
            },
          }
        );
      },
    });
  }, [isExpanded]);

  useEffect(() => {
    (window as any).__consumeScroll_Projects = (dir: number, activeIndex: number): boolean => {
      if (activeIndex !== 2) return false; // Only consume when Projects section (index 2) is active
      if (isExpanded) return false; // Let user scroll native overlay

      // Boundary protection: first or last project
      if ((activeIdx === 0 && dir === -1) || (activeIdx === projects.length - 1 && dir === 1)) {
        if (boundaryTime.current === null) {
          boundaryTime.current = Date.now();
          return true; // absorb
        }
        if (Date.now() - boundaryTime.current < 800) return true;
        boundaryTime.current = null;
        return false; // let ScrollEngine transition section
      }

      boundaryTime.current = null;
      const nextIndex = activeIdx + dir;
      if (nextIndex >= 0 && nextIndex < projects.length) {
        updateContent(nextIndex, dir);
        return true;
      }
      return false;
    };

    return () => {
      delete (window as any).__consumeScroll_Projects;
    };
  }, [updateContent, activeIdx, isExpanded]);

  // Handle expansion lock
  useEffect(() => {
    (window as any).__isExpanded = isExpanded;
  }, [isExpanded]);

  const activeProject = projects[activeIdx];

  return (
    <section className="section bg-[#0a0a0a] relative flex items-center px-8 md:px-24">

      <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-700`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <FloatingDevice
            activeProject={activeIdx}
            isExpanded={isExpanded}
            projectImage={projects[activeIdx].projectImage}
          />
        </Canvas>
      </div>

      {/* Watch Demo — styled as an embedded screen overlay */}
      {!isExpanded && activeProject.demoVideo && (
        <button
          onClick={() => setIsExpanded(true)}
          className="absolute z-20 flex flex-col items-center justify-center gap-1 cursor-pointer group"
          style={{ right: '30%', top: '32%', transform: 'translate(50%, -50%)' }}
        >
          {/* Minimal play triangle — slightly more visible opacity */}
          <svg className="w-10 h-10 text-white/90 drop-shadow-lg group-hover:text-[#c4a35a] group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-[9px] font-mono tracking-[0.25em] text-white/60 uppercase group-hover:text-[#c4a35a] transition-colors">Watch Demo</span>
        </button>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center z-10 transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col gap-6">
          <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-[#c4a35a] mb-2">
            Selected Works
          </p>

          <motion.div layoutId={`title-${activeProject.id}`}>
            <h3 ref={nameRef} className="reveal font-heading text-5xl md:text-7xl font-bold uppercase text-[#e8e4de] leading-[0.9]">
              {projects[0].name}
            </h3>
          </motion.div>

          <p ref={techRef} className="reveal font-mono text-sm tracking-wider text-[#c4a35a]">
            {projects[0].tech}
          </p>

          <p ref={descRef} className="reveal text-lg leading-relaxed text-white/60 max-w-lg">
            {projects[0].desc}
          </p>

          <div className="reveal mt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-6 py-3 border border-[#c4a35a] text-[#c4a35a] font-mono text-xs uppercase tracking-widest hover:bg-[#c4a35a] hover:text-black transition-colors"
            >
              Explore System →
            </button>
          </div>

          <div className="reveal flex items-center gap-4 mt-8">
            <span ref={counterRef} className="font-heading text-4xl font-bold text-[#c4a35a]">01</span>
            <span className="text-white/20 font-heading text-xl">/</span>
            <span className="font-heading text-xl text-white/20">0{projects.length}</span>
            <div className="ml-6 flex gap-2">
              {projects.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === activeIdx ? 'w-8 bg-[#c4a35a]' : 'w-4 bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={handleOverlayWheel}
            className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
          >
            {activeProject.demoVideo ? (
              <div className="absolute top-0 left-0 right-0 h-[70vh] z-0 pointer-events-none">
                <video
                  src={activeProject.demoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                  }}
                />
              </div>
            ) : activeProject.projectImage ? (
              <div
                className="absolute top-0 left-0 right-0 h-[70vh] z-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `url(${activeProject.projectImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
                }}
              />
            ) : null}

            <div className="min-h-screen px-8 md:px-24 py-24 flex flex-col pt-[50vh] relative z-10">

              <button
                onClick={() => setIsExpanded(false)}
                className="fixed top-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors z-50 rounded-full"
              >
                Close ✕
              </button>

              <motion.div layoutId={`title-${activeProject.id}`} className="mb-12">
                <h3 className="font-heading text-5xl md:text-8xl font-bold uppercase text-[#e8e4de] leading-[0.9]">
                  {activeProject.name}
                </h3>
              </motion.div>

              <div className="max-w-3xl flex flex-col gap-8 text-lg text-white/70 leading-relaxed font-sans">
                <p className="font-mono text-sm tracking-widest text-[#c4a35a]">{activeProject.tech}</p>
                <p>{activeProject.desc}</p>

                <div className="mt-8">
                  <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-[#c4a35a] mb-6 border-b border-white/10 pb-4">System Architecture</h4>

                  <div className="mt-16 max-w-4xl pb-24">
                    {activeProject.longContent ? (
                      activeProject.longContent
                    ) : (
                      <div className="space-y-6">
                        {activeProject.details?.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-4 text-white/70 text-lg leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#c4a35a] mt-2.5 flex-shrink-0" />
                            <p>{detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeProject.link && (
                    <div className="mt-16 pb-12 flex justify-start">
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95"
                      >
                        <div className="absolute inset-0 bg-[#c4a35a] rounded-full blur-sm opacity-50 group-hover:opacity-100 group-hover:blur-md transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e8c070] to-[#c4a35a] rounded-full"></div>
                        <span className="relative z-10 flex items-center gap-3 mix-blend-color-burn">
                          <span className="group-hover:animate-pulse">Launch System</span>
                          <span className="text-xl leading-none">↗</span>
                        </span>
                        <div className="absolute inset-0 rounded-full border border-white/40 overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
