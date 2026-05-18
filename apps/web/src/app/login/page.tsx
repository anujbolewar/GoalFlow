'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KeyRound, ShieldAlert, Award, Compass } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleDemoLogin = (role: 'employee' | 'manager' | 'admin') => {
    // Navigate straight to the designated dashboard for instant hackathon demo flow
    if (role === 'employee') {
      router.push('/employee');
    } else if (role === 'manager') {
      router.push('/manager');
    } else if (role === 'admin') {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] text-[#F8FAFC] p-4 font-sans selection:bg-[#3B82F6] selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* GoalFlow Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 animate-pulse">
            <Compass className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#F8FAFC] via-[#94A3B8] to-[#3B82F6] bg-clip-text text-transparent">
            GoalFlow
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 font-medium">
            &ldquo;From goal creation to appraisal — one platform, zero
            guesswork.&rdquo;
          </p>
        </div>

        {/* Login Box */}
        <Card className="bg-[#1E293B] border-[#334155] text-[#F8FAFC] shadow-2xl shadow-black/40">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold tracking-tight">
              Access Portal
            </CardTitle>
            <CardDescription className="text-[#94A3B8] text-xs">
              AtomQuest Hackathon 1.0 Securing Access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {/* Primary MS Login */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full bg-[#1E293B] hover:bg-[#334155] border-[#334155] hover:border-blue-500/50 text-[#F8FAFC] hover:text-[#F8FAFC] flex items-center justify-center gap-3 py-6 rounded-lg transition-all duration-200"
                onClick={() => handleDemoLogin('employee')}
              >
                {/* SVG Microsoft Icon */}
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                  <path d="M0 0H11V11H0V0Z" fill="#F25022" />
                  <path d="M12 0H23V11H12V0Z" fill="#7FBA00" />
                  <path d="M0 12H11V23H0V12Z" fill="#00A4EF" />
                  <path d="M12 12H23V23H12V12Z" fill="#FFB900" />
                </svg>
                <span className="font-semibold text-sm">
                  Sign in with Microsoft
                </span>
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#334155]"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[#475569]">
                Or use demo credentials
              </span>
              <div className="flex-grow border-t border-[#334155]"></div>
            </div>

            {/* Role Demo Login Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-5 flex items-center justify-start gap-3 px-4 rounded-lg shadow-lg shadow-blue-500/10 border-none transition-all duration-200"
                  onClick={() => handleDemoLogin('employee')}
                >
                  <Compass className="w-4 h-4 text-blue-100" />
                  <div className="text-left">
                    <div className="text-xs text-blue-100/80 font-normal">
                      Step 1 Demo
                    </div>
                    <div className="text-sm font-bold">
                      Login as Employee (Rahul Verma)
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] font-medium py-5 flex items-center justify-start gap-3 px-4 rounded-lg border border-[#475569] transition-all duration-200"
                  onClick={() => handleDemoLogin('manager')}
                >
                  <KeyRound className="w-4 h-4 text-[#94A3B8]" />
                  <div className="text-left">
                    <div className="text-xs text-[#94A3B8] font-normal">
                      Step 2 Demo
                    </div>
                    <div className="text-sm font-bold">
                      Login as Manager (Vikram Nair)
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-[#1e293b] hover:bg-[#334155] text-purple-400 hover:text-purple-300 font-medium py-5 flex items-center justify-start gap-3 px-4 rounded-lg border border-[#334155] hover:border-purple-500/40 transition-all duration-200"
                  onClick={() => handleDemoLogin('admin')}
                >
                  <Award className="w-4 h-4 text-purple-400" />
                  <div className="text-left">
                    <div className="text-xs text-purple-400/80 font-normal">
                      Step 3 Demo
                    </div>
                    <div className="text-sm font-bold">
                      Login as Admin (HR Dashboard)
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-[#334155]/60 pt-4 pb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#475569]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Identity verified via Row-Level Security</span>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-[#475569] font-medium">
          AtomQuest Hackathon 1.0 | GoalFlow v1.0
        </div>
      </motion.div>
    </div>
  );
}
