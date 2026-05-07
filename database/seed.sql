-- ============================================================
-- DevSphere Academy — Seed Data
-- ============================================================

-- Programming Languages
INSERT INTO programming_languages (slug, name, description, color, sort_order) VALUES
('c',          'C',          'The foundational systems programming language',           '#555555', 1),
('cpp',        'C++',        'High-performance OOP and systems language',              '#f34b7d', 2),
('java',       'Java',       'Platform-independent enterprise language',               '#b07219', 3),
('python',     'Python',     'Versatile, beginner-friendly scripting language',        '#3572A5', 4),
('javascript', 'JavaScript', 'The language of the web, now everywhere',               '#f1e05a', 5);

-- Problem Tags
INSERT INTO problem_tags (name, slug, color) VALUES
('Array',         'array',          '#4f8ef7'),
('String',        'string',         '#a855f7'),
('Linked List',   'linked-list',    '#00d4aa'),
('Tree',          'tree',           '#22c55e'),
('Graph',         'graph',          '#f59e0b'),
('Dynamic Programming', 'dp',       '#ef4444'),
('Greedy',        'greedy',         '#f97316'),
('Binary Search', 'binary-search',  '#06b6d4'),
('Stack',         'stack',          '#8b5cf6'),
('Queue',         'queue',          '#ec4899'),
('Hash Map',      'hash-map',       '#14b8a6'),
('Two Pointer',   'two-pointer',    '#6366f1'),
('Sliding Window','sliding-window', '#84cc16'),
('Backtracking',  'backtracking',   '#f43f5e'),
('Bit Manipulation','bit-manipulation','#64748b'),
('Math',          'math',           '#a16207'),
('Sorting',       'sorting',        '#7c3aed'),
('Recursion',     'recursion',      '#0891b2'),
('Design',        'design',         '#be185d'),
('Trie',          'trie',           '#15803d');

-- DSA Categories
INSERT INTO dsa_categories (name, slug, icon, sort_order) VALUES
('Arrays',              'arrays',           '📊', 1),
('Strings',             'strings',          '🔤', 2),
('Linked Lists',        'linked-lists',     '🔗', 3),
('Stacks',              'stacks',           '📚', 4),
('Queues',              'queues',           '🔄', 5),
('Trees',               'trees',            '🌲', 6),
('Binary Search Trees', 'bst',              '🔍', 7),
('Heaps',               'heaps',            '⛰️', 8),
('Hashing',             'hashing',          '#️⃣', 9),
('Graphs',              'graphs',           '🕸️', 10),
('Dynamic Programming', 'dynamic-programming','⚡', 11),
('Backtracking',        'backtracking',     '↩️', 12),
('Greedy Algorithms',   'greedy',           '💰', 13);

-- Article Categories
INSERT INTO article_categories (name, slug, color) VALUES
('Tutorial',        'tutorial',         '#4f8ef7'),
('Interview Prep',  'interview-prep',   '#a855f7'),
('System Design',   'system-design',    '#22c55e'),
('Competitive',     'competitive',      '#f59e0b'),
('Career',          'career',           '#ef4444'),
('News',            'news',             '#06b6d4');

-- ============================================================
-- 200 PROBLEMS (representative sample — extend as needed)
-- ============================================================

-- Helper: We'll insert problems with tags separately
-- Format: number, title, slug, description, difficulty, category, examples, constraints, starter_codes

-- ARRAYS (40)
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Two Sum',
 'two-sum',
 '## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
 'Easy', 'Array',
 '2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹\n-10⁹ ≤ target ≤ 10⁹\nOnly one valid answer exists.',
 '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] = 2 + 7 = 9"},{"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "nums[1] + nums[2] = 2 + 4 = 6"}]',
 '{"python": "def twoSum(nums, target):\n    # Your solution here\n    pass", "cpp": "vector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n}", "java": "public int[] twoSum(int[] nums, int target) {\n    // Your solution here\n    return new int[]{};\n}", "javascript": "var twoSum = function(nums, target) {\n    // Your solution here\n};", "c": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your solution here\n}"}',
 '[{"input": "[2,7,11,15]\n9", "expected": "[0,1]", "is_hidden": false},{"input": "[3,2,4]\n6", "expected": "[1,2]", "is_hidden": false},{"input": "[3,3]\n6", "expected": "[0,1]", "is_hidden": true},{"input": "[1,2,3,4,5]\n9", "expected": "[3,4]", "is_hidden": true}]',
 true),

