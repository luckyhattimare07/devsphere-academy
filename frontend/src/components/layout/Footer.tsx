'use client';
import Link from 'next/link';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  Learn: [
    { href: '/languages/python', label: 'Python' },
    { href: '/languages/cpp', label: 'C++' },
    { href: '/languages/java', label: 'Java' },
    { href: '/languages/javascript', label: 'JavaScript' },
    { href: '/languages/c', label: 'C' },
  ],
  DSA: [
    { href: '/dsa/arrays', label: 'Arrays' },
    { href: '/dsa/trees', label: 'Trees' },
    { href: '/dsa/graphs', label: 'Graphs' },
    { href: '/dsa/dynamic-programming', label: 'Dynamic Programming' },
  ],
  Practice: [
    { href: '/practice?difficulty=Easy', label: 'Easy Problems' },
    { href: '/practice?difficulty=Medium', label: 'Medium Problems' },
    { href: '/practice?difficulty=Hard', label: 'Hard Problems' },
    { href: '/compiler', label: 'Online Compiler' },
  ],
  Company: [
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/10">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-gradient">DevSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              The most comprehensive platform for mastering programming, DSA, and competitive coding.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h3 className="font-semibold text-sm mb-4">{cat}</h3>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2024 DevSphere Academy. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built with ❤️ for developers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
