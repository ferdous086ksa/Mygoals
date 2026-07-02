import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask, AchievementBadge, UserProgress, ActivityLog } from '../types';

export const categoriesMeta = {
  work: { label: 'العمل', icon: 'Briefcase', color: '#3b82f6', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  study: { label: 'الدراسة', icon: 'BookOpen', color: '#f59e0b', bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  health: { label: 'الصحة', icon: 'Heart', color: '#10b981', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  sport: { label: 'الرياضة', icon: 'Dumbbell', color: '#8b5cf6', bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  money: { label: 'المال', icon: 'DollarSign', color: '#eab308', bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  family: { label: 'العائلة', icon: 'Users', color: '#ec4899', bgClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  self_dev: { label: 'تطوير الذات', icon: 'Sparkles', color: '#6366f1', bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  projects: { label: 'المشاريع', icon: 'Target', color: '#f43f5e', bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const prioritiesMeta = {
  high: { label: 'عالية', color: '#f43f5e', bgClass: 'bg-rose-500/15 text-rose-400' },
  medium: { label: 'متوسطة', color: '#f59e0b', bgClass: 'bg-amber-500/15 text-amber-400' },
  low: { label: 'منخفضة', color: '#10b981', bgClass: 'bg-emerald-500/15 text-emerald-400' },
};

export const defaultAnnualGoals: AnnualGoal[] = [
  {
    id: 'ann-1',
    title: 'تعلم وإتقان اللغة الإنجليزية',
    description: 'الوصول للمستوى المتقدم C1 من أجل العمل والدراسة والمحادثة بطلاقة',
    targetValue: 12,
    currentValue: 6,
    unit: 'مستوى فرعي',
    status: 'active',
    category: 'study',
    priority: 'high',
    year: 2026,
  },
  {
    id: 'ann-2',
    title: 'خسارة 15 كجم والوصول للوزن المثالي',
    description: 'اتباع نظام غذائي متكامل وممارسة الرياضة بانتظام لتحسين الصحة البدنية والنشاط',
    targetValue: 15,
    currentValue: 8,
    unit: 'كجم',
    status: 'active',
    category: 'health',
    priority: 'medium',
    year: 2026,
  },
  {
    id: 'ann-3',
    title: 'تطوير مشروع جانبي مالي للبرمجة',
    description: 'بناء تطبيق ويب وإطلاقه للحصول على مصدر دخل إضافي لا يقل عن 500 دولار شهرياً',
    targetValue: 100,
    currentValue: 45,
    unit: 'نسبة جاهزية',
    status: 'active',
    category: 'projects',
    priority: 'high',
    year: 2026,
  },
];

export const defaultMonthlyGoals: MonthlyGoal[] = [
  // English goals
  {
    id: 'mon-1',
    annualGoalId: 'ann-1',
    title: 'إنهاء المستوى المتوسط الأول B1.1',
    description: 'دراسة قواعد المستوى وحفظ الكلمات الشائعة وإكمال الواجبات',
    targetValue: 100,
    currentValue: 85,
    unit: 'بالمئة إتمام',
    status: 'active',
    category: 'study',
    month: 7, // July
  },
  {
    id: 'mon-2',
    annualGoalId: 'ann-1',
    title: 'إنهاء كتاب قواعد اللغة الإنجليزية التفاعلي',
    description: 'تغطية 15 فصلاً رئيسياً مع التمارين',
    targetValue: 15,
    currentValue: 15,
    unit: 'فصول',
    status: 'completed',
    category: 'study',
    month: 6, // June
  },
  // Health goals
  {
    id: 'mon-3',
    annualGoalId: 'ann-2',
    title: 'خسارة 2.5 كجم في شهر يوليو',
    description: 'الحفاظ على عجز السعرات والمشي اليومي وقطع السكريات',
    targetValue: 2.5,
    currentValue: 1.2,
    unit: 'كجم',
    status: 'active',
    category: 'health',
    month: 7,
  },
  // Projects goals
  {
    id: 'mon-4',
    annualGoalId: 'ann-3',
    title: 'تصميم واجهات المستخدم للمشروع بالكامل',
    description: 'بناء الهيكل والتصميم التفاعلي للمشروع باستخدام مكتبات متطورة',
    targetValue: 100,
    currentValue: 100,
    unit: 'بالمئة إتمام',
    status: 'completed',
    category: 'projects',
    month: 6,
  },
];

export const defaultWeeklyGoals: WeeklyGoal[] = [
  // linked to mon-1
  {
    id: 'wek-1',
    monthlyGoalId: 'mon-1',
    title: 'دراسة 8 ساعات وحفظ 60 كلمة جديدة',
    description: 'التركيز على الكلمات الخاصة بموضوعات الأعمال والمحادثة اليومية',
    targetValue: 100,
    currentValue: 60,
    unit: 'بالمئة تقدم',
    status: 'active',
    category: 'study',
    weekIndex: 1,
  },
  // linked to mon-3
  {
    id: 'wek-2',
    monthlyGoalId: 'mon-3',
    title: 'ممارسة الرياضة والجري 4 مرات بالأسبوع',
    description: 'حرق 400 سعرة حرارية في كل جلسة',
    targetValue: 4,
    currentValue: 2,
    unit: 'مرات رياضية',
    status: 'active',
    category: 'health',
    weekIndex: 1,
  },
];

export const defaultDailyTasks: DailyTask[] = [
  {
    id: 'tsk-1',
    weeklyGoalId: 'wek-1',
    title: 'مشاهدة درس قواعد اللغة الإنجليزية اليومي (نصف ساعة)',
    completed: true,
    priority: 'high',
    category: 'study',
    date: '2026-07-02',
    repeat: 'none',
    timeSpent: 0.5,
    postponedCount: 0,
    notes: 'درس زمن المضارع التام والمستمر وتطبيقاته',
  },
  {
    id: 'tsk-2',
    weeklyGoalId: 'wek-1',
    title: 'مراجعة 15 كلمة وحفظها بالتطبيق التفاعلي',
    completed: false,
    priority: 'medium',
    category: 'study',
    date: '2026-07-02',
    repeat: 'daily',
    timeSpent: 0,
    postponedCount: 0,
  },
  {
    id: 'tsk-3',
    weeklyGoalId: 'wek-2',
    title: 'الجري الصباحي السريع لمسافة 4 كم',
    completed: true,
    priority: 'high',
    category: 'health',
    date: '2026-07-02',
    repeat: 'none',
    timeSpent: 0.75,
    postponedCount: 0,
    notes: 'تمت الهرولة في الحديقة العامة مع نبضات ممتازة',
  },
  {
    id: 'tsk-4',
    title: 'شرب 3 لترات ماء على مدار اليوم',
    completed: true,
    priority: 'low',
    category: 'health',
    date: '2026-07-02',
    repeat: 'daily',
    timeSpent: 0.1,
    postponedCount: 0,
  },
  {
    id: 'tsk-5',
    title: 'قراءة كتاب عن الذكاء والتركيز (10 صفحات)',
    completed: false,
    priority: 'low',
    category: 'self_dev',
    date: '2026-07-02',
    repeat: 'daily',
    timeSpent: 0,
    postponedCount: 1,
  },
  // Yesterday's tasks
  {
    id: 'tsk-6',
    title: 'كتابة خطة العمل للمشروع البرمجي الجديد',
    completed: true,
    priority: 'high',
    category: 'projects',
    date: '2026-07-01',
    repeat: 'none',
    timeSpent: 2,
    postponedCount: 0,
  },
  {
    id: 'tsk-7',
    title: 'شرب 3 لترات ماء على مدار اليوم',
    completed: true,
    priority: 'low',
    category: 'health',
    date: '2026-07-01',
    repeat: 'daily',
    timeSpent: 0.1,
    postponedCount: 0,
  },
  {
    id: 'tsk-8',
    title: 'مراجعة 15 كلمة وحفظها بالتطبيق التفاعلي',
    completed: true,
    priority: 'medium',
    category: 'study',
    date: '2026-07-01',
    repeat: 'daily',
    timeSpent: 0.5,
    postponedCount: 0,
  },
];

export const defaultBadges: AchievementBadge[] = [
  {
    id: 'bdg-1',
    title: 'الانطلاقة الأولى',
    description: 'أكملت أول مهمة يومية بنجاح!',
    icon: 'Target',
    unlockedAt: '2026-07-01T09:15:00Z',
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'bdg-2',
    title: 'شعلة الالتزام الأسبوعية',
    description: 'التزمت بإكمال مهمة واحدة على الأقل يومياً لمدة 7 أيام متواصلة',
    icon: 'Flame',
    progress: 4, // 4 days streak currently
    maxProgress: 7,
  },
  {
    id: 'bdg-3',
    title: 'بطل العزيمة الفولاذية',
    description: 'التزمت بالكامل وأتممت مهامك لمدة 30 يوماً متواصلة',
    icon: 'ShieldAlert',
    progress: 4,
    maxProgress: 30,
  },
  {
    id: 'bdg-4',
    title: 'صاحب المئة مهمة',
    description: 'أكملت بنجاح 100 مهمة وهدف فرعي في التطبيق',
    icon: 'Award',
    progress: 6,
    maxProgress: 100,
  },
  {
    id: 'bdg-5',
    title: 'قاهر الشهر',
    description: 'حققت بنجاح جميع أهدافك الشهرية المحددة لشهر واحد بالكامل',
    icon: 'Trophy',
    progress: 0,
    maxProgress: 1,
  },
];

export const defaultUserProgress: UserProgress = {
  points: 480,
  level: 'active',
  streak: 4,
  lastActiveDate: '2026-07-02',
};

export const defaultActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-02T08:30:00.000Z',
    type: 'task_complete',
    message: 'أكملت المهمة: مشاهدة درس قواعد اللغة الإنجليزية اليومي',
    pointsEarned: 10,
  },
  {
    id: 'log-2',
    timestamp: '2026-07-02T07:10:00.000Z',
    type: 'task_complete',
    message: 'أكملت المهمة: الجري الصباحي السريع لمسافة 4 كم',
    pointsEarned: 10,
  },
  {
    id: 'log-3',
    timestamp: '2026-07-01T21:00:00.000Z',
    type: 'points_earned',
    message: 'حصلت على نقاط الالتزام المتواصل لليوم الرابع على التوالي!',
    pointsEarned: 20,
  },
  {
    id: 'log-4',
    timestamp: '2026-07-01T15:00:00.000Z',
    type: 'task_complete',
    message: 'أكملت المهمة: كتابة خطة العمل للمشروع البرمجي الجديد',
    pointsEarned: 10,
  },
  {
    id: 'log-5',
    timestamp: '2026-06-30T19:30:00.000Z',
    type: 'badge_unlocked',
    message: 'تهانينا! لقد قمت بفتح شارة الإنجاز: الانطلاقة الأولى',
    pointsEarned: 100,
  },
];

export const motivationalQuotes = [
  { text: 'السر في المضي قدماً هو البدء أولاً.', author: 'مارك توين' },
  { text: 'الأهداف هي مجرد أحلام لها مواعيد نهائية.', author: 'ديفيد هانت' },
  { text: 'انضباطك والتزامك اليوم يحدد نجاحك غداً.', author: 'أرسطو' },
  { text: 'لا يهم مدى بطئك طالما أنك لا تتوقف عن السير.', author: 'كونفوشيوس' },
  { text: 'طريقتك في قضاء يومك هي طريقتك في بناء حياتك بالكامل.', author: 'أني ديلارد' },
  { text: 'النجاح هو مجموع الجهود الصغيرة التي تتكرر يوماً بعد يوم.', author: 'روبرت كولير' },
  { text: 'الذكاء هو القدرة على التكيف مع التغيير والعمل المستمر.', author: 'ستيفن هوكينغ' }
];