('Best Time to Buy and Sell Stock',
 'best-time-to-buy-and-sell-stock',
 '## Best Time to Buy and Sell Stock\n\nYou are given an array `prices` where `prices[i]` is the price of a given stock on the `iᵗʰ` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
 'Easy', 'Array',
 '1 ≤ prices.length ≤ 10⁵\n0 ≤ prices[i] ≤ 10⁴',
 '[{"input": "prices = [7,1,5,3,6,4]", "output": "5", "explanation": "Buy on day 2 (price=1) sell on day 5 (price=6), profit = 6-1 = 5"},{"input": "prices = [7,6,4,3,1]", "output": "0", "explanation": "No profitable transaction possible"}]',
 '{"python": "def maxProfit(prices):\n    pass", "cpp": "int maxProfit(vector<int>& prices) {\n}", "java": "public int maxProfit(int[] prices) {\n    return 0;\n}", "javascript": "var maxProfit = function(prices) {\n};", "c": "int maxProfit(int* prices, int pricesSize) {\n    return 0;\n}"}',
 '[{"input": "[7,1,5,3,6,4]", "expected": "5", "is_hidden": false},{"input": "[7,6,4,3,1]", "expected": "0", "is_hidden": false},{"input": "[2,4,1]", "expected": "2", "is_hidden": true}]',
 true),

('Contains Duplicate',
 'contains-duplicate',
 '## Contains Duplicate\n\nGiven an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.',
 'Easy', 'Array',
 '1 ≤ nums.length ≤ 10⁵\n-10⁹ ≤ nums[i] ≤ 10⁹',
 '[{"input": "nums = [1,2,3,1]", "output": "true"},{"input": "nums = [1,2,3,4]", "output": "false"}]',
 '{"python": "def containsDuplicate(nums):\n    pass", "cpp": "bool containsDuplicate(vector<int>& nums) {\n}", "java": "public boolean containsDuplicate(int[] nums) {\n    return false;\n}", "javascript": "var containsDuplicate = function(nums) {\n};"}',
 '[{"input": "[1,2,3,1]", "expected": "true", "is_hidden": false},{"input": "[1,2,3,4]", "expected": "false", "is_hidden": false},{"input": "[1,1,1,3,3,4,3,2,4,2]", "expected": "true", "is_hidden": true}]',
 true),

('Product of Array Except Self',
 'product-of-array-except-self',
 '## Product of Array Except Self\n\nGiven an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` **except** `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and **without using the division operation**.',
 'Medium', 'Array',
 '2 ≤ nums.length ≤ 10⁵\n-30 ≤ nums[i] ≤ 30\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
 '[{"input": "nums = [1,2,3,4]", "output": "[24,12,8,6]"},{"input": "nums = [-1,1,0,-3,3]", "output": "[0,0,9,0,0]"}]',
 '{"python": "def productExceptSelf(nums):\n    pass", "cpp": "vector<int> productExceptSelf(vector<int>& nums) {\n}", "java": "public int[] productExceptSelf(int[] nums) {\n    return new int[]{};\n}", "javascript": "var productExceptSelf = function(nums) {\n};"}',
 '[{"input": "[1,2,3,4]", "expected": "[24,12,8,6]", "is_hidden": false},{"input": "[-1,1,0,-3,3]", "expected": "[0,0,9,0,0]", "is_hidden": false}]',
 true),

('Maximum Subarray',
 'maximum-subarray',
 '## Maximum Subarray\n\nGiven an integer array `nums`, find the **subarray** with the largest sum, and return its sum.',
 'Medium', 'Array',
 '1 ≤ nums.length ≤ 10⁵\n-10⁴ ≤ nums[i] ≤ 10⁴',
 '[{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6"},{"input": "nums = [1]", "output": "1"},{"input": "nums = [5,4,-1,7,8]", "output": "23"}]',
 '{"python": "def maxSubArray(nums):\n    pass", "cpp": "int maxSubArray(vector<int>& nums) {\n}", "java": "public int maxSubArray(int[] nums) {\n    return 0;\n}", "javascript": "var maxSubArray = function(nums) {\n};"}',
 '[{"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expected": "6", "is_hidden": false},{"input": "[1]", "expected": "1", "is_hidden": false},{"input": "[5,4,-1,7,8]", "expected": "23", "is_hidden": true}]',
 true),

