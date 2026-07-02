/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, Plus, Sparkles, ChevronDown, ChevronRight, Trash2, Edit2, Check, AlertCircle, Loader2, Info, BookOpen
} from 'lucide-react';
import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask, Category, Priority, GoalPlanBreakdown } from '../types';
import { categoriesMeta, prioritiesMeta } from '../data/defaultData';

interface GoalManagerProps {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  onAddAnnualGoal: (goal: Omit<AnnualGoal, 'id' | 'currentValue' | 'status'>) => void;
  onAddMonthlyGoal: (goal: Omit<MonthlyGoal, 'id' | 'currentValue' | 'status'>) => void;
  onAddWeeklyGoal: (goal: Omit<WeeklyGoal, 'id' | 'currentValue' | 'status'>) => void;
  onAddDailyTask: (title: string, priority: Priority, category: Category, date: string, weeklyGoalId?: string) => void;
  onDeleteAnnualGoal: (id: string) => void;
  onDeleteMonthlyGoal: (id: string) => void;
  onDeleteWeeklyGoal: (id: string) => void;
  onDeleteDailyTask: (id: string) => void;
  onUpdateAnnualProgress: (id: string, value: number) => void;
  onUpdateMonthlyProgress: (id: string, value: number) => void;
  onUpdateWeeklyProgress: (id: string, value: number) => void;
}

