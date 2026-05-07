'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, BookmarkCheck, CheckCircle2, Circle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils'; 

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const TAGS = ['All','Array','String','Linked List','Tree','Graph','Dynamic Programming','Greedy','Binary Search','Stack','Hash Map','Two Pointer','Sliding Window','Backtracking','Design'];

interface Problem {
  id: string; number: number; title: string; slug: string;
  difficulty: 'Easy'|'Medium'|'Hard'; category: string;
  acceptance_rate: number; tags: {name:string;slug:string;color:string}[];
  submission_status?: string; bookmarked?: boolean;
}

const diffClass = { Easy:'text-difficulty-easy bg-green-500/10 border-green-500/20', Medium:'text-difficulty-medium bg-amber-500/10 border-amber-500/20', Hard:'text-difficulty-hard bg-red-500/10 border-red-500/20' };

export default function PracticePage() { 
  const [problems, setProblems]   = useState<Problem[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [difficulty, setDifficulty] = useState('All'); 
  const [tag, setTag]             = useState('All');
  const [sortBy, setSortBy]       = useState<'number'|'acceptance_rate'|'difficulty'>('number');
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('asc');

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 25 };
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (tag !== 'All') params.tag = tag.toLowerCase().replace(/ /g, '-');
      if (search) params.search = search;
      const res = await api.get('/problems', { params });
      setProblems(res.data.data.problems);
      setTotal(res.data.data.pagination.total);
    } catch {
      // Fallback demo data if API not running
      setProblems([
        {id:'1',number:1,title:'Two Sum',slug:'two-sum',difficulty:'Easy',category:'Array',acceptance_rate:73,tags:[{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Hash Map',slug:'hash-map',color:'#14b8a6'}],submission_status:'Accepted'},
        {id:'2',number:2,title:'Best Time to Buy and Sell Stock',slug:'best-time-to-buy-and-sell-stock',difficulty:'Easy',category:'Array',acceptance_rate:68,tags:[{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Greedy',slug:'greedy',color:'#f97316'}]},
        {id:'3',number:3,title:'Longest Substring Without Repeating Characters',slug:'longest-substring-without-repeating-characters',difficulty:'Medium',category:'String',acceptance_rate:49,tags:[{name:'String',slug:'string',color:'#a855f7'},{name:'Sliding Window',slug:'sliding-window',color:'#84cc16'}]},
        {id:'4',number:4,title:'Median of Two Sorted Arrays',slug:'median-of-two-sorted-arrays',difficulty:'Hard',category:'Array',acceptance_rate:38,tags:[{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Binary Search',slug:'binary-search',color:'#06b6d4'}]},
        {id:'5',number:5,title:'3Sum',slug:'3sum',difficulty:'Medium',category:'Array',acceptance_rate:38,tags:[{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Two Pointer',slug:'two-pointer',color:'#6366f1'}]},
        {id:'6',number:6,title:'Valid Parentheses',slug:'valid-parentheses',difficulty:'Easy',category:'String',acceptance_rate:82,tags:[{name:'Stack',slug:'stack',color:'#8b5cf6'},{name:'String',slug:'string',color:'#a855f7'}],submission_status:'Accepted'},
        {id:'7',number:7,title:'Number of Islands',slug:'number-of-islands',difficulty:'Medium',category:'Graph',acceptance_rate:62,tags:[{name:'Graph',slug:'graph',color:'#f59e0b'}]},
        {id:'8',number:8,title:'Climbing Stairs',slug:'climbing-stairs',difficulty:'Easy',category:'DP',acceptance_rate:88,tags:[{name:'Dynamic Programming',slug:'dp',color:'#ef4444'}],submission_status:'Accepted'},
        {id:'9',number:9,title:'Coin Change',slug:'coin-change',difficulty:'Medium',category:'DP',acceptance_rate:48,tags:[{name:'Dynamic Programming',slug:'dp',color:'#ef4444'}]},
        {id:'10',number:10,title:'Reverse Linked List',slug:'reverse-linked-list',difficulty:'Easy',category:'Linked List',acceptance_rate:88,tags:[{name:'Linked List',slug:'linked-list',color:'#00d4aa'}],submission_status:'Accepted'},
        {id:'11',number:11,title:'LRU Cache',slug:'lru-cache',difficulty:'Medium',category:'Design',acceptance_rate:48,tags:[{name:'Design',slug:'design',color:'#be185d'},{name:'Linked List',slug:'linked-list',color:'#00d4aa'}]},
        {id:'12',number:12,title:'Trapping Rain Water',slug:'trapping-rain-water',difficulty:'Hard',category:'Array',acceptance_rate:61,tags:[{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Stack',slug:'stack',color:'#8b5cf6'}]},
        {id:'13',number:13,title:'Validate Binary Search Tree',slug:'validate-binary-search-tree',difficulty:'Medium',category:'Tree',acceptance_rate:59,tags:[{name:'Tree',slug:'tree',color:'#22c55e'}]},
        {id:'14',number:14,title:'Longest Increasing Subsequence',slug:'longest-increasing-subsequence',difficulty:'Medium',category:'DP',acceptance_rate:56,tags:[{name:'Dynamic Programming',slug:'dp',color:'#ef4444'},{name:'Binary Search',slug:'binary-search',color:'#06b6d4'}]},
        {id:'15',number:15,title:'Course Schedule',slug:'course-schedule',difficulty:'Medium',category:'Graph',acceptance_rate:48,tags:[{name:'Graph',slug:'graph',color:'#f59e0b'}]},
      ]);
      setTotal(200);
    } finally {
      setLoading(false);
    }
  }, [page, difficulty, tag, search]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const filtered = problems.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
    if (tag !== 'All' && !p.tags.some(t => t.name === tag)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'number') return (a.number - b.number) * dir;
    if (sortBy === 'acceptance_rate') return (a.acceptance_rate - b.acceptance_rate) * dir;
    const dMap = {Easy:0, Medium:1, Hard:2};
    return (dMap[a.difficulty] - dMap[b.difficulty]) * dir;
  });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({col}: {col: typeof sortBy}) => sortBy === col
    ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
    : <ChevronDown className="h-3 w-3 opacity-30" />;

  const stats = { easy: problems.filter(p=>p.difficulty==='Easy').length, medium: problems.filter(p=>p.difficulty==='Medium').length, hard: problems.filter(p=>p.difficulty==='Hard').length };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border/60 bg-secondary/10">
          <div className="container px-4 py-8">
            <h1 className="font-display text-3xl font-bold mb-2">Problem Set</h1>
            <p className="text-muted-foreground mb-6">200+ curated coding problems. Sorted by topic and difficulty.</p>
            <div className="flex gap-6">
              {[{label:'Easy', val:stats.easy, cls:'text-difficulty-easy'},{label:'Medium', val:stats.medium, cls:'text-difficulty-medium'},{label:'Hard', val:stats.hard, cls:'text-difficulty-hard'}].map(s => (
                <div key={s.label} className="text-center">
                  <div className={cn('text-2xl font-display font-bold', s.cls)}>{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border/60 bg-background sticky top-16 z-10">
          <div className="container px-4 py-3 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems..."
                className="pl-9 pr-4 py-2 bg-secondary/40 border border-border/60 rounded-lg text-sm outline-none focus:border-ds-blue/50 w-56 text-foreground placeholder:text-muted-foreground/60" />
            </div>

            {/* Difficulty */}
            <div className="flex gap-1">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                    difficulty === d ? 'border-ds-blue/50 bg-ds-blue/10 text-ds-blue' : 'border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60')}>
                  {d}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {TAGS.slice(0,8).map(t => (
                <button key={t} onClick={() => setTag(t)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border whitespace-nowrap',
                    tag === t ? 'border-ds-violet/50 bg-ds-violet/10 text-ds-violet' : 'border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60')}>
                  {t}
                </button>
              ))}
            </div>

            <div className="ml-auto text-xs text-muted-foreground">{sorted.length} problems</div>
          </div>
        </div>

        {/* Table */}
        <div className="container px-4 py-4">
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" onClick={() => toggleSort('number')}>
                    <span className="flex items-center gap-1"># <SortIcon col="number" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" onClick={() => toggleSort('difficulty')}>
                    <span className="flex items-center gap-1">Difficulty <SortIcon col="difficulty" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground hidden md:table-cell" onClick={() => toggleSort('acceptance_rate')}>
                    <span className="flex items-center gap-1">Acceptance <SortIcon col="acceptance_rate" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({length:10}).map((_,i) => (
                    <tr key={i} className="border-b border-border/30">
                      {Array.from({length:5}).map((_,j) => (
                        <td key={j} className="px-4 py-4"><div className="skeleton h-4 rounded w-full max-w-[120px]" /></td>
                      ))}
                    </tr>
                  ))
                ) : sorted.map((p, i) => (
                  <motion.tr key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors group">
                    <td className="px-4 py-3.5 text-center">
                      {p.submission_status === 'Accepted'
                        ? <CheckCircle2 className="h-4 w-4 text-green-400 mx-auto" />
                        : <Circle className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground font-mono">{p.number}</td>
                    <td className="px-4 py-3.5">
                      <Link href={`/practice/${p.slug}`}
                        className="text-sm font-medium hover:text-ds-blue transition-colors group-hover:text-ds-blue/80">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md border', diffClass[p.difficulty])}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.tags.slice(0,2).map(t => (
                          <span key={t.slug} className="text-xs px-2 py-0.5 rounded-md bg-secondary/60 text-muted-foreground border border-border/50">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground hidden md:table-cell">
                      {p.acceptance_rate.toFixed(1)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Showing {sorted.length} of {total} problems</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="h-8 border-border/60">Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)} disabled={sorted.length < 25} className="h-8 border-border/60">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
