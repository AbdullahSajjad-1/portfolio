'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches);
    
    if (!cursorRef.current) return;

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX - 10);
      yTo(e.clientY - 10);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-5 h-5 bg-[#c4a35a] rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
    />
  );
}
