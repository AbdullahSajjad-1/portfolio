const experiences = [

  {
    role: 'Chapter Lead',
    company: 'GDGoC BNU',
    date: 'Sep 2024 — Present',
    desc: 'Leading technical events, workshops, and community engagement for developers. Organizing hackathons and driving tech education initiatives.',
  },
  {
    role: 'Web Dev Intern',
    company: 'GAOtek Inc.',
    date: 'Jun 2025 — Aug 2025',
    desc: 'Building responsive frontend components, optimizing web performance, and implementing modern UI patterns for enterprise applications.',
  },

  {
    role: 'Team Lead',
    company: 'IBEX',
    date: 'Jun 2023 — Jun 2024',
    desc: 'Managed a cross-functional team delivering high-quality client solutions under tight deadlines. Coordinated sprints and quality assurance.',
  },
  {
    role: 'SEO & Digital Marketing Associate',
    company: 'Tech Titans',
    date: 'Apr 2021 — Jan 2023',
    desc: 'Handled SEO initiatives while supporting programming and digital marketing campaigns. Worked across technical and marketing functions to improve campaign reach and engagement.',
  },
  {
    role: 'SEO Specialist, Digital Media Department',
    company: 'Tech Andaz',
    date: 'Jun 2021 — Jun 2022',
    desc: 'Executed SEO strategies to improve online visibility and search rankings. Collaborated with digital teams on content optimization and performance tracking.',
  },
  {
    role: 'Marketing & Social Media Manager',
    company: 'The Westral',
    date: 'Jun 2021 — Jul 2021',
    desc: 'Managed social media presence using custom illustrations and After Effects-based visual content. Acted as liaison with third-party agencies to align branding and marketing objectives.',
  },
  {
    role: 'Non-Profit Leadership',
    company: 'Emaan Dar Foundation — The Yellow Foundation (USA)',
    date: 'Jul 2020 — Jun 2022',
    desc: 'Led operations, donation drives, volunteer coordination, and digital outreach initiatives. Managed vendors and content production workflow.',
  },

];

export default function Experience() {
  return (
    <section className="section-scrollable bg-[#0f0f0f] flex flex-col pt-32 pb-24 px-8 md:px-24 items-center">
      <div className="max-w-5xl w-full">
        <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-[#c4a35a] mb-6">
          Professional Experience
        </p>
        <h2 className="reveal font-heading text-5xl md:text-6xl font-bold uppercase text-[#e8e4de] leading-[0.9] mb-16">
          Where I&apos;ve
          <br />
          <span className="text-[#c4a35a]">Worked.</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

          <div className="flex flex-col">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="reveal relative pl-8 md:pl-12 py-8 border-b border-white/5 group hover:bg-white/[0.02] transition-colors duration-300"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-10 w-2 h-2 rounded-full bg-[#c4a35a] -translate-x-[3px] group-hover:scale-150 transition-transform" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="max-w-xl">
                    <h3 className="font-heading text-2xl md:text-4xl text-[#e8e4de] uppercase">
                      {exp.role}
                    </h3>
                    <p className="text-white/50 font-sans mt-1">
                      {exp.company}
                    </p>
                    <p className="text-white/30 font-sans mt-4 text-sm leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#c4a35a] tracking-wider shrink-0 uppercase">
                    {exp.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
