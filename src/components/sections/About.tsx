const techStack = [
  'Next.js', 'React', 'TypeScript', 'Python', 'C++', 'PyTorch',
  'PostgreSQL', 'mySQL', 'NOSQL', 'Node.js', 'Three.js',
  'Github Actions', 'CI/CD', 'AI Automation', 'Automation Workflows', 'WordPress', 'SEO',
  'Leadership', 'Team Management', 'Operations Management',
];

const education = [
  {
    institution: 'Beaconhouse National University',
    degree: 'BS Computer Science',
    years: '2024 — 2028',
    active: true,
  },
  {
    institution: 'Aitchison College',
    degree: 'A Levels',
    years: '2011 — 2023',
    active: false,
  },
];

export default function About() {
  return (
    <section className="section section-scrollable bg-[#0f0f0f] flex items-center px-8 md:px-24 max-md:overflow-y-auto max-md:pb-24 max-md:pt-24 max-md:block">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center">

        {/* Left: Heading + Education */}
        <div className="flex flex-col gap-10">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-[#c4a35a] mb-6">
              About Me
            </p>
            <h2 className="reveal font-heading text-5xl md:text-7xl font-bold uppercase text-[#e8e4de] leading-[0.9]">
              Engineer.
              <br />
              Builder.
              <br />
              <span className="text-[#c4a35a]">Problem</span>
              <br />
              Solver.
            </h2>
          </div>

          {/* Education */}
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">Education</p>
            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div
                  key={edu.institution}
                  className={`flex justify-between items-start border-l-2 pl-4 py-1 ${edu.active ? 'border-[#c4a35a]' : 'border-white/10'}`}
                >
                  <div>
                    <h4 className="text-white font-semibold text-sm md:text-base">{edu.institution}</h4>
                    <p className="text-white/50 text-xs mt-0.5">{edu.degree}</p>
                  </div>
                  <span className={`font-mono text-xs tracking-wider shrink-0 ml-4 mt-0.5 ${edu.active ? 'text-[#c4a35a]' : 'text-white/30'}`}>
                    {edu.years}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bio + Stats + Skills */}
        <div className="flex flex-col gap-8 max-w-lg">
          <div className="flex flex-col gap-4">
            <p className="reveal text-base text-white/60 leading-relaxed">
              My background is a rare intersection of deep hard-engineering, AI,
              PyTorch, Signal Processing, and scalable systems architecture using
              Next.js, mySQL, and PostgreSQL.
            </p>
            <p className="reveal text-base text-white/60 leading-relaxed">
              I don&apos;t just build websites. I engineer high-performance platforms,
              automated workflows, and complex neural networks that solve real problems
              at scale.
            </p>
          </div>

          {/* Stats */}
          <div className="reveal flex gap-12 pt-6 border-t border-white/10">
            <div>
              <span className="block text-3xl font-bold text-[#c4a35a] font-heading">03+</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mt-1 block">Years</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-[#c4a35a] font-heading">100</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mt-1 block">PageSpeed</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-[#c4a35a] font-heading">10+</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 mt-1 block">Projects</span>
            </div>
          </div>

          {/* Skills */}
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Skills</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-white/40 rounded-full hover:border-[#c4a35a] hover:text-[#c4a35a] transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
