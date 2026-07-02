/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Calendar as CalendarIcon, BarChart3, Sparkles, 
  Trophy, FileText, Settings, Shield, Moon, Sun, Flame, Award, Bell
} from 'lucide-react';

// Import Types
import { 
  AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask, 
  AchievementBadge, UserProgress, ActivityLog, Category, Priority 
} from './types';

// Import Default Data
import { 
  defaultAnnualGoals, defaultMonthlyGoals, defaultWeeklyGoals, 
  defaultDailyTasks, defaultBadges, defaultUserProgress, 
  defaultActivityLogs, categoriesMeta 
} from './data/defaultData';

// Import Components
import Dashboard from './components/Dashboard';
import GoalManager from './components/GoalManager';
import SmartCalendar from './components/SmartCalendar';
import Statistics from './components/Statistics';
import AnalysisPanel from './components/AnalysisPanel';
import AchievementsPanel from './components/AchievementsPanel';
import ReportsPanel from './components/ReportsPanel';
import SettingsPanel from './components/SettingsPanel';
import AdminPanel from './components/AdminPanel';

// Import Firebase and database service
import { getOrCreateUserId } from './lib/firebase';
import { loadUserData, saveUserData } from './lib/firebaseService';

type TabType = 'dashboard' | 'goals' | 'calendar' | 'charts' | 'ai' | 'badges' | 'reports' | 'settings' | 'admin';

