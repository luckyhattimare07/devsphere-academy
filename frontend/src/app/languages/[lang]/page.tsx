'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, Circle, BookOpen, Code2, Play, Lightbulb, ChevronLeft, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

/* ── Static tutorial data ─────────────────────────────────── */
const LANG_META: Record<string, { name: string; icon: string; color: string; accent: string }> = {
  c:          { name: 'C',          icon: '🔵', color: '#6b7280', accent: '#6b7280' },
  cpp:        { name: 'C++',        icon: '🟣', color: '#ec4899', accent: '#ec4899' },
  java:       { name: 'Java',       icon: '🟠', color: '#f97316', accent: '#f97316' },
  python:     { name: 'Python',     icon: '🟡', color: '#eab308', accent: '#eab308' },
  javascript: { name: 'JavaScript', icon: '🟤', color: '#f59e0b', accent: '#f59e0b' },
};

const TOPICS: Record<string, Array<{
  id: string; title: string; content: string;
  code?: string; lang?: string; output?: string;
  quiz?: { q: string; opts: string[]; ans: number };
}>> = {
  python: [
    {
      id: 'intro', title: 'Introduction to Python',
      content: `## Introduction to Python\n\nPython is a high-level, interpreted, general-purpose programming language created by **Guido van Rossum** in 1991. It emphasises code readability and simplicity.\n\n### Why Python?\n- Clean, readable syntax\n- Huge standard library\n- Versatile: web, data science, ML, scripting\n- Massive community and ecosystem\n\n### The Zen of Python\n> Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex.`,
      code: `# Your first Python program\nprint("Hello, DevSphere!")\n\n# Python is dynamically typed\nname = "Developer"\nyear = 2024\npi   = 3.14159\n\nprint(f"Welcome, {name}! Year: {year}, Pi ≈ {pi:.2f}")`,
      lang: 'python',
      output: 'Hello, DevSphere!\nWelcome, Developer! Year: 2024, Pi ≈ 3.14',
      quiz: { q: 'Python was created by?', opts: ['Guido van Rossum','Dennis Ritchie','Bjarne Stroustrup','James Gosling'], ans: 0 }
    },
    {
      id: 'variables', title: 'Variables & Data Types',
      content: `## Variables & Data Types\n\nPython uses **dynamic typing** — you don't declare types. Variables can hold any value and change type at runtime.\n\n### Built-in Types\n| Type | Example | Description |\n|------|---------|-------------|\n| \`int\` | \`42\` | Integers |\n| \`float\` | \`3.14\` | Floating-point |\n| \`str\` | \`"hello"\` | Strings |\n| \`bool\` | \`True\` | Boolean |\n| \`list\` | \`[1,2,3]\` | Mutable sequence |\n| \`tuple\` | \`(1,2)\` | Immutable sequence |\n| \`dict\` | \`{"a":1}\` | Key-value pairs |\n| \`set\` | \`{1,2,3}\` | Unordered unique values |`,
      code: `x   = 42          # int\ny   = 3.14        # float\nname = "Python"  # str\nflag = True      # bool\n\n# Type checking\nprint(type(x), type(y))\nprint(isinstance(x, int))   # True\n\n# Multiple assignment\na, b, c = 1, 2, 3\nprint(a, b, c)\n\n# f-strings (Python 3.6+)\nprint(f"x={x}, y={y:.1f}, name={name}")`,
      lang: 'python',
      output: "<class 'int'> <class 'float'>\nTrue\n1 2 3\nx=42, y=3.1, name=Python",
      quiz: { q: 'Which type is mutable?', opts: ['tuple','str','list','int'], ans: 2 }
    },
    {
      id: 'control-flow', title: 'Control Flow',
      content: `## Control Flow\n\nPython uses **indentation** (not braces) to define code blocks.\n\n### if / elif / else\n\`\`\`python\nif condition:\n    ...\nelif other:\n    ...\nelse:\n    ...\n\`\`\`\n\n### match (Python 3.10+)\nSimilar to switch/case in other languages.`,
      code: `score = 85\n\n# if / elif / else\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\n\nprint(f"Score {score} → Grade {grade}")\n\n# Ternary expression\nresult = "Pass" if score >= 50 else "Fail"\nprint(result)\n\n# match statement (3.10+)\nday = "Mon"\nmatch day:\n    case "Mon" | "Tue" | "Wed" | "Thu" | "Fri":\n        print("Weekday")\n    case "Sat" | "Sun":\n        print("Weekend")`,
      lang: 'python',
      output: 'Score 85 → Grade B\nPass\nWeekday',
      quiz: { q: 'Python uses what to define code blocks?', opts: ['Braces {}','Parentheses ()','Indentation','Keywords'], ans: 2 }
    },
    {
      id: 'loops', title: 'Loops & Comprehensions',
      content: `## Loops in Python\n\nPython \`for\` loops iterate over any **iterable** — lists, strings, ranges, dicts, etc.\n\n### List Comprehensions\nOne of Python's most elegant features:\n\`\`\`python\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n\`\`\``,
      code: `# for loop with range\nfor i in range(5):\n    print(i, end=" ")\nprint()\n\n# while loop\nn = 1\nwhile n <= 8:\n    n *= 2\nprint("n =", n)\n\n# Loop over a list\nlangs = ["C", "Python", "Java"]\nfor i, lang in enumerate(langs):\n    print(f"{i}: {lang}")\n\n# List comprehension\nsquares = [x**2 for x in range(1, 6)]\nprint(squares)\n\n# Dict comprehension\nsq_map = {x: x**2 for x in range(1, 4)}\nprint(sq_map)`,
      lang: 'python',
      output: '0 1 2 3 4 \nn = 16\n0: C\n1: Python\n2: Java\n[1, 4, 9, 16, 25]\n{1: 1, 2: 4, 3: 9}',
      quiz: { q: 'What does range(5) produce?', opts: ['1,2,3,4,5','0,1,2,3,4','0,1,2,3,4,5','1,2,3,4'], ans: 1 }
    },
    {
      id: 'functions', title: 'Functions & Lambdas',
      content: `## Functions in Python\n\nFunctions are defined with \`def\`. Python supports default arguments, keyword arguments, \`*args\`, and \`**kwargs\`.\n\n### Lambda Functions\nAnonymous single-expression functions:\n\`\`\`python\nsquare = lambda x: x ** 2\n\`\`\`\n\n### First-Class Functions\nFunctions are objects — they can be passed around, returned, and stored in variables.`,
      code: `def greet(name: str, greeting: str = "Hello") -> str:\n    return f"{greeting}, {name}!"\n\nprint(greet("Dev"))\nprint(greet("Dev", greeting="Hi"))\n\n# *args and **kwargs\ndef summarize(*args, **kwargs):\n    total = sum(args)\n    label = kwargs.get("label", "Sum")\n    return f"{label}: {total}"\n\nprint(summarize(1, 2, 3, label="Total"))\n\n# Lambda\nsquare = lambda x: x ** 2\ndoubles = list(map(lambda x: x * 2, [1, 2, 3, 4]))\nprint(square(7), doubles)\n\n# Decorator\ndef uppercase(func):\n    def wrapper(*args):\n        return func(*args).upper()\n    return wrapper\n\n@uppercase\ndef say(msg): return msg\n\nprint(say("hello world"))`,
      lang: 'python',
      output: 'Hello, Dev!\nHi, Dev!\nTotal: 6\n49 [2, 4, 6, 8]\nHELLO WORLD',
      quiz: { q: 'What does a decorator do?', opts: ['Deletes a function','Wraps a function to add behaviour','Creates a new class','Imports a module'], ans: 1 }
    },
    {
      id: 'oop', title: 'Object-Oriented Programming',
      content: `## OOP in Python\n\nPython is multi-paradigm and fully supports OOP via **classes**.\n\n### Four Pillars\n1. **Encapsulation** — bundle data + behaviour\n2. **Inheritance** — child class extends parent\n3. **Polymorphism** — same interface, different behaviour\n4. **Abstraction** — hide implementation details`,
      code: `from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n    \n    def __repr__(self):\n        return f"{type(self).__name__}(area={self.area():.2f})"\n\nclass Circle(Shape):\n    def __init__(self, r: float):\n        self.r = r\n    def area(self) -> float:\n        import math\n        return math.pi * self.r ** 2\n\nclass Rectangle(Shape):\n    def __init__(self, w: float, h: float):\n        self.w, self.h = w, h\n    def area(self) -> float:\n        return self.w * self.h\n\nshapes: list[Shape] = [Circle(5), Rectangle(4, 6)]\nfor s in shapes:\n    print(s)`,
      lang: 'python',
      output: 'Circle(area=78.54)\nRectangle(area=24.00)',
      quiz: { q: 'Which keyword defines inheritance?', opts: ['extends','inherits','class Child(Parent)','super'], ans: 2 }
    },
    {
      id: 'advanced', title: 'Advanced: Generators & Async',
      content: `## Generators & Async Python\n\n### Generators\nGenerators use \`yield\` to lazily produce values — perfect for large datasets.\n\n### Async/Await\nPython's asyncio enables non-blocking I/O using coroutines.`,
      code: `# Generator — infinite Fibonacci\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ngen = fib()\nprint([next(gen) for _ in range(8)])\n\n# Context manager\nclass Timer:\n    def __enter__(self):\n        import time\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, *_):\n        self.elapsed = time.perf_counter() - self.start\n        print(f"Elapsed: {self.elapsed*1000:.1f}ms")\n\nwith Timer():\n    total = sum(range(1_000_000))\n    print(f"Sum: {total}")`,
      lang: 'python',
      output: '[0, 1, 1, 2, 3, 5, 8, 13]\nSum: 499999500000\nElapsed: ~12.4ms',
      quiz: { q: 'What keyword makes a function a generator?', opts: ['return','async','yield','await'], ans: 2 }
    },
  ],
  c: [
    {
      id: 'intro', title: 'Introduction to C',
      content: `## Introduction to C\n\nC is a general-purpose, procedural programming language developed by **Dennis Ritchie** at Bell Labs in 1972.\n\nIt is the language that Linux, Windows, Python, and virtually every modern OS is written in.\n\n### Key Characteristics\n- Compiled language — very fast\n- Manual memory management\n- Direct hardware access via pointers\n- Foundation for C++, Java, Python`,
      code: `/* Hello World in C */\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello, DevSphere!\\n");\n    return 0;\n}`,
      lang: 'c',
      output: 'Hello, DevSphere!',
      quiz: { q: 'Who created C?', opts: ['Bjarne Stroustrup','Dennis Ritchie','Guido van Rossum','Linus Torvalds'], ans: 1 }
    },
    {
      id: 'pointers', title: 'Pointers & Memory',
      content: `## Pointers in C\n\nA **pointer** holds the memory address of another variable. This is C's most powerful — and most dangerous — feature.\n\n### Pointer Syntax\n- \`int *ptr\` — declares a pointer to int\n- \`&x\` — address-of operator\n- \`*ptr\` — dereference (access the value)`,
      code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int x = 42;\n    int *ptr = &x;\n\n    printf("Value:   %d\\n", *ptr);\n    printf("Address: %p\\n", (void*)ptr);\n\n    *ptr = 100;  // modify through pointer\n    printf("New x:   %d\\n", x);\n\n    // Dynamic allocation\n    int *arr = malloc(5 * sizeof(int));\n    for (int i = 0; i < 5; i++) arr[i] = i * i;\n    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    free(arr);  // ALWAYS free!\n    return 0;\n}`,
      lang: 'c',
      output: 'Value:   42\nAddress: 0x7ffd...\nNew x:   100\n0 1 4 9 16',
      quiz: { q: 'What does & give you?', opts: ['The value','The address','A copy','A pointer type'], ans: 1 }
    },
  ],
  cpp: [
    {
      id: 'intro', title: 'Introduction to C++',
      content: `## Introduction to C++\n\nC++ was created by **Bjarne Stroustrup** in 1983 as "C with Classes". It adds OOP, templates, the STL, and modern features on top of C.\n\n### Why C++?\n- Zero-overhead abstractions\n- Full OOP support\n- Rich STL with containers & algorithms\n- Used in game engines, finance, competitive programming`,
      code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name = "DevSphere";\n    cout << "Hello, " << name << "!" << endl;\n    \n    // Range-based for loop\n    int nums[] = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int n : nums) sum += n;\n    cout << "Sum = " << sum << endl;\n    return 0;\n}`,
      lang: 'cpp',
      output: 'Hello, DevSphere!\nSum = 15',
      quiz: { q: 'C++ was created by?', opts: ['Dennis Ritchie','James Gosling','Bjarne Stroustrup','Linus Torvalds'], ans: 2 }
    },
    {
      id: 'stl', title: 'STL Containers',
      content: `## Standard Template Library\n\nThe STL provides generic, reusable containers and algorithms.\n\n### Common Containers\n| Container | Access | Insert | Use Case |\n|-----------|--------|--------|----------|\n| \`vector\` | O(1) | O(1) amortized | Dynamic array |\n| \`map\` | O(log n) | O(log n) | Sorted key-value |\n| \`unordered_map\` | O(1) avg | O(1) avg | Hash map |\n| \`set\` | O(log n) | O(log n) | Sorted unique |\n| \`priority_queue\` | O(1) | O(log n) | Max/min heap |`,
      code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // vector\n    vector<int> v = {3,1,4,1,5,9,2,6};\n    sort(v.begin(), v.end());\n    cout << "Sorted: ";\n    for (int x : v) cout << x << " ";\n    cout << endl;\n\n    // unordered_map (hash map)\n    unordered_map<string,int> freq;\n    string words[] = {"the","cat","the","dog","cat","the"};\n    for (auto& w : words) freq[w]++;\n    for (auto& [k,v] : freq)\n        cout << k << ": " << v << "\\n";\n\n    // priority_queue (max-heap)\n    priority_queue<int> pq;\n    for (int x : {5,2,8,1,9}) pq.push(x);\n    cout << "Max: " << pq.top() << endl;\n    return 0;\n}`,
      lang: 'cpp',
      output: 'Sorted: 1 1 2 3 4 5 6 9 \nthe: 3\ncat: 2\ndog: 1\nMax: 9',
      quiz: { q: 'Which STL container gives O(1) average access?', opts: ['vector','map','unordered_map','set'], ans: 2 }
    },
  ],
  java: [
    {
      id: 'intro', title: 'Introduction to Java',
      content: `## Introduction to Java\n\nJava was created by **James Gosling** at Sun Microsystems in 1995. Its motto: **"Write Once, Run Anywhere"** — code compiles to bytecode that runs on any JVM.\n\n### Java Ecosystem\n- Android development\n- Enterprise (Spring, Jakarta EE)\n- Big Data (Hadoop, Spark)\n- Microservices`,
      code: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, DevSphere!");\n        \n        // String formatting\n        String name = "Developer";\n        int year = 2024;\n        System.out.printf("Welcome %s in %d%n", name, year);\n        \n        // var (Java 10+)\n        var list = new java.util.ArrayList<String>();\n        list.add("Java");\n        list.add("Python");\n        list.forEach(System.out::println);\n    }\n}`,
      lang: 'java',
      output: 'Hello, DevSphere!\nWelcome Developer in 2024\nJava\nPython',
      quiz: { q: 'Java compiles to what?', opts: ['Machine code','Assembly','Bytecode','Source code'], ans: 2 }
    },
  ],
  javascript: [
    {
      id: 'intro', title: 'Introduction to JavaScript',
      content: `## Introduction to JavaScript\n\nJavaScript was created by **Brendan Eich** in 1995 in just 10 days. It's now the most-used language in the world, running in browsers, servers (Node.js), mobile (React Native), and more.\n\n### Modern JavaScript (ES6+)\n- Arrow functions, destructuring, spread\n- Promises, async/await\n- Modules (import/export)\n- Optional chaining (\`?.\`), nullish coalescing (\`??\`)`,
      code: `// Modern JavaScript (ES2024)\nconst greet = (name = 'World') => \`Hello, \${name}!\`;\nconsole.log(greet('DevSphere'));\n\n// Destructuring\nconst { name, score = 0 } = { name: 'Alice', score: 95 };\nconsole.log(name, score);\n\n// Array methods\nconst nums = [1, 2, 3, 4, 5];\nconst result = nums\n  .filter(n => n % 2 === 0)\n  .map(n => n ** 2)\n  .reduce((acc, n) => acc + n, 0);\nconsole.log('Result:', result);  // 4 + 16 = 20\n\n// Optional chaining\nconst user = { profile: { city: 'Delhi' } };\nconsole.log(user?.profile?.city ?? 'Unknown');`,
      lang: 'javascript',
      output: 'Hello, DevSphere!\nAlice 95\nResult: 20\nDelhi',
      quiz: { q: 'Who created JavaScript?', opts: ['Guido van Rossum','Brendan Eich','Ryan Dahl','Douglas Crockford'], ans: 1 }
    },
  ],
};

