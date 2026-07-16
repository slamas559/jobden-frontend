'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sora } from 'next/font/google';
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
  Sparkles,
  Menu,
  X,
  MessageSquareText,
  ClipboardList,
  BadgeCheck,
  Code2,
  Palette,
  Megaphone,
  Headset,
  LineChart,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const sora = Sora({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-sora' });

const trendingSearches = ['Remote', 'React Developer', 'UI/UX Design', 'Marketing', 'Data Analyst'];

const stats = [
  { value: '12,400+', label: 'Active roles right now' },
  { value: '3,200+', label: 'Companies hiring' },
  { value: '48 hrs', label: 'Average first response' },
  { value: '100%', label: 'Free for job seekers' },
];

const steps = [
  {
    n: '01',
    title: 'Search & filter',
    desc: "Tell us what you're looking for — role, location, or salary — and JobDen narrows the noise to roles worth your time.",
    icon: Search,
  },
  {
    n: '02',
    title: 'Apply in one click',
    desc: 'No repeated forms. Your profile carries over, so applying to your fifth role is as fast as your first.',
    icon: ClipboardList,
  },
  {
    n: '03',
    title: 'Hear back, faster',
    desc: 'Message hiring managers directly and track every application status in one place — no more guessing.',
    icon: MessageSquareText,
  },
];

const categories = [
  { name: 'Engineering', icon: Code2, query: 'Engineer' },
  { name: 'Design', icon: Palette, query: 'Designer' },
  { name: 'Marketing & Sales', icon: Megaphone, query: 'Marketing' },
  { name: 'Customer Support', icon: Headset, query: 'Customer Support' },
  { name: 'Operations & Finance', icon: LineChart, query: 'Operations' },
  { name: 'Remote', icon: Globe, query: '' , remote: true },
];

const testimonials = [
  {
    quote: "I stopped refreshing five different job boards. JobDen's alerts actually matched what I applied to, and I heard back from two companies in the same week.",
    name: 'Amaka O.',
    role: 'Product Designer',
  },
  {
    quote: 'Posting a role took ten minutes and we had qualified applicants by the next morning. No agency fees, no back and forth.',
    name: 'Tunde B.',
    role: 'Engineering Manager, hiring on JobDen',
  },
  {
    quote: 'The one-click apply is not a gimmick — it genuinely saved me hours across a job search that used to feel like a second job.',
    name: 'Chidinma K.',
    role: 'Marketing Lead',
  },
];

const faqs = [
  {
    q: 'Is JobDen free for job seekers?',
    a: 'Yes — creating a profile, searching, and applying to roles is completely free, and always will be.',
  },
  {
    q: 'Do I need an account to browse jobs?',
    a: "No. You can search and read full job listings without signing up. You'll only need an account to apply, bookmark a role, or message an employer.",
  },
  {
    q: 'How does JobDen vet employers?',
    a: 'Every company that posts a role goes through a manual review before it goes live, so you can apply with confidence.',
  },
  {
    q: 'Can I use JobDen to hire?',
    a: 'Yes. Employers can post roles, manage applicants, and message candidates directly from their dashboard — no recruiters required.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const goToJobs = (params: { search?: string; location?: string }) => {
    const qs = new URLSearchParams();
    if (params.search?.trim()) qs.set('search', params.search.trim());
    if (params.location?.trim()) qs.set('location', params.location.trim());
    router.push(`/jobs${qs.toString() ? `?${qs.toString()}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToJobs({ search: searchQuery, location });
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    goToJobs({ search: tag, location });
  };

  const handleCategoryClick = (query: string, remote?: boolean) => {
    goToJobs({ search: query, location: remote ? 'Remote' : location });
  };

  return (
    <div className={`${sora.variable} min-h-screen bg-white text-slate-900 selection:bg-indigo-100`}>
      {/* Navigation */}
      <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-sora)]">JobDen</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link>
            <Link href="#categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/jobs" className="hover:text-indigo-600 transition-colors font-semibold text-indigo-600">Find Jobs</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                Join Now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-slate-700"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
            <div className="flex flex-col space-y-3 text-sm font-medium text-slate-600">
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</Link>
              <Link href="#categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-indigo-600 font-semibold">Find Jobs</Link>
            </div>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Join Now</Button>
              </Link>
            </div>
          </div>
        )}
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
              <Badge text="🚀 2,400+ new roles posted this week" />
              <h1 className="font-[family-name:var(--font-sora)] text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Work that fits, <br className="hidden md:block" />
                found <span className="text-indigo-600">faster.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Search real openings from vetted companies, apply in one click, and talk to hiring managers directly. No recruiters, no black holes.
              </p>

              {/* --- FUNCTIONAL SEARCH BAR --- */}
              <div className="max-w-4xl mx-auto">
                <form
                  onSubmit={handleSearchSubmit}
                  className="p-2 bg-white rounded-2xl md:rounded-full shadow-2xl shadow-indigo-100 border border-slate-200 flex flex-col md:flex-row gap-2"
                >
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
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 md:h-14 px-10 text-lg rounded-xl md:rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all"
                  >
                    Search Jobs
                  </Button>
                </form>

                {/* Trending Tags */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-sm text-slate-400 font-medium italic">Trending:</span>
                  {trendingSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
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

        {/* Stats Strip */}
        <section className="py-10 border-y bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">How it works</span>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">
              From search to signed offer
            </h2>
            <p className="text-slate-500">Three steps, no wasted motion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="font-[family-name:var(--font-sora)] absolute top-6 right-8 text-5xl font-extrabold text-slate-50">
                    {step.n}
                  </span>
                  <div className="relative mb-5 bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="relative text-xl font-bold mb-2">{step.title}</h3>
                  <p className="relative text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Popular Categories */}
        <section id="categories" className="py-24 bg-slate-50/50 border-y">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">Browse by category</span>
              <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">
                Popular places to start
              </h2>
              <p className="text-slate-500">Jump straight into the roles you care about.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.query, (cat as any).remote)}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors shrink-0">
                      <Icon className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{cat.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        Browse roles <ArrowRight className="h-3 w-3" />
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">Why JobDen</span>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-slate-500">Powerful tools designed for the modern job seeker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BentoCard
              title="Real-time Tracking"
              desc="Get notified the moment an employer opens your application or updates its status."
              icon={<Zap className="h-6 w-6 text-amber-500" />}
              className="md:col-span-2 bg-amber-50/50 border-amber-100"
            />
            <BentoCard
              title="Direct Messaging"
              desc="Skip the recruiter relay — talk to hiring managers directly, right inside JobDen."
              icon={<MessageSquareText className="h-6 w-6 text-blue-500" />}
              className="bg-blue-50/50 border-blue-100"
            />
            <BentoCard
              title="Verified Listings"
              desc="Every employer and job posting is manually reviewed before it goes live."
              icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />}
              className="bg-emerald-50/50 border-emerald-100"
            />
            <BentoCard
              title="One-Click Apply"
              desc="Build your profile once. Every application after that takes seconds, not forms."
              icon={<Sparkles className="h-6 w-6 text-purple-500" />}
              className="md:col-span-2 bg-purple-50/50 border-purple-100"
            />
            <BentoCard
              title="Saved Searches"
              desc="Bookmark roles and set up alerts so new matches land in your inbox first."
              icon={<CheckCircle className="h-6 w-6 text-rose-500" />}
              className="bg-rose-50/50 border-rose-100"
            />
            <BentoCard
              title="Built for Employers, Too"
              desc="Post a role, review applicants, and message candidates — no agency fees."
              icon={<Building2 className="h-6 w-6 text-indigo-500" />}
              className="bg-indigo-50/50 border-indigo-100"
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-slate-50/50 border-y">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">Real stories</span>
              <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">
                People trust JobDen with their next move
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col"
                >
                  <BadgeCheck className="h-6 w-6 text-indigo-600 mb-4" />
                  <p className="text-slate-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-400">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dual CTA Banner */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

              <div className="relative">
                <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Ready to find your next role?
                </h2>
                <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
                  Join thousands of job seekers building their careers on JobDen — it's free, always.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="h-13 px-8 text-base bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl">
                      Create your free profile <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                      Browse jobs first
                    </Button>
                  </Link>
                </div>
                <p className="text-indigo-200 text-sm mt-8">
                  Hiring instead?{' '}
                  <Link href="/register" className="underline underline-offset-4 font-semibold hover:text-white">
                    Post a job for free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">FAQ</span>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold mt-3 mb-4 tracking-tight">
              Questions, answered
            </h2>
          </div>

          <div className="max-w-2xl mx-auto divide-y divide-slate-100 border-t border-b border-slate-100">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-slate-900">
                  {item.q}
                  <span className="ml-4 shrink-0 text-indigo-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="font-[family-name:var(--font-sora)] text-lg font-bold tracking-tight">JobDen</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                The modern way to find work and hire talent — direct, verified, and free for job seekers.
              </p>
            </div>
            <FooterColumn
              title="For job seekers"
              links={[
                { label: 'Browse jobs', href: '/jobs' },
                { label: 'Create an account', href: '/register' },
                { label: 'Sign in', href: '/login' },
              ]}
            />
            <FooterColumn
              title="For employers"
              links={[
                { label: 'Post a job', href: '/register' },
                { label: 'Sign in', href: '/login' },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Features', href: '#features' },
              ]}
            />
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} JobDen Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
              <Link href="/help" className="hover:text-slate-600 transition-colors">Support</Link>
            </div>
          </div>
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

function BentoCard({ title, desc, icon, className }: { title: string; desc: string; icon: any; className: string }) {
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

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
