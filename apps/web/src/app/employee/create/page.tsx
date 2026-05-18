'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';

interface Suggestion {
  title: string;
  uom_type?: string;
  uom?: string;
  suggested_target?: string | number;
  target?: string;
  weightage_suggestion?: number;
  weightage?: number;
  description?: string;
  desc?: string;
  rationale?: string;
}

const suggestionsMap: Record<string, Suggestion[]> = {
  'Revenue Growth': [
    {
      title: 'Achieve ₹50L in new client revenue by Q4',
      uom: 'NUMERIC',
      target: '5000000',
      weightage: 25,
      desc: 'Focus on acquiring mid-market enterprise accounts across Western India.',
    },
    {
      title: 'Close 15 enterprise deals in FY2026',
      uom: 'NUMERIC',
      target: '15',
      weightage: 20,
      desc: 'Prioritize deals with average contract value exceeding ₹3L.',
    },
    {
      title: 'Upsell premium SaaS add-ons to 10 existing clients',
      uom: 'NUMERIC',
      target: '10',
      weightage: 10,
      desc: 'Collaborate with Customer Success to identify qualified accounts.',
    },
  ],
  'Cost Reduction': [
    {
      title: 'Reduce AWS production environment spend by 15%',
      uom: 'PERCENTAGE',
      target: '15',
      weightage: 20,
      desc: 'Optimize EC2/RDS instances and deprecate unused elastic IPs.',
    },
    {
      title: 'Deprecate legacy test tooling to save ₹50k monthly',
      uom: 'ZERO_BASED',
      target: '0',
      weightage: 15,
      desc: 'Complete migration of all team test runner pipelines to CI/CD.',
    },
  ],
  'Customer Experience': [
    {
      title: 'Maintain 90% client retention rate',
      uom: 'PERCENTAGE',
      target: '90',
      weightage: 20,
      desc: 'Establish proactive bi-weekly health checks for high-priority client list.',
    },
    {
      title: 'Achieve CSAT score of 4.5 out of 5',
      uom: 'NUMERIC',
      target: '4.5',
      weightage: 20,
      desc: 'Accelerate resolution times for tier-1 customer escalation incidents.',
    },
  ],
  'People Development': [
    {
      title: 'Complete Azure Architect certification',
      uom: 'TIMELINE',
      target: '100',
      weightage: 15,
      desc: 'Pass AZ-305 design exam and run 2 knowledge-transfer sessions.',
    },
  ],
  Innovation: [
    {
      title: 'Build and deploy Claude AI assistant integration prototype',
      uom: 'TIMELINE',
      target: '100',
      weightage: 25,
      desc: 'Build secure proxy layer with prompt injection defense schemas.',
    },
  ],
};