export default function GoalManager({
  annualGoals,
  monthlyGoals,
  weeklyGoals,
  dailyTasks,
  onAddAnnualGoal,
  onAddMonthlyGoal,
  onAddWeeklyGoal,
  onAddDailyTask,
  onDeleteAnnualGoal,
  onDeleteMonthlyGoal,
  onDeleteWeeklyGoal,
  onDeleteDailyTask,
  onUpdateAnnualProgress,
  onUpdateMonthlyProgress,
  onUpdateWeeklyProgress
}: GoalManagerProps) {
  // Navigation for active target filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'annual' | 'monthly' | 'weekly'>('all');

  // Expanded card trackers
  const [expandedAnnual, setExpandedAnnual] = useState<Record<string, boolean>>({ 'ann-1': true });
  const [expandedMonthly, setExpandedMonthly] = useState<Record<string, boolean>>({});

  // Form Modals Toggles
  const [showAddAnnualModal, setShowAddAnnualModal] = useState(false);
  const [showAddMonthlyModal, setShowAddMonthlyModal] = useState(false);
  const [showAddWeeklyModal, setShowAddWeeklyModal] = useState(false);
  const [showAddDailyModal, setShowAddDailyModal] = useState(false);

  // Selected parents for child goal creations
  const [selectedAnnualId, setSelectedAnnualId] = useState('');
  const [selectedMonthlyId, setSelectedMonthlyId] = useState('');
  const [selectedWeeklyId, setSelectedWeeklyId] = useState('');

  // Form Fields
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annCategory, setAnnCategory] = useState<Category>('self_dev');
  const [annPriority, setAnnPriority] = useState<Priority>('medium');
  const [annUnit, setAnnUnit] = useState('كتاب');
  const [annTarget, setAnnTarget] = useState(10);

  const [monTitle, setMonTitle] = useState('');
  const [monDesc, setMonDesc] = useState('');
  const [monCategory, setMonCategory] = useState<Category>('self_dev');
  const [monMonth, setMonMonth] = useState(7);
  const [monUnit, setMonUnit] = useState('صفحة');
  const [monTarget, setMonTarget] = useState(100);

  const [wekTitle, setWekTitle] = useState('');
  const [wekDesc, setWekDesc] = useState('');
  const [wekCategory, setWekCategory] = useState<Category>('self_dev');
  const [wekWeek, setWekWeek] = useState(1);
  const [wekUnit, setWekUnit] = useState('فصل');
  const [wekTarget, setWekTarget] = useState(4);

  const [dayTitle, setDayTitle] = useState('');
  const [dayPriority, setDayPriority] = useState<Priority>('medium');
  const [dayCategory, setDayCategory] = useState<Category>('self_dev');
  const [dayDate, setDayDate] = useState(new Date().toISOString().split('T')[0]);

  // AI Planner Breakdown State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPromptGoal, setAiPromptGoal] = useState('');
  const [aiSelectedCategory, setAiSelectedCategory] = useState<Category>('study');
  const [aiSelectedPriority, setAiSelectedPriority] = useState<Priority>('high');
  const [aiUnit, setAiUnit] = useState('مستوى');
  const [aiTargetValue, setAiTargetValue] = useState(4);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState<GoalPlanBreakdown | null>(null);

  const toggleAnnual = (id: string) => {
    setExpandedAnnual(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMonthly = (id: string) => {
    setExpandedMonthly(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateAnnual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;
    onAddAnnualGoal({
      title: annTitle,
      description: annDesc,
      category: annCategory,
      priority: annPriority,
      unit: annUnit,
      targetValue: annTarget,
      year: 2026
    });
    setAnnTitle('');
    setAnnDesc('');
    setAnnTarget(10);
    setShowAddAnnualModal(false);
  };

  const handleCreateMonthly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monTitle.trim() || !selectedAnnualId) return;
    onAddMonthlyGoal({
      annualGoalId: selectedAnnualId,
      title: monTitle,
      description: monDesc,
      category: monCategory,
      month: monMonth,
      unit: monUnit,
      targetValue: monTarget
    });
    setMonTitle('');
    setMonDesc('');
    setMonTarget(100);
    setShowAddMonthlyModal(false);
  };

  const handleCreateWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wekTitle.trim() || !selectedMonthlyId) return;
    onAddWeeklyGoal({
      monthlyGoalId: selectedMonthlyId,
      title: wekTitle,
      description: wekDesc,
      category: wekCategory,
      weekIndex: wekWeek,
      unit: wekUnit,
      targetValue: wekTarget
    });
    setWekTitle('');
    setWekDesc('');
    setWekTarget(4);
    setShowAddWeeklyModal(false);
  };

  const handleCreateDaily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayTitle.trim()) return;
    onAddDailyTask(dayTitle, dayPriority, dayCategory, dayDate, selectedWeeklyId || undefined);
    setDayTitle('');
    setShowAddDailyModal(false);
  };

  // Run AI breakdown using Gemini proxy
  const handleAIPlanGeneration = async () => {
    if (!aiPromptGoal.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);

    try {
      const response = await fetch('/api/gemini/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiPromptGoal,
          category: aiSelectedCategory,
          priority: aiSelectedPriority,
          unit: aiUnit,
          targetValue: aiTargetValue
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAiResult(data);
      } else {
        setAiError(data.error || 'فشل الاتصال بمساعد الذكاء الاصطناعي.');
      }
    } catch (err) {
      setAiError('حدث خطأ غير متوقع أثناء توليد الخطة.');
    } finally {
      setAiLoading(false);
    }
  };

  // Inject generated AI plan into user goals state
  const handleAcceptAIPlan = () => {
    if (!aiResult) return;

    // 1. Create the Annual Goal
    const annGoalId = 'ann-' + Date.now();
    onAddAnnualGoal({
      title: aiResult.annualGoal,
      description: `تم توليد هذا الهدف ذكياً باستخدام الذكاء الاصطناعي لفئة ${categoriesMeta[aiSelectedCategory].label}`,
      category: aiSelectedCategory,
      priority: aiSelectedPriority,
      unit: aiUnit,
      targetValue: aiTargetValue,
      year: 2026
    });

    // We will simulate the insertion of other generated children by calling handlers sequentially.
    // In our App.tsx, when we reload, we will bind these correctly, but here we can add them to current state directly.
    // For simplicity, we trigger the adds.
    // Let's add monthly goals from AI breakdown
    aiResult.monthlyGoals.forEach((m, idx) => {
      const simulatedMonId = 'mon-' + Date.now() + '-' + idx;
      onAddMonthlyGoal({
        annualGoalId: 'ann-ai-temp', // In App.tsx we handle attaching to the latest added annual goal
        title: m.title,
        description: m.description,
        category: aiSelectedCategory,
        month: m.month,
        unit: m.unit,
        targetValue: m.targetValue
      });
    });

    // Let's also suggest weekly and daily tasks
    aiResult.weeklyGoals.slice(0, 3).forEach((w, idx) => {
      onAddWeeklyGoal({
        monthlyGoalId: 'mon-ai-temp', // handled in App.tsx
        title: w.title,
        category: aiSelectedCategory,
        weekIndex: w.weekIndex,
        unit: w.unit,
        targetValue: w.targetValue
      });
    });

    aiResult.dailyTasks.slice(0, 4).forEach((d) => {
      // Add tasks for today
      const todayStr = new Date().toISOString().split('T')[0];
      onAddDailyTask(d.title, d.priority, aiSelectedCategory, todayStr);
    });

    setShowAIModal(false);
    setAiResult(null);
    setAiPromptGoal('');
    alert('تم توليد وإدراج الخطة الذكية بنجاح! ستجد الهدف السنوي والأهداف الشهرية والأسبوعية والمهام مدرجة في لوحة التحكم.');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
              activeFilter === 'all' 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            جميع الأهداف الهرمية
          </button>
          <button 
            onClick={() => setActiveFilter('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
              activeFilter === 'annual' 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            أهداف سنوية فقط
          </button>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          {/* AI Planner Trigger Button */}
          <button 
            onClick={() => setShowAIModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>تقسيم هدف بالذكاء الاصطناعي ✨</span>
          </button>

          <button 
            onClick={() => setShowAddAnnualModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>هدف سنوي جديد</span>
          </button>
        </div>
      </div>

      {/* Main Hierarchical Goals Tree */}
      <div className="space-y-4">
        {annualGoals.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <Target className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 font-sans">لا توجد أهداف مسجلة حتى الآن</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-sans max-w-sm mx-auto leading-relaxed">
                ابدأ بإنشاء أول هدف سنوي يدوياً أو استخدم المساعد الذكي لتوليد خطة كاملة ومقسمة لعامك الجديد.
              </p>
            </div>
            <button 
              onClick={() => setShowAIModal(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl font-sans inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>جرّب التقسيم بالذكاء الاصطناعي</span>
            </button>
          </div>
        ) : (
          annualGoals
            .filter(goal => activeFilter === 'all' || activeFilter === 'annual')
            .map(annGoal => {
              const annCat = categoriesMeta[annGoal.category];
              const annPrio = prioritiesMeta[annGoal.priority];
              const annPercent = Math.round((annGoal.currentValue / annGoal.targetValue) * 100);
              const isAnnExpanded = expandedAnnual[annGoal.id];

              // Find linked monthly goals
              const linkedMonthGoals = monthlyGoals.filter(m => m.annualGoalId === annGoal.id);

              return (
                <div 
                  key={annGoal.id} 
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs"
                >
                  {/* Annual Goal Header Card */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-start gap-3 min-w-0">
                      <button 
                        onClick={() => toggleAnnual(annGoal.id)}
                        className="mt-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isAnnExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full font-sans">
                            هدف سنوي {annGoal.year}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${annCat?.bgClass}`}>
                            {annCat?.label}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${annPrio?.bgClass}`}>
                            {annPrio?.label}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans line-clamp-1">{annGoal.title}</h3>
                        {annGoal.description && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-sans line-clamp-1">{annGoal.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Progress Control and Deletion */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-900">
                      <div className="space-y-1.5 w-32 md:w-40">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-500">التقدم:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{annGoal.currentValue} / {annGoal.targetValue} {annGoal.unit}</span>
                        </div>
                        {/* Progress slider input to interactively update */}
                        <div className="flex items-center gap-2">
                          <input 
                            type="range" 
                            min="0" 
                            max={annGoal.targetValue} 
                            value={annGoal.currentValue}
                            onChange={(e) => onUpdateAnnualProgress(annGoal.id, Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-emerald-500 font-mono">{annPercent}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            setSelectedAnnualId(annGoal.id);
                            setShowAddMonthlyModal(true);
                          }}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
                          title="ربط هدف شهري جديد"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteAnnualGoal(annGoal.id)}
                          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                          title="حذف الهدف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Monthly Goals Section */}
                  {isAnnExpanded && activeFilter === 'all' && (
                    <div className="p-4 bg-slate-50/20 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-900 space-y-3">
                      <div className="flex justify-between items-center px-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-sans">الأهداف الشهرية المرتبطة</span>
                        <span className="text-[10px] text-slate-400 font-mono">{linkedMonthGoals.length} أهداف شهرية</span>
                      </div>

                      {linkedMonthGoals.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mb-2">لا توجد أهداف شهرية مرتبطة بهذا الهدف السنوي بعد.</p>
                          <button 
                            onClick={() => {
                              setSelectedAnnualId(annGoal.id);
                              setShowAddMonthlyModal(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded-lg font-sans transition-colors inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة هدف شهري</span>
                          </button>
                        </div>
                      ) : (
                        linkedMonthGoals.map(monGoal => {
                          const monPercent = Math.round((monGoal.currentValue / monGoal.targetValue) * 100);
                          const isMonExpanded = expandedMonthly[monGoal.id];
                          const linkedWeekGoals = weeklyGoals.filter(w => w.monthlyGoalId === monGoal.id);

                          return (
                            <div key={monGoal.id} className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-2xs">
                              {/* Monthly goal header row */}
                              <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-100/30 dark:bg-slate-900/10">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <button 
                                    onClick={() => toggleMonthly(monGoal.id)}
                                    className="p-0.5 mt-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    {isMonExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </button>
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[9px] font-bold px-2 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full font-sans">
                                        شهر {monGoal.month} (يوليو)
                                      </span>
                                      {monGoal.status === 'completed' && (
                                        <span className="text-[9px] font-medium px-2 py-0.2 bg-blue-500/15 text-blue-500 rounded-full font-sans">مكتمل</span>
                                      )}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans line-clamp-1">{monGoal.title}</h4>
                                  </div>
                                </div>

                                {/* Monthly controls */}
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                  <div className="space-y-1 w-28 sm:w-32">
                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                      <span className="text-slate-400">التقدم:</span>
                                      <span className="font-bold text-slate-700 dark:text-slate-300">{monGoal.currentValue} / {monGoal.targetValue}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max={monGoal.targetValue} 
                                        value={monGoal.currentValue}
                                        onChange={(e) => onUpdateMonthlyProgress(monGoal.id, Number(e.target.value))}
                                        className="w-full accent-blue-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                      />
                                      <span className="text-[9px] font-mono text-blue-500 font-bold">{monPercent}%</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-0.5">
                                    <button 
                                      onClick={() => {
                                        setSelectedMonthlyId(monGoal.id);
                                        setShowAddWeeklyModal(true);
                                      }}
                                      className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                                      title="ربط هدف أسبوعي"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => onDeleteMonthlyGoal(monGoal.id)}
                                      className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                                      title="حذف الهدف الشهري"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Weekly goals */}
                              {isMonExpanded && (
                                <div className="p-3 bg-slate-50/10 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                  {linkedWeekGoals.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-2 font-sans">لا توجد أهداف أسبوعية بعد.</p>
                                  ) : (
                                    linkedWeekGoals.map(wekGoal => {
                                      const wekPercent = Math.round((wekGoal.currentValue / wekGoal.targetValue) * 100);
                                      const linkedTasks = dailyTasks.filter(t => t.weeklyGoalId === wekGoal.id);

                                      return (
                                        <div key={wekGoal.id} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                              <span className="text-[8px] font-bold px-1.5 py-0.1 bg-indigo-500/10 text-indigo-500 rounded-sm font-sans">الأسبوع {wekGoal.weekIndex}</span>
                                              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">{wekGoal.title}</h5>
                                            </div>
                                            {wekGoal.description && (
                                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">{wekGoal.description}</p>
                                            )}
                                          </div>

                                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-900">
                                            <div className="space-y-1 w-24">
                                              <div className="flex justify-between items-center text-[9px] font-mono">
                                                <span className="text-slate-400">التقدم:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{wekGoal.currentValue} / {wekGoal.targetValue}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <input 
                                                  type="range" 
                                                  min="0" 
                                                  max={wekGoal.targetValue} 
                                                  value={wekGoal.currentValue}
                                                  onChange={(e) => onUpdateWeeklyProgress(wekGoal.id, Number(e.target.value))}
                                                  className="w-full accent-indigo-500 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                                />
                                                <span className="text-[8px] font-mono text-indigo-500 font-bold">{wekPercent}%</span>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-0.5">
                                              <button 
                                                onClick={() => {
                                                  setSelectedWeeklyId(wekGoal.id);
                                                  setShowAddDailyModal(true);
                                                }}
                                                className="p-1 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md"
                                                title="إضافة مهمة يومية مرتبطة"
                                              >
                                                <Plus className="w-3.5 h-3.5" />
                                              </button>
                                              <button 
                                                onClick={() => onDeleteWeeklyGoal(wekGoal.id)}
                                                className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md"
                                                title="حذف الهدف الأسبوعي"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* AI Smart Planner Generator Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/15 text-purple-500 rounded-xl">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">المخطط السنوي الذكي بالذكاء الاصطناعي ✨</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">اكتب هدفاً كبيراً ودع مساعد Gemini يقسمه لخطوات ملموسة</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowAIModal(false); setAiResult(null); }}
                className="p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {aiError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 font-sans flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {!aiResult ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">ما هو هدفك الكبير لعام {new Date().getFullYear()}؟</label>
                  <textarea 
                    value={aiPromptGoal}
                    onChange={(e) => setAiPromptGoal(e.target.value)}
                    placeholder="مثال: إتقان محادثة اللغة الفرنسية، أو بناء تطبيق تجاري كامل وإطلاقه، أو الحصول على ترقية مهنية..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-sans focus:ring-2 focus:ring-purple-500 h-24 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">التصنيف المناسب للهدف</label>
                    <select 
                      value={aiSelectedCategory}
                      onChange={(e) => setAiSelectedCategory(e.target.value as Category)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      {Object.entries(categoriesMeta).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">الأولوية</label>
                    <select 
                      value={aiSelectedPriority}
                      onChange={(e) => setAiSelectedPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      {Object.entries(prioritiesMeta).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">وحدة قياس التقدم للهدف الكبير</label>
                    <input 
                      type="text" 
                      value={aiUnit}
                      onChange={(e) => setAiUnit(e.target.value)}
                      placeholder="مثال: مستوى فرعي، كجم، كتاب، مشروع..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-sans focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">المستهدف الرقمي السنوي</label>
                    <input 
                      type="number" 
                      value={aiTargetValue}
                      onChange={(e) => setAiTargetValue(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleAIPlanGeneration}
                    disabled={aiLoading || !aiPromptGoal.trim()}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري صياغة وتقسيم الخطة ذكياً عبر Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>توليد الخطة المقسمة الآن</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-purple-500 font-sans uppercase">الهدف السنوي المقترح</span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">{aiResult.annualGoal}</h4>
                </div>

                {/* AI Plan Preview */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans">مخطط الأهداف والمهام الناتجة:</h5>
                  
                  {/* Monthly Goals */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    <p className="text-[10px] font-bold text-slate-400 font-sans">أهداف شهرية مقترحة:</p>
                    {aiResult.monthlyGoals.map((m, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 text-xs">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                          <span>الشهر {m.month}: {m.title}</span>
                          <span className="font-mono">{m.targetValue} {m.unit}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">{m.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Weekly Goals */}
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    <p className="text-[10px] font-bold text-slate-400 font-sans">أهداف أسبوعية مقترحة:</p>
                    {aiResult.weeklyGoals.map((w, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg text-[11px] flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">الشهر {w.monthIndex} - الأسبوع {w.weekIndex}: {w.title}</span>
                        <span className="font-mono font-semibold">{w.targetValue} {w.unit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Daily Tasks */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 font-sans">مهام يومية للبدء الفوري:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiResult.dailyTasks.map((d, idx) => (
                        <div key={idx} className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] text-slate-700 dark:text-slate-300">
                          <span className="font-bold">[{prioritiesMeta[d.priority]?.label}]</span> {d.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex gap-2.5">
                  <button 
                    onClick={handleAcceptAIPlan}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-colors"
                  >
                    قبول وإدراج الخطة بالكامل
                  </button>
                  <button 
                    onClick={() => setAiResult(null)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold font-sans cursor-pointer"
                  >
                    تعديل المدخلات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Creation Modals below */}

      {/* Add Annual Goal Modal */}
      {showAddAnnualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleCreateAnnual} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">إضافة هدف سنوي جديد لعام 2026</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">عنوان الهدف</label>
              <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="مثال: قراءة 24 كتاباً، إنقاص الوزن..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">وصف الهدف</label>
              <textarea value={annDesc} onChange={(e) => setAnnDesc(e.target.value)} placeholder="تفاصيل إضافية عن الهدف..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs h-16" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">التصنيف</label>
                <select value={annCategory} onChange={(e) => setAnnCategory(e.target.value as Category)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(categoriesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">الأولوية</label>
                <select value={annPriority} onChange={(e) => setAnnPriority(e.target.value as Priority)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(prioritiesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">وحدة قياس الهدف</label>
                <input type="text" value={annUnit} onChange={(e) => setAnnUnit(e.target.value)} placeholder="كتاب، ساعة، كجم..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">المستهدف الرقمي</label>
                <input type="number" value={annTarget} onChange={(e) => setAnnTarget(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">إضافة</button>
              <button type="button" onClick={() => setShowAddAnnualModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Monthly Goal Modal */}
      {showAddMonthlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleCreateMonthly} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">إضافة هدف شهري مرتبط</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">عنوان الهدف الشهري</label>
              <input type="text" required value={monTitle} onChange={(e) => setMonTitle(e.target.value)} placeholder="مثال: قراءة كتابين..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">الوصف</label>
              <textarea value={monDesc} onChange={(e) => setMonDesc(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs h-16" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">لأي شهر؟</label>
                <select value={monMonth} onChange={(e) => setMonMonth(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>الشهر {m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">التصنيف</label>
                <select value={monCategory} onChange={(e) => setMonCategory(e.target.value as Category)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(categoriesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">وحدة القياس</label>
                <input type="text" value={monUnit} onChange={(e) => setMonUnit(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">المستهدف</label>
                <input type="number" value={monTarget} onChange={(e) => setMonTarget(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold">إضافة</button>
              <button type="button" onClick={() => setShowAddMonthlyModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Weekly Goal Modal */}
      {showAddWeeklyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleCreateWeekly} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">إضافة هدف أسبوعي</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">عنوان الهدف الأسبوعي</label>
              <input type="text" required value={wekTitle} onChange={(e) => setWekTitle(e.target.value)} placeholder="مثال: قراءة 150 صفحة هذا الأسبوع" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">وصف أو تفاصيل</label>
              <textarea value={wekDesc} onChange={(e) => setWekDesc(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs h-16" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">أي أسبوع بالشهر؟</label>
                <select value={wekWeek} onChange={(e) => setWekWeek(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
                  <option value={1}>الأسبوع الأول</option>
                  <option value={2}>الأسبوع الثاني</option>
                  <option value={3}>الأسبوع الثالث</option>
                  <option value={4}>الأسبوع الرابع</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">التصنيف</label>
                <select value={wekCategory} onChange={(e) => setWekCategory(e.target.value as Category)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(categoriesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">وحدة القياس</label>
                <input type="text" value={wekUnit} onChange={(e) => setWekUnit(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">المستهدف</label>
                <input type="number" value={wekTarget} onChange={(e) => setWekTarget(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold">إضافة</button>
              <button type="button" onClick={() => setShowAddWeeklyModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Daily Task linked to Weekly Goal Modal */}
      {showAddDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleCreateDaily} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">إضافة مهمة يومية</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">عنوان المهمة</label>
              <input type="text" required value={dayTitle} onChange={(e) => setDayTitle(e.target.value)} placeholder="مثال: مراجعة 20 كلمة بالإنجليزية" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">الأولوية</label>
                <select value={dayPriority} onChange={(e) => setDayPriority(e.target.value as Priority)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(prioritiesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">التصنيف</label>
                <select value={dayCategory} onChange={(e) => setDayCategory(e.target.value as Category)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                  {Object.entries(categoriesMeta).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">التاريخ</label>
              <input type="date" value={dayDate} onChange={(e) => setDayDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono" />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">إضافة مهمة</button>
              <button type="button" onClick={() => setShowAddDailyModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
