'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Briefcase, UserCircle, Building2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/use-auth';
import { passwordSchema } from '@/lib/utils/validators';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  accountType: z.enum(['job_seeker', 'employer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: 'job_seeker',
    },
  });

  const accountType = watch('accountType');

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      is_employer: data.accountType === 'employer',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-none shadow-2xl shadow-indigo-100 rounded-[2rem] overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Small Sidebar for Info */}
            <div className="hidden md:flex md:col-span-2 bg-indigo-600 p-8 text-white flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-12">
                   <Briefcase className="h-6 w-6" />
                   <span className="font-bold text-xl tracking-tighter">JobDen</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Start your journey.</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Join a community of forward-thinking professionals and world-class companies.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-medium bg-white/10 p-3 rounded-xl border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-indigo-200" />
                  Verified Opportunities
                </div>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="md:col-span-3 p-8 bg-white">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                <CardDescription>Get started with your free account today.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Account Type Selection */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Account Type</Label>
                  <RadioGroup
                    value={accountType}
                    onValueChange={(value: RegisterFormData["accountType"]) => {
                      setValue("accountType", value, { shouldValidate: true });
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <SelectCard 
                      id="job_seeker" 
                      value="job_seeker" 
                      icon={<UserCircle className="h-5 w-5" />} 
                      label="Candidate" 
                      isActive={accountType === 'job_seeker'} 
                    />
                    <SelectCard 
                      id="employer" 
                      value="employer" 
                      icon={<Building2 className="h-5 w-5" />} 
                      label="Employer" 
                      isActive={accountType === 'employer'} 
                    />
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                        {...register('email')}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                          {...register('password')}
                          disabled={isLoading}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                          {...register('confirmPassword')}
                          disabled={isLoading}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white transition-all shadow-lg shadow-indigo-100"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper component for account type selection
function SelectCard({ id, value, icon, label, isActive }: { id: string, value: string, icon: any, label: string, isActive: boolean }) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-4 cursor-pointer transition-all duration-200",
          "hover:bg-slate-50 border-slate-100",
          "peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-600"
        )}
      >
        <div className={cn("mb-2 p-2 rounded-lg transition-colors", isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
      </Label>
    </div>
  );
}