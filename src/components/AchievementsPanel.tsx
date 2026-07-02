/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, Flame, ShieldAlert, Award, Target, Check, Zap, HelpCircle, Star
} from 'lucide-react';
import { AchievementBadge, UserProgress } from '../types';

interface AchievementsPanelProps {
  badges: AchievementBadge[];
  userProgress: UserProgress;
  levelLabel: string;
}

// Helper to map icon names to Lucide icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Target: Target,
  Flame: Flame,
  ShieldAlert: ShieldAlert,
  Award: Award,
  Trophy: Trophy,
};

export default function AchievementsPanel({
  badges,
  userProgress,
  levelLabel
}: AchievementsPanelProps) {
  // Get next level thresholds and progress
  const getNextLevelThresholds = (points: number) => {
    if (points <= 100) return { current: 'مبتدئ', next: 'نشيط', nextPoints: 101, max: 100 };
    if (points <= 500) return { current: 'نشيط', next: 'ملتزم', nextPoints: 501, max: 500 };
    if (points <= 1500) return { current: 'ملتزم', next: 'محترف', nextPoints: 1501, max: 1500 };
    if (points <= 4000) return { current: 'محترف', next: 'خبير الإنجاز', nextPoints: 4001, max: 4000 };
    return { current: 'خبير الإنجاز', next: 'القمة السلوكية', nextPoints: 10000, max: 10000 };
  };

  const thresholds = getNextLevelThresholds(userProgress.points);
  const levelProgressPercent = Math.min(Math.round((userProgress.points / thresholds.nextPoints) * 100), 100);

  return (
    <div className="space-y-6">
      {/* Levels & Points Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-linear-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/15 p-6 rounded-3xl items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-sans">نظام المستويات والمكافآت الذكي</span>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">
              مرحباً بك في رتبة <span className="text-amber-500">[{levelLabel}]</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-md leading-relaxed">
              احصل على نقاط إضافية عند التزامك بالمهام اليومية والأهداف الكبيرة وتنمية رتبتك السلوكية للانتقال إلى المستوى التالي.
            </p>
          </div>

          {/* Level Progress Slider/Progress */}
          <div className="space-y-1.5 max-w-lg">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-sans">التقدم للمستوى التالي [{thresholds.next}]:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{userProgress.points} / {thresholds.nextPoints} نقطة</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-linear-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${levelProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Visual points wheel */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-md">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" fill="transparent" />
              <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="6" className="text-amber-500 transition-all duration-500" fill="transparent"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - levelProgressPercent / 100)} />
            </svg>
            <div className="text-center space-y-0.5 z-10">
              <span className="text-[10px] text-slate-400 font-sans uppercase">النقاط الكلية</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">{userProgress.points}</p>
              <span className="text-[10px] text-amber-500 font-sans font-bold">{levelLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span>مجموعتك من شارات التميز</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            المكتملة: {badges.filter(b => b.progress >= b.maxProgress).length} / {badges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map(badge => {
            const BadgeIcon = iconMap[badge.icon] || Trophy;
            const isUnlocked = badge.progress >= badge.maxProgress;
            const percent = Math.round((badge.progress / badge.maxProgress) * 100);

            return (
              <div 
                key={badge.id}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-linear-to-b from-amber-500/5 to-transparent border-amber-500/20 shadow-xs' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className={`p-3 rounded-xl border flex-shrink-0 ${
                  isUnlocked 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}>
                  <BadgeIcon className="w-6 h-6" />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans truncate">{badge.title}</h5>
                      {isUnlocked && (
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.2 rounded-full font-sans">نشط</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans leading-relaxed">{badge.description}</p>
                  </div>

                  {/* Progress slider inside badge */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-slate-400">التقدم للشارة:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1">
                      <div 
                        className="bg-amber-500 h-1 rounded-full" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans uppercase flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>كيف يمكنك كسب النقاط؟</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-slate-600 dark:text-slate-400">
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
            <span className="font-bold text-emerald-500">+10 نقاط</span>
            <p className="text-[11px] text-slate-400">عند إتمام أي مهمة يومية بسيطة</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
            <span className="font-bold text-blue-500">+50 نقطة</span>
            <p className="text-[11px] text-slate-400">عند إتمام هدف أسبوعي محدد</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
            <span className="font-bold text-purple-500">+200 نقطة</span>
            <p className="text-[11px] text-slate-400">عند إتمام أي هدف شهري بنجاح</p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
            <span className="font-bold text-rose-500">+1000 نقطة</span>
            <p className="text-[11px] text-slate-400">إتمام هدف سنوي كبير بالكامل!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
