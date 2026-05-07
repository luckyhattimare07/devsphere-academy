'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Code2, BookOpen, BarChart3, Plus, Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'overview',  label: 'Overview',  icon: BarChart3 },
  { id: 'problems',  label: 'Problems',  icon: Code2 },
  { id: 'users',     label: 'Users',     icon: Users },
  { id: 'articles',  label: 'Articles',  icon: BookOpen },
];

const MOCK_STATS = {
  totalUsers: 52140, activeUsers: 38420, totalProblems: 200,
  publishedProblems: 187, totalSubmissions: 1284900, acceptanceRate: 61,
  totalArticles: 24, totalViews: 892000,
};

const MOCK_USERS = [
  { id: '1', username: 'arjun_sharma', email: 'arjun@gmail.com', role: 'user',  active: true,  solved: 147, joined: '2024-01-12' },
  { id: '2', username: 'priya_m',      email: 'priya@gmail.com',  role: 'user',  active: true,  solved: 89,  joined: '2024-02-03' },
  { id: '3', username: 'admin_dev',    email: 'admin@devsphere.academy', role: 'admin', active: true, solved: 200, joined: '2023-12-01' },
  { id: '4', username: 'spammer_99',   email: 'spam@xyz.com',     role: 'user',  active: false, solved: 0,   joined: '2024-05-10' },
  { id: '5', username: 'rahul_cpp',    email: 'rahul@gmail.com',  role: 'user',  active: true,  solved: 163, joined: '2024-01-28' },
];

const MOCK_PROBLEMS = [
  { id: '1', number: 1,   title: 'Two Sum',            difficulty: 'Easy',   published: true,  submissions: 12840, acceptance: 73 },
  { id: '2', number: 2,   title: 'Best Time to Buy',   difficulty: 'Easy',   published: true,  submissions: 9210,  acceptance: 68 },
  { id: '3', number: 8,   title: 'Trapping Rain Water',difficulty: 'Hard',   published: true,  submissions: 4120,  acceptance: 61 },
  { id: '4', number: 51,  title: 'Climbing Stairs',    difficulty: 'Easy',   published: true,  submissions: 15200, acceptance: 88 },
  { id: '5', number: 201, title: 'Advanced BFS',       difficulty: 'Medium', published: false, submissions: 0,     acceptance: 0  },
];

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</div>
      <div className={cn('font-display text-3xl font-bold', color)}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState(MOCK_USERS);
  const [problems, setProblems] = useState(MOCK_PROBLEMS);

  const toggleUser = (id: string) => setUsers((u) => u.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  const toggleProblem = (id: string) => setProblems((p) => p.map((x) => x.id === id ? { ...x, published: !x.published } : x));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 fixed left-0 top-16 bottom-0 bg-card border-r border-border/60 z-20 p-4">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Shield className="h-4 w-4 text-ds-red" />
            <span className="font-display font-bold text-sm text-ds-red">Admin Panel</span>
          </div>
          <nav className="space-y-0.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  tab === t.id ? 'bg-ds-blue/10 text-ds-blue font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="ml-56 flex-1 p-8 overflow-y-auto">
          {/* Overview */}
          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display text-2xl font-bold mb-6">Platform Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Users"     value={MOCK_STATS.totalUsers}       sub={`${MOCK_STATS.activeUsers.toLocaleString()} active`} color="text-ds-blue" />
                <StatCard label="Problems"        value={MOCK_STATS.totalProblems}    sub={`${MOCK_STATS.publishedProblems} published`}          color="text-ds-green" />
                <StatCard label="Submissions (30d)" value={MOCK_STATS.totalSubmissions} sub={`${MOCK_STATS.acceptanceRate}% acceptance`}          color="text-ds-violet" />
                <StatCard label="Article Views"  value={MOCK_STATS.totalViews}       sub={`${MOCK_STATS.totalArticles} articles`}               color="text-ds-amber" />
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={() => setTab('problems')} className="gap-2 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0">
                    <Plus className="h-4 w-4" /> Add Problem
                  </Button>
                  <Button onClick={() => setTab('articles')} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> New Article
                  </Button>
                  <Button onClick={() => setTab('users')} variant="outline" className="gap-2">
                    <Users className="h-4 w-4" /> Manage Users
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Problems */}
          {tab === 'problems' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl font-bold">Problems</h1>
                <Button className="gap-2 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0">
                  <Plus className="h-4 w-4" /> Add Problem
                </Button>
              </div>
              <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/60 bg-secondary/30">
                    <tr>
                      {['#','Title','Difficulty','Status','Submissions','Acceptance','Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {problems.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.number}</td>
                        <td className="px-4 py-3 font-medium">{p.title}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs border-0',
                            p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                            p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                          )}>{p.difficulty}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs border-0 cursor-pointer', p.published ? 'bg-green-500/10 text-green-400' : 'bg-secondary text-muted-foreground')}
                            onClick={() => toggleProblem(p.id)}>
                            {p.published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.submissions.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.acceptance}%</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl font-bold">Users</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input placeholder="Search users..." className="pl-9 pr-4 py-2 rounded-lg border border-border/60 bg-secondary/50 text-sm outline-none focus:border-ds-blue/50 w-56 placeholder:text-muted-foreground" />
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/60 bg-secondary/30">
                    <tr>
                      {['User','Email','Role','Status','Solved','Joined','Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.map((u) => (
                      <tr key={u.id} className={cn('hover:bg-secondary/20 transition-colors', !u.active && 'opacity-50')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white text-xs font-bold">
                              {u.username.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge className={cn('text-xs border-0', u.role === 'admin' ? 'bg-ds-red/10 text-ds-red' : 'bg-secondary text-muted-foreground')}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleUser(u.id)} className="transition-colors">
                            {u.active
                              ? <ToggleRight className="h-5 w-5 text-green-400" />
                              : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.solved}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{u.joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                            <button className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Articles */}
          {tab === 'articles' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl font-bold">Articles</h1>
                <Button className="gap-2 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0">
                  <Plus className="h-4 w-4" /> New Article
                </Button>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-8 text-center text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium mb-1">Article Editor</p>
                <p className="text-sm">Create rich Markdown articles with code blocks, images, and tags. Connect to the /api/v1/articles endpoint.</p>
                <Button className="mt-4 gap-2 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0">
                  <Plus className="h-4 w-4" /> Write New Article
                </Button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
