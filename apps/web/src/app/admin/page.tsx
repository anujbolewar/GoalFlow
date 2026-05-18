'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { fetchApi } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  Download,
  Activity,
  Users,
  CheckCircle,
  FileCheck,
  Radio,
  PlayCircle,
  History,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Real-time counter states
  const totalEmployees = 10;
  const goalsSubmitted = 8;
  const [managerApproved, setManagerApproved] = useState(6);
  const checkInsComplete = 4;

  // Real-time WebSocket connection to the backend
  useEffect(() => {
    const isOfflineMode =
      typeof window !== 'undefined' &&
      (window.location.search.includes('demo=true') ||
        window.location.search.includes('offline=true'));

    if (isOfflineMode) {
      console.log(
        '🛟 [Offline Mode WS] WebSocket hooks ignored in fallback mode.'
      );
      return;
    }

    try {
      const ws = new WebSocket('ws://localhost:8000/ws/dashboard');

      ws.onopen = () => {
        console.log('📡 Live GoalFlow Telemetry Channel established!');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.event_type === 'APPROVE') {
            setManagerApproved((prev) => prev + 1);
            setPulse(true);
            setTimeout(() => setPulse(false), 800);

            const newEvent = {
              id: Date.now(),
              text: `⚡ [WS LIVE] Manager approved ${data.employee_name}'s goal sheet`,
              time: 'Just now',
              type: 'APPROVE',
            };
            setActivities((prev) => [newEvent, ...prev]);
            toast.success(`Approval registered: ${data.employee_name}`, {
              icon: '🔒',
            });
          } else if (data.event_type === 'SUBMIT') {
            const newEvent = {
              id: Date.now(),
              text: `🟢 [WS LIVE] Employee ${data.employee_name} submitted goals`,
              time: 'Just now',
              type: 'SUBMIT',
            };
            setActivities((prev) => [newEvent, ...prev]);
            toast.info(`Goal sheet submitted: ${data.employee_name}`, {
              icon: '📝',
            });
          } else if (data.event_type === 'CHECKIN') {
            const newEvent = {
              id: Date.now(),
              text: `📊 [WS LIVE] Employee ${data.employee_name} completed Check-in`,
              time: 'Just now',
              type: 'CHECKIN',
            };
            setActivities((prev) => [newEvent, ...prev]);
            toast.success(`Check-in complete: ${data.employee_name}`, {
              icon: '🏆',
            });
          }
        } catch (e) {
          console.error('Failed to parse live telemetry packet:', e);
        }
      };

      ws.onerror = (e) => {
        console.warn(
          'WebSocket channel error. Offline fallback modes are armed.',
          e
        );
      };

      return () => {
        ws.close();
      };
    } catch (e) {
      console.warn('WebSocket connection refused.', e);
    }
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    toast.loading('Restoring pristine demo seed state...', {
      id: 'reset-toast',
    });

    try {
      const res = await fetchApi('/demo/reset', {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Demo environment successfully restored!', {
          id: 'reset-toast',
          description: 'All employee sheets reset to initial seeds.',
        });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error('Re-seeding failed!', { id: 'reset-toast' });
      }
    } catch {
      toast.error('Connection error!', { id: 'reset-toast' });
    } finally {
      setIsResetting(false);
    }
  };

  // Live activity list
  const [activities, setActivities] = useState([
    {
      id: 1,
      text: '🟢 Arjun Mehta submitted goals',
      time: '2 mins ago',
      type: 'SUBMIT',
    },
    {
      id: 2,
      text: "✅ Vikram Nair approved Sneha Patel's goals",
      time: '10 mins ago',
      type: 'APPROVE',
    },
    {
      id: 3,
      text: '📊 Priya Sharma completed Q1 Check-in',
      time: '1 hour ago',
      type: 'CHECKIN',
    },
  ]);

  // Chart data
  const chartData = [
    { name: 'Sales', completion: 85 },
    { name: 'Operations', completion: 70 },
    { name: 'Engineering', completion: 90 },
    { name: 'Finance', completion: 50 },
    { name: 'HR', completion: 100 },
  ];

  // Simulate real-time WebSocket event
  const triggerWebSocketSim = () => {
    // Increment Approved
    setManagerApproved((prev) => prev + 1);

    // Add new activity
    const newEvent = {
      id: Date.now(),
      text: "⚡ [Pusher WebSocket] Vikram Nair approved Arjun Mehta's goal sheet",
      time: 'Just now',
      type: 'APPROVE',
    };

    setActivities((prev) => [newEvent, ...prev]);
  };

  // Trigger CSV Download
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Employee Name,Department,Goals Count,Weightage,Q1 Score,Status\n' +
      'Arjun Mehta,Sales,3,100%,85%,LOCKED\n' +
      'Priya Sharma,Operations,4,100%,92%,LOCKED\n' +
      'Sneha Patel,Sales,4,100%,88%,LOCKED\n' +
      'Rahul Verma,Engineering,2,45%,0%,DRAFT';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'GoalFlow_Achievement_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white p-6 md:p-12">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Completion Dashboard
              <Badge className="bg-[#22C55E]/15 text-[#22C55E] border-none font-extrabold text-[10px] animate-pulse flex items-center gap-1.5 px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                LIVE 🟢
              </Badge>
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Real-time organizational KPI alignment logs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => router.push('/audit')}
            variant="outline"
            className="border-[#334155] bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-bold text-xs rounded-lg flex items-center gap-1.5 py-5"
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </Button>

          <Button
            onClick={triggerWebSocketSim}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 py-5"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Simulate WebSocket Live Event</span>
          </Button>

          <Button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 py-5"
          >
            <Download className="w-4 h-4" />
            <span>📥 Export Achievement Report</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 4 Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider block">
                  Total Employees
                </span>
                <span className="text-3xl font-black">{totalEmployees}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider block">
                  Goals Submitted
                </span>
                <span className="text-3xl font-black text-amber-400">
                  {goalsSubmitted}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white relative overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider block">
                  Manager Approved
                </span>
                <motion.span
                  key={managerApproved}
                  initial={{ scale: 0.7, color: '#22C55E' }}
                  animate={{ scale: 1, color: '#4ADE80' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="text-3xl font-black block"
                >
                  {managerApproved}
                </motion.span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <FileCheck className="w-5 h-5" />
              </div>
            </CardContent>
            {/* Decorative pulse ripple */}
            {pulse && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 border-2 border-green-500 rounded-2xl pointer-events-none"
              />
            )}
          </Card>

          <Card className="bg-[#1E293B] border-[#334155] text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider block">
                  Check-ins Complete
                </span>
                <span className="text-3xl font-black text-[#8B5CF6]">
                  {checkInsComplete}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#8B5CF6]">
                <CheckCircle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dual Layout: Heatmap and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: ORG HEATMAP / RECHARTS CHART */}
          <Card className="bg-[#1E293B] border-[#334155] text-white lg:col-span-8 shadow-xl">
            <CardHeader className="border-b border-[#334155]/60">
              <CardTitle className="text-md font-bold">
                Organizational Completion Metrics
              </CardTitle>
              <CardDescription className="text-[#94A3B8] text-xs">
                Completion rates across critical corporate departments.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      domain={[0, 100]}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                    />
                    <Bar
                      dataKey="completion"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: LIVE ACTIVITY FEED */}
          <Card className="bg-[#1E293B] border-[#334155] text-white lg:col-span-4 shadow-xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-[#334155]/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-400" />
                <CardTitle className="text-md font-bold">
                  Live Activity Feed
                </CardTitle>
              </div>
              <CardDescription className="text-[#94A3B8] text-xs">
                Streaming WebSocket ledger triggers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto flex-grow space-y-3">
              <AnimatePresence initial={false}>
                {activities.map((act) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="p-3 bg-[#0F172A]/50 border border-[#334155]/30 rounded-xl space-y-1"
                  >
                    <p className="text-[11px] font-bold text-slate-100 leading-relaxed">
                      {act.text}
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-[#475569] pt-1">
                      <span className="font-semibold">{act.time}</span>
                      <Badge className="bg-slate-700/60 text-slate-400 border-none font-bold text-[8px] px-1 py-0">
                        {act.type}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Hidden Master Demo Reset button for presentation flexibility */}
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="text-[#475569] hover:text-[#94A3B8] transition-colors flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mt-12 mx-auto disabled:opacity-50"
          title="Restore Pristine seeds"
        >
          <span className={`${isResetting ? 'animate-spin' : ''}`}>🔄</span>
          <span>
            {isResetting ? 'Resetting Demo State...' : 'Demo Master Reset'}
          </span>
        </button>
      </div>

      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
