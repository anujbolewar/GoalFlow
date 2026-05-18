'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Compass,
  LayoutDashboard,
  Target,
  Award,
  Bell,
  Plus,
  Sparkles,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function EmployeeDashboard() {
  const router = useRouter();

  // Mock Goals matching the 45% weightage specs (30% + 15%)
  const goals = [
    {
      id: 'g-mock-1',
      thrustArea: 'Innovation',
      title: 'Migrate legacy auth to Azure AD SSO',
      uom: 'Timeline',
      target: '100% complete',
      weightage: 30,
      status: 'DRAFT',
    },
    {
      id: 'g-mock-2',
      thrustArea: 'Operational Excellence',
      title: 'Implement SonarQube Quality Gates in CI/CD',
      uom: 'Percentage',
      target: '85%',
      weightage: 15,
      status: 'DRAFT',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* LEFT SIDEBAR - Dark Theme */}
      <aside className="w-64 bg-[#1E293B] border-r border-[#334155] flex flex-col justify-between p-4 min-h-screen">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
              GoalFlow
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#334155] text-white transition-all">
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/employee/create')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all"
            >
              <Target className="w-4 h-4" />
              <span>My Goals</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all">
              <Award className="w-4 h-4" />
              <span>Achievements</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-blue-500"></span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-4 pt-4 border-t border-[#334155]/60">
          <div className="bg-[#0F172A]/40 rounded-xl p-3 flex items-center gap-3 border border-[#334155]/25">
            <div className="w-9 h-9 rounded-full bg-[#334155] flex items-center justify-center">
              <User className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">
                Rahul Verma
              </div>
              <div className="text-[10px] text-[#94A3B8] font-medium">
                Engineering
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <Badge className="bg-[#8B5CF6]/25 hover:bg-[#8B5CF6]/30 text-[#8B5CF6] border-none text-[10px] font-bold py-0.5 px-2">
              Q1 Check-in: OPEN
            </Badge>
            <button
              onClick={() => router.push('/login')}
              className="text-[#475569] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-[#0F172A] p-8 flex flex-col gap-6 overflow-y-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/40 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, Rahul
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1">
              Goal Setting Period is{' '}
              <span className="text-blue-400 font-semibold">OPEN</span> until
              31st May. Ensure your total weightage equals exactly 100%.
            </p>
          </div>
          <Button
            onClick={() => router.push('/employee/create')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Goal
          </Button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Goals Created
              </span>
              <span className="text-2xl font-black">2 / 8</span>
              <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: '25%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Total Weightage
              </span>
              <span className="text-2xl font-black text-amber-400">45%</span>
              <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: '45%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Remaining Weightage
              </span>
              <span className="text-2xl font-black text-blue-400">55%</span>
              <div className="w-full bg-slate-700 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full"
                  style={{ width: '55%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Sheet Status
              </span>
              <span className="text-2xl font-black text-slate-400">DRAFT</span>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#94A3B8] font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Editable</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestion Chip */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => router.push('/employee/create')}
          className="bg-slate-800/60 hover:bg-slate-800 border border-[#334155] rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              ✨ Get AI-powered goal suggestions
              <Badge className="bg-purple-500/20 text-purple-400 text-[9px] hover:bg-purple-500/20 font-bold px-1.5 py-0.5 border-none">
                Claude Sonnet
              </Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Let AI analyze your Thrust Areas to formulate precise, measurable
              SMART goals instantly.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#475569]" />
        </motion.div>

        {/* Goals Table */}
        <Card className="bg-[#1E293B] border-[#334155] text-white flex-grow">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0F172A]/40 border-b border-[#334155]">
                <TableRow className="border-b border-[#334155] hover:bg-transparent">
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Thrust Area
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Goal Title
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    UoM
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Target
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4 text-right">
                    Weightage
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((g) => (
                  <TableRow
                    key={g.id}
                    className="border-b border-[#334155]/60 hover:bg-[#334155]/20 transition-all duration-150"
                  >
                    <TableCell className="font-semibold text-xs py-4">
                      {g.thrustArea}
                    </TableCell>
                    <TableCell className="font-medium text-sm py-4">
                      {g.title}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-slate-700/50 hover:bg-slate-700/50 text-[#F8FAFC] border-none text-[10px] font-bold py-0.5 px-2">
                        {g.uom}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm py-4 text-blue-400">
                      {g.target}
                    </TableCell>
                    <TableCell className="font-bold py-4 text-right text-amber-400">
                      {g.weightage}%
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Badge className="bg-slate-600/30 hover:bg-slate-600/30 text-[#94A3B8] border-none text-[10px] font-bold py-0.5 px-2">
                        {g.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Floating Add Goal Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => router.push('/employee/create')}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 border-none"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </Button>
      </motion.div>
    </div>
  );
}
