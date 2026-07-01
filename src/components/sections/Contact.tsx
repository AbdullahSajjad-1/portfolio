'use client';

import { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // We still allow the default mailto: behavior to run, but we ALSO copy the email to the clipboard
    // just in case the user doesn't have a default email client configured on their computer.
    navigator.clipboard.writeText('abdullah.sajjad665@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section section-scrollable bg-[#0a0a0a] flex flex-col justify-center max-md:justify-start items-center px-8 md:px-24 text-center max-md:pt-32 max-md:pb-48">
      <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-[#c4a35a] mb-8">
        Get In Touch
      </p>

      <h2 className="reveal font-heading text-6xl md:text-8xl font-bold uppercase text-[#e8e4de] leading-[0.85]">
        Let&apos;s Build
        <br />
        Something
        <br />
        <span className="text-[#c4a35a]">Together.</span>
      </h2>

      <p className="reveal text-lg text-white/40 mt-10 mb-14 max-w-md">
        Currently open for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you.
      </p>

      <a
        href="mailto:abdullah.sajjad665@gmail.com"
        onClick={handleEmailClick}
        className="reveal group relative px-10 py-5 bg-transparent border border-[#c4a35a] text-[#c4a35a] font-bold uppercase tracking-widest rounded-full overflow-hidden transition-colors duration-500 hover:text-black"
      >
        <span className="absolute inset-0 bg-[#c4a35a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        <span className="relative z-10">{copied ? 'Email Copied!' : 'Say Hello →'}</span>
      </a>

      <div className="reveal absolute bottom-12 flex gap-10 font-mono text-xs uppercase tracking-widest text-white/30">
        <a
          href="https://www.linkedin.com/in/abdullahsajjad12"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#c4a35a] transition-colors duration-300"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/AbdullahSajjad-1"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#c4a35a] transition-colors duration-300"
        >
          GitHub
        </a>
        <a
          href="mailto:abdullah.sajjad665@gmail.com"
          onClick={handleEmailClick}
          className="hover:text-[#c4a35a] transition-colors duration-300 cursor-pointer"
        >
          {copied ? 'Copied!' : 'Email'}
        </a>
      </div>
    </section>
  );
}