export default function LanguageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || 'python';
  const meta = LANG_META[lang] || LANG_META.python;
  const topics = TOPICS[lang] || TOPICS.python;

  const [activeTopic, setActiveTopic] = useState(topics[0].id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentTopicIdx = topics.findIndex((t) => t.id === activeTopic);
  const topic = topics[currentTopicIdx];

  const markDone = () =>
  setCompleted((prev) => {
    const updated = new Set(prev);
    updated.add(activeTopic);
    return updated;
  });

  const goNext = () => {
    if (currentTopicIdx < topics.length - 1) {
      markDone();
      setActiveTopic(topics[currentTopicIdx + 1].id);
      setQuizAnswer(null);
    }
  };

  const goPrev = () => {
    if (currentTopicIdx > 0) {
      setActiveTopic(topics[currentTopicIdx - 1].id);
      setQuizAnswer(null);
    }
  };

  if (!topic) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className={cn(
          'fixed left-0 top-16 bottom-0 z-30 bg-card border-r border-border/60 overflow-y-auto transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}>
          <div className="p-4">
            {/* Lang header */}
            <div className="flex items-center gap-3 mb-5 px-2">
              <span className="text-2xl">{meta.icon}</span>
              <div>
                <div className="font-display font-bold text-sm">{meta.name}</div>
                <div className="text-xs text-muted-foreground">{topics.length} topics</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-5 px-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>{completed.size}/{topics.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ds-blue to-ds-violet transition-all"
                  style={{ width: `${(completed.size / topics.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Topics list */}
            <div className="space-y-0.5">
              {topics.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTopic(t.id); setQuizAnswer(null); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all',
                    activeTopic === t.id
                      ? 'bg-ds-blue/10 text-ds-blue font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}>
                  {completed.has(t.id)
                    ? <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    : <Circle className={cn('h-4 w-4 flex-shrink-0', activeTopic === t.id ? 'text-ds-blue' : 'text-muted-foreground/40')} />
                  }
                  <span className="leading-snug">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={cn('flex-1 transition-all duration-300 min-h-screen', sidebarOpen ? 'ml-64' : 'ml-0')}>
          {/* Toolbar */}
          <div className="sticky top-16 z-20 flex items-center gap-3 px-6 py-3 border-b border-border/60 bg-background/90 backdrop-blur-md">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
              <BookOpen className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{meta.name}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{topic.title}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="text-xs bg-secondary text-muted-foreground border-border/40">
                {currentTopicIdx + 1} / {topics.length}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto px-6 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>

                {/* Markdown content */}
                <div className="problem-content prose prose-invert max-w-none mb-8">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    remarkPlugins={[remarkGfm]}>
                    {topic.content}
                  </ReactMarkdown>
                </div>

                {/* Code example */}
                {topic.code && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="h-4 w-4 text-ds-blue" />
                      <span className="text-sm font-semibold">Code Example</span>
                      <Badge className="text-xs bg-ds-blue/10 text-ds-blue border-ds-blue/20 ml-auto">
                        {topic.lang || lang}
                      </Badge>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-[#0d1421] overflow-hidden">
                      <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto">
                        <code>{topic.code}</code>
                      </pre>
                      {topic.output && (
                        <div className="border-t border-border/60 px-5 py-3 bg-green-500/5">
                          <div className="text-xs text-green-400 font-semibold mb-2 flex items-center gap-1.5">
                            <Play className="h-3 w-3" /> Output
                          </div>
                          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{topic.output}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {topic.quiz && (
                  <div className="mb-8 rounded-xl border border-ds-teal/20 bg-ds-teal/5 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="h-4 w-4 text-ds-teal" />
                      <span className="text-sm font-semibold text-ds-teal">Quick Check</span>
                    </div>
                    <p className="text-sm font-medium mb-4">{topic.quiz.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.quiz.opts.map((opt, i) => (
                        <button
                          key={i}
                          disabled={quizAnswer !== null}
                          onClick={() => setQuizAnswer(i)}
                          className={cn(
                            'px-4 py-2.5 rounded-lg border text-sm text-left transition-all',
                            quizAnswer === null
                              ? 'border-border/60 hover:border-ds-teal/40 hover:bg-ds-teal/5'
                              : i === topic.quiz!.ans
                                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                                : quizAnswer === i
                                  ? 'border-red-500/50 bg-red-500/10 text-red-400'
                                  : 'border-border/40 opacity-50'
                          )}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <p className={cn('mt-3 text-sm font-medium', quizAnswer === topic.quiz.ans ? 'text-green-400' : 'text-red-400')}>
                        {quizAnswer === topic.quiz.ans ? '✓ Correct!' : `✗ Incorrect — the answer is "${topic.quiz.opts[topic.quiz.ans]}"`}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button variant="outline" onClick={goPrev} disabled={currentTopicIdx === 0} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  {currentTopicIdx < topics.length - 1 ? (
                    <Button onClick={goNext} className="gap-2 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0">
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => router.push('/practice')} className="gap-2 bg-gradient-to-r from-ds-green to-ds-teal text-white border-0">
                      Practice Problems <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
