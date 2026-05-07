'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Flame, Code2, Target, Clock, Bookmark, ChevronRight, CheckCircle2, XCircle, Minus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const DEMO_DATA = {
  stats: { problems_solved:127, easy_solved:68, medium_solved:42, hard_solved:17, score:3240, ranking:842, streak_current:7, streak_max:21, total_submissions:342, username:'DevSphere', full_name:'Dev Sphere' },
  recent_submissions: [
    {title:'Two Sum', slug:'two-sum', difficulty:'Easy', status:'Accepted', language:'python', submitted_at: new Date(Date.now()-7200000).toISOString()},
    {title:'Valid Parentheses', slug:'valid-parentheses', difficulty:'Easy', status:'Accepted', language:'python', submitted_at: new Date(Date.now()-86400000).toISOString()},
    {title:'Climbing Stairs', slug:'climbing-stairs', difficulty:'Easy', status:'Accepted', language:'cpp', submitted_at: new Date(Date.now()-172800000).toISOString()},
    {title:'3Sum', slug:'3sum', difficulty:'Medium', status:'Wrong Answer', language:'python', submitted_at: new Date(Date.now()-259200000).toISOString()},
    {title:'LRU Cache', slug:'lru-cache', difficulty:'Medium', status:'Accepted', language:'java', submitted_at: new Date(Date.now()-345600000).toISOString()},
  ],
  bookmarks: [
    {title:'Trapping Rain Water', slug:'trapping-rain-water', difficulty:'Hard', acceptance_rate:61},
    {title:'Merge K Sorted Lists', slug:'merge-k-sorted-lists', difficulty:'Hard', acceptance_rate:47},
    {title:'Word Break', slug:'word-break', difficulty:'Medium', acceptance_rate:51},
  ],
  recommended: [
    {number:5, title:'3Sum', slug:'3sum', difficulty:'Medium', acceptance_rate:38, tags:['Array','Two Pointer']},
    {number:9, title:'Coin Change', slug:'coin-change', difficulty:'Medium', acceptance_rate:48, tags:['DP']},
    {number:13, title:'Binary Tree Level Order', slug:'binary-tree-level-order-traversal', difficulty:'Medium', acceptance_rate:74, tags:['Tree','BFS']},
  ],
};

const LEADERBOARD = [
  {rank:1, username:'CodeNinja_07', problems_solved:187, score:4821, streak_current:45},
  {rank:2, username:'algo_master',  problems_solved:174, score:4563, streak_current:30},
  {rank:3, username:'priya_dev',    problems_solved:166, score:4201, streak_current:22},
  {rank:4, username:'leetcode_pro', problems_solved:158, score:3980, streak_current:15},
  {rank:5, username:'rahul_cpp',    problems_solved:145, score:3744, streak_current:10},
];

const LANG_PROGRESS = [
  {lang:'Python',     pct:78, color:'from-yellow-400 to-yellow-500'},
  {lang:'C++',        pct:55, color:'from-pink-400 to-pink-500'},
  {lang:'Java',       pct:40, color:'from-orange-400 to-orange-500'},
  {lang:'C',          pct:62, color:'from-gray-400 to-gray-500'},
  {lang:'JavaScript', pct:33, color:'from-amber-400 to-amber-500'},
];

const diffColor = {Easy:'text-difficulty-easy', Medium:'text-difficulty-medium', Hard:'text-difficulty-hard'};
const statusIcon = {Accepted:<CheckCircle2 className="h-4 w-4 text-green-400"/>, 'Wrong Answer':<XCircle className="h-4 w-4 text-red-400"/>, default:<Minus className="h-4 w-4 text-muted-foreground"/>};

