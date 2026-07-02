/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, CheckCircle2, Circle, AlertCircle, 
  ArrowLeftRight, Calendar as CalendarIcon, Bell, Sparkles, Plus, TrendingUp, CheckCircle, Clock
} from 'lucide-react';
import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask, ActivityLog, Category, Priority } from '../types';
import { categoriesMeta, prioritiesMeta, motivationalQuotes } from '../data/defaultData';

interface DashboardProps {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  activityLogs: ActivityLog[];
  streak: number;
  points: number;
  levelLabel: string;
  onAddTask: (title: string, priority: Priority, category: Category, date: string, weeklyGoalId?: string) => void;
  onToggleTask: (id: string) => void;
  onSetActiveTab: (tab: string) => void;
}

export default function Dashboard({
  annualGoals,
  monthlyGoals,
  weeklyGoals,
  dailyTasks,
  activityLogs,
  streak,
  points,
  levelLabel,
  onAddTask,
  onToggleTask,
  onSetActiveTab
}: DashboardProps) {
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState<Category>('self_dev');
  const [quickTaskPriority, setQuickTaskPriority] = useState<Priority>('medium');
  const [quote, setQuote] = useState({ text: '', author: '' });

  // Select quote based on current day
  useEffect(() => {
    const day = new Date().getDate();
    const index = day % motivationalQuotes.length;
    setQuote(motivationalQuotes[index]);
  }, []);

  // Filter tasks for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = dailyTasks.filter(task => task.date === todayStr);

  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const todayCompletionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Filter active monthly goals for this month (July 2026, which is month 7)
  const currentMonth = 7; 
  const currentMonthGoals = monthlyGoals.filter(g => g.month === currentMonth);
  const completedMonthGoals = currentMonthGoals.filter(g => g.status === 'completed').length;
  const totalMonthGoals = currentMonthGoals.length;
  const monthCompletionRate = totalMonthGoals > 0 
    ? Math.round((currentMonthGoals.reduce((acc, curr) => acc + (curr.currentValue / curr.targetValue), 0) / totalMonthGoals) * 100)
    : 0;

  // Filter annual goals for 2026
  const currentYearGoals = annualGoals.filter(g => g.year === 2026);
  const totalAnnualGoals = currentYearGoals.length;
  const annualCompletionRate = totalAnnualGoals > 0
    ? Math.round((currentYearGoals.reduce((acc, curr) => acc + (Math.min(curr.currentValue / curr.targetValue, 1)), 0) / totalAnnualGoals) * 100)
    : 0;

  // Next tasks notifications
  const pendingTasks = todayTasks.filter(t => !t.completed);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    onAddTask(quickTaskTitle, quickTaskPriority, quickTaskCategory, todayStr);
    setQuickTaskTitle('');
  };

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Top Banner with Quote & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome & Motivational Quote */}
        <div id="quote-card" className="lg:col-span-2 relative overflow-hidden bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">اقتباس اليوم التحفيزي</span>
            </div>
            <p className="text-xl md:text-2xl font-sans font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              "{quote.text}"
            </p>
          </div>
          <div className="mt-6 flex justify-between items-end">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-sans">— {quote.author}</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans">نشط الآن</span>
            </div>
          </div>
        </div>

        {/* Level, Points & Streak Badge */}
        <div id="streak-card" className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">المستوى الحالي</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans">{levelLabel}</h3>
            </div>
            <div className="px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-bold font-mono">{points} نقطة</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">الالتزام المتواصل</span>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">{streak} أيام متتالية</p>
              </div>
            </div>
            <button 
              onClick={() => onSetActiveTab('achievements')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline font-sans"
            >
              عرض الإنجازات ←
            </button>
          </div>
        </div>
      </div>

      {/* Progress Circles (Annual, Monthly, Daily) */}
      <div id="progress-overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-xs relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">نسبة إنجاز مهام اليوم</span>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">{todayCompletionRate}%</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              مكتمل: {completedToday} / متبقي: {totalToday - completedToday}
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-emerald-500 transition-all duration-500" fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - todayCompletionRate / 100)} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
              اليوم
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-xs relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">نسبة إنجاز الشهر الحالي</span>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">{monthCompletionRate}%</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              عدد الأهداف النشطة بالشهر: {totalMonthGoals}
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-blue-500 transition-all duration-500" fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - monthCompletionRate / 100)} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
              الشهر
            </div>
          </div>
        </div>

        {/* Annual Progress */}
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-xs relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">نسبة إنجاز الأهداف السنوية</span>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">{annualCompletionRate}%</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              أهداف عام {new Date().getFullYear()}: {totalAnnualGoals} أهداف
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-purple-500 transition-all duration-500" fill="transparent"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - annualCompletionRate / 100)} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
              السنة
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Daily Tasks & Quick Add, Activity & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks & Quick Add */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">مهام اليوم</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full font-mono">
              {completedToday} مكتملة
            </span>
          </div>

          {/* Quick Task Input */}
          <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="أضف مهمة سريعة لليوم..."
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            
            <div className="flex gap-2">
              <select 
                value={quickTaskCategory}
                onChange={(e) => setQuickTaskCategory(e.target.value as Category)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(categoriesMeta).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>

              <select 
                value={quickTaskPriority}
                onChange={(e) => setQuickTaskPriority(e.target.value as Priority)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(prioritiesMeta).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>

              <button 
                type="submit"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة</span>
              </button>
            </div>
          </form>

          {/* Today's Tasks List */}
          <div className="space-y-2 mt-4 max-h-[280px] overflow-y-auto pr-1">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm font-sans">
                لا توجد مهام مسجلة لليوم بعد. ابدأ بإضافة مهمة جديدة أعلاه!
              </div>
            ) : (
              todayTasks.map((task) => {
                const cat = categoriesMeta[task.category];
                const prio = prioritiesMeta[task.priority];
                return (
                  <div 
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      task.completed 
                        ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-900 opacity-60' 
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className={`text-slate-400 hover:text-emerald-500 transition-colors focus:outline-hidden ${task.completed ? 'text-emerald-500' : ''}`}
                      >
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <span className={`text-sm font-sans truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cat?.bgClass}`}>
                        {cat?.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${prio?.bgClass}`}>
                        {prio?.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Reminders / Notifications & Recent Activity Log */}
        <div className="space-y-6">
          {/* Notifications Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Bell className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold font-sans">تنبيهات المهام القادمة</h4>
              </div>
              {pendingTasks.length > 0 && (
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </div>

            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-sans">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>جميع مهام اليوم مكتملة! أحسنت العمل.</span>
                </div>
              ) : (
                pendingTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 font-sans line-clamp-1">{task.title}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>مهمة معلقة لليوم</span>
                      </span>
                      <span className="font-mono">{prioritiesMeta[task.priority]?.label}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>آخر الأنشطة المسجلة</span>
            </h4>

            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4 font-sans">لا توجد أنشطة مسجلة بعد.</p>
              ) : (
                activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900 pb-2.5 last:border-0 last:pb-0">
                    <div className="mt-0.5">
                      {log.type === 'task_complete' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {log.type === 'badge_unlocked' && <Trophy className="w-4 h-4 text-amber-500" />}
                      {log.type === 'level_up' && <Sparkles className="w-4 h-4 text-purple-500" />}
                      {log.type === 'task_add' && <Plus className="w-4 h-4 text-blue-500" />}
                      {log.type === 'points_earned' && <Flame className="w-4 h-4 text-rose-500" />}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">{log.message}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>{new Date(log.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                        {log.pointsEarned && <span className="text-emerald-500">+{log.pointsEarned} نقطة</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