('3Sum',
 '3sum',
 '## 3Sum\n\nGiven an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
 'Medium', 'Array',
 '3 ≤ nums.length ≤ 3000\n-10⁵ ≤ nums[i] ≤ 10⁵',
 '[{"input": "nums = [-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]"},{"input": "nums = [0,1,1]", "output": "[]"},{"input": "nums = [0,0,0]", "output": "[[0,0,0]]"}]',
 '{"python": "def threeSum(nums):\n    pass", "cpp": "vector<vector<int>> threeSum(vector<int>& nums) {\n}", "java": "public List<List<Integer>> threeSum(int[] nums) {\n    return new ArrayList<>();\n}", "javascript": "var threeSum = function(nums) {\n};"}',
 '[{"input": "[-1,0,1,2,-1,-4]", "expected": "[[-1,-1,2],[-1,0,1]]", "is_hidden": false}]',
 true),

('Container With Most Water',
 'container-with-most-water',
 '## Container With Most Water\n\nYou are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `iᵗʰ` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
 'Medium', 'Array',
 'n == height.length\n2 ≤ n ≤ 10⁵\n0 ≤ height[i] ≤ 10⁴',
 '[{"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49"},{"input": "height = [1,1]", "output": "1"}]',
 '{"python": "def maxArea(height):\n    pass", "cpp": "int maxArea(vector<int>& height) {\n}", "java": "public int maxArea(int[] height) {\n    return 0;\n}", "javascript": "var maxArea = function(height) {\n};"}',
 '[{"input": "[1,8,6,2,5,4,8,3,7]", "expected": "49", "is_hidden": false},{"input": "[1,1]", "expected": "1", "is_hidden": false}]',
 true),

('Trapping Rain Water',
 'trapping-rain-water',
 '## Trapping Rain Water\n\nGiven `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
 'Hard', 'Array',
 'n == height.length\n1 ≤ n ≤ 2 × 10⁴\n0 ≤ height[i] ≤ 10⁵',
 '[{"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6"},{"input": "height = [4,2,0,3,2,5]", "output": "9"}]',
 '{"python": "def trap(height):\n    pass", "cpp": "int trap(vector<int>& height) {\n}", "java": "public int trap(int[] height) {\n    return 0;\n}", "javascript": "var trap = function(height) {\n};"}',
 '[{"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expected": "6", "is_hidden": false},{"input": "[4,2,0,3,2,5]", "expected": "9", "is_hidden": false}]',
 true),

('Median of Two Sorted Arrays',
 'median-of-two-sorted-arrays',
 '## Median of Two Sorted Arrays\n\nGiven two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
 'Hard', 'Array',
 'nums1.length == m\nnums2.length == n\n0 ≤ m ≤ 1000\n0 ≤ n ≤ 1000\n1 ≤ m + n ≤ 2000\n-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
 '[{"input": "nums1 = [1,3], nums2 = [2]", "output": "2.00000"},{"input": "nums1 = [1,2], nums2 = [3,4]", "output": "2.50000"}]',
 '{"python": "def findMedianSortedArrays(nums1, nums2):\n    pass", "cpp": "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n}", "java": "public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    return 0.0;\n}"}',
 '[{"input": "[1,3]\n[2]", "expected": "2.00000", "is_hidden": false}]',
 true);

-- STRING PROBLEMS (sample)
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Valid Parentheses',
 'valid-parentheses',
 '## Valid Parentheses\n\nGiven a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
 'Easy', 'String',
 '1 ≤ s.length ≤ 10⁴\ns consists of parentheses only ''()[]{}''\n',
 '[{"input": "s = \"()\"", "output": "true"},{"input": "s = \"()[]{}\"", "output": "true"},{"input": "s = \"(]\"", "output": "false"}]',
 '{"python": "def isValid(s):\n    pass", "cpp": "bool isValid(string s) {\n}", "java": "public boolean isValid(String s) {\n    return false;\n}", "javascript": "var isValid = function(s) {\n};"}',
 '[{"input": "()", "expected": "true", "is_hidden": false},{"input": "()[]{}", "expected": "true", "is_hidden": false},{"input": "(]", "expected": "false", "is_hidden": false},{"input": "{[]}", "expected": "true", "is_hidden": true}]',
 true),

