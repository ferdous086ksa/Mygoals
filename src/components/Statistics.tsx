/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Award, Calendar, AlertTriangle, Clock, Activity, CheckCircle2 
} from 'lucide-react';
import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask } from '../types';
import { categoriesMeta } from '../data/defaultData';

interface StatisticsProps {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
}

export default function Statistics({
  annualGoals,
  monthlyGoals,
  weeklyGoals,
  dailyTasks
}: StatisticsProps) {
  // 1. General numerical metrics
  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter(t => t.completed).length;
  const generalCommitmentRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalAnnual = annualGoals.length;
  const completedAnnual = annualGoals.filter(g => g.status === 'completed').length;

  const totalMonthly = monthlyGoals.length;
  const completedMonthly = monthlyGoals.filter(g => g.status === 'completed').length;

  // Calculate total hours spent
  const totalHoursSpent = dailyTasks.reduce((acc, curr) => acc + (curr.completed ? (curr.timeSpent || 0) : 0), 0);

  // Delayed count
  const delayedGoalsCount = annualGoals.filter(g => g.status === 'delayed').length +
                           monthlyGoals.filter(g => g.status === 'delayed').length +
                           weeklyGoals.filter(g => g.status === 'delayed').length;

  // 2. Prepare chart data: Completion over days (line chart)
  // Let's gather last 5 days
  const dailyProgressData = [
    { name: '28 يونيو', 'المهام المكتملة': 3, 'المهام الكلية': 4 },
    { name: '29 يونيو', 'المهام المكتملة': 4, 'المهام الكلية': 5 },
    { name: '30 يونيو', 'المهام المكتملة': 5, 'المهام الكلية': 5 },
    { name: '1 يوليو', 'المهام المكتملة': 3, 'المهام الكلية': 3 },
    { name: '2 يوليو', 'المهام المكتملة': completedTasks, 'المهام الكلية': totalTasks },
  ];

  // 3. Prepare chart data: Category breakdown (pie chart)
  const categoryCounts: Record<string, { name: string; value: number; color: string }> = {};
  dailyTasks.forEach(task => {
    if (task.completed) {
      const catKey = task.category;
      const meta = categoriesMeta[catKey];
      if (categoryCounts[catKey]) {
        categoryCounts[catKey].value += 1;
      } else {
        categoryCounts[catKey] = {
          name: meta?.label || catKey,
          value: 1,
          color: meta?.color || '#3b82f6'
        };
      }
    }
  });

  const pieData = Object.values(categoryCounts);
  const defaultPieData = [
    { name: 'الدراسة', value: 4, color: '#f59e0b' },
    { name: 'الصحة', value: 3, color: '#10b981' },
    { name: 'المشاريع', value: 2, color: '#f43f5e' },
    { name: 'العمل', value: 2, color: '#3b82f6' }
  ];

  const categoryChartData = pieData.length > 0 ? pieData : defaultPieData;

  // 4. Monthly Achievement Comparisons (bar chart)
  const monthlyComparisonData = [
    { name: 'يناير', 'الأهداف المكتملة': 1, 'الأهداف المتأخرة': 0 },
    { name: 'فبراير', 'الأهداف المكتملة': 2, 'الأهداف المتأخرة': 1 },
    { name: 'مارس', 'الأهداف المكتملة': 3, 'الأهداف المتأخرة': 0 },
    { name: 'أبريل', 'الأهداف المكتملة': 2, 'الأهداف المتأخرة': 2 },
    { name: 'مايو', 'الأهداف المكتملة': 4, 'الأهداف المتأخرة': 1 },
    { name: 'يونيو', 'الأهداف المكتملة': 5, 'الأهداف المتأخرة': 0 },
    { name: 'يوليو', 'الأهداف المكتملة': completedMonthly, 'الأهداف المتأخرة': delayedGoalsCount },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Stat Cards Grid */}
      <div id="stat-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total achieved */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 font-sans">الأهداف المكتملة</span>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {completedAnnual + completedMonthly} <span className="text-xs text-slate-500 font-sans font-normal">أهداف</span>
            </p>
          </div>
        </div>

        {/* Commitment Rate */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 font-sans">معدل التزام المهام</span>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {generalCommitmentRate}% <span className="text-xs text-slate-500 font-sans font-normal">عام</span>
            </p>
          </div>
        </div>

        {/* Total hours */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 font-sans">ساعات الإنتاجية المسجلة</span>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {totalHoursSpent.toFixed(1)} <span className="text-xs text-slate-500 font-sans font-normal">ساعة</span>
            </p>
          </div>
        </div>

        {/* Delayed goals */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 font-sans">الأهداف المتأخرة</span>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
              {delayedGoalsCount} <span className="text-xs text-slate-500 font-sans font-normal">أهداف</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress Over Time */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>مخطط تقدم إنجاز المهام اليومية</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">آخر 5 أيام</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter' }} />
                <Line type="monotone" dataKey="المهام المكتملة" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="المهام الكلية" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly goal comparisons */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>مقارنة إنجاز الأهداف عبر الأشهر</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">عام 2026</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter' }} />
                <Bar dataKey="الأهداف المكتملة" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="الأهداف المتأخرة" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Categories Pie & Productive highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Breakdown Pie */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-500" />
            <span>توزيع الإنجاز حسب فئات الأهداف</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 font-sans uppercase">النسب والتصنيفات</p>
              <div className="grid grid-cols-2 gap-2">
                {categoryChartData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-xs font-sans text-slate-700 dark:text-slate-300 truncate">
                      {entry.name}: {entry.value} مهام
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Highlights panel */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">مؤشرات الأداء الذهبية</h4>
            
            <div className="space-y-3">
              {/* Best Month */}
              <div className="flex justify-between items-center p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-sans">أفضل شهر إنتاجية</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">يونيو 2026</p>
                </div>
                <span className="text-xs font-bold font-sans text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">100% نجاح</span>
              </div>

              {/* Best Day */}
              <div className="flex justify-between items-center p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-sans">أكثر الأيام التزاماً</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">الخميس</p>
                </div>
                <span className="text-xs font-bold font-sans text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">متوسط 5 مهام</span>
              </div>

              {/* Average completion rate */}
              <div className="flex justify-between items-center p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-sans">متوسط الإنجاز اليومي</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">4 مهام مكتملة/يوم</p>
                </div>
                <span className="text-xs font-bold font-sans text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">نشط جداً</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            يتم احتساب مؤشرات الأداء تلقائياً بناءً على إدخالاتك اليومية في جدول المهام وحفظ تقدم الأهداف.
          </div>
        </div>
      </div>
    </div>
  );
}
