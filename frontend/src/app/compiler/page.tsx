'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Copy, Check, ChevronDown, AlertCircle, CheckCircle, Clock, Cpu, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { id:'python',     name:'Python',     monacoId:'python',     version:'3.8.1',      icon:'🟡' },
  { id:'c',          name:'C',          monacoId:'c',          version:'GCC 9.2.0',  icon:'🔵' },
  { id:'cpp',        name:'C++',        monacoId:'cpp',        version:'GCC 9.2.0',  icon:'🟣' },
  { id:'java',       name:'Java',       monacoId:'java',       version:'OpenJDK 13', icon:'🟠' },
  { id:'javascript', name:'JavaScript', monacoId:'javascript', version:'Node 12',    icon:'🟤' },
  { id:'typescript', name:'TypeScript', monacoId:'typescript', version:'3.7.4',      icon:'🔷' },
  { id:'go',         name:'Go',         monacoId:'go',         version:'1.13.5',     icon:'🩵' },
  { id:'rust',       name:'Rust',       monacoId:'rust',       version:'1.40.0',     icon:'🦀' },
];

const TEMPLATES: Record<string, string> = {
  python:`# Python — DevSphere Compiler
def solve():
    n = int(input())
    print(f"Input received: {n}")
    print(f"Square: {n * n}")
    print(f"Cube: {n ** 3}")

solve()`,
  c:`#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    printf("Input: %d\\nSquare: %d\\nCube: %d\\n", n, n*n, n*n*n);
    return 0;
}`,
  cpp:`#include <bits/stdc++.h>
using namespace std;
int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    long long n; cin >> n;
    cout << "Input: " << n << "\\n";
    cout << "Square: " << n*n << "\\n";
    cout << "Cube: " << n*n*n << "\\n";
    return 0;
}`,
  java:`import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        System.out.println("Input: " + n);
        System.out.println("Square: " + (n*n));
        System.out.println("Cube: " + (n*n*n));
    }
}`,
  javascript:`const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n').filter(Boolean)));
process.stdin.on('end', () => {
    const n = BigInt(lines[0].trim());
    console.log(\`Input: \${n}\`);
    console.log(\`Square: \${n*n}\`);
    console.log(\`Cube: \${n*n*n}\`);
});`,
  typescript:`const lines: string[] = [];
process.stdin.on('data', (d: Buffer) => lines.push(...d.toString().split('\\n').filter(Boolean)));
process.stdin.on('end', () => {
    const n: number = parseInt(lines[0]);
    console.log(\`Input: \${n}\`);
    console.log(\`Square: \${n*n}\`);
});`,
  go:`package main
import "fmt"
func main() {
    var n int64
    fmt.Scan(&n)
    fmt.Printf("Input: %d\\nSquare: %d\\nCube: %d\\n", n, n*n, n*n*n)
}`,
  rust:`use std::io;
fn main() {
    let mut s = String::new();
    io::stdin().read_line(&mut s).unwrap();
    let n: i64 = s.trim().parse().unwrap();
    println!("Input: {}\\nSquare: {}\\nCube: {}", n, n*n, n*n*n);
}`,
};