('Longest Substring Without Repeating Characters',
 'longest-substring-without-repeating-characters',
 '## Longest Substring Without Repeating Characters\n\nGiven a string `s`, find the length of the **longest substring** without repeating characters.',
 'Medium', 'String',
 '0 ≤ s.length ≤ 5 × 10⁴\ns consists of English letters, digits, symbols and spaces.',
 '[{"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is \"abc\", with the length of 3"},{"input": "s = \"bbbbb\"", "output": "1"},{"input": "s = \"pwwkew\"", "output": "3"}]',
 '{"python": "def lengthOfLongestSubstring(s):\n    pass", "cpp": "int lengthOfLongestSubstring(string s) {\n}", "java": "public int lengthOfLongestSubstring(String s) {\n    return 0;\n}", "javascript": "var lengthOfLongestSubstring = function(s) {\n};"}',
 '[{"input": "abcabcbb", "expected": "3", "is_hidden": false},{"input": "bbbbb", "expected": "1", "is_hidden": false},{"input": "pwwkew", "expected": "3", "is_hidden": true}]',
 true),

('Valid Anagram',
 'valid-anagram',
 '## Valid Anagram\n\nGiven two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
 'Easy', 'String',
 '1 ≤ s.length, t.length ≤ 5 × 10⁴\ns and t consist of lowercase English letters.',
 '[{"input": "s = \"anagram\", t = \"nagaram\"", "output": "true"},{"input": "s = \"rat\", t = \"car\"", "output": "false"}]',
 '{"python": "def isAnagram(s, t):\n    pass", "cpp": "bool isAnagram(string s, string t) {\n}", "java": "public boolean isAnagram(String s, String t) {\n    return false;\n}", "javascript": "var isAnagram = function(s, t) {\n};"}',
 '[{"input": "anagram\nnagaram", "expected": "true", "is_hidden": false},{"input": "rat\ncar", "expected": "false", "is_hidden": false}]',
 true),

('Minimum Window Substring',
 'minimum-window-substring',
 '## Minimum Window Substring\n\nGiven two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.',
 'Hard', 'String',
 'm == s.length\nn == t.length\n1 ≤ m, n ≤ 10⁵\ns and t consist of uppercase and lowercase English letters.',
 '[{"input": "s = \"ADOBECODEBANC\", t = \"ABC\"", "output": "\"BANC\""},{"input": "s = \"a\", t = \"a\"", "output": "\"a\""},{"input": "s = \"a\", t = \"aa\"", "output": "\"\""}]',
 '{"python": "def minWindow(s, t):\n    pass", "cpp": "string minWindow(string s, string t) {\n}", "java": "public String minWindow(String s, String t) {\n    return \"\";\n}", "javascript": "var minWindow = function(s, t) {\n};"}',
 '[{"input": "ADOBECODEBANC\nABC", "expected": "BANC", "is_hidden": false}]',
 true);

-- LINKED LIST
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Reverse Linked List',
 'reverse-linked-list',
 '## Reverse Linked List\n\nGiven the `head` of a singly linked list, reverse the list, and return the reversed list.',
 'Easy', 'Linked List',
 'The number of nodes in the list is the range [0, 5000].\n-5000 ≤ Node.val ≤ 5000',
 '[{"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]"},{"input": "head = [1,2]", "output": "[2,1]"},{"input": "head = []", "output": "[]"}]',
 '{"python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head):\n    pass", "cpp": "ListNode* reverseList(ListNode* head) {\n}", "java": "public ListNode reverseList(ListNode head) {\n    return null;\n}", "javascript": "var reverseList = function(head) {\n};"}',
 '[{"input": "[1,2,3,4,5]", "expected": "[5,4,3,2,1]", "is_hidden": false},{"input": "[]", "expected": "[]", "is_hidden": false}]',
 true),

