'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login({
      username: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Visual/Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20" />
        
        <div className="relative z-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 mb-8">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Unlock the next chapter of your professional journey.
            </h2>
            <p className="text-lg text-slate-400">
              Join 50,000+ professionals finding work at companies like Stripe, Vercel, and Airbnb.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-slate-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">JobDen</span>
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl p-2">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                      {...register('email')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs sm font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-6 pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  New to JobDen?{' '}
                  <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                    Create account
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/help" className="hover:text-slate-600 transition-colors">Support</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}