'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

const LANGUAGES = [
  {
    slug: 'c',
    name: 'C Programming',
    icon: '🔵',
    tagline: 'The foundation of systems programming',
    color: 'from-gray-500/15 to-slate-600/5',
    border: 'border-gray-500/30',
    accent: '#6b7280',
    topics: ['Introduction','Variables & Types','Loops & Control','Functions','Arrays','Pointers','Structs','File I/O','Memory Management','Advanced C'],
    stats: { topics: 40, exercises: 80 },
    level: 'Beginner → Advanced',
  },
  {
    slug: 'cpp',
    name: 'C++',
    icon: '🟣',
    tagline: 'High-performance OOP & systems language',
    color: 'from-pink-500/15 to-rose-600/5',
    border: 'border-pink-500/30',
    accent: '#ec4899',
    topics: ['Introduction','OOP Basics','Inheritance','Polymorphism','Templates','STL','Smart Pointers','Move Semantics','Multithreading','Competitive Programming'],
    stats: { topics: 50, exercises: 120 },
    level: 'Intermediate → Expert',
  },
  {
    slug: 'java',
    name: 'Java',
    icon: '🟠',
    tagline: 'Platform-independent enterprise language',
    color: 'from-orange-500/15 to-amber-600/5',
    border: 'border-orange-500/30',
    accent: '#f97316',
    topics: ['Introduction','OOP Fundamentals','Interfaces','Collections','Generics','Streams','Concurrency','Spring Basics','JVM Internals','Design Patterns'],
    stats: { topics: 45, exercises: 100 },
    level: 'Beginner → Advanced',
  },
  {
    slug: 'python',
    name: 'Python',
    icon: '🟡',
    tagline: 'Versatile, beginner-friendly scripting language',
    color: 'from-yellow-500/15 to-lime-600/5',
    border: 'border-yellow-500/30',
    accent: '#eab308',
    topics: ['Introduction','Data Types','Control Flow','Functions','OOP','Decorators','Generators','Async/Await','Data Science Basics','Advanced Python'],
    stats: { topics: 55, exercises: 150 },
    level: 'Beginner → Expert',
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    icon: '🟤',
    tagline: 'The language of the web, now everywhere',
    color: 'from-amber-500/15 to-orange-600/5',
    border: 'border-amber-500/30',
    accent: '#f59e0b',
    topics: ['Introduction','ES6+ Features','Closures & Scope','Async Programming','Prototypes','Event Loop','DOM APIs','Node.js Basics','React Fundamentals','TypeScript Intro'],
    stats: { topics: 50, exercises: 130 },
    level: 'Beginner → Advanced',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

export default function LanguagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Header */}
        <div className="container px-4 mb-14 text-center">
          <motion.div {...fadeUp()}>
            <Badge className="mb-4 bg-ds-teal/10 text-ds-teal border-ds-teal/30">Programming Languages</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Structured <span className="text-gradient">Language Courses</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From syntax basics to advanced concepts — each course includes explanations, code examples, output walkthroughs, and practice questions.
            </p>
          </motion.div>
        </div>

        {/* Language Cards */}
        <div className="container px-4 max-w-5xl mx-auto space-y-8">
          {LANGUAGES.map((lang, i) => (
            <motion.div key={lang.slug} {...fadeUp(i * 0.08)}>
              <div className={`rounded-2xl border ${lang.border} bg-gradient-to-br ${lang.color} overflow-hidden hover:shadow-xl transition-all duration-300 group`}>
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Icon + meta */}
                    <div className="flex-shrink-0">
                      <div className="text-6xl mb-3">{lang.icon}</div>
                      <Badge style={{ background: `${lang.accent}20`, color: lang.accent, borderColor: `${lang.accent}40` }} className="text-xs font-semibold">
                        {lang.level}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="font-display text-2xl font-bold mb-1">{lang.name}</h2>
                      <p className="text-muted-foreground text-sm mb-4">{lang.tagline}</p>

                      {/* Topics preview */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {lang.topics.map((t) => (
                          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-background/40 border border-border/40 text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Stats + CTA */}
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {lang.stats.topics} topics</span>
                          <span className="flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> {lang.stats.exercises} exercises</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Free</span>
                        </div>
                        <Link
                          href={`/languages/${lang.slug}`}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${lang.accent}, ${lang.accent}cc)`, boxShadow: `0 4px 20px ${lang.accent}30` }}>
                          Start Learning <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
