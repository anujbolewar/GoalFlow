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
  Users,
  Award,
  Bell,
  User,
  LogOut,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export default function ManagerDashboard() {
  const router = useRouter();

  // Mock team members list matching database seed data
  const teamMembers = [
    {
      id: 'u-emp-1',
      name: 'Arjun Mehta',
      department: 'Sales',
      goalsCount: 3,
      weightage: 100,
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'u-emp-2',
      name: 'Riya Kapoor',
      department: 'Sales',
      goalsCount: 0,
      weightage: 0,
      status: 'DRAFT',
    },
    {
      id: 'u-emp-3',
      name: 'Priya Sharma',
      department: 'Sales',
      goalsCount: 4,
      weightage: 100,
      status: 'APPROVED',
    },
    {
      id: 'u-emp-seeded-1',
      name: 'Sneha Patel',
      department: 'Sales',
      goalsCount: 4,
      weightage: 100,
      status: 'APPROVED',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* LEFT SIDEBAR - Manager Role */}
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
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all">
              <Users className="w-4 h-4" />
              <span>My Team</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all">
              <Award className="w-4 h-4" />
              <span>Performance Logs</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#94A3B8] hover:text-white hover:bg-[#334155]/50 transition-all">
              <Bell className="w-4 h-4" />
              <span>Team Notifications</span>
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
                Vikram Nair
              </div>
              <div className="text-[10px] text-[#94A3B8] font-medium">
                Sales Manager
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
        {/* welcome title */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manager Hub</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Review team performance metrics and lock submitted goals.
          </p>
        </div>

        {/* Alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 flex items-center gap-4 text-amber-500"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <div className="text-sm font-semibold">
            2 goal sheets pending your approval. Action required.
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Team Size
              </span>
              <span className="text-2xl font-black">4</span>
              <span className="text-[10px] text-slate-400 mt-2">
                Active direct reports
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Approved Sheets
              </span>
              <span className="text-2xl font-black text-green-500">2</span>
              <span className="text-[10px] text-slate-400 mt-2">
                100% Locked & Immutable
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Pending Approval
              </span>
              <span className="text-2xl font-black text-amber-400">2</span>
              <span className="text-[10px] text-slate-400 mt-2">
                Needs Manager Review
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-5 flex flex-col gap-1">
              <span className="text-xs text-[#94A3B8] font-semibold">
                Overdue Appraisals
              </span>
              <span className="text-2xl font-black text-red-500">0</span>
              <span className="text-[10px] text-slate-400 mt-2">
                All tasks on track
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Team Overview Table */}
        <Card className="bg-[#1E293B] border-[#334155] text-white flex-grow">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#0F172A]/40 border-b border-[#334155]">
                <TableRow className="border-b border-[#334155] hover:bg-transparent">
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Employee
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Goals count
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4 text-center">
                    Weightage
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-[#94A3B8] font-bold py-4 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((m) => (
                  <TableRow
                    key={m.id}
                    className="border-b border-[#334155]/60 hover:bg-[#334155]/20 transition-all duration-150"
                  >
                    <TableCell className="font-bold text-sm py-4">
                      {m.name}
                    </TableCell>
                    <TableCell className="font-medium py-4">
                      {m.goalsCount} Goals
                    </TableCell>
                    <TableCell className="font-bold py-4 text-center text-slate-100">
                      {m.weightage}%
                    </TableCell>
                    <TableCell className="py-4">
                      {m.status === 'APPROVED' ? (
                        <Badge className="bg-green-500/20 text-green-400 border-none font-bold text-[10px]">
                          Approved ✓
                        </Badge>
                      ) : m.status === 'PENDING_APPROVAL' ? (
                        <Badge className="bg-amber-500/20 text-amber-400 border-none font-bold text-[10px] animate-pulse">
                          Pending Approval
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-700/50 text-[#94A3B8] border-none font-bold text-[10px]">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      {m.status === 'PENDING_APPROVAL' ? (
                        <Button
                          onClick={() =>
                            router.push(`/manager/approval/${m.id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-1 px-4 rounded-lg flex items-center gap-1.5 ml-auto"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          disabled={m.goalsCount === 0}
                          className="border-[#334155] bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] font-bold text-xs py-1 px-4 rounded-lg ml-auto"
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
