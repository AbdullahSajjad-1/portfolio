export default function Hero() {
  return (
    <section className="section bg-[#0a0a0a] flex flex-col justify-center px-8 md:px-24">
      <div className="max-w-5xl">
        <div className="overflow-hidden">
          <h1 className="reveal font-heading text-[clamp(3rem,10vw,8rem)] font-bold tracking-tighter uppercase leading-[0.9] text-[#e8e4de]">
            Abdullah
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="reveal font-heading text-[clamp(3rem,10vw,8rem)] font-bold tracking-tighter uppercase leading-[0.9] text-[#e8e4de]">
            Sajjad
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <p className="reveal font-mono text-sm uppercase tracking-[0.25em] text-[#c4a35a]">
            AI Engineer — PyTorch — Deep Learning
          </p>
          <p className="reveal font-mono text-sm uppercase tracking-[0.25em] text-white/40">
            Full-Stack Systems — Next.js — PostgreSQL
          </p>
        </div>

        <div className="reveal mt-16 flex items-center gap-4">
          <div className="w-12 h-px bg-[#c4a35a]" />
          <span className="font-mono text-xs tracking-widest text-white/30 uppercase">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
