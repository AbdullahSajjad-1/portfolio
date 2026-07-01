'use client';

import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface ScrollEngineProps {
  children: React.ReactNode;
}

export default function ScrollEngine({ children }: ScrollEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const animating = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const lastWheelTime = useRef<number>(0);

  const goToSection = useCallback((index: number, direction: number) => {
    if (animating.current) return;
    if (index < 0 || index >= sectionsRef.current.length) return;

    animating.current = true;
    const sections = sectionsRef.current;
    const current = sections[currentIndex.current];
    const next = sections[index];

    // Position next section
    gsap.set(next, {
      visibility: 'visible',
      zIndex: 2,
    });

    // Dispatch event for Navbar immediately so it syncs with the visual start
    window.dispatchEvent(
      new CustomEvent('sectionChange', { detail: { index } })
    );

    // Timeline for the transition
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(current, { visibility: 'hidden', zIndex: 0 });
        gsap.set(next, { zIndex: 1 });
        currentIndex.current = index;
        setTimeout(() => {
          animating.current = false;
        }, 500); // 500ms scroll cooldown after section transitions
      },
    });

    // Clip-path wipe: incoming section reveals from top or bottom
    const clipFrom =
      direction === 1 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';

    tl.fromTo(
      next,
      { clipPath: clipFrom },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power4.inOut' },
      0
    );

    // Fade and scale current section slightly
    tl.to(
      current,
      { scale: 0.95, opacity: 0.3, duration: 1, ease: 'power4.inOut' },
      0
    );

    // Stagger-reveal child .reveal elements in the incoming section
    const reveals = next.querySelectorAll('.reveal');
    if (reveals.length > 0) {
      tl.fromTo(
        reveals,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.4
      );
    }

    // Reset scale on next section
    gsap.set(next, { scale: 1, opacity: 1 });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll('.section, .section-scrollable')
    );
    sectionsRef.current = sections;

    // Initialize: hide all except the first
    sections.forEach((section, i) => {
      gsap.set(section, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        visibility: i === 0 ? 'visible' : 'hidden',
        zIndex: i === 0 ? 1 : 0,
        scale: 1,
        opacity: 1,
      });
    });

    // Animate first section's reveals on load
    const firstReveals = sections[0]?.querySelectorAll('.reveal');
    if (firstReveals && firstReveals.length > 0) {
      gsap.fromTo(
        firstReveals,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }
    const checkNativeScroll = (dir: number) => {
      const current = sectionsRef.current[currentIndex.current];
      if (!current) return false;
      
      // Only apply native scroll boundaries to explicitly scrollable sections
      if (!current.classList.contains('section-scrollable')) return false;

      // Verify if overflow-y is actually scrollable in the computed layout (ignores hidden state on desktop)
      const style = window.getComputedStyle(current);
      if (style.overflowY !== 'auto' && style.overflowY !== 'scroll') return false;

      // Require at least 15px of actual overflow to treat it as scrollable (prevents subpixel scale locks)
      const isScrollable = current.scrollHeight > current.clientHeight + 15;
      if (!isScrollable) return false;
      
      // When swiping DOWN (wants to go up)
      if (dir === -1) {
        const isAtTop = current.scrollTop <= 5; // 5px buffer for top boundary
        if (!isAtTop) {
          return true; // Allow native internal scroll, block GSAP
        }
      }
      
      // When swiping UP (wants to go down)
      if (dir === 1) {
        // 5px buffer for bottom boundary to account for browser zoom and subpixel layout variances
        const isAtBottom = Math.ceil(current.scrollTop + current.clientHeight) >= current.scrollHeight - 5;
        if (!isAtBottom) {
          return true; // Allow native internal scroll, block GSAP
        }
      }

      // If at boundary, transition immediately without artificial delays
      return false;
    };

    // Named sub-scroll consumers registered by child sections
    const CONSUMERS = [
      '__consumeScroll_Projects',
      '__consumeScroll_MinorProjects',
    ] as const;

    const runConsumers = (dir: number): boolean => {
      for (const key of CONSUMERS) {
        const fn = (window as any)[key];
        if (typeof fn === 'function') {
          if (fn(dir, currentIndex.current)) return true;
        }
      }
      return false;
    };

    // Create Observer
    observerRef.current = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => {
        const now = Date.now();
        const timeSinceLastWheel = now - lastWheelTime.current;
        lastWheelTime.current = now;

        if (animating.current || (window as any).__isExpanded) return;
        // Require a 150ms pause in scrolling to clear trackpad inertia before allowing new transitions
        if (timeSinceLastWheel < 150) return;

        if (checkNativeScroll(-1)) return;
        if (runConsumers(-1)) return;
        if (currentIndex.current > 0) {
          goToSection(currentIndex.current - 1, -1);
        }
      },
      onUp: () => {
        const now = Date.now();
        const timeSinceLastWheel = now - lastWheelTime.current;
        lastWheelTime.current = now;

        if (animating.current || (window as any).__isExpanded) return;
        // Require a 150ms pause in scrolling to clear trackpad inertia before allowing new transitions
        if (timeSinceLastWheel < 150) return;

        if (checkNativeScroll(1)) return;
        if (runConsumers(1)) return;
        if (currentIndex.current < sections.length - 1) {
          goToSection(currentIndex.current + 1, 1);
        }
      },
      tolerance: 20,
      preventDefault: false,
    });

    // Expose goToSection globally for Navbar
    (window as any).__goToSection = goToSection;
    (window as any).__getSectionCount = () => sections.length;
    (window as any).__getCurrentSection = () => currentIndex.current;

    return () => {
      observerRef.current?.kill();
      delete (window as any).__goToSection;
      delete (window as any).__getSectionCount;
      delete (window as any).__getCurrentSection;
    };
  }, [goToSection]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {children}
    </div>
  );
}
