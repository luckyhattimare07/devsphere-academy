'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Eye, Heart, ChevronRight, BookOpen, Tag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ARTICLES = [
  {
    id: '1', slug: 'mastering-dynamic-programming',
    title: 'Mastering Dynamic Programming: A Complete Guide',
    excerpt: 'From Fibonacci to LCS — understand the patterns behind every DP problem with visual diagrams and optimised code.',
    category: 'Tutorial', categoryColor: '#4f8ef7',
    readTime: 8, views: 12400, likes: 847,
    author: { name: 'Arjun Sharma', initials: 'AS' },
    tags: ['DP', 'Algorithms', 'Interview Prep'],
    featured: true,
    icon: '⚡',
  },
  {
    id: '2', slug: 'top-15-leetcode-patterns',
    title: 'Top 15 LeetCode Patterns You Must Know',
    excerpt: 'These 15 patterns solve 90% of coding interview problems. Learn them once, apply everywhere.',
    category: 'Interview Prep', categoryColor: '#a855f7',
    readTime: 6, views: 28100, likes: 1920,
    author: { name: 'Priya Mehta', initials: 'PM' },
    tags: ['LeetCode', 'Patterns', 'Interview'],
    featured: true,
    icon: '🎯',
  },
  {
    id: '3', slug: 'python-one-liners',
    title: 'Python One-Liners That Will Impress Your Interviewer',
    excerpt: 'List comprehensions, walrus operator, lambda tricks — write elegant Python that shows you really know the language.',
    category: 'Tutorial', categoryColor: '#4f8ef7',
    readTime: 5, views: 9800, likes: 634,
    author: { name: 'DevSphere Team', initials: 'DT' },
    tags: ['Python', 'Tips', 'Interview'],
    featured: false,
    icon: '🐍',
  },
  {
    id: '4', slug: 'bfs-vs-dfs',
    title: 'When to Use BFS vs DFS — A Practical Guide',
    excerpt: 'Both explore graphs but have very different use cases. Here\'s exactly when to pick each one, with examples.',
    category: 'Tutorial', categoryColor: '#4f8ef7',
    readTime: 6, views: 7200, likes: 512,
    author: { name: 'Rahul Verma', initials: 'RV' },
    tags: ['Graph', 'BFS', 'DFS', 'Algorithms'],
    featured: false,
    icon: '🕸️',
  },
  {
    id: '5', slug: 'stl-mastery',
    title: 'STL Mastery: Maps, Sets, and Priority Queues in C++',
    excerpt: 'The Standard Template Library is your best friend in competitive programming. Here\'s a complete guide.',
    category: 'Tutorial', categoryColor: '#4f8ef7',
    readTime: 7, views: 6100, likes: 423,
    author: { name: 'Karan Patel', initials: 'KP' },
    tags: ['C++', 'STL', 'Competitive'],
    featured: false,
    icon: '🟣',
  },
  {
    id: '6', slug: 'url-shortener-system-design',
    title: 'How to Design a URL Shortener (Bit.ly Clone)',
    excerpt: 'Walk through the complete system design interview for a URL shortener — from requirements to architecture.',
    category: 'System Design', categoryColor: '#22c55e',
    readTime: 12, views: 15700, likes: 1102,
    author: { name: 'Neha Rao', initials: 'NR' },
    tags: ['System Design', 'Interview', 'Architecture'],
    featured: false,
    icon: '🏗️',
  },
  {
    id: '7', slug: 'cracking-faang-interviews',
    title: 'Cracking FAANG Coding Interviews: A 3-Month Plan',
    excerpt: 'A structured, week-by-week plan to prepare for Google, Meta, Amazon, and other top tech interviews.',
    category: 'Career', categoryColor: '#ef4444',
    readTime: 10, views: 31200, likes: 2440,
    author: { name: 'Arjun Sharma', initials: 'AS' },
    tags: ['FAANG', 'Career', 'Interview', 'Roadmap'],
    featured: false,
    icon: '🚀',
  },
  {
    id: '8', slug: 'async-javascript-deep-dive',
    title: 'Async JavaScript Deep Dive: Promises, Async/Await & the Event Loop',
    excerpt: 'Finally understand how the event loop works, why Promises exist, and how async/await makes it readable.',
    category: 'Tutorial', categoryColor: '#4f8ef7',
    readTime: 9, views: 8900, likes: 671,
    author: { name: 'Sneha Patel', initials: 'SP' },
    tags: ['JavaScript', 'Async', 'Web'],
    featured: false,
    icon: '🟤',
  },
];