export default function CreateGoalPage() {
  const router = useRouter();

  // Form states
  const [thrustArea, setThrustArea] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uomType, setUomType] = useState('PERCENTAGE'); // PERCENTAGE, NUMERIC, TIMELINE, ZERO_BASED
  const [target, setTarget] = useState('');
  const [weightage, setWeightage] = useState('');

  // Validation state
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // AI suggestions loading states
  const [suggestedGoals, setSuggestedGoals] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const remainingWeightage = 55; // 100% - 45% (pre-seeded 2 goals)

  // Fetch live AI suggestions from Claude 3.5 on selection changes
  useEffect(() => {
    if (!thrustArea) {
      setSuggestedGoals([]);
      return;
    }

    const loadSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetchApi('/ai/suggest-goals', {
          method: 'POST',
          body: JSON.stringify({ thrust_area: thrustArea }),
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestedGoals(data);
        } else {
          setSuggestedGoals(suggestionsMap[thrustArea] || []);
        }
      } catch {
        console.warn('Using high-fidelity static suggestions fallback.');
        setSuggestedGoals(suggestionsMap[thrustArea] || []);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [thrustArea]);

  const handleApplySuggestion = (sug: Suggestion) => {
    setTitle(sug.title);
    setUomType(sug.uom_type?.toUpperCase() || sug.uom || 'PERCENTAGE');
    setTarget(sug.suggested_target?.toString() || sug.target || '100');
    setWeightage(
      sug.weightage_suggestion?.toString() || sug.weightage?.toString() || '20'
    );
    setDescription(
      (sug.description || sug.desc || '') +
        (sug.rationale ? `\n\n[Rationale: ${sug.rationale}]` : '')
    );
  };

  // Live validator
  useEffect(() => {
    if (!weightage) {
      setError('');
      return;
    }
    const val = parseInt(weightage, 10);
    if (isNaN(val)) {
      setError('Weightage must be a number.');
    } else if (val < 10) {
      setError('Rule violation: Minimum weightage per goal is 10%.');
    } else if (val > remainingWeightage) {
      setError(
        `Rule violation: Cannot exceed remaining budget of ${remainingWeightage}%.`
      );
    } else {
      setError('');
    }
  }, [weightage, remainingWeightage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thrustArea || !title || !target || !weightage) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    const val = parseInt(weightage, 10);
    if (val < 10 || val > remainingWeightage) {
      setError('Cannot submit: validation rules violated.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/employee');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#3B82F6] selection:text-white p-6 md:p-12">
      {/* Top Navigation Row */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: THE FORM */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-[#1E293B] border-[#334155] text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Create New Performance Goal
              </CardTitle>
              <CardDescription className="text-[#94A3B8] text-xs">
                Provide specific metrics to align with company thrust areas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                {/* Thrust Area Dropdown */}
                <div className="space-y-2">
                  <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                    Thrust Area *
                  </Label>
                  <Select
                    value={thrustArea}
                    onValueChange={(val) => setThrustArea(val ?? '')}
                  >
                    <SelectTrigger className="bg-[#0F172A] border-[#334155] text-white rounded-lg focus:ring-blue-500">
                      <SelectValue placeholder="Select corporate alignment area" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#1E293B] border-[#334155] text-white">
                      <SelectItem value="Revenue Growth">
                        Revenue Growth
                      </SelectItem>
                      <SelectItem value="Cost Reduction">
                        Cost Reduction
                      </SelectItem>
                      <SelectItem value="Customer Experience">
                        Customer Experience
                      </SelectItem>
                      <SelectItem value="People Development">
                        People Development
                      </SelectItem>
                      <SelectItem value="Innovation">Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Goal Title */}
                <div className="space-y-2">
                  <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                    Goal Title *
                  </Label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Migrate critical auth to Azure AD SSO"
                    className="bg-[#0F172A] border-[#334155] text-white placeholder-slate-600 rounded-lg focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                    Description
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how success looks, key actions, and target timeline..."
                    className="bg-[#0F172A] border-[#334155] text-white placeholder-slate-600 rounded-lg h-24 focus:ring-blue-500"
                  />
                </div>

                {/* UoM segmented control */}
                <div className="space-y-2">
                  <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider block mb-1">
                    Unit of Measure (UoM) *
                  </Label>
                  <div className="grid grid-cols-4 gap-2 bg-[#0F172A] p-1.5 rounded-lg border border-[#334155]">
                    {['NUMERIC', 'PERCENTAGE', 'TIMELINE', 'ZERO_BASED'].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setUomType(type);
                            if (type === 'ZERO_BASED') setTarget('0');
                          }}
                          className={`text-[10px] py-2 font-bold tracking-tight rounded-md uppercase transition-all duration-150 ${
                            uomType === type
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-[#94A3B8] hover:text-white'
                          }`}
                        >
                          {type.replace('_', ' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Target & Weightage row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                      Target{' '}
                      {uomType === 'PERCENTAGE'
                        ? '(%)'
                        : uomType === 'TIMELINE'
                          ? '(Days)'
                          : ''}{' '}
                      *
                    </Label>
                    <Input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      disabled={uomType === 'ZERO_BASED'}
                      placeholder={uomType === 'ZERO_BASED' ? '0' : 'e.g. 100'}
                      className="bg-[#0F172A] border-[#334155] text-white placeholder-slate-600 rounded-lg focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                        Weightage *
                      </Label>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Budget: {remainingWeightage}% left
                      </span>
                    </div>
                    <Input
                      type="number"
                      value={weightage}
                      onChange={(e) => setWeightage(e.target.value)}
                      placeholder="Min 10% required"
                      className={`bg-[#0F172A] text-white rounded-lg focus:ring-blue-500 transition-all ${
                        error
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#334155]'
                      }`}
                    />
                  </div>
                </div>

                {/* Validation and Success Notification Toasts */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-500/10 border border-red-500/35 text-red-500 rounded-lg p-3 flex items-center gap-2 text-xs font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/10 border border-green-500/35 text-green-400 rounded-lg p-3 flex items-center gap-2 text-xs font-semibold"
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Goal Saved successfully! Returning to dashboard...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save Button */}
                <Button
                  type="submit"
                  disabled={!!error || isSuccess}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-lg transition-all"
                >
                  Save and Update Goal Sheet
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI SUGGESTIONS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#1E293B] border-[#334155] text-white shadow-2xl relative overflow-hidden">
            {/* Glossy top decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>

            <CardHeader className="border-b border-[#334155]/60 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-md font-bold">
                  GoalFlow AI Coach
                </CardTitle>
                <Badge className="bg-purple-500/25 text-purple-400 border-none font-bold text-[9px] px-1.5 py-0.5 ml-auto">
                  Claude 3.5
                </Badge>
              </div>
              <CardDescription className="text-[#94A3B8] text-xs mt-1">
                Select a Thrust Area to see tailored, high-impact SMART
                suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <AnimatePresence mode="wait">
                {isLoadingSuggestions ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">
                      🔮 Claude is engineering alignment...
                    </span>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#0F172A]/40 border border-[#334155]/60 rounded-xl space-y-2.5 relative overflow-hidden"
                      >
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: 'linear',
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent w-full h-full"
                        />
                        <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-800 rounded-md w-5/6 animate-pulse" />
                        <div className="h-2 bg-slate-800 rounded-md w-1/2 animate-pulse" />
                      </div>
                    ))}
                  </motion.div>
                ) : thrustArea ? (
                  <motion.div
                    key={thrustArea}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">
                      ✨ AI Coach Suggestions for {thrustArea}:
                    </span>

                    <div className="space-y-3">
                      {suggestedGoals.map((sug, i) => {
                        const sugUom =
                          sug.uom_type?.toUpperCase() ||
                          sug.uom ||
                          'PERCENTAGE';
                        const sugTarget =
                          sug.suggested_target?.toString() ||
                          sug.target ||
                          '100';
                        const sugWeight =
                          sug.weightage_suggestion?.toString() ||
                          sug.weightage?.toString() ||
                          '20';
                        const sugDesc = sug.description || sug.desc;

                        return (
                          <div
                            key={i}
                            className="bg-[#0F172A]/60 border border-[#334155]/80 hover:border-purple-500/40 rounded-xl p-4 flex flex-col gap-2 transition-all group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-bold text-slate-100 group-hover:text-white leading-relaxed">
                                {sug.title}
                              </span>
                            </div>

                            <p className="text-[10px] text-[#94A3B8]">
                              {sugDesc}
                            </p>

                            {sug.rationale && (
                              <p className="text-[9px] text-[#8B5CF6] italic bg-[#8B5CF6]/5 px-2 py-1 rounded border border-[#8B5CF6]/15">
                                <strong>Rationale:</strong> {sug.rationale}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 items-center mt-1">
                              <Badge className="bg-slate-700/60 text-slate-300 border-none text-[8px] font-bold px-1.5 py-0">
                                UoM: {sugUom}
                              </Badge>
                              <Badge className="bg-slate-700/60 text-slate-300 border-none text-[8px] font-bold px-1.5 py-0">
                                Target: {sugTarget}
                              </Badge>
                              <Badge className="bg-purple-900/30 text-purple-400 border-none text-[8px] font-black px-1.5 py-0">
                                Weight: {sugWeight}%
                              </Badge>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplySuggestion(sug)}
                              className="text-[10px] text-purple-400 hover:text-purple-300 font-bold text-left mt-2 flex items-center gap-1"
                            >
                              Use this suggestion →
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-[#475569]">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#94A3B8]">
                        No Suggestions Available
                      </p>
                      <p className="text-[10px] text-[#475569] mt-0.5">
                        Please select a Thrust Area to load tailored AI
                        templates.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