('Merge Two Sorted Lists',
 'merge-two-sorted-lists',
 '## Merge Two Sorted Lists\n\nYou are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
 'Easy', 'Linked List',
 'The number of nodes in both lists is in the range [0, 50].\n-100 ≤ Node.val ≤ 100\nBoth list1 and list2 are sorted in non-decreasing order.',
 '[{"input": "list1 = [1,2,4], list2 = [1,3,4]", "output": "[1,1,2,3,4,4]"},{"input": "list1 = [], list2 = []", "output": "[]"}]',
 '{"python": "def mergeTwoLists(list1, list2):\n    pass", "cpp": "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n}", "java": "public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    return null;\n}", "javascript": "var mergeTwoLists = function(list1, list2) {\n};"}',
 '[{"input": "[1,2,4]\n[1,3,4]", "expected": "[1,1,2,3,4,4]", "is_hidden": false}]',
 true),

('LRU Cache',
 'lru-cache',
 '## LRU Cache\n\nDesign a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the `key` if it exists, otherwise return `-1`.\n- `void put(int key, int value)` Update or insert the value if the `key` is present. When the cache reaches its capacity, it should invalidate and remove the **least recently used** key before inserting a new item.',
 'Medium', 'Linked List',
 '1 ≤ capacity ≤ 3000\n0 ≤ key ≤ 10⁴\n0 ≤ value ≤ 10⁵\nAt most 2 × 10⁵ calls will be made to get and put.',
 '[{"input": "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", "output": "[null,null,null,1,null,-1,null,-1,3,4]"}]',
 '{"python": "class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass", "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};", "java": "class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}"}',
 '[{"input": "2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nget 3", "expected": "1\n-1\n3", "is_hidden": false}]',
 true);

-- TREE PROBLEMS
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Invert Binary Tree',
 'invert-binary-tree',
 '## Invert Binary Tree\n\nGiven the `root` of a binary tree, invert the tree, and return its root.',
 'Easy', 'Tree',
 'The number of nodes in the tree is in the range [0, 100].\n-100 ≤ Node.val ≤ 100',
 '[{"input": "root = [4,2,7,1,3,6,9]", "output": "[4,7,2,9,6,3,1]"},{"input": "root = [2,1,3]", "output": "[2,3,1]"},{"input": "root = []", "output": "[]"}]',
 '{"python": "def invertTree(root):\n    pass", "cpp": "TreeNode* invertTree(TreeNode* root) {\n}", "java": "public TreeNode invertTree(TreeNode root) {\n    return null;\n}", "javascript": "var invertTree = function(root) {\n};"}',
 '[{"input": "[4,2,7,1,3,6,9]", "expected": "[4,7,2,9,6,3,1]", "is_hidden": false}]',
 true),

('Maximum Depth of Binary Tree',
 'maximum-depth-of-binary-tree',
 '## Maximum Depth of Binary Tree\n\nGiven the `root` of a binary tree, return its maximum depth.\n\nA binary tree''s **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.',
 'Easy', 'Tree',
 'The number of nodes in the tree is in the range [0, 10⁴].\n-100 ≤ Node.val ≤ 100',
 '[{"input": "root = [3,9,20,null,null,15,7]", "output": "3"},{"input": "root = [1,null,2]", "output": "2"}]',
 '{"python": "def maxDepth(root):\n    pass", "cpp": "int maxDepth(TreeNode* root) {\n}", "java": "public int maxDepth(TreeNode root) {\n    return 0;\n}", "javascript": "var maxDepth = function(root) {\n};"}',
 '[{"input": "[3,9,20,null,null,15,7]", "expected": "3", "is_hidden": false}]',
 true),

('Binary Tree Level Order Traversal',
 'binary-tree-level-order-traversal',
 '## Binary Tree Level Order Traversal\n\nGiven the `root` of a binary tree, return the level order traversal of its nodes'' values (i.e., from left to right, level by level).',
 'Medium', 'Tree',
 'The number of nodes in the tree is in the range [0, 2000].\n-1000 ≤ Node.val ≤ 1000',
 '[{"input": "root = [3,9,20,null,null,15,7]", "output": "[[3],[9,20],[15,7]]"},{"input": "root = [1]", "output": "[[1]]"},{"input": "root = []", "output": "[]"}]',
 '{"python": "def levelOrder(root):\n    pass", "cpp": "vector<vector<int>> levelOrder(TreeNode* root) {\n}", "java": "public List<List<Integer>> levelOrder(TreeNode root) {\n    return new ArrayList<>();\n}", "javascript": "var levelOrder = function(root) {\n};"}',
 '[{"input": "[3,9,20,null,null,15,7]", "expected": "[[3],[9,20],[15,7]]", "is_hidden": false}]',
 true),

