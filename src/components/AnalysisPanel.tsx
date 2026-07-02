/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, ShieldAlert, AlertTriangle, ArrowUpRight, Award, 
  HelpCircle, CheckCircle, Loader2, ListTodo, ThumbsUp, Lightbulb
} from 'lucide-react';
import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask, UserProgress } from '../types';

interface AnalysisPanelProps {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  userProgress: UserProgress;
}

interface AdvisorResult {
  advisorGreeting: string;
  completionPredictions: string;
  productivityTips: string[];
  recommendedPriorities: string[];
}

interface DelayResult {
  analysisText: string;
  recommendations: string[];
}

export default function AnalysisPanel({
  annualGoals,
  monthlyGoals,
  weeklyGoals,
  dailyTasks,
  userProgress
}: AnalysisPanelProps) {
  // AI Advisor state
  const [advisorData, setAdvisorData] = useState<AdvisorResult | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState('');

  // Delay analysis state
  const [delayData, setDelayData] = useState<DelayResult | null>(null);
  const [delayLoading, setDelayLoading] = useState(false);
  const [delayError, setDelayError] = useState('');

  // Calculate most achieved/delayed goals based on sliders or postpone counter
  const activeAnnual = annualGoals.filter(g => g.status === 'active');
  const delayedGoals = [
    ...annualGoals.filter(g => g.status === 'delayed'),
    ...monthlyGoals.filter(g => g.status === 'delayed'),
    ...weeklyGoals.filter(g => g.status === 'delayed'),
  ];

  // Most postponed tasks
  const mostPostponedTasks = dailyTasks
    .filter(t => t.postponedCount > 0)
    .sort((a, b) => b.postponedCount - a.postponedCount)
    .slice(0, 3);

  const fetchAIAdvice = async () => {
    setAdvisorLoading(true);
    setAdvisorError('');
    setAdvisorData(null);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annualGoals,
          monthlyGoals,
          weeklyGoals,
          dailyTasks,
          userProgress
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAdvisorData(data);
      } else {
        setAdvisorError(data.error || 'فشل الاتصال بمرشد الإنتاجية الذكي.');
      }
    } catch (err) {
      setAdvisorError('حدث خطأ أثناء الاتصال بالخادم الذكي.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  const fetchDelayAnalysis = async () => {
    setDelayLoading(true);
    setDelayError('');
    setDelayData(null);

    // Prepare delayed goals and tasks for the prompt
    const delayedItems = [
      ...delayedGoals.map(g => `الهدف: ${g.title}`),
      ...mostPostponedTasks.map(t => `مهمة يومية مؤجلة ${t.postponedCount} مرات: ${t.title}`)
    ];

    try {
      const response = await fetch('/api/gemini/delay-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delayedItems })
      });

      const data = await response.json();
      if (response.ok) {
        setDelayData(data);
      } else {
        setDelayError(data.error || 'فشل الاتصال بمحلل التأجيل الذكي.');
      }
    } catch (err) {
      setDelayError('حدث خطأ أثناء الاتصال بخادم المحلل الذكي.');
    } finally {
      setDelayLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action block for AI consultations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advisor card */}
        <div className="bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-transparent border border-indigo-500/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-indigo-500/15 text-indigo-500 rounded-xl">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">مرشد الأداء والإنتاجية غداً 🔮</h3>
                <p className="text-[11px] text-slate-400 font-sans">احصل على توقعات إتمام الأهداف ونصائح غد المخصصة</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              يقوم المستشار الذكي بتحليل نقاطك ومعدل التزامك المتواصل وسلوك إكمال المهام لتوقع جدول إنجازك الأنسب واقتراح أولويات الغد.
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={fetchAIAdvice}
              disabled={advisorLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {advisorLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري المراجعة والتحليل عبر Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>مراجعة الأداء واقتراح أولويات الغد</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Procrastination analyst card */}
        <div className="bg-linear-to-br from-rose-500/5 via-amber-500/5 to-transparent border border-rose-500/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-rose-500/15 text-rose-500 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">محلل التسويف وعقبات التأخير ⚠️</h3>
                <p className="text-[11px] text-slate-400 font-sans">دراسة أسباب تأجيل أهدافك والحلول النفسية العملية</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              هل هناك مهمة معينة تتجنب البدء فيها؟ يقوم المحلل السلوكي بفحص المهام المؤجلة واقتراح خطة تخلص من التسويف.
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={fetchDelayAnalysis}
              disabled={delayLoading}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {delayLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تحليل عقبات التأخير...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>تحليل أسباب التأخير وتخطي التسويف</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Results Display Areas */}

      {/* 1. Advisor Result Display */}
      {advisorError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 rounded-xl flex items-center gap-2 font-sans">
          <AlertTriangle className="w-4 h-4" />
          <span>{advisorError}</span>
        </div>
      )}

      {advisorData && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-900">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">توصيات المرشد الشخصي الذكي</h4>
          </div>

          <div className="space-y-4">
            {/* Greeting & General Evaluation */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-500 font-sans uppercase">التقييم والترحيب الشخصي</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
                {advisorData.advisorGreeting}
              </p>
            </div>

            {/* Predictions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-purple-500 font-sans uppercase">توقعات إتمام الأهداف والالتزام</span>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/10 flex gap-2">
                <ThumbsUp className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <p>{advisorData.completionPredictions}</p>
              </div>
            </div>

            {/* Recommendations grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Productivity tips */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-500 font-sans uppercase flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>نصائح ذهبية لإنتاجيتك</span>
                </span>
                <div className="space-y-2">
                  {advisorData.productivityTips.map((tip, idx) => (
                    <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-sans">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended priorities tomorrow */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-500 font-sans uppercase flex items-center gap-1">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>أولويات مقترحة للغد</span>
                </span>
                <div className="space-y-2">
                  {advisorData.recommendedPriorities.map((prio, idx) => (
                    <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-sans">
                      {prio}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Delay Result Display */}
      {delayError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 rounded-xl flex items-center gap-2 font-sans">
          <AlertTriangle className="w-4 h-4" />
          <span>{delayError}</span>
        </div>
      )}

      {delayData && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-900">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">تحليل وعلاج التسويف والمماطلة السلوكية</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-rose-500 font-sans uppercase">التحليل السلوكي والنفسي للتأخير</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                {delayData.analysisText}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-500 font-sans uppercase">خطة العمل لتجاوز عقبات البدء</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {delayData.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-sans flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static Analysis Grid: Most delayed goals & most postponed tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most postponed tasks */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>المهام الأكثر تأجيلاً وتأخيراً</span>
          </h4>

          <div className="space-y-2.5">
            {mostPostponedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-sans">أنت تنجز مهامك دون تأجيل متكرر! أداء ممتاز.</p>
            ) : (
              mostPostponedTasks.map(task => (
                <div key={task.id} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 font-sans line-clamp-1">{task.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">آخر تأجيل: {task.date}</span>
                  </div>
                  <span className="text-[10px] font-bold font-sans text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                    مؤجلة {task.postponedCount} مرات
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Achieved categories or goal metrics */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>أهداف سنوية نشطة ومستويات النجاح</span>
          </h4>

          <div className="space-y-2.5">
            {activeAnnual.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-sans">لا توجد أهداف سنوية نشطة لتتبع مستويات نجاحها.</p>
            ) : (
              activeAnnual.map(goal => {
                const percent = Math.round((goal.currentValue / goal.targetValue) * 100);
                return (
                  <div key={goal.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-sans truncate w-40">{goal.title}</span>
                      <span className="font-mono text-[11px] text-slate-400">{percent}% نجاح</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