const CATEGORIES = ['All', 'Tutorial', 'Interview Prep', 'System Design', 'Career', 'Competitive'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((a) => a.featured).slice(0, 2);
  const rest = filtered.filter((a) => !a.featured || featured.length >= 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Header */}
        <div className="container px-4 mb-12">
          <motion.div {...fadeUp()} className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <Badge className="mb-3 bg-ds-blue/10 text-ds-blue border-ds-blue/30">Articles & Tutorials</Badge>
              <h1 className="font-display text-4xl font-bold mb-2">
                DevSphere <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-muted-foreground">In-depth tutorials, interview prep, and career advice from the community.</p>
            </div>
            {/* Search */}
            <div className="md:ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-sm w-72 outline-none focus:border-ds-blue/50 focus:bg-secondary transition-all placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>

          {/* Category filters */}
          <motion.div {...fadeUp(0.08)} className="flex gap-2 mt-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-ds-blue/15 text-ds-blue border border-ds-blue/30'
                    : 'text-muted-foreground border border-border/50 hover:border-border hover:text-foreground'
                )}>
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="container px-4">
          {/* Featured */}
          {featured.length > 0 && activeCategory === 'All' && !search && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {featured.map((a, i) => (
                <motion.article key={a.id} {...fadeUp(i * 0.08)}>
                  <a href={`/blog/${a.slug}`}
                    className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-ds-blue/40 hover:shadow-xl hover:shadow-black/10 transition-all h-full">
                    <div className="h-48 bg-gradient-to-br from-secondary to-background flex items-center justify-center text-6xl border-b border-border/60">
                      {a.icon}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge style={{ background: `${a.categoryColor}20`, color: a.categoryColor, borderColor: `${a.categoryColor}40` }} className="text-xs font-semibold">
                          {a.category}
                        </Badge>
                        <Badge className="text-xs bg-ds-amber/10 text-ds-amber border-ds-amber/30">Featured</Badge>
                      </div>
                      <h2 className="font-semibold text-lg leading-snug mb-2 group-hover:text-ds-blue transition-colors line-clamp-2">{a.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{a.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white font-bold text-[9px]">{a.author.initials}</div>
                          {a.author.name}
                        </div>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readTime} min</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {(a.views / 1000).toFixed(1)}k</span>
                        <span className="flex items-center gap-1 ml-auto"><Heart className="h-3 w-3" /> {a.likes}</span>
                      </div>
                    </div>
                  </a>
                </motion.article>
              ))}
            </div>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {rest.map((a, i) => (
              <motion.article key={a.id} {...fadeUp(i * 0.05)}>
                <a href={`/blog/${a.slug}`}
                  className="group block rounded-xl border border-border/60 bg-card overflow-hidden hover:border-ds-blue/40 hover:shadow-lg transition-all h-full">
                  <div className="h-32 bg-gradient-to-br from-secondary to-background flex items-center justify-center text-4xl border-b border-border/60">
                    {a.icon}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: a.categoryColor }} className="text-xs font-semibold uppercase tracking-wide">{a.category}</span>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-ds-blue transition-colors line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{a.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {a.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readTime} min</span>
                      <span className="flex items-center gap-1 ml-auto"><Eye className="h-3 w-3" /> {(a.views / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No articles found for "{search || activeCategory}"</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