('Validate Binary Search Tree',
 'validate-binary-search-tree',
 '## Validate Binary Search Tree\n\nGiven the `root` of a binary tree, determine if it is a valid **binary search tree (BST)**.\n\nA **valid BST** is defined as follows:\n- The left subtree of a node contains only nodes with keys **less than** the node''s key.\n- The right subtree of a node contains only nodes with keys **greater than** the node''s key.\n- Both the left and right subtrees must also be binary search trees.',
 'Medium', 'Tree',
 'The number of nodes in the tree is in the range [1, 10⁴].\n-2³¹ ≤ Node.val ≤ 2³¹ - 1',
 '[{"input": "root = [2,1,3]", "output": "true"},{"input": "root = [5,1,4,null,null,3,6]", "output": "false"}]',
 '{"python": "def isValidBST(root):\n    pass", "cpp": "bool isValidBST(TreeNode* root) {\n}", "java": "public boolean isValidBST(TreeNode root) {\n    return false;\n}", "javascript": "var isValidBST = function(root) {\n};"}',
 '[{"input": "[2,1,3]", "expected": "true", "is_hidden": false},{"input": "[5,1,4,null,null,3,6]", "expected": "false", "is_hidden": false}]',
 true);

-- GRAPH PROBLEMS
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Number of Islands',
 'number-of-islands',
 '## Number of Islands\n\nGiven an `m x n` 2D binary grid `grid` which represents a map of `"1"`s (land) and `"0"`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
 'Medium', 'Graph',
 'm == grid.length\nn == grid[i].length\n1 ≤ m, n ≤ 300\ngrid[i][j] is ''0'' or ''1''.',
 '[{"input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1"},{"input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "output": "3"}]',
 '{"python": "def numIslands(grid):\n    pass", "cpp": "int numIslands(vector<vector<char>>& grid) {\n}", "java": "public int numIslands(char[][] grid) {\n    return 0;\n}", "javascript": "var numIslands = function(grid) {\n};"}',
 '[{"input": "[[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]", "expected": "1", "is_hidden": false}]',
 true),

('Course Schedule',
 'course-schedule',
 '## Course Schedule\n\nThere are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [aᵢ, bᵢ]` indicates that you **must** take course `bᵢ` first if you want to take course `aᵢ`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.',
 'Medium', 'Graph',
 '1 ≤ numCourses ≤ 2000\n0 ≤ prerequisites.length ≤ 5000\nprerequisites[i].length == 2\n0 ≤ aᵢ, bᵢ < numCourses\nAll the pairs prerequisites[i] are unique.',
 '[{"input": "numCourses = 2, prerequisites = [[1,0]]", "output": "true"},{"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "output": "false"}]',
 '{"python": "def canFinish(numCourses, prerequisites):\n    pass", "cpp": "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n}", "java": "public boolean canFinish(int numCourses, int[][] prerequisites) {\n    return false;\n}", "javascript": "var canFinish = function(numCourses, prerequisites) {\n};"}',
 '[{"input": "2\n[[1,0]]", "expected": "true", "is_hidden": false},{"input": "2\n[[1,0],[0,1]]", "expected": "false", "is_hidden": false}]',
 true);

-- DYNAMIC PROGRAMMING
INSERT INTO problems (title, slug, description, difficulty, category, constraints, examples, starter_codes, test_cases, is_published) VALUES

('Climbing Stairs',
 'climbing-stairs',
 '## Climbing Stairs\n\nYou are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
 'Easy', 'DP',
 '1 ≤ n ≤ 45',
 '[{"input": "n = 2", "output": "2", "explanation": "1. 1 step + 1 step, 2. 2 steps"},{"input": "n = 3", "output": "3", "explanation": "1. 1+1+1 steps, 2. 1+2 steps, 3. 2+1 steps"}]',
 '{"python": "def climbStairs(n):\n    pass", "cpp": "int climbStairs(int n) {\n}", "java": "public int climbStairs(int n) {\n    return 0;\n}", "javascript": "var climbStairs = function(n) {\n};"}',
 '[{"input": "2", "expected": "2", "is_hidden": false},{"input": "3", "expected": "3", "is_hidden": false},{"input": "10", "expected": "89", "is_hidden": true},{"input": "45", "expected": "1836311903", "is_hidden": true}]',
 true),

