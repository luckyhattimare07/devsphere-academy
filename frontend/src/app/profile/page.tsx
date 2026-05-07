'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Trophy, Zap, Target, Calendar, Edit2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';

const MOCK_RECENT = [
  { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', status: 'Accepted', lang: 'Python', time: '2h ago', runtime: '48ms' },
  { title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', status: 'Accepted', lang: 'Python', time: '5h ago', runtime: '32ms' },
  { title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', status: 'Wrong Answer', lang: 'C++', time: '1d ago', runtime: '-' },
  { title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', status: 'Accepted', lang: 'Python', time: '2d ago', runtime: '156ms' },
  { title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', status: 'Accepted', lang: 'JavaScript', time: '3d ago', runtime: '84ms' },
];

const BADGES = [
  { name: '7-Day Streak',   icon: '🔥', desc: 'Solved every day for a week',   earned: true },
  { name: 'Python Master',  icon: '🐍', desc: 'Completed Python course',        earned: true },
  { name: 'Problem Solver', icon: '🧩', desc: 'Solved 100 problems',            earned: true },
  { name: 'Speed Runner',   icon: '⚡', desc: 'Beat 90% on runtime',            earned: false },
  { name: 'Hard Mode',      icon: '💀', desc: 'Solved 10 hard problems',        earned: false },
  { name: 'Top 100',        icon: '🏆', desc: 'Ranked in global top 100',       earned: false },
];

function DiffBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className={cn('text-xs font-semibold w-14', color)}>{label}</span>
      <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(count / max) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color === 'text-ds-green' ? 'bg-ds-green' : color === 'text-ds-amber' ? 'bg-ds-amber' : 'bg-ds-red')}
        />
      </div>
      <span className="text-xs text-muted-foreground w-12 text-right">{count} / {max}</span>
    </div>
  );
}

// Generate heatmap data
function generateHeatmap() {
  const cells: number[] = [];
  for (let i = 0; i < 52 * 7; i++) {
    const r = Math.random();
    cells.push(r < 0.55 ? 0 : r < 0.7 ? 1 : r < 0.82 ? 2 : r < 0.93 ? 3 : 4);
  }
  return cells;
}
const HEATMAP = generateHeatmap();

export default function ProfilePage() {
  const { user } = useAuthStore();
  const username = user?.username || 'devuser';
  const initials = username.slice(0, 2).toUpperCase();

  const stats = {
    total: 127, easy: 68, medium: 42, hard: 17,
    rank: 842, streak: 7, score: 3240,
    acceptance: 72,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Profile hero */}
        <div className="border-b border-border/60 bg-card">
          <div className="container px-4 py-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white font-display text-3xl font-bold shadow-lg shadow-ds-blue/20 flex-shrink-0">
                {initials}
              </div>

             <div className="flex-1">
  <div className="flex flex-wrap items-center gap-3 mb-1">
    <h1 className="font-display text-2xl font-bold">
      {user?.full_name || username}
    </h1>

    <Badge className="bg-ds-blue/10 text-ds-blue border-ds-blue/30 text-xs">
      Rank #{stats.rank}
    </Badge>
  </div>

  <p className="text-muted-foreground text-sm mb-3">
    {user?.email || 'member@devsphere.academy'} · Member since Jan 2024
  </p>
</div>

              <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-semibold text-sm mb-5 flex items-center gap-2">
                <Target className="h-4 w-4 text-ds-blue" /> Problem Stats
              </h3>
              {/* Donut-style total */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#4f8ef7" strokeWidth="3"
                      strokeDasharray={`${(stats.total / 200) * 97.4} 97.4`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-xl leading-none">{stats.total}</span>
                    <span className="text-xs text-muted-foreground">/ 200</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <DiffBar label="Easy"   count={stats.easy}   max={80} color="text-ds-green" />
                  <DiffBar label="Medium" count={stats.medium} max={80} color="text-ds-amber" />
                  <DiffBar label="Hard"   count={stats.hard}   max={40} color="text-red-400" />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Score',       value: stats.score.toLocaleString(), icon: Trophy,   color: 'text-ds-amber' },
                { label: 'Streak',      value: `${stats.streak} 🔥`,         icon: Zap,      color: 'text-ds-red' },
                { label: 'Acceptance',  value: `${stats.acceptance}%`,        icon: Target,   color: 'text-ds-green' },
                { label: 'Global Rank', value: `#${stats.rank}`,              icon: Trophy,   color: 'text-ds-violet' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                  <div className={cn('font-display font-bold text-xl', s.color)}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-ds-amber" /> Badges
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map((b) => (
                  <div key={b.name} title={b.desc}
                    className={cn('flex flex-col items-center gap-1 p-2 rounded-lg border transition-all', b.earned ? 'border-ds-amber/30 bg-ds-amber/5' : 'border-border/40 bg-secondary/30 opacity-40')}>
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-xs text-center leading-tight">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heatmap */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-ds-blue" /> Activity Heatmap
              </h3>
              <div className="overflow-x-auto">
                <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(52, minmax(0, 1fr))`, gridTemplateRows: 'repeat(7, 1fr)', width: 'max-content' }}>
                  {HEATMAP.map((v, i) => (
                    <div key={i} className={cn('heat-cell', `heat-${v}`)} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-xs text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map((v) => (
                  <div key={v} className={cn('heat-cell', `heat-${v}`)} />
                ))}
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>

            {/* Recent submissions */}
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Recent Submissions</h3>
                <Badge className="text-xs bg-secondary text-muted-foreground border-border/40">Last 30 days</Badge>
              </div>
              <div className="divide-y divide-border/40">
                {MOCK_RECENT.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/30 transition-colors">
                    {s.status === 'Accepted'
                      ? <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <a href={`/practice/${s.slug}`} className="text-sm font-medium hover:text-ds-blue transition-colors truncate block">{s.title}</a>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-xs font-semibold', s.difficulty === 'Easy' ? 'text-ds-green' : s.difficulty === 'Medium' ? 'text-ds-amber' : 'text-red-400')}>
                          {s.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{s.lang}</span>
                      </div>
                    </div>
                    {s.status === 'Accepted' && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" /> {s.runtime}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground flex-shrink-0">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