export default function App() {
  // Load initial states from localStorage or defaults
  const [annualGoals, setAnnualGoals] = useState<AnnualGoal[]>(() => {
    const saved = localStorage.getItem('ahdafi_annual_goals');
    return saved ? JSON.parse(saved) : defaultAnnualGoals;
  });

  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(() => {
    const saved = localStorage.getItem('ahdafi_monthly_goals');
    return saved ? JSON.parse(saved) : defaultMonthlyGoals;
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem('ahdafi_weekly_goals');
    return saved ? JSON.parse(saved) : defaultWeeklyGoals;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('ahdafi_daily_tasks');
    return saved ? JSON.parse(saved) : defaultDailyTasks;
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('ahdafi_badges');
    return saved ? JSON.parse(saved) : defaultBadges;
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ahdafi_user_progress');
    return saved ? JSON.parse(saved) : defaultUserProgress;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ahdafi_activity_logs');
    return saved ? JSON.parse(saved) : defaultActivityLogs;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ahdafi_dark_mode');
    return saved ? saved === 'true' : true; // default dark mode for cosmic twilight look
  });

  const [startOfWeek, setStartOfWeek] = useState<'saturday' | 'sunday' | 'monday'>('saturday');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Cloud Sync state variables
  const [userId, setUserId] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'loading' | 'synced' | 'syncing' | 'error'>('loading');

  // Initialize Cloud Database Sync on Mount
  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);

    async function initCloudSync() {
      // Check offline status first
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn("Client is offline. Initializing application with local storage data.");
        setIsDataLoaded(true);
        setSyncStatus('error');
        return;
      }

      try {
        setSyncStatus('loading');
        const cloudData = await loadUserData(uid);
        if (cloudData) {
          // Cloud data exists! Prioritize cloud data and load into state
          setAnnualGoals(cloudData.annualGoals || []);
          setMonthlyGoals(cloudData.monthlyGoals || []);
          setWeeklyGoals(cloudData.weeklyGoals || []);
          setDailyTasks(cloudData.dailyTasks || []);
          setBadges(cloudData.badges || []);
          setUserProgress(cloudData.userProgress || defaultUserProgress);
          setActivityLogs(cloudData.activityLogs || []);
          setSyncStatus('synced');
        } else {
          // No cloud profile yet, attempt upload of existing local datasets
          await saveUserData(uid, {
            annualGoals,
            monthlyGoals,
            weeklyGoals,
            dailyTasks,
            badges,
            userProgress,
            activityLogs
          });
          setSyncStatus('synced');
        }
        setIsDataLoaded(true);
      } catch (error: any) {
        console.warn("Failed to load Cloud Database profile (falling back to local storage):", error?.message || error);
        // Fallback: mark loaded so user can keep working locally
        setIsDataLoaded(true);
        setSyncStatus('error');
      }
    }

    const handleOnline = () => {
      console.log("App went online. Triggering cloud synchronization...");
      initCloudSync();
    };

    const handleOffline = () => {
      console.warn("App went offline. Switched status to offline mode.");
      setSyncStatus('error');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    initCloudSync();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ahdafi_annual_goals', JSON.stringify(annualGoals));
  }, [annualGoals]);

  useEffect(() => {
    localStorage.setItem('ahdafi_monthly_goals', JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem('ahdafi_weekly_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem('ahdafi_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('ahdafi_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ahdafi_user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('ahdafi_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Sync to Cloud Firestore (with 1 second debounce to bundle multiple fast changes)
  useEffect(() => {
    if (!isDataLoaded || !userId) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    const delayDebounceFn = setTimeout(async () => {
      try {
        await saveUserData(userId, {
          annualGoals,
          monthlyGoals,
          weeklyGoals,
          dailyTasks,
          badges,
          userProgress,
          activityLogs
        });
        
        // If navigator is still online, we are successfully synced!
        if (typeof navigator === 'undefined' || navigator.onLine) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch (error: any) {
        console.warn("Firestore sync deferred (using local backup):", error?.message || error);
        setSyncStatus('error');
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [annualGoals, monthlyGoals, weeklyGoals, dailyTasks, badges, userProgress, activityLogs, userId, isDataLoaded]);

  useEffect(() => {
    localStorage.setItem('ahdafi_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper to append a new activity log
  const logActivity = (type: ActivityLog['type'], message: string, pointsEarned = 0) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      pointsEarned
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep latest 50 logs
    
    if (pointsEarned !== 0) {
      setUserProgress(prev => {
        const nextPoints = Math.max(0, prev.points + pointsEarned);
        let currentLevel = prev.level;
        if (nextPoints > 4000) currentLevel = 'master';
        else if (nextPoints > 1500) currentLevel = 'pro';
        else if (nextPoints > 500) currentLevel = 'committed';
        else if (nextPoints > 100) currentLevel = 'active';
        else currentLevel = 'beginner';

        return {
          ...prev,
          points: nextPoints,
          level: currentLevel
        };
      });
    }
  };

  // State handlers

  // Daily task completions
  const handleToggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        const pts = nextCompleted ? 10 : -10;
        logActivity(
          'task_complete', 
          `${nextCompleted ? 'أكملت' : 'تراجعت عن إتمام'} المهمة: ${task.title}`, 
          pts
        );
        return { ...task, completed: nextCompleted };
      }
      return task;
    }));
  };

  const handleAddTask = (title: string, priority: Priority, category: Category, date: string, weeklyGoalId?: string) => {
    const newTask: DailyTask = {
      id: `tsk-${Date.now()}`,
      title,
      completed: false,
      priority,
      category,
      date,
      repeat: 'none',
      postponedCount: 0,
      weeklyGoalId
    };
    setDailyTasks(prev => [newTask, ...prev]);
    logActivity('task_complete', `أنشأت مهمة يومية جديدة: ${title}`);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = dailyTasks.find(t => t.id === id);
    if (!taskToDelete) return;
    setDailyTasks(prev => prev.filter(t => t.id !== id));
    logActivity('task_complete', `حذفت المهمة اليومية: ${taskToDelete.title}`);
  };

  const handlePostponeTask = (id: string) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id) {
        const currentDate = new Date(task.date);
        currentDate.setDate(currentDate.getDate() + 1); // move to tomorrow
        const newDateStr = currentDate.toISOString().split('T')[0];
        
        logActivity('points_earned', `أجلت المهمة إلى الغد: ${task.title}`);
        return { 
          ...task, 
          date: newDateStr, 
          postponedCount: task.postponedCount + 1 
        };
      }
      return task;
    }));
  };

  const handleMoveTask = (id: string, newDate: string) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id) {
        logActivity('task_complete', `أعدت جدولة المهمة إلى يوم ${newDate}: ${task.title}`);
        return { ...task, date: newDate };
      }
      return task;
    }));
  };

  // Goals Hierarchy adders and deleters
  const handleAddAnnualGoal = (goal: Omit<AnnualGoal, 'id' | 'currentValue' | 'status'>) => {
    const newGoal: AnnualGoal = {
      ...goal,
      id: `ann-${Date.now()}`,
      currentValue: 0,
      status: 'active'
    };
    setAnnualGoals(prev => [...prev, newGoal]);
    logActivity('points_earned', `أنشأت هدفاً سنوياً جديداً: ${goal.title}`, 50);
  };

  const handleAddMonthlyGoal = (goal: Omit<MonthlyGoal, 'id' | 'currentValue' | 'status'>) => {
    const newGoal: MonthlyGoal = {
      ...goal,
      id: `mon-${Date.now()}`,
      currentValue: 0,
      status: 'active'
    };
    setMonthlyGoals(prev => [...prev, newGoal]);
    logActivity('points_earned', `أنشأت هدفاً شهرياً جديداً: ${goal.title}`, 30);
  };

  const handleAddWeeklyGoal = (goal: Omit<WeeklyGoal, 'id' | 'currentValue' | 'status'>) => {
    const newGoal: WeeklyGoal = {
      ...goal,
      id: `wek-${Date.now()}`,
      currentValue: 0,
      status: 'active'
    };
    setWeeklyGoals(prev => [...prev, newGoal]);
    logActivity('points_earned', `أنشأت هدفاً أسبوعياً جديداً: ${goal.title}`, 20);
  };

  const handleDeleteAnnualGoal = (id: string) => {
    setAnnualGoals(prev => prev.filter(g => g.id !== id));
    setMonthlyGoals(prev => prev.filter(g => g.annualGoalId !== id));
  };

  const handleDeleteMonthlyGoal = (id: string) => {
    setMonthlyGoals(prev => prev.filter(g => g.id !== id));
    setWeeklyGoals(prev => prev.filter(g => g.monthlyGoalId !== id));
  };

  const handleDeleteWeeklyGoal = (id: string) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== id));
    setDailyTasks(prev => prev.filter(t => t.weeklyGoalId !== id));
  };

  // Slider progress updates
  const handleUpdateAnnualProgress = (id: string, val: number) => {
    setAnnualGoals(prev => prev.map(g => {
      if (g.id === id) {
        const isCompleted = val >= g.targetValue;
        const status = isCompleted ? 'completed' : 'active';
        if (isCompleted && g.status !== 'completed') {
          logActivity('badge_unlocked', `مبروك! أتممت هدفاً سنوياً كبيراً بالكامل: ${g.title}`, 1000);
        }
        return { ...g, currentValue: val, status };
      }
      return g;
    }));
  };

  const handleUpdateMonthlyProgress = (id: string, val: number) => {
    setMonthlyGoals(prev => prev.map(g => {
      if (g.id === id) {
        const isCompleted = val >= g.targetValue;
        const status = isCompleted ? 'completed' : 'active';
        if (isCompleted && g.status !== 'completed') {
          logActivity('badge_unlocked', `أتممت بنجاح هدفاً شهرياً هاماً: ${g.title}`, 200);
        }
        return { ...g, currentValue: val, status };
      }
      return g;
    }));
  };

  const handleUpdateWeeklyProgress = (id: string, val: number) => {
    setWeeklyGoals(prev => prev.map(g => {
      if (g.id === id) {
        const isCompleted = val >= g.targetValue;
        const status = isCompleted ? 'completed' : 'active';
        if (isCompleted && g.status !== 'completed') {
          logActivity('badge_unlocked', `أنجزت هدفاً أسبوعياً فرعياً: ${g.title}`, 50);
        }
        return { ...g, currentValue: val, status };
      }
      return g;
    }));
  };

  // Handle entire goal plans from AI Breakdown Planner
  const handleApplyAIBreakdown = (annualGoal: { title: string; desc: string; target: number; unit: string; cat: Category; prio: Priority }, monthList: { title: string; target: number; unit: string }[], weekList: { title: string; target: number; unit: string }[]) => {
    // 1. Create Annual Goal
    const annId = `ann-${Date.now()}`;
    const newAnn: AnnualGoal = {
      id: annId,
      title: annualGoal.title,
      description: annualGoal.desc,
      targetValue: annualGoal.target,
      currentValue: 0,
      unit: annualGoal.unit,
      status: 'active',
      category: annualGoal.cat,
      priority: annualGoal.prio,
      year: 2026
    };

    // 2. Create Monthly Goal
    const monId = `mon-${Date.now()}`;
    const newMon: MonthlyGoal = {
      id: monId,
      annualGoalId: annId,
      title: monthList[0]?.title || `الهدف الشهري لـ ${annualGoal.title}`,
      description: `خطة مستهدفة مشتقة ذكياً بـ ${monthList[0]?.target || 10} ${monthList[0]?.unit || annualGoal.unit}`,
      targetValue: monthList[0]?.target || 100,
      currentValue: 0,
      unit: monthList[0]?.unit || annualGoal.unit,
      status: 'active',
      category: annualGoal.cat,
      month: 7 // current month July
    };

    // 3. Create Weekly Goal
    const wekId = `wek-${Date.now()}`;
    const newWek: WeeklyGoal = {
      id: wekId,
      monthlyGoalId: monId,
      title: weekList[0]?.title || `خطة الأسبوع لـ ${annualGoal.title}`,
      description: `خطة عمل للأسبوع الأول بـ ${weekList[0]?.target || 5} ${weekList[0]?.unit || annualGoal.unit}`,
      targetValue: weekList[0]?.target || 100,
      currentValue: 0,
      unit: weekList[0]?.unit || annualGoal.unit,
      status: 'active',
      category: annualGoal.cat,
      weekIndex: 1
    };

    // Save states
    setAnnualGoals(prev => [...prev, newAnn]);
    setMonthlyGoals(prev => [...prev, newMon]);
    setWeeklyGoals(prev => [...prev, newWek]);

    logActivity('badge_unlocked', `تفكيك وتوليد خطة هدف ذكية بنجاح من Gemini لـ: ${annualGoal.title}`, 150);
  };

  // Backup Data handlers
  const handleBackupData = () => {
    const backupObj = {
      annualGoals,
      monthlyGoals,
      weeklyGoals,
      dailyTasks,
      badges,
      userProgress,
      activityLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `نسخة_احتياطية_أهدافي_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.annualGoals && parsed.dailyTasks) {
          setAnnualGoals(parsed.annualGoals);
          setMonthlyGoals(parsed.monthlyGoals || []);
          setWeeklyGoals(parsed.weeklyGoals || []);
          setDailyTasks(parsed.dailyTasks);
          setBadges(parsed.badges || []);
          setUserProgress(parsed.userProgress || defaultUserProgress);
          setActivityLogs(parsed.activityLogs || []);
          alert('تهانينا! تم استرجاع واستيراد جميع أهدافك وإحصائياتك بنجاح.');
        } else {
          alert('الملف المرفوع غير مطابق لصيغة النسخ الاحتياطي السليم للتطبيق.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
  };

  // Convert progress status values into labels
  const levelLabels: Record<string, string> = {
    beginner: 'مبتدئ',
    active: 'نشيط',
    committed: 'ملتزم الخطة',
    pro: 'محترف الإنجاز',
    master: 'خبير سلوكي'
  };

  const levelLabel = levelLabels[userProgress.level] || 'نشيط';

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Top Announcement Header */}
      <div className="bg-linear-to-r from-emerald-600 to-indigo-600 text-white text-[11px] font-sans font-bold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 relative z-20">
        <Flame className="w-3.5 h-3.5 animate-bounce" />
        <span>عزيمتك اليوم تصنع مستقبلك! التزامك الحالي بالمهام: {userProgress.streak} أيام متواصلة 🔥</span>
      </div>

      {/* Main Core Full Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Responsive Drawer / Sidebar Side Nav */}
        <aside id="main-sidebar" className="w-full md:w-64 bg-indigo-950 text-white dark:bg-slate-950 border-b md:border-b-0 md:border-l border-indigo-900 dark:border-slate-900 p-5 flex flex-col justify-between flex-shrink-0 z-10 transition-colors duration-300">
          <div className="space-y-6">
            
            {/* Header Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-400 rounded-2xl flex items-center justify-center text-indigo-950 shadow-lg shadow-emerald-400/20 font-bold">
                  <Target className="w-5 h-5 animate-spin-slow text-indigo-900" />
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-white font-sans tracking-tight">أهدافي الذكي</h1>
                  <span className="text-[10px] text-indigo-200 dark:text-slate-400 font-sans">متعقب الأهداف والالتزام</span>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 bg-white/10 dark:bg-slate-900 rounded-lg text-indigo-100 hover:text-white dark:hover:text-slate-200 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Cloud Sync Database Status Badge */}
            <div className="bg-white/5 dark:bg-slate-900/50 p-2.5 rounded-xl flex items-center justify-between border border-white/5 text-[10px] font-sans">
              <span className="text-indigo-200 dark:text-slate-400">قاعدة البيانات:</span>
              <div className="flex items-center gap-1.5">
                {syncStatus === 'loading' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                    <span className="font-bold text-blue-300">جاري التحميل...</span>
                  </>
                )}
                {syncStatus === 'syncing' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                    <span className="font-bold text-amber-300">جاري المزامنة...</span>
                  </>
                )}
                {syncStatus === 'synced' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    <span className="font-bold text-emerald-300">سحابية آمنة</span>
                  </>
                )}
                {syncStatus === 'error' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
                    <span className="font-bold text-red-300">وضع أوفلاين</span>
                  </>
                )}
              </div>
            </div>

            {/* Nav Menu Lists */}
            <nav className="space-y-1">
              {/* Dashboard */}
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>الرئيسية (لوحة المتابعة)</span>
              </button>

              {/* Goal Manager */}
              <button 
                onClick={() => setActiveTab('goals')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'goals' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>تخطيط وإدارة الأهداف</span>
              </button>

              {/* Smart Calendar */}
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'calendar' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>التقويم الذكي والمواعيد</span>
              </button>

              {/* Charts & Statistics */}
              <button 
                onClick={() => setActiveTab('charts')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'charts' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>مخططات وإحصائيات الإنجاز</span>
              </button>

              {/* AI Advisor Panel */}
              <button 
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'ai' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>المستشار والتحليل الذكي</span>
                </div>
                <span className="text-[8px] bg-emerald-500 text-white font-mono font-bold px-1.5 py-0.2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]">Gemini</span>
              </button>

              {/* Badges and Achievements */}
              <button 
                onClick={() => setActiveTab('badges')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'badges' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>شارات تميز الإنجاز</span>
              </button>

              {/* Reports Panel */}
              <button 
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'reports' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>إعداد وتصدير التقارير</span>
              </button>

              {/* Settings Panel */}
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>إعدادات الواجهة والبيانات</span>
              </button>

              {/* Admin Panel */}
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-white/15 text-white border-r-4 border-emerald-400 shadow-md' 
                    : 'text-indigo-100 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4" />
                  <span>لوحة التحكم والإدارة</span>
                </div>
                <span className="text-[8px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full font-sans">ADMIN</span>
              </button>
            </nav>
          </div>

          {/* User footer badge card */}
          <div className="pt-5 border-t border-indigo-900 dark:border-slate-900 mt-6 space-y-3">
            <div className="bg-indigo-900/40 dark:bg-slate-900 p-4 rounded-2xl text-center border border-indigo-800/20 dark:border-slate-800">
              <div className="text-[10px] text-indigo-300 dark:text-slate-400 mb-1 uppercase tracking-widest font-sans font-bold">مستوى المستخدم</div>
              <div className="text-sm font-extrabold text-white dark:text-slate-100 font-sans">{levelLabel}</div>
              <div className="w-full bg-indigo-950 dark:bg-slate-950 h-2 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-all duration-500" 
                  style={{ width: `${Math.min(100, (userProgress.points % 1000) / 10)}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-indigo-200 dark:text-slate-400 mt-2 font-mono">
                {userProgress.points} / {Math.ceil((userProgress.points + 1) / 1000) * 1000} نقطة
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          {/* Active Tab rendering */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              annualGoals={annualGoals}
              monthlyGoals={monthlyGoals}
              weeklyGoals={weeklyGoals}
              dailyTasks={dailyTasks}
              activityLogs={activityLogs}
              streak={userProgress.streak}
              points={userProgress.points}
              levelLabel={levelLabel}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onSetActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'goals' && (
            <GoalManager 
              annualGoals={annualGoals}
              monthlyGoals={monthlyGoals}
              weeklyGoals={weeklyGoals}
              dailyTasks={dailyTasks}
              onAddAnnualGoal={handleAddAnnualGoal}
              onAddMonthlyGoal={handleAddMonthlyGoal}
              onAddWeeklyGoal={handleAddWeeklyGoal}
              onAddDailyTask={handleAddTask}
              onDeleteAnnualGoal={handleDeleteAnnualGoal}
              onDeleteMonthlyGoal={handleDeleteMonthlyGoal}
              onDeleteWeeklyGoal={handleDeleteWeeklyGoal}
              onDeleteDailyTask={handleDeleteTask}
              onUpdateAnnualProgress={handleUpdateAnnualProgress}
              onUpdateMonthlyProgress={handleUpdateMonthlyProgress}
              onUpdateWeeklyProgress={handleUpdateWeeklyProgress}
            />
          )}

          {activeTab === 'calendar' && (
            <SmartCalendar 
              dailyTasks={dailyTasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          )}

          {activeTab === 'charts' && (
            <Statistics 
              annualGoals={annualGoals}
              monthlyGoals={monthlyGoals}
              weeklyGoals={weeklyGoals}
              dailyTasks={dailyTasks}
            />
          )}

          {activeTab === 'ai' && (
            <AnalysisPanel 
              annualGoals={annualGoals}
              monthlyGoals={monthlyGoals}
              weeklyGoals={weeklyGoals}
              dailyTasks={dailyTasks}
              userProgress={userProgress}
            />
          )}

          {activeTab === 'badges' && (
            <AchievementsPanel 
              badges={badges}
              userProgress={userProgress}
              levelLabel={levelLabel}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPanel 
              annualGoals={annualGoals}
              monthlyGoals={monthlyGoals}
              weeklyGoals={weeklyGoals}
              dailyTasks={dailyTasks}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel 
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              startOfWeek={startOfWeek}
              onChangeStartOfWeek={setStartOfWeek}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
              onBackupData={handleBackupData}
              onRestoreData={handleRestoreData}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanel />
          )}

        </main>
      </div>
    </div>
  );
}