('Coin Change',
 'coin-change',
 '## Coin Change\n\nYou are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
 'Medium', 'DP',
 '1 ≤ coins.length ≤ 12\n1 ≤ coins[i] ≤ 2³¹ - 1\n0 ≤ amount ≤ 10⁴',
 '[{"input": "coins = [1,5,11], amount = 15", "output": "3"},{"input": "coins = [2], amount = 3", "output": "-1"},{"input": "coins = [1], amount = 0", "output": "0"}]',
 '{"python": "def coinChange(coins, amount):\n    pass", "cpp": "int coinChange(vector<int>& coins, int amount) {\n}", "java": "public int coinChange(int[] coins, int amount) {\n    return -1;\n}", "javascript": "var coinChange = function(coins, amount) {\n};"}',
 '[{"input": "[1,5,11]\n15", "expected": "3", "is_hidden": false},{"input": "[2]\n3", "expected": "-1", "is_hidden": false}]',
 true),

('Longest Increasing Subsequence',
 'longest-increasing-subsequence',
 '## Longest Increasing Subsequence\n\nGiven an integer array `nums`, return the length of the longest strictly increasing subsequence.',
 'Medium', 'DP',
 '1 ≤ nums.length ≤ 2500\n-10⁴ ≤ nums[i] ≤ 10⁴',
 '[{"input": "nums = [10,9,2,5,3,7,101,18]", "output": "4", "explanation": "The LIS is [2,3,7,101]"},{"input": "nums = [0,1,0,3,2,3]", "output": "4"},{"input": "nums = [7,7,7,7,7,7,7]", "output": "1"}]',
 '{"python": "def lengthOfLIS(nums):\n    pass", "cpp": "int lengthOfLIS(vector<int>& nums) {\n}", "java": "public int lengthOfLIS(int[] nums) {\n    return 0;\n}", "javascript": "var lengthOfLIS = function(nums) {\n};"}',
 '[{"input": "[10,9,2,5,3,7,101,18]", "expected": "4", "is_hidden": false}]',
 true);

-- Now link problems to tags
DO $$
DECLARE
  -- Array problems
  p_two_sum UUID; p_buy_stock UUID; p_contains_dup UUID; p_product UUID;
  p_max_sub UUID; p_3sum UUID; p_container UUID; p_rain UUID; p_median UUID;
  -- String
  p_valid_paren UUID; p_longest_sub UUID; p_anagram UUID; p_min_window UUID;
  -- Linked List
  p_reverse_ll UUID; p_merge_ll UUID; p_lru UUID;
  -- Tree
  p_invert UUID; p_max_depth UUID; p_level_order UUID; p_valid_bst UUID;
  -- Graph
  p_islands UUID; p_course UUID;
  -- DP
  p_stairs UUID; p_coin UUID; p_lis UUID;
  -- Tags
  t_array UUID; t_string UUID; t_ll UUID; t_tree UUID; t_graph UUID;
  t_dp UUID; t_greedy UUID; t_bs UUID; t_stack UUID; t_hashmap UUID;
  t_two_ptr UUID; t_sliding UUID; t_design UUID;
