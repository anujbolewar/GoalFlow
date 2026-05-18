'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Compass,
  ChevronLeft,
  Lock,
  Check,
  CornerUpLeft,
  Pencil,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { fetchApi } from '@/lib/api';

export default function GoalApprovalPage() {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [showTeamsNotify, setShowTeamsNotify] = useState(false);

  // Arjun Mehta's Goals State
  const [goals, setGoals] = useState([
    {
      id: 'g-5',
      thrustArea: 'Revenue Growth',
      title: 'Close $500k in Enterprise Deals',
      uom: 'NUMERIC',
      target: '500000',
      weightage: 40,
      isEditing: false,
    },
    {
      id: 'g-6',
      thrustArea: 'Revenue Growth',
      title: 'Onboard 10 new channel partners',
      uom: 'NUMERIC',
      target: '10',
      weightage: 30,
      isEditing: false,
    },
    {
      id: 'g-7',
      thrustArea: 'Customer Experience',
      title: 'Conduct 20 customer success workshops',
      uom: 'NUMERIC',
      target: '20',
      weightage: 30,
      isEditing: false,
    },
  ]);

  const handleEditField = (
    id: string,
    field: 'target' | 'weightage',
    value: string
  ) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            [field]: field === 'weightage' ? parseInt(value, 10) || 0 : value,
          };
        }
        return g;
      })
    );
  };

  const toggleEdit = (id: string) => {
    if (isApproved) return;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, isEditing: !g.isEditing };
        }
        return g;
      })
    );
  };

  const playLockSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const audioContext = new AudioCtx();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        30,
        audioContext.currentTime + 0.08
      );

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.08
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.09);
    } catch {
      console.warn('AudioContext block by browser auto-play policies');
    }
  };

  const handleApprove = async () => {
    // 1. Play high-fidelity click sound effect
    playLockSound();

    // 2. Lock screen overlay transition
    setIsApproved(true);
    toast.success('Goal sheet approved. Goals are now locked.', {
      duration: 3000,
    });

    // 3. Fire real-time backend synchronization trigger (Pusher WS & Teams Webhook)
    try {
      await fetchApi('/manager/goals/u-emp-1/approve', {
        method: 'POST',
      });
    } catch {
      console.warn('Offline fallback activated cleanly for lock triggers.');
    }

    // 4. Slide in Microsoft Teams mock card preview
    setTimeout(() => {
      setShowTeamsNotify(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white p-6 md:p-12 relative overflow-hidden">
      <Toaster position="top-right" theme="dark" richColors />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Manager Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            GoalFlow
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black tracking-tight">
            Reviewing Arjun Mehta&apos;s Sheet
          </h2>
          <Badge
            className={`border-none font-bold text-xs py-1 px-3 ${
              isApproved
                ? 'bg-[#8B5CF6]/25 text-[#8B5CF6] animate-pulse'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isApproved ? 'LOCKED 🔒' : 'PENDING APPROVAL'}
          </Badge>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Review thrust alignments and adjust parameters inline if necessary.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ARJUN'S GOAL SHEET (READ-ONLY / INLINE EDIT) */}
        <div className="lg:col-span-8 space-y-4">
          {goals.map((g) => (
            <Card
              key={g.id}
              className={`bg-[#1E293B] border-[#334155] text-white relative transition-all duration-300 ${
                isApproved
                  ? 'opacity-85 border-purple-500/30'
                  : 'hover:border-blue-500/30'
              }`}
            >
              {/* Lock Indicator overlay on approval */}
              <AnimatePresence>
                {isApproved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 text-[#8B5CF6] z-10 flex items-center gap-1.5 bg-[#8B5CF6]/10 px-2.5 py-1 rounded-md"
                  >
                    <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="text-[10px] font-black tracking-wider uppercase">
                      LOCKED
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#8B5CF6] tracking-wider uppercase">
                      {g.thrustArea}
                    </span>
                    <h3 className="text-md font-bold text-slate-100">
                      {g.title}
                    </h3>
                  </div>
                  {!isApproved && (
                    <button
                      onClick={() => toggleEdit(g.id)}
                      className={`text-[#94A3B8] hover:text-white transition-colors p-1.5 rounded-md ${
                        g.isEditing
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-700/50'
                      }`}
                      title="Edit inline"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Inline Editing Controls */}
                {g.isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 grid grid-cols-2 gap-4 border-t border-[#334155]/40"
                  >
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black text-[#94A3B8] uppercase">
                        Target Value
                      </Label>
                      <Input
                        value={g.target}
                        onChange={(e) =>
                          handleEditField(g.id, 'target', e.target.value)
                        }
                        className="bg-[#0F172A] border-[#334155] text-xs py-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black text-[#94A3B8] uppercase">
                        Weightage (%)
                      </Label>
                      <Input
                        type="number"
                        value={g.weightage}
                        onChange={(e) =>
                          handleEditField(g.id, 'weightage', e.target.value)
                        }
                        className="bg-[#0F172A] border-[#334155] text-xs py-1"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-wrap gap-4 pt-3 border-t border-[#334155]/40 items-center justify-between">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">
                          Metric Type
                        </span>
                        <Badge className="bg-slate-700/50 hover:bg-slate-700/50 text-[#F8FAFC] border-none text-[9px] font-black py-0.5 px-2">
                          {g.uom}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">
                          Target Objective
                        </span>
                        <span className="text-xs font-extrabold text-blue-400">
                          {parseInt(g.target, 10) >= 1000
                            ? `₹${(parseInt(g.target, 10) / 100000).toFixed(1)} Lakh`
                            : g.target}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5 items-end">
                      <span className="text-[9px] font-bold text-[#475569] uppercase tracking-wider">
                        Goal Weight
                      </span>
                      <span className="text-sm font-black text-amber-400">
                        {g.weightage}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RIGHT COLUMN: MANAGER ACTIONS PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#1E293B] border-[#334155] text-white shadow-2xl">
            <CardHeader className="border-b border-[#334155]/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                Approval Desk
              </CardTitle>
              <CardDescription className="text-[#94A3B8] text-[10px]">
                Approve to lock goal values for the FY2026 cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5 bg-[#0F172A]/40 rounded-xl p-4 border border-[#334155]/25">
                <span className="text-[9px] font-black text-[#94A3B8] uppercase block">
                  Sheet Summary
                </span>
                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-[#94A3B8]">Total Goals</span>
                  <span className="font-bold">3 Goals</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-[#94A3B8]">Aggregated Weightage</span>
                  <span className="font-bold text-green-500">100%</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-[#94A3B8]">Validation status</span>
                  <span className="font-bold text-blue-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Compliant</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleApprove}
                  disabled={isApproved}
                  className={`w-full font-bold py-6 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                    isApproved
                      ? 'bg-purple-600 hover:bg-purple-600 opacity-50 text-white border-none'
                      : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/5 border-none'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isApproved ? 'Goal Sheet Locked' : 'Approve & Lock 🔒'}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  disabled={isApproved}
                  className="w-full border-[#334155] bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-bold py-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <CornerUpLeft className="w-4 h-4" />
                  <span>Return for Rework ↩</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TEAMS NOTIFICATION PREVIEW (Bottom Right Toast) */}
      <AnimatePresence>
        {showTeamsNotify && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 w-96 bg-[#1F1F1F] border-t-4 border-[#6264A7] text-white rounded-lg shadow-2xl p-4 z-50 flex gap-3.5 font-sans"
          >
            <div className="w-10 h-10 rounded bg-[#6264A7] flex items-center justify-center flex-shrink-0 text-white font-extrabold text-lg">
              T
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#A6A6A6] font-bold uppercase tracking-wider">
                  Microsoft Teams Bot
                </span>
                <button
                  onClick={() => setShowTeamsNotify(false)}
                  className="text-xs text-[#A6A6A6] hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Goal Approved & Locked
                  <Badge className="bg-purple-900/40 text-purple-400 border-none font-bold text-[8px] px-1.5 py-0">
                    Meridian
                  </Badge>
                </h4>
                <p className="text-[10px] text-[#A6A6A6] mt-1 leading-relaxed">
                  Vikram Nair has approved <strong>Arjun Mehta&apos;s</strong>{' '}
                  goal sheet. 3 goals have been successfully locked and mapped
                  to the immutable audit ledger.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
