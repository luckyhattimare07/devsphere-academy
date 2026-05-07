'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Play, Send, ChevronDown, Bookmark, BookmarkCheck, MessageSquare, Lightbulb, CheckCircle2, XCircle, Clock, Cpu, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANG_OPTIONS = [
  { id: 'python',     label: 'Python',     monacoId: 'python'     },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp'        },
  { id: 'java',       label: 'Java',       monacoId: 'java'       },
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
  { id: 'c',          label: 'C',          monacoId: 'c'          },
];

const diffClass = {
  Easy:   'text-difficulty-easy bg-green-500/10 border-green-500/20',
  Medium: 'text-difficulty-medium bg-amber-500/10 border-amber-500/20',
  Hard:   'text-difficulty-hard bg-red-500/10 border-red-500/20',
};

type ProblemTab = 'description' | 'editorial' | 'submissions' | 'discuss';
type ResultTab  = 'result' | 'testcases';

export default function ProblemPage() {
  const params = useParams();
  const slug = params.id as string;

  const [problem, setProblem]     = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [lang, setLang]           = useState(LANG_OPTIONS[0]);
  const [code, setCode]           = useState('');
  const [probTab, setProbTab]     = useState<ProblemTab>('description');
  const [resultTab, setResultTab] = useState<ResultTab>('result');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning]     = useState(false);
  const [result, setResult]       = useState<any>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIdx, setHintIdx]     = useState(0);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [langOpen, setLangOpen]   = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/problems/${slug}`);
      const p = res.data.data.problem;
      setProblem(p);
      setBookmarked(p.bookmarked || false);
      // Set default code for selected language
      const starter = p.starter_codes?.[lang.id] || `# Solve ${p.title}\n`;
      setCode(starter);
    } catch {
      // Demo fallback
      const demo = {
        number: 1, title: 'Two Sum', difficulty: 'Easy',
        description: `## Two Sum\n\nGiven an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nReturn the answer in any order.`,
        constraints: '2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹',
        examples: [
          {input:'nums = [2,7,11,15], target = 9', output:'[0,1]', explanation:'nums[0] + nums[1] = 9'},
          {input:'nums = [3,2,4], target = 6',      output:'[1,2]', explanation:'nums[1] + nums[2] = 6'},
        ],
        hints: ['Try using a hash map for O(n) solution','For each element, check if (target - element) exists in the map'],
        tags: [{name:'Array',slug:'array',color:'#4f8ef7'},{name:'Hash Map',slug:'hash-map',color:'#14b8a6'}],
        starter_codes: {
          python: `def twoSum(nums, target):\n    # Your solution here\n    pass\n\n# Test\nprint(twoSum([2,7,11,15], 9))`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n}`,
          java: `public int[] twoSum(int[] nums, int target) {\n    // Your solution here\n    return new int[]{};\n}`,
          javascript: `var twoSum = function(nums, target) {\n    // Your solution here\n};`,
          c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your solution here\n}`,
        },
        test_cases: [
          {input:'[2,7,11,15]\n9', expected:'[0,1]', is_hidden:false},
          {input:'[3,2,4]\n6', expected:'[1,2]', is_hidden:false},
        ],
        acceptance_rate: 73, total_submissions: 12543, accepted_submissions: 9156,
      };
      setProblem(demo);
      setCode(demo.starter_codes.python);
    } finally {
      setLoading(false);
    }
  };

  const handleLangChange = (l: typeof LANG_OPTIONS[0]) => {
    setLang(l);
    setLangOpen(false);
    const starter = problem?.starter_codes?.[l.id] || `// Solve ${problem?.title || 'Problem'}\n`;
    setCode(starter);
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setResultTab('result');
    setResult(null);
    try {
      const res = await api.post('/compiler/execute', {
        language: lang.id,
        source_code: code,
        stdin: problem?.test_cases?.[0]?.input || '',
      });
      setResult({ type: 'run', ...res.data.data });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Execution failed');
      setResult({ type: 'run', status: 'Error', status_id: 0, stdout: '', stderr: 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting || !problem) return;
    setSubmitting(true);
    setResultTab('result');
    setResult(null);
    try {
      const res = await api.post('/submissions', {
        problem_id: problem.id,
        language: lang.id,
        code,
      });
      const data = res.data.data;
      setResult({ type: 'submit', ...data });
      if (data.passed) {
        toast.success('🎉 Accepted!');
      } else {
        toast.error(`Wrong Answer on test case`);
      }
      setSubmissions(prev => [{ language: lang.id, status: data.status, runtime_ms: data.runtime_ms, submitted_at: new Date().toISOString() }, ...prev]);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBookmark = async () => {
    if (!problem) return;
    try {
      const res = await api.post(`/problems/${problem.id}/bookmark`);
      setBookmarked(res.data.data.bookmarked);
      toast.success(res.data.data.bookmarked ? 'Bookmarked' : 'Bookmark removed');
    } catch { toast.error('Login required to bookmark'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ds-blue/30 border-t-ds-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col flex-1 pt-16" style={{height:'calc(100vh)'}}>
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border/60 bg-secondary/10 flex-wrap">
          <Link href="/practice" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />Problems
          </Link>
          <div className="h-4 w-px bg-border" />
          {problem && (
            <>
              <span className="text-sm font-medium">{problem.number}. {problem.title}</span>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', diffClass[problem.difficulty as keyof typeof diffClass])}>
                {problem.difficulty}
              </span>
              {problem.tags?.slice(0,3).map((t: any) => (
                <span key={t.slug} className="text-xs px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/50 hidden md:block">{t.name}</span>
              ))}
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleBookmark} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground">
              {bookmarked ? <BookmarkCheck className="h-4 w-4 text-ds-blue" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Problem */}
          <div className="w-96 xl:w-[440px] flex flex-col border-r border-border/60 overflow-hidden">
            {/* Problem tabs */}
            <div className="flex border-b border-border/60 bg-secondary/10 overflow-x-auto">
              {(['description','editorial','submissions','discuss'] as ProblemTab[]).map(t => (
                <button key={t} onClick={() => setProbTab(t)}
                  className={cn('px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap',
                    probTab===t ? 'text-ds-blue border-ds-blue' : 'text-muted-foreground border-transparent hover:text-foreground')}>
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {probTab === 'description' && problem && (
                <div className="space-y-5">
                  <div className="problem-content prose prose-invert max-w-none text-sm">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
                      {problem.description}
                    </ReactMarkdown>
                  </div>

                  {problem.examples?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Examples</h3>
                      {problem.examples.map((ex: any, i: number) => (
                        <div key={i} className="rounded-lg border border-border/50 overflow-hidden">
                          <div className="px-3 py-1.5 bg-secondary/30 text-xs font-semibold text-muted-foreground">Example {i+1}</div>
                          <div className="p-3 font-mono text-xs space-y-1">
                            <div><span className="text-muted-foreground">Input:  </span><span className="text-[#abb2bf]">{ex.input}</span></div>
                            <div><span className="text-muted-foreground">Output: </span><span className="text-[#98c379]">{ex.output}</span></div>
                            {ex.explanation && <div className="text-muted-foreground text-xs mt-1">{ex.explanation}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {problem.constraints && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Constraints</h3>
                      <div className="bg-secondary/30 rounded-lg p-3 font-mono text-xs text-muted-foreground whitespace-pre-line border border-border/40">
                        {problem.constraints}
                      </div>
                    </div>
                  )}

                  {problem.hints?.length > 0 && (
                    <div>
                      <button onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                        <Lightbulb className="h-4 w-4" />
                        {showHints ? 'Hide hints' : `Show hint (${problem.hints.length} available)`}
                      </button>
                      {showHints && (
                        <div className="mt-2 space-y-2">
                          {problem.hints.slice(0, hintIdx+1).map((h: string, i: number) => (
                            <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200/80">
                              💡 {h}
                            </div>
                          ))}
                          {hintIdx < problem.hints.length - 1 && (
                            <button onClick={() => setHintIdx(i => i+1)} className="text-xs text-amber-400 hover:text-amber-300">
                              Show next hint →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
                    <span>Submissions: <span className="text-foreground font-medium">{problem.total_submissions?.toLocaleString()}</span></span>
                    <span>Acceptance: <span className="text-green-400 font-medium">{problem.acceptance_rate?.toFixed(1)}%</span></span>
                  </div>
                </div>
              )}

              {probTab === 'editorial' && (
                <div className="text-sm text-muted-foreground text-center py-12">
                  <div className="text-3xl mb-3">📖</div>
                  <p>Editorial available after solving the problem.</p>
                </div>
              )}

              {probTab === 'submissions' && (
                <div className="space-y-2">
                  {submissions.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-12">
                      <div className="text-3xl mb-3">📋</div>No submissions yet
                    </div>
                  ) : submissions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20 text-sm">
                      <span className={cn('font-semibold', s.status==='Accepted' ? 'text-green-400' : 'text-red-400')}>{s.status}</span>
                      <span className="text-muted-foreground text-xs">{s.language}</span>
                      <span className="text-muted-foreground text-xs">{s.runtime_ms}ms</span>
                    </div>
                  ))}
                </div>
              )}

              {probTab === 'discuss' && (
                <div className="text-center text-muted-foreground text-sm py-12">
                  <div className="text-3xl mb-3">💬</div>
                  <p>Discussion board — share approaches and ask questions.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right — Editor + Results */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border/60 bg-secondary/10">
              {/* Language selector */}
              <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card hover:bg-secondary/60 text-sm font-medium transition-colors">
                  {lang.label}
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
                      className="absolute top-full left-0 mt-1 w-36 bg-card border border-border/60 rounded-xl shadow-xl z-10 overflow-hidden">
                      {LANG_OPTIONS.map(l => (
                        <button key={l.id} onClick={() => handleLangChange(l)}
                          className={cn('w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors',
                            lang.id===l.id && 'text-ds-blue bg-secondary/60')}>
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRun} disabled={running || submitting} className="h-8 gap-2 border-border/60">
                  {running ? <div className="w-3 h-3 border-2 border-ds-blue/30 border-t-ds-blue rounded-full animate-spin" /> : <Play className="h-3 w-3" />}
                  Run
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={running || submitting}
                  className="h-8 gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md shadow-green-500/20 font-semibold">
                  {submitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-3 w-3" />}
                  Submit
                </Button>
              </div>
            </div>

            {/* Monaco */}
            <div style={{ height: result ? 'calc(100% - 220px)' : 'calc(100% - 60px)' }}>
              <MonacoEditor
                height="100%"
                language={lang.monacoId}
                theme="vs-dark"
                value={code}
                onChange={v => setCode(v || '')}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 12 },
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* Results */}
            {result && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:200,opacity:1}}
                className="border-t border-border/60 bg-card overflow-hidden flex flex-col">
                <div className="flex border-b border-border/60 bg-secondary/10">
                  {(['result','testcases'] as ResultTab[]).map(t => (
                    <button key={t} onClick={() => setResultTab(t)}
                      className={cn('px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2',
                        resultTab===t ? 'text-ds-blue border-ds-blue' : 'text-muted-foreground border-transparent')}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-auto p-4 text-sm">
                  {resultTab === 'result' && (
                    <div className="space-y-3">
                      <div className={cn('flex items-center gap-2 font-semibold',
                        (result.passed || result.status_id===3) ? 'text-green-400' : 'text-red-400')}>
                        {(result.passed || result.status_id===3) ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        {result.status}
                      </div>
                      {result.runtime_ms && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{result.runtime_ms}ms</span>
                          {result.memory_kb && <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{(result.memory_kb/1024).toFixed(1)} MB</span>}
                        </div>
                      )}
                      {result.stdout && <pre className="bg-background/60 rounded-lg p-2 text-xs text-[#abb2bf] overflow-x-auto font-mono border border-border/40">{result.stdout}</pre>}
                      {result.stderr && <pre className="bg-red-500/5 rounded-lg p-2 text-xs text-red-300 overflow-x-auto font-mono border border-red-500/20">{result.stderr}</pre>}
                    </div>
                  )}
                  {resultTab === 'testcases' && (
                    <div className="space-y-2">
                      {(result.test_results || []).map((tc: any, i: number) => (
                        <div key={i} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono',
                          tc.passed ? 'bg-green-500/5 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/20 text-red-300')}>
                          {tc.passed ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" /> : <XCircle className="h-3.5 w-3.5 flex-shrink-0" />}
                          <span>Case {i+1}</span>
                          {!tc.is_hidden && tc.actual_output && <span className="text-muted-foreground">→ {tc.actual_output}</span>}
                          {tc.is_hidden && <span className="text-muted-foreground italic">Hidden test case</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