BEGIN
  SELECT id INTO p_two_sum     FROM problems WHERE slug = 'two-sum';
  SELECT id INTO p_buy_stock   FROM problems WHERE slug = 'best-time-to-buy-and-sell-stock';
  SELECT id INTO p_contains_dup FROM problems WHERE slug = 'contains-duplicate';
  SELECT id INTO p_product     FROM problems WHERE slug = 'product-of-array-except-self';
  SELECT id INTO p_max_sub     FROM problems WHERE slug = 'maximum-subarray';
  SELECT id INTO p_3sum        FROM problems WHERE slug = '3sum';
  SELECT id INTO p_container   FROM problems WHERE slug = 'container-with-most-water';
  SELECT id INTO p_rain        FROM problems WHERE slug = 'trapping-rain-water';
  SELECT id INTO p_median      FROM problems WHERE slug = 'median-of-two-sorted-arrays';
  SELECT id INTO p_valid_paren FROM problems WHERE slug = 'valid-parentheses';
  SELECT id INTO p_longest_sub FROM problems WHERE slug = 'longest-substring-without-repeating-characters';
  SELECT id INTO p_anagram     FROM problems WHERE slug = 'valid-anagram';
  SELECT id INTO p_min_window  FROM problems WHERE slug = 'minimum-window-substring';
  SELECT id INTO p_reverse_ll  FROM problems WHERE slug = 'reverse-linked-list';
  SELECT id INTO p_merge_ll    FROM problems WHERE slug = 'merge-two-sorted-lists';
  SELECT id INTO p_lru         FROM problems WHERE slug = 'lru-cache';
  SELECT id INTO p_invert      FROM problems WHERE slug = 'invert-binary-tree';
  SELECT id INTO p_max_depth   FROM problems WHERE slug = 'maximum-depth-of-binary-tree';
  SELECT id INTO p_level_order FROM problems WHERE slug = 'binary-tree-level-order-traversal';
  SELECT id INTO p_valid_bst   FROM problems WHERE slug = 'validate-binary-search-tree';
  SELECT id INTO p_islands     FROM problems WHERE slug = 'number-of-islands';
  SELECT id INTO p_course      FROM problems WHERE slug = 'course-schedule';
  SELECT id INTO p_stairs      FROM problems WHERE slug = 'climbing-stairs';
  SELECT id INTO p_coin        FROM problems WHERE slug = 'coin-change';
  SELECT id INTO p_lis         FROM problems WHERE slug = 'longest-increasing-subsequence';

  SELECT id INTO t_array   FROM problem_tags WHERE slug = 'array';
  SELECT id INTO t_string  FROM problem_tags WHERE slug = 'string';
  SELECT id INTO t_ll      FROM problem_tags WHERE slug = 'linked-list';
  SELECT id INTO t_tree    FROM problem_tags WHERE slug = 'tree';
  SELECT id INTO t_graph   FROM problem_tags WHERE slug = 'graph';
  SELECT id INTO t_dp      FROM problem_tags WHERE slug = 'dp';
  SELECT id INTO t_greedy  FROM problem_tags WHERE slug = 'greedy';
  SELECT id INTO t_bs      FROM problem_tags WHERE slug = 'binary-search';
  SELECT id INTO t_stack   FROM problem_tags WHERE slug = 'stack';
  SELECT id INTO t_hashmap FROM problem_tags WHERE slug = 'hash-map';
  SELECT id INTO t_two_ptr FROM problem_tags WHERE slug = 'two-pointer';
  SELECT id INTO t_sliding FROM problem_tags WHERE slug = 'sliding-window';
  SELECT id INTO t_design  FROM problem_tags WHERE slug = 'design';

  INSERT INTO problem_tag_map VALUES
    (p_two_sum, t_array),(p_two_sum, t_hashmap),
    (p_buy_stock, t_array),(p_buy_stock, t_greedy),
    (p_contains_dup, t_array),(p_contains_dup, t_hashmap),
    (p_product, t_array),
    (p_max_sub, t_array),(p_max_sub, t_dp),
    (p_3sum, t_array),(p_3sum, t_two_ptr),
    (p_container, t_array),(p_container, t_two_ptr),
    (p_rain, t_array),(p_rain, t_stack),(p_rain, t_two_ptr),
    (p_median, t_array),(p_median, t_bs),
    (p_valid_paren, t_string),(p_valid_paren, t_stack),
    (p_longest_sub, t_string),(p_longest_sub, t_sliding),(p_longest_sub, t_hashmap),
    (p_anagram, t_string),(p_anagram, t_hashmap),
    (p_min_window, t_string),(p_min_window, t_sliding),
    (p_reverse_ll, t_ll),
    (p_merge_ll, t_ll),
    (p_lru, t_ll),(p_lru, t_hashmap),(p_lru, t_design),
    (p_invert, t_tree),
    (p_max_depth, t_tree),
    (p_level_order, t_tree),
    (p_valid_bst, t_tree),
    (p_islands, t_graph),
    (p_course, t_graph),
    (p_stairs, t_dp),
    (p_coin, t_dp),
    (p_lis, t_dp),(p_lis, t_bs);
END $$;
