'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Code2, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-ds-blue/10 via-ds-violet/5 to-transparent items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative text-center max-w-md px-8 z-10">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-gradient">DevSphere</span>
          </Link>
          <h2 className="font-display text-3xl font-bold mb-4">Resume Your<br />Coding Journey</h2>
          <p className="text-muted-foreground">200+ problems, 5 languages, real-time compilation — all waiting for you.</p>
          <div className="mt-8 flex justify-center gap-6 text-center">
            {[{v:'50K+',l:'Learners'},{v:'200+',l:'Problems'},{v:'98%',l:'Success'}].map(s => (
              <div key={s.l}><div className="text-2xl font-display font-bold text-gradient">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-gradient">DevSphere</span>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-muted-foreground text-sm mb-6">Welcome back! Enter your credentials.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" autoComplete="email"
                className={cn('w-full px-3 py-2.5 bg-secondary/40 border rounded-lg text-sm outline-none transition-colors placeholder:text-muted-foreground/50',
                  errors.email ? 'border-red-500/60 focus:border-red-500' : 'border-border/60 focus:border-ds-blue/60')} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPwd?'text':'password'} placeholder="••••••••" autoComplete="current-password"
                  className={cn('w-full px-3 py-2.5 pr-10 bg-secondary/40 border rounded-lg text-sm outline-none transition-colors placeholder:text-muted-foreground/50',
                    errors.password ? 'border-red-500/60 focus:border-red-500' : 'border-border/60 focus:border-ds-blue/60')} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-ds-blue hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 shadow-md shadow-ds-blue/20 h-10 font-semibold" disabled={isLoading}>
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div><div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or</span></div></div>

          <Button variant="outline" className="w-full h-10 gap-2 border-border/60">
            <Github className="h-4 w-4" />Continue with GitHub
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No account? <Link href="/auth/register" className="text-ds-blue hover:underline font-medium">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
