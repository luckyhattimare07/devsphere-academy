'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Menu, X, Sun, Moon, ChevronDown, Zap, BookOpen, Trophy, LayoutDashboard, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    href: '/languages', label: 'Languages', icon: BookOpen,
    sub: [
      { href: '/languages/c',          label: 'C',          icon: '🔵' },
      { href: '/languages/cpp',        label: 'C++',        icon: '🟣' },
      { href: '/languages/java',       label: 'Java',       icon: '🟠' },
      { href: '/languages/python',     label: 'Python',     icon: '🟡' },
      { href: '/languages/javascript', label: 'JavaScript', icon: '🟤' },
    ],
  },
  { href: '/dsa',      label: 'DSA',      icon: Zap },
  { href: '/practice', label: 'Practice', icon: Trophy },
  { href: '/compiler', label: 'Compiler', icon: Code2 },
  { href: '/blog',     label: 'Blog',     icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm' : 'bg-transparent'
    )}>
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-extrabold text-lg text-gradient">DevSphere</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <div key={link.href} className="relative"
              onMouseEnter={() => link.sub && setActiveDropdown(link.href)}
              onMouseLeave={() => setActiveDropdown(null)}>
              <Link href={link.href} className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'text-ds-blue bg-ds-blue/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}>
                {link.label}
                {link.sub && <ChevronDown className="h-3 w-3" />}
              </Link>
              <AnimatePresence>
                {link.sub && activeDropdown === link.href && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-44 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden">
                    {link.sub.map((s) => (
                      <Link key={s.href} href={s.href}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                        <span className="text-base">{s.icon}</span>{s.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="relative hidden md:block"
              onMouseEnter={() => setActiveDropdown('user')}
              onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center text-white text-xs font-bold">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'user' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full right-0 mt-1 w-48 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden">
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors"><LayoutDashboard className="h-4 w-4 text-muted-foreground" />Dashboard</Link>
                    <Link href="/profile"   className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors"><User className="h-4 w-4 text-muted-foreground" />Profile</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors"><Settings className="h-4 w-4 text-muted-foreground" />Admin</Link>
                    )}
                    <div className="border-t border-border/50 mt-1">
                      <button onClick={logout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" />Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm"><Link href="/auth/login">Sign In</Link></Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 shadow-md shadow-ds-blue/20">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          )}

          <button className="md:hidden p-2 rounded-lg hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/98 backdrop-blur-xl">
            <nav className="container px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href) ? 'text-ds-blue bg-ds-blue/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                )}>
                  <link.icon className="h-4 w-4" />{link.label}
                </Link>
              ))}
              <div className="border-t border-border/50 mt-2 pt-2 flex flex-col gap-1">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 rounded-lg"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                    <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"><LogOut className="h-4 w-4" />Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 rounded-lg">Sign In</Link>
                    <Link href="/auth/register" className="px-3 py-2.5 text-sm text-ds-blue font-semibold bg-ds-blue/10 rounded-lg">Get Started Free</Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