export default function CompilerPage() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(TEMPLATES.python);
  const [stdin, setStdin] = useState('7');
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'output'|'input'|'info'>('output');
  const [copied, setCopied] = useState(false);
  const [showLangs, setShowLangs] = useState(false);

  const changeLang = (l: typeof LANGUAGES[0]) => {
    setLang(l);
    setCode(TEMPLATES[l.id] || '// Write your code here\n');
    setResult(null);
    setShowLangs(false);
  };

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setTab('output');
    setResult(null);
    try {
      const res = await api.post('/compiler/execute', { language: lang.id, source_code: code, stdin });
      const data = res.data.data;

setResult({
  ...data,
  status:
    typeof data.status === 'object'
      ? data.status.description
      : data.status || 'Completed',

  status_id:
    data.status_id ||
    data.status?.id ||
    0,

  stdout: data.stdout || '',
  stderr: data.stderr || data.compile_output || '',
});
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Execution failed';
      toast.error(msg);
      setResult({ status: 'Error', status_id: 0, stdout: '', stderr: msg });
    } finally {
      setRunning(false);
    }
  }, [running, lang.id, code, stdin]);

  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const isOk =
  result?.status_id === 3 ||
  result?.status?.id === 3 ||
  result?.status === 'Accepted';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col flex-1 pt-16">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-secondary/20 flex-wrap">
          {/* Language picker */}
          <div className="relative">
            <button onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 bg-card hover:bg-secondary/60 transition-colors text-sm font-medium min-w-[150px]">
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
              <span className="text-xs text-muted-foreground ml-auto mr-1">{lang.version}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {showLangs && (
                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}
                  className="absolute top-full left-0 mt-1 w-56 bg-card border border-border/60 rounded-xl shadow-xl z-20 overflow-hidden">
                  {LANGUAGES.map(l => (
                    <button key={l.id} onClick={() => changeLang(l)}
                      className={cn('flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors',
                        lang.id === l.id && 'text-ds-blue bg-secondary/60')}>
                      <span>{l.icon}</span>
                      <span className="flex-1">{l.name}</span>
                      <span className="text-xs text-muted-foreground">{l.version}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button onClick={run} disabled={running}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md shadow-green-500/20 h-9 px-5 font-semibold">
            {running ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Running...</>
            ) : (
              <><Play className="h-4 w-4 mr-2 fill-white" />Run Code</>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={() => { setCode(TEMPLATES[lang.id]); setResult(null); }} className="h-9 border-border/60 gap-2">
            <RotateCcw className="h-3 w-3" />Reset
          </Button>
          <Button variant="outline" size="sm" onClick={copy} className="h-9 border-border/60 gap-2">
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Judge0 API
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden" style={{height:'calc(100vh - 116px)'}}>
          {/* Editor */}
          <div className="flex-1 min-w-0 border-r border-border/60">
            <MonacoEditor
              height="100%"
              language={lang.monacoId}
              theme="vs-dark"
              value={code}
              onChange={v => setCode(v||'')}
              options={{
                fontSize:13, fontFamily:"'JetBrains Mono','Fira Code',monospace", fontLigatures:true,
                lineNumbers:'on', minimap:{enabled:false}, scrollBeyondLastLine:false,
                automaticLayout:true, tabSize:2, wordWrap:'on',
                padding:{top:12,bottom:12}, cursorBlinking:'smooth',
                renderLineHighlight:'all', smoothScrolling:true,
              }}
            />
          </div>

          {/* Output panel */}
          <div className="w-96 xl:w-[460px] flex flex-col bg-card">
            <div className="flex border-b border-border/60 bg-secondary/20">
              {(['output','input','info'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn('px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2',
                    tab===t ? 'text-ds-blue border-ds-blue' : 'text-muted-foreground border-transparent hover:text-foreground')}>
                  {t}
                </button>
              ))}
            </div>

            {tab === 'output' && (
              <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {running && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-ds-blue/30 border-t-ds-blue rounded-full animate-spin" />
                    Executing via Judge0...
                  </div>
                )}
                {!running && !result && (
                  <div className="text-muted-foreground text-xs leading-relaxed space-y-2">
                    <div className="text-2xl">💻</div>
                    <p>Click <span className="text-ds-blue font-semibold">Run Code</span> to execute your program.</p>
                    <p>Add input in the <span className="font-medium">Input</span> tab before running.</p>
                  </div>
                )}
                {result && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-3">
                    <div className={cn('flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg',
                      isOk ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                      {isOk ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {result.status}
                    </div>
                    {result.time && (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{(parseFloat(result.time)*1000).toFixed(0)}ms</span>
                        {result.memory && <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{(result.memory/1024).toFixed(1)} MB</span>}
                      </div>
                    )}
                    {result.stdout && (
                      <div>
                        <div className="text-xs font-semibold text-green-400 mb-1.5 uppercase tracking-wider">Output</div>
                        <pre className="bg-background/60 rounded-lg p-3 text-xs text-[#abb2bf] overflow-x-auto whitespace-pre-wrap border border-border/40 leading-6">{result.stdout}</pre>
                      </div>
                    )}
                    {result.stderr && (
                      <div>
                        <div className="text-xs font-semibold text-red-400 mb-1.5 uppercase tracking-wider">Errors</div>
                        <pre className="bg-red-500/5 rounded-lg p-3 text-xs text-red-300 overflow-x-auto whitespace-pre-wrap border border-red-500/20 leading-6">{result.stderr}</pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {tab === 'input' && (
              <div className="flex-1 flex flex-col p-4 gap-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Standard Input (stdin)</div>
                <textarea value={stdin} onChange={e => setStdin(e.target.value)}
                  placeholder="Enter program input here..."
                  className="flex-1 bg-secondary/30 border border-border/60 rounded-lg p-3 font-mono text-sm resize-none outline-none focus:border-ds-blue/50 text-foreground placeholder:text-muted-foreground/50" />
              </div>
            )}

            {tab === 'info' && (
              <div className="flex-1 p-4 text-sm overflow-auto space-y-5">
                {[
                  {title:'Resource Limits', items:[['CPU Time','5 seconds'],['Memory','256 MB'],['Output','64 KB']]},
                  {title:'Shortcuts',       items:[['Run Code','Ctrl+Enter'],['Format','Shift+Alt+F'],['Comment','Ctrl+/']]},
                ].map(sec => (
                  <div key={sec.title}>
                    <div className="font-semibold text-foreground mb-2">{sec.title}</div>
                    <div className="space-y-1">
                      {sec.items.map(([k,v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-mono text-ds-blue">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <div className="font-semibold text-foreground mb-2">Current Language</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">{lang.icon}</span>
                    <div><div className="font-medium">{lang.name}</div><div className="text-xs text-muted-foreground">{lang.version}</div></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
