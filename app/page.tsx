'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Search, 
  MapPin,
  Zap, 
  Globe, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const trendingJobs = ["Remote", "React Developer", "UI/UX Design", "Marketing"];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">JobDen</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">Process</Link>
            <Link href="/jobs" className="hover:text-indigo-600 transition-colors font-semibold text-indigo-600">Find Jobs</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-16 pb-16 md:pt-28 md:pb-24 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-indigo-200 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeInUp}>
              <Badge text="🚀 Over 2,400+ new jobs posted this week" />
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                The modern way to <br className="hidden md:block" /> 
                get hired, <span className="text-indigo-600">faster.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect directly with hiring managers at top-tier companies. No middleman, no black holes.
              </p>
              
              {/* --- MODERN SEARCH BAR --- */}
              <div className="max-w-4xl mx-auto">
                <div className="p-2 bg-white rounded-2xl md:rounded-full shadow-2xl shadow-indigo-100 border border-slate-200 flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-2 md:py-0">
                    <Search className="h-5 w-5 text-indigo-600 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Job title or keywords"
                      className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex items-center px-4 gap-3 py-2 md:py-0">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                    <input 
                      type="text"
                      placeholder="City or Remote"
                      className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 h-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <Button size="lg" className="h-12 md:h-14 px-10 text-lg rounded-xl md:rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all">
                    Search Jobs
                  </Button>
                </div>

                {/* Trending Tags */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-sm text-slate-400 font-medium italic">Trending:</span>
                  {trendingJobs.map((tag) => (
                    <button 
                      key={tag} 
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y bg-slate-50/50">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
              Talent hired at the world's best companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale contrast-125">
               <span className="font-black text-2xl">NETFLIX</span>
               <span className="font-black text-2xl">airbnb</span>
               <span className="font-black text-2xl">stripe</span>
               <span className="font-black text-2xl">Vercel</span>
               <span className="font-black text-2xl">Discord</span>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to succeed</h2>
            <p className="text-slate-500">Powerful tools designed for the modern job seeker.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BentoCard 
              title="Real-time Tracking" 
              desc="Get notified the second an employer reviews your profile."
              icon={<Zap className="h-6 w-6 text-amber-500" />}
              className="md:col-span-2 bg-amber-50/50 border-amber-100"
            />
            <BentoCard 
              title="Global Reach" 
              desc="Browse over 10,000+ remote opportunities."
              icon={<Globe className="h-6 w-6 text-blue-500" />}
              className="bg-blue-50/50 border-blue-100"
            />
            <BentoCard 
              title="Verified Safety" 
              desc="Every job posting is manually vetted."
              icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />}
              className="bg-emerald-50/50 border-emerald-100"
            />
            <BentoCard 
              title="AI Resume Analysis" 
              desc="Optimized for ATS systems to get you seen."
              icon={<Sparkles className="h-6 w-6 text-purple-500" />}
              className="md:col-span-2 bg-purple-50/50 border-purple-100"
            />
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t py-12">
        <div className="container mx-auto px-6 text-center">
           <p className="text-slate-400 text-sm">© 2025 JobDen Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Utility Components
function Badge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-xs md:text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6 animate-pulse">
            {text}
        </span>
    );
}

function BentoCard({ title, desc, icon, className }: { title: string, desc: string, icon: any, className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`p-8 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${className}`}
    >
      <div className="mb-4 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}