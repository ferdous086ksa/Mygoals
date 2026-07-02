/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 
  | 'work'          // العمل
  | 'study'         // الدراسة
  | 'health'        // الصحة
  | 'sport'         // الرياضة
  | 'money'         // المال
  | 'family'        // العائلة
  | 'self_dev'      // تطوير الذات
  | 'projects';     // المشاريع

export type Priority = 'high' | 'medium' | 'low';

export interface DailyTask {
  id: string;
  weeklyGoalId?: string; // linked to a weekly goal
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  date: string; // YYYY-MM-DD
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  timeSpent?: number; // hours spent
  postponedCount: number; // number of times postponed
  notes?: string;
}

export interface WeeklyGoal {
  id: string;
  monthlyGoalId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string; // e.g., "ساعات", "كلمات", "كجم"
  status: 'active' | 'completed' | 'delayed';
  category: Category;
  weekIndex: number; // 1 to 4 or start/end dates
}

export interface MonthlyGoal {
  id: string;
  annualGoalId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: 'active' | 'completed' | 'delayed';
  category: Category;
  month: number; // 1 to 12
}

export interface AnnualGoal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: 'active' | 'completed' | 'delayed';
  category: Category;
  priority: Priority;
  year: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // icon name from lucide
  unlockedAt?: string; // ISO date
  progress: number; // percentage or current/target
  maxProgress: number;
}

export interface UserProgress {
  points: number;
  level: 'beginner' | 'active' | 'committed' | 'professional' | 'expert';
  streak: number; // daily commitment streak
  lastActiveDate?: string; // YYYY-MM-DD
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  type: 'task_complete' | 'goal_complete' | 'level_up' | 'badge_unlocked' | 'task_add' | 'points_earned';
  message: string;
  pointsEarned?: number;
}

export interface GoalPlanBreakdown {
  annualGoal: string;
  monthlyGoals: {
    title: string;
    month: number;
    targetValue: number;
    unit: string;
    description: string;
  }[];
  weeklyGoals: {
    title: string;
    monthIndex: number; // Month index (1-12) the weekly goal is under
    weekIndex: number; // Week index (1-4)
    targetValue: number;
    unit: string;
  }[];
  dailyTasks: {
    title: string;
    priority: Priority;
    notes: string;
  }[];
}
