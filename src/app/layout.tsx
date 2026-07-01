import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import GrainOverlay from '@/components/ui/GrainOverlay';
import Navbar from '@/components/ui/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Abdullah Sajjad | Software Engineer',
  description: 'AI Engineer & Full-Stack Systems Architect — Building high-performance platforms with PyTorch, Next.js, and Supabase.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[#e8e4de] selection:bg-[#c4a35a] selection:text-[#0a0a0a] overflow-hidden`}>
        <GrainOverlay />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
