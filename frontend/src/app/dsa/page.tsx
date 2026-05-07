'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, MemoryStick, Code2, Play, ArrowRight, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const DSA_DATA = [
  {
    id: 'arrays', name: 'Arrays', icon: '📊', color: 'text-ds-blue', border: 'border-ds-blue/30', bg: 'bg-ds-blue/5', problems: 40,
    theory: `## Arrays\n\nAn array is a **contiguous block of memory** that stores elements of the same type. It is the most fundamental data structure in computer science.\n\n### Key Properties\n- **Fixed size** (in most languages) — allocated at creation\n- **Zero-indexed** — first element at index 0\n- **Cache-friendly** — elements stored adjacently in memory\n\n### Common Patterns\n1. **Two Pointers** — O(n) solutions for sorted arrays\n2. **Sliding Window** — subarray / substring problems\n3. **Prefix Sum** — range query optimisation\n4. **Kadane's Algorithm** — maximum subarray`,
    implementations: [
      { lang: 'Python', code: `# Two Sum — O(n) hash map\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if (diff := target - n) in seen:\n            return [seen[diff], i]\n        seen[n] = i\n\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]`, output: '[0, 1]' },
      { lang: 'C++', code: `// Two Sum — O(n)\n#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int diff = target - nums[i];\n        if (seen.count(diff)) return {seen[diff], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`, output: '// Returns {0, 1}' },
    ],
    complexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)', space: 'O(n)' },
    tips: ['Use hash maps to reduce O(n²) to O(n)', 'Two pointers on sorted arrays avoid extra space', 'Prefix sums enable O(1) range queries after O(n) preprocessing'],
  },
  {
    id: 'linked-lists', name: 'Linked Lists', icon: '🔗', color: 'text-ds-teal', border: 'border-ds-teal/30', bg: 'bg-ds-teal/5', problems: 20,
    theory: `## Linked Lists\n\nA linked list is a **chain of nodes** where each node stores data and a pointer to the next node. Unlike arrays, nodes are **not stored contiguously** in memory.\n\n### Types\n- **Singly Linked** — each node has one \`next\` pointer\n- **Doubly Linked** — each node has \`prev\` and \`next\`\n- **Circular** — tail points back to head\n\n### Key Technique: Fast & Slow Pointers\nUsed to detect cycles, find midpoints, and identify nth-from-end nodes in O(n) time and O(1) space.`,
    implementations: [
      { lang: 'Python', code: `class ListNode:\n    def __init__(self, val=0, nxt=None):\n        self.val = val\n        self.next = nxt\n\ndef reverse(head):\n    prev = None\n    while head:\n        head.next, prev, head = prev, head, head.next\n    return prev\n\n# Detect cycle — Floyd's algorithm\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False`, output: '# O(n) time, O(1) space' },
    ],
    complexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)*', delete: 'O(1)*', space: 'O(n)' },
    tips: ['*O(1) insert/delete only when you already have the node reference', 'Use dummy head node to simplify edge cases', 'Fast/slow pointer solves cycle, midpoint, and kth problems'],
  },
  {
    id: 'trees', name: 'Binary Trees', icon: '🌲', color: 'text-ds-green', border: 'border-ds-green/30', bg: 'bg-ds-green/5', problems: 30,
    theory: `## Binary Trees\n\nA binary tree is a hierarchical structure where each node has at most **two children** (left and right).\n\n### Traversals\n| Order | Pattern | Use Case |\n|-------|---------|----------|\n| Inorder | Left → Root → Right | BST sorted order |\n| Preorder | Root → Left → Right | Copy tree |\n| Postorder | Left → Right → Root | Delete tree |\n| Level-order | BFS by level | Shortest path |\n\n### DFS vs BFS\n- **DFS** — stack-based, good for path/height problems\n- **BFS** — queue-based, good for level-based problems`,
    implementations: [
      { lang: 'Python', code: `from collections import deque\n\nclass TreeNode:\n    def __init__(self, v, l=None, r=None):\n        self.val, self.left, self.right = v, l, r\n\ndef max_depth(root) -> int:\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\ndef level_order(root):\n    if not root: return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left:  q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res`, output: '# max_depth: O(n) time, O(h) space' },
    ],
    complexity: { access: 'O(h)', search: 'O(h)', insert: 'O(h)', delete: 'O(h)', space: 'O(n)' },
    tips: ['h = O(log n) for balanced, O(n) worst case', 'DFS problems often have elegant recursive solutions', 'Use iterative DFS with a stack when recursion depth is a concern'],
  },
  {
    id: 'graphs', name: 'Graphs', icon: '🕸️', color: 'text-ds-amber', border: 'border-ds-amber/30', bg: 'bg-ds-amber/5', problems: 25,
    theory: `## Graphs\n\nA graph G = (V, E) consists of **vertices** (nodes) and **edges** (connections).\n\n### Representations\n- **Adjacency List** — O(V+E) space, preferred for sparse\n- **Adjacency Matrix** — O(V²) space, preferred for dense\n\n### Key Algorithms\n| Algorithm | Complexity | Purpose |\n|-----------|-----------|--------|\n| BFS | O(V+E) | Shortest path (unweighted) |\n| DFS | O(V+E) | Connectivity, cycles, topological sort |\n| Dijkstra | O(E log V) | Shortest path (weighted) |\n| Union-Find | O(α(n)) ≈ O(1) | Connectivity, MST |`,
    implementations: [
      { lang: 'Python', code: `from collections import deque\n\ndef bfs(graph: dict, start: int) -> list:\n    """BFS — shortest path in unweighted graph"""\n    visited = {start}\n    queue = deque([start])\n    order = []\n    while queue:\n        v = queue.popleft()\n        order.append(v)\n        for nei in graph.get(v, []):\n            if nei not in visited:\n                visited.add(nei)\n                queue.append(nei)\n    return order\n\n# Topological Sort (Kahn's Algorithm)\ndef topo_sort(n: int, edges: list) -> list:\n    from collections import defaultdict\n    adj = defaultdict(list)\n    indegree = [0] * n\n    for u, v in edges:\n        adj[u].append(v)\n        indegree[v] += 1\n    q = deque(i for i in range(n) if indegree[i] == 0)\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in adj[u]:\n            indegree[v] -= 1\n            if indegree[v] == 0: q.append(v)\n    return order if len(order) == n else []  # [] = cycle`, output: '# O(V+E)' },
    ],
    complexity: { access: 'O(1)', search: 'O(V+E)', insert: 'O(1)', delete: 'O(E)', space: 'O(V+E)' },
    tips: ['Choose BFS for shortest path, DFS for everything else', 'Topological sort detects cycles (empty result = cycle exists)', 'Union-Find is O(α(n)) ≈ constant for connectivity queries'],
  },
  {
    id: 'dp', name: 'Dynamic Programming', icon: '⚡', color: 'text-ds-violet', border: 'border-ds-violet/30', bg: 'bg-ds-violet/5', problems: 20,
    theory: `## Dynamic Programming\n\nDP solves problems by breaking them into **overlapping subproblems** and storing (memoising) results.\n\n### Two Approaches\n- **Top-Down (Memoisation)** — recursive with cache\n- **Bottom-Up (Tabulation)** — iterative, fill table from base cases\n\n### When to Use DP\n1. **Optimal substructure** — optimal solution built from optimal subsolutions\n2. **Overlapping subproblems** — same subproblem solved multiple times\n\n### Classic DP Patterns\n- 1D DP: Fibonacci, Climbing Stairs, House Robber\n- 2D DP: LCS, Edit Distance, 0/1 Knapsack\n- Interval DP: Matrix Chain, Burst Balloons`,
    implementations: [
      { lang: 'Python', code: `# Coin Change — BU Tabulation — O(n * amount)\ndef coin_change(coins: list, amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for i in range(coin, amount + 1):\n            dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1, 5, 11], 15))  # 3\n\n# Longest Common Subsequence — O(mn)\ndef lcs(s1: str, s2: str) -> int:\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\nprint(lcs("ABCBDAB", "BDCAB"))  # 4`, output: '3\n4' },
    ],
    complexity: { access: 'N/A', search: 'N/A', insert: 'N/A', delete: 'N/A', space: 'O(n) to O(mn)' },
    tips: ['Always start with the recurrence relation before coding', 'Space-optimise: if dp[i] only depends on dp[i-1], use two variables', 'Memoisation is easier to write; tabulation is faster in practice'],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

export default function DSAPage() {
  const [selected, setSelected] = useState(DSA_DATA[0].id);
  const [activeLang, setActiveLang] = useState(0);
  const topic = DSA_DATA.find((d) => d.id === selected) || DSA_DATA[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0 bg-card border-r border-border/60 overflow-y-auto z-20">
          <div className="p-4">
            <div className="font-display font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4 px-2">
              DSA Topics
            </div>
            <div className="space-y-0.5">
              {DSA_DATA.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setSelected(d.id); setActiveLang(0); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                    selected === d.id
                      ? 'bg-ds-blue/10 text-ds-blue font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}>
                  <span className="flex items-center gap-2.5">
                    <span>{d.icon}</span> {d.name}
                  </span>
                  <Badge className={cn('text-xs border-0', selected === d.id ? 'bg-ds-blue/20 text-ds-blue' : 'bg-secondary text-muted-foreground')}>
                    {d.problems}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-64 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-8 py-10">

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center text-3xl', topic.bg, 'border', topic.border)}>
                  {topic.icon}
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">{topic.name}</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{topic.problems} practice problems</p>
                </div>
              </div>

              {/* Theory */}
              <div className="problem-content prose prose-invert max-w-none mb-8">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
                  {topic.theory}
                </ReactMarkdown>
              </div>

              {/* Complexity table */}
              <div className="mb-8 rounded-xl border border-border/60 overflow-hidden">
                <div className="px-5 py-3 bg-secondary/40 border-b border-border/60 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ds-amber" />
                  <span className="font-semibold text-sm">Time & Space Complexity</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/20">
                      <tr>
                        {['Operation','Access','Search','Insert','Delete','Space'].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border/40">
                        <td className="px-4 py-3 font-medium">{topic.name}</td>
                        <td className={cn('px-4 py-3 font-mono text-xs', topic.complexity.access === 'O(1)' ? 'text-green-400' : 'text-amber-400')}>{topic.complexity.access}</td>
                        <td className="px-4 py-3 font-mono text-xs text-amber-400">{topic.complexity.search}</td>
                        <td className={cn('px-4 py-3 font-mono text-xs', topic.complexity.insert.startsWith('O(1)') ? 'text-green-400' : 'text-amber-400')}>{topic.complexity.insert}</td>
                        <td className={cn('px-4 py-3 font-mono text-xs', topic.complexity.delete.startsWith('O(1)') ? 'text-green-400' : 'text-amber-400')}>{topic.complexity.delete}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{topic.complexity.space}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code implementations */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="h-4 w-4 text-ds-blue" />
                  <span className="font-semibold text-sm">Implementation</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {topic.implementations.map((impl, i) => (
                    <button
                      key={impl.lang}
                      onClick={() => setActiveLang(i)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                        activeLang === i ? 'bg-ds-blue/15 text-ds-blue border border-ds-blue/30' : 'text-muted-foreground hover:bg-secondary border border-transparent'
                      )}>
                      {impl.lang}
                    </button>
                  ))}
                </div>
                {topic.implementations[activeLang] && (
                  <div className="rounded-xl border border-border/60 bg-[#0d1421] overflow-hidden">
                    <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto">
                      <code>{topic.implementations[activeLang].code}</code>
                    </pre>
                    <div className="border-t border-border/60 px-5 py-3 bg-green-500/5 flex items-center gap-2">
                      <Play className="h-3 w-3 text-green-400" />
                      <span className="text-xs font-mono text-muted-foreground">{topic.implementations[activeLang].output}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mb-8 rounded-xl border border-ds-teal/20 bg-ds-teal/5 p-6">
                <div className="font-semibold text-sm text-ds-teal mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Key Tips
                </div>
                <ul className="space-y-2">
                  {topic.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-ds-teal mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practice CTA */}
              <div className="rounded-xl border border-border/60 bg-card p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="font-semibold">Ready to practice?</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{topic.problems} curated problems for {topic.name}</div>
                </div>
                <Button asChild className="bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 gap-2">
                  <Link href={`/practice?tag=${topic.name.toLowerCase().replace(/ /g, '-')}`}>
                    Solve Problems <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