function HeatMap({data}: {data:{date:string;count:number}[]}) {
  const weeks = 52;
  const today = new Date();
  const cells = Array.from({length: weeks * 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (weeks * 7 - 1 - i));
    const key = d.toISOString().split('T')[0];
    const entry = data.find(a => a.date === key);
    const count = entry?.count || 0;
    const level = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4;
    return { date: key, count, level };
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {Array.from({length: weeks}).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {cells.slice(w*7, w*7+7).map((c, d) => (
              <div key={d} title={`${c.date}: ${c.count} submissions`}
                className={cn('heat-cell cursor-default transition-colors hover:opacity-80', `heat-${c.level}`)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [heatmap, setHeatmap] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, heatRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/heatmap'),
      ]);
      setData(dashRes.data.data);
      setHeatmap(heatRes.data.data.activity);
    } catch {
      setData(DEMO_DATA);
      // Generate demo heatmap
      const now = new Date();
      const demo = [];
      for (let i = 0; i < 180; i++) {
        if (Math.random() > 0.5) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          demo.push({ date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 8) + 1 });
        }
      }
      setHeatmap(demo);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || DEMO_DATA.stats;
  const recentSubs = data?.recent_submissions || DEMO_DATA.recent_submissions;
  const bookmarks = data?.bookmarks || DEMO_DATA.bookmarks;
  const recommended = data?.recommended || DEMO_DATA.recommended;

  const totalProblems = 200;
  const solvedPct = Math.round((stats.problems_solved / totalProblems) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ds-blue/30 border-t-ds-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border/60 bg-secondary/10">
          <div className="container px-4 py-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">
                Welcome back, <span className="text-gradient">{stats.username || 'Developer'}</span> 👋
              </h1>
              <p className="text-muted-foreground text-sm">
                {stats.streak_current > 0 ? `🔥 ${stats.streak_current}-day streak! Keep it going.` : "Start coding to build your streak!"}
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 shadow-md">
              <Link href="/practice">Practice Now <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <div className="container px-4 py-6 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {label:'Solved',    val:stats.problems_solved,  sub:`of ${totalProblems}`, color:'text-ds-blue',   icon:Code2},
              {label:'Easy',      val:stats.easy_solved,       sub:'solved',             color:'text-difficulty-easy',   icon:Target},
              {label:'Medium',    val:stats.medium_solved,     sub:'solved',             color:'text-difficulty-medium',  icon:Target},
              {label:'Hard',      val:stats.hard_solved,       sub:'solved',             color:'text-difficulty-hard',    icon:Target},
              {label:'Streak',    val:`${stats.streak_current}🔥`, sub:'days',           color:'text-amber-400',  icon:Flame},
              {label:'Rank',      val:`#${stats.ranking?.toLocaleString() || '—'}`, sub:'global', color:'text-ds-violet', icon:Trophy},
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:i*0.07}}
                className="rounded-xl border border-border/60 bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{s.label}</div>
                <div className={cn('font-display text-2xl font-bold', s.color)}>{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress breakdown */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="font-semibold mb-4 flex items-center justify-between">
                <span>Progress Overview</span>
                <span className="text-sm text-muted-foreground">{solvedPct}% complete</span>
              </div>
              {/* Circular-like breakdown */}
              <div className="space-y-3 mb-5">
                {[
                  {label:'Easy',   solved:stats.easy_solved,   total:80,  color:'bg-green-500'},
                  {label:'Medium', solved:stats.medium_solved,  total:80,  color:'bg-amber-500'},
                  {label:'Hard',   solved:stats.hard_solved,    total:40,  color:'bg-red-500'},
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className={cn('font-medium', {Easy:'text-difficulty-easy',Medium:'text-difficulty-medium',Hard:'text-difficulty-hard'}[item.label])}>{item.label}</span>
                      <span>{item.solved}/{item.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                      <motion.div className={cn('h-full rounded-full', item.color)}
                        initial={{width:0}} animate={{width:`${(item.solved/item.total)*100}%`}} transition={{duration:0.8, delay:0.3}} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Language progress */}
              <div className="font-semibold mb-3 text-sm">Language Mastery</div>
              <div className="space-y-2.5">
                {LANG_PROGRESS.map((l, i) => (
                  <div key={l.lang}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{l.lang}</span><span>{l.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                      <motion.div className={cn('h-full rounded-full bg-gradient-to-r', l.color)}
                        initial={{width:0}} animate={{width:`${l.pct}%`}} transition={{duration:0.7, delay:0.1*i+0.5}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="font-semibold mb-4 flex items-center justify-between">
                <span>Recent Submissions</span>
                <Link href="/practice" className="text-xs text-ds-blue hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {recentSubs.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/30 transition-colors">
                    {(statusIcon as any)[s.status] || statusIcon.default}
                    <div className="flex-1 min-w-0">
                      <Link href={`/practice/${s.slug}`} className="text-sm font-medium hover:text-ds-blue transition-colors truncate block">{s.title}</Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={diffColor[s.difficulty as keyof typeof diffColor]}>{s.difficulty}</span>
                        <span>·</span>
                        <span>{s.language}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(s.submitted_at), {addSuffix:true})}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="font-semibold mb-4 flex items-center justify-between">
                <span>Global Leaderboard</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-1">
                {LEADERBOARD.map((u, i) => (
                  <div key={u.rank} className={cn('flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                    i < 3 ? 'hover:bg-amber-500/5' : 'hover:bg-secondary/30')}>
                    <span className={cn('font-display font-bold text-base w-6 text-center',
                      i===0?'text-amber-400':i===1?'text-gray-400':i===2?'text-amber-700':'text-muted-foreground')}>
                      {u.rank}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.username}</div>
                      <div className="text-xs text-muted-foreground">{u.problems_solved} solved · {u.streak_current}🔥</div>
                    </div>
                    <span className="text-xs font-mono text-ds-blue">{u.score.toLocaleString()}</span>
                  </div>
                ))}
                {/* Your rank */}
                <div className="border-t border-border/40 mt-2 pt-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-ds-blue/5 border border-ds-blue/20">
                    <span className="font-display font-bold text-sm w-6 text-center text-ds-blue">#{stats.ranking?.toLocaleString()}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(stats.username||'D')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{stats.username} (You)</div>
                      <div className="text-xs text-muted-foreground">{stats.problems_solved} solved</div>
                    </div>
                    <span className="text-xs font-mono text-ds-blue">{stats.score?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity heatmap */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="font-semibold mb-4 flex items-center justify-between">
              <span>Coding Activity</span>
              <span className="text-xs text-muted-foreground">{heatmap.reduce((a,b) => a + b.count, 0)} submissions in the last year</span>
            </div>
            <HeatMap data={heatmap} />
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              {[0,1,2,3,4].map(l => <div key={l} className={cn('heat-cell', `heat-${l}`)} />)}
              <span>More</span>
            </div>
          </div>

          {/* Bookmarks + Recommended */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-ds-blue" /> Bookmarked Problems
              </div>
              {bookmarks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookmarks yet. Bookmark problems while solving.</p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((b: any) => (
                    <Link key={b.slug} href={`/practice/${b.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/30 transition-colors group">
                      <div>
                        <div className="text-sm font-medium group-hover:text-ds-blue transition-colors">{b.title}</div>
                        <div className="text-xs text-muted-foreground">{b.acceptance_rate}% acceptance</div>
                      </div>
                      <span className={cn('text-xs font-semibold', diffColor[b.difficulty as keyof typeof diffColor])}>{b.difficulty}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-ds-violet" /> Recommended For You
              </div>
              <div className="space-y-2">
                {recommended.map((p: any) => (
                  <Link key={p.slug} href={`/practice/${p.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/30 transition-colors group">
                    <span className="text-sm text-muted-foreground font-mono w-8">{p.number}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium group-hover:text-ds-blue transition-colors truncate">{p.title}</div>
                      <div className="flex gap-1.5 mt-0.5">
                        {(Array.isArray(p.tags) ? p.tags : []).slice(0,2).map((t: any) => (
                          <span key={typeof t==='string'?t:t.name} className="text-xs bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">
                            {typeof t==='string'?t:t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn('text-xs font-semibold', diffColor[p.difficulty as keyof typeof diffColor])}>{p.difficulty}</span>
                      <span className="text-xs text-muted-foreground">{p.acceptance_rate}%</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-3 border-border/60 text-sm h-9">
                <Link href="/practice">Browse All Problems <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
