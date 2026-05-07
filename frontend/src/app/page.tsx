'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, BookOpen, Trophy, Zap, Github, Twitter, Star, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LANGUAGES = [
  { name: 'C',          icon: '🔵', color: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', problems: 80,  level: 'Beginner' },
  { name: 'C++',        icon: '🟣', color: 'from-pink-500/20 to-pink-600/10',  border: 'border-pink-500/30',  problems: 120, level: 'Intermediate' },
  { name: 'Java',       icon: '🟠', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', problems: 100, level: 'Intermediate' },
  { name: 'Python',     icon: '🟡', color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', problems: 150, level: 'All Levels' },
  { name: 'JavaScript', icon: '🟤', color: 'from-amber-500/20 to-amber-600/10',   border: 'border-amber-500/30',  problems: 130, level: 'Intermediate' },
];

const DSA_TOPICS = [
  { name: 'Arrays & Strings',      icon: '📊', count: 70, color: 'text-ds-blue' },
  { name: 'Linked Lists',          icon: '🔗', count: 20, color: 'text-ds-teal' },
  { name: 'Trees & BST',           icon: '🌲', count: 30, color: 'text-ds-green' },
  { name: 'Graphs',                icon: '🕸️', count: 25, color: 'text-ds-amber' },
  { name: 'Dynamic Programming',   icon: '⚡', count: 20, color: 'text-ds-violet' },
  { name: 'Stacks & Queues',       icon: '📚', count: 20, color: 'text-ds-purple' },
  { name: 'Hashing',               icon: '#️⃣', count: 15, color: 'text-ds-red' },
  { name: 'Greedy & Backtracking', icon: '💰', count: 20, color: 'text-ds-teal' },
];

const STATS = [
  { value: '50K+',  label: 'Active Learners',   icon: Users },
  { value: '200+',  label: 'DSA Problems',       icon: Code2 },
  { value: '5',     label: 'Languages',          icon: BookOpen },
  { value: '98%',   label: 'Success Rate',       icon: Trophy },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma',  role: 'Software Engineer @ Google',  rating: 5, text: "DevSphere's structured DSA roadmap got me FAANG-ready in 3 months. The problems are perfectly curated and explanations are crystal clear." },
  { name: 'Priya Mehta',   role: 'Data Scientist @ Microsoft',   rating: 5, text: "I went from zero to ML-ready in Python in 6 weeks. The inline compiler with instant feedback is absolutely the best learning tool I've used." },
  { name: 'Rahul Verma',   role: 'Placed @ Amazon (SDE-2)',      rating: 5, text: "Best platform for placement prep. The 200-problem set covers every pattern that comes up in top-tier coding interviews." },
  { name: 'Sneha Patel',   role: 'Full Stack Dev @ Flipkart',    rating: 5, text: "The JavaScript course is incredibly deep. From closures to async patterns — it covers everything you need for modern web development." },
];

const FEATURES = [
  { icon: Code2,      title: 'Live Compiler',        desc: 'Write and run code in 8 languages directly in your browser. Powered by Judge0.' },
  { icon: BookOpen,   title: 'Structured Tutorials',  desc: 'Step-by-step language courses with examples, outputs, and practice questions.' },
  { icon: Trophy,     title: 'Coding Challenges',     desc: '200+ LeetCode-style problems with hidden test cases and editorial solutions.' },
  { icon: Zap,        title: 'DSA Visualizer',        desc: 'Interactive animations showing how data structures and algorithms work.' },
  { icon: Star,       title: 'Leaderboard',           desc: 'Compete globally. Track your rank, streaks, and progress over time.' },
  { icon: CheckCircle2, title: 'Progress Tracking',   desc: 'Dashboard heatmaps, completion badges, and personalized recommendations.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-glow-blue rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute top-48 right-1/4 w-80 h-80 bg-glow-violet rounded-full blur-3xl opacity-15 pointer-events-none" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp(0)} className="mb-6">
            <Badge className="bg-ds-blue/15 text-ds-blue border-ds-blue/30 text-xs font-semibold px-4 py-1.5 rounded-full">
              🚀 New: Python Advanced Course + 50 new problems
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Master Programming with{' '}
            <span className="text-gradient">DevSphere Academy</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The most comprehensive platform for learning programming languages,
            data structures, algorithms, and competitive coding — all in one place.
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 h-12 px-8 text-base font-semibold shadow-lg shadow-ds-blue/20 hover:shadow-ds-blue/30 hover:-translate-y-0.5 transition-all">
              <Link href="/languages">Start Learning Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold border-border/60 hover:-translate-y-0.5 transition-all">
              <Link href="/practice">Practice Problems</Link>
            </Button>
          </motion.div>

          {/* Code preview */}
          <motion.div {...fadeUp(0.32)} className="mt-16 relative max-w-2xl mx-auto">
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-secondary/40">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">two_sum.py</span>
              </div>
              <pre className="text-left p-5 text-sm font-mono leading-7 overflow-x-auto">
                <code>
<span className="text-[#c678dd]">def</span> <span className="text-[#61afef]">two_sum</span>(nums, target):{'\n'}
{'    '}<span className="text-[#5c6370] italic"># O(n) Hash Map approach</span>{'\n'}
{'    '}seen = {'{}'}{'\n'}
{'    '}<span className="text-[#c678dd]">for</span> i, n <span className="text-[#c678dd]">in</span> <span className="text-[#61afef]">enumerate</span>(nums):{'\n'}
{'        '}diff = target <span className="text-[#56b6c2]">-</span> n{'\n'}
{'        '}<span className="text-[#c678dd]">if</span> diff <span className="text-[#c678dd]">in</span> seen:{'\n'}
{'            '}<span className="text-[#c678dd]">return</span> [seen[diff], i]{'\n'}
{'        '}seen[n] = i{'\n'}
                </code>
              </pre>
              <div className="px-5 py-3 border-t border-border/60 bg-green-500/5 text-green-400 text-xs font-mono">
                ✓ Accepted · Runtime: 48ms · Memory: 14.2 MB
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-secondary/20 py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <div className="text-4xl font-display font-extrabold text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ────────────────────────────────────── */}
      <section className="py-24 container px-4">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <Badge className="mb-4 bg-ds-teal/10 text-ds-teal border-ds-teal/30">Languages</Badge>
          <h2 className="font-display text-4xl font-bold mb-4">
            Learn <span className="text-gradient">Programming Languages</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Structured courses from basics to advanced, with hands-on code examples and practice questions.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {LANGUAGES.map((lang, i) => (
            <motion.div key={lang.name} {...fadeUp(i * 0.07)}>
              <Link href={`/languages/${lang.name.toLowerCase()}`}
                className={`group block rounded-xl border ${lang.border} bg-gradient-to-br ${lang.color} p-6 hover:scale-[1.03] hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                <div className="text-4xl mb-4">{lang.icon}</div>
                <div className="font-semibold text-base mb-1">{lang.name}</div>
                <div className="text-xs text-muted-foreground mb-3">{lang.level}</div>
                <div className="text-xs text-muted-foreground">{lang.problems} topics</div>
                <div className="mt-4 flex items-center text-xs text-ds-blue opacity-0 group-hover:opacity-100 transition-opacity">
                  Start learning <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DSA ROADMAP ──────────────────────────────────── */}
      <section className="py-24 bg-secondary/10 border-y border-border/50">
        <div className="container px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <Badge className="mb-4 bg-ds-violet/10 text-ds-violet border-ds-violet/30">DSA</Badge>
            <h2 className="font-display text-4xl font-bold mb-4">
              Complete <span className="text-gradient">DSA Roadmap</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From arrays to dynamic programming — master every concept needed to crack coding interviews.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {DSA_TOPICS.map((topic, i) => (
              <motion.div key={topic.name} {...fadeUp(i * 0.06)}>
                <Link href={`/dsa/${topic.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="group block rounded-xl border border-border/50 bg-card p-5 hover:border-ds-blue/40 hover:bg-secondary/50 transition-all">
                  <div className="text-2xl mb-3">{topic.icon}</div>
                  <div className="font-medium text-sm mb-1">{topic.name}</div>
                  <div className={`text-xs font-semibold ${topic.color}`}>{topic.count} problems</div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center mt-10">
            <Button asChild variant="outline" className="border-ds-violet/40 text-ds-violet hover:bg-ds-violet/10">
              <Link href="/dsa">View Full DSA Course <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 container px-4">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold mb-4">Everything You Need to <span className="text-gradient">Level Up</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">One platform. Every tool. Zero excuses.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i * 0.07)}
              className="group rounded-xl border border-border/50 bg-card p-6 hover:border-ds-blue/30 hover:bg-secondary/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-ds-blue/10 flex items-center justify-center mb-4 group-hover:bg-ds-blue/20 transition-colors">
                <f.icon className="h-5 w-5 text-ds-blue" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 bg-secondary/10 border-y border-border/50">
        <div className="container px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold mb-4">Trusted by <span className="text-gradient">Developers</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.08)}
                className="rounded-xl border border-border/50 bg-card p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-28 container px-4">
        <motion.div {...fadeUp()} className="relative rounded-2xl overflow-hidden border border-ds-blue/20 bg-gradient-to-br from-ds-blue/10 via-ds-violet/5 to-transparent p-12 text-center max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-glow-blue opacity-30 pointer-events-none" />
          <h2 className="font-display text-4xl font-bold mb-4 relative">
            Ready to Start Your <span className="text-gradient">Coding Journey</span>?
          </h2>
          <p className="text-muted-foreground mb-8 relative">Join 50,000+ developers who are already mastering their craft.</p>
          <div className="flex gap-4 justify-center flex-wrap relative">
            <Button asChild size="lg" className="bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 h-12 px-8 font-semibold shadow-lg shadow-ds-blue/20">
              <Link href="/auth/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 border-border/60">
              <Link href="/practice">Browse Problems</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
