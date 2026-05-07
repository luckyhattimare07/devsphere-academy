'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Code2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscores only'),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include uppercase, lowercase, and number'),
  full_name: z.string().max(100).optional(),
});

type Form = z.infer<typeof schema>;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();

  // FIXED HERE
  const { setUser } = useAuthStore();

  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      const res = await api.post('/auth/register', data);

      const { user } = res.data.data;

      setUser(user);

      toast.success('Account created! Welcome to DevSphere 🎉');

      router.push('/dashboard');
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || 'Registration failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ds-blue to-ds-violet flex items-center justify-center shadow-lg shadow-ds-blue/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>

            <span className="font-display font-bold text-xl text-gradient">
              DevSphere
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
          <h1 className="font-display text-2xl font-bold text-center mb-2">
            Create your account
          </h1>

          <p className="text-sm text-muted-foreground text-center mb-8">
            Start mastering programming today — it's free
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Username
                </label>

                <input
                  {...register('username')}
                  placeholder="cool_dev"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-sm outline-none focus:border-ds-blue/50 transition-all placeholder:text-muted-foreground"
                />

                {errors.username && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Full Name{' '}
                  <span className="text-muted-foreground font-normal">
                    (opt.)
                  </span>
                </label>

                <input
                  {...register('full_name')}
                  placeholder="Ada Lovelace"
                  className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-sm outline-none focus:border-ds-blue/50 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Email
              </label>

              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-sm outline-none focus:border-ds-blue/50 transition-all placeholder:text-muted-foreground"
              />

              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Password
              </label>

              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border/60 bg-secondary/50 text-sm outline-none focus:border-ds-blue/50 transition-all placeholder:text-muted-foreground"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {PASSWORD_RULES.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center gap-1.5"
                    >
                      <CheckCircle2
                        className={`h-3 w-3 ${
                          r.test(password)
                            ? 'text-green-400'
                            : 'text-muted-foreground/40'
                        }`}
                      />

                      <span
                        className={`text-xs ${
                          r.test(password)
                            ? 'text-green-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-ds-blue to-ds-violet text-white border-0 font-semibold mt-2 gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By signing up, you agree to our{' '}
            <Link
              href="/terms"
              className="text-ds-blue hover:underline"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-ds-blue hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-sm text-muted-foreground text-center mt-5">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-ds-blue font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}