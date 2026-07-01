import ScrollEngine from '@/components/layout/ScrollEngine';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import MinorProjects from '@/components/sections/MinorProjects';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <ScrollEngine>
        <Hero />
        <About />
        <Projects />
        <MinorProjects />
        <Experience />
        <Contact />
      </ScrollEngine>
    </main>
  );
}
