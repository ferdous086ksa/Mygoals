/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Settings, Moon, Sun, Globe, Calendar, Bell, Cloud, Download, Upload, Shield, RefreshCw
} from 'lucide-react';

interface SettingsPanelProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  startOfWeek: 'saturday' | 'sunday' | 'monday';
  onChangeStartOfWeek: (day: 'saturday' | 'sunday' | 'monday') => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onBackupData: () => void;
  onRestoreData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingsPanel({
  darkMode,
  onToggleDarkMode,
  startOfWeek,
  onChangeStartOfWeek,
  notificationsEnabled,
  onToggleNotifications,
  onBackupData,
  onRestoreData
}: SettingsPanelProps) {
  const triggerFileInput = () => {
    document.getElementById('restore-file-input')?.click();
  };

  const simulateCloudSync = () => {
    alert('تمت مزامنة بياناتك مع السحابة الافتراضية بنجاح! جميع أهدافك ومهامك اليومية آمنة ومحدثة على كافة أجهزتك.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
          <Settings className="w-5 h-5 text-emerald-500 animate-spin-slow" />
          <span>إعدادات التطبيق وتخصيص الواجهة</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">قم بتعديل نمط العرض، وتأمين بياناتك، ومزامنتها عبر السحابة</p>
      </div>

      {/* Basic Customization Block */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase font-sans">تخصيص العرض واللغة</h4>
        
        {/* Toggle Dark Mode */}
        <div className="flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">تفعيل الوضع الليلي (Night Mode)</p>
            <p className="text-[10px] text-slate-400 font-sans">تغيير واجهة التطبيق إلى مظهر داكن مريح للعينين</p>
          </div>
          <button 
            onClick={onToggleDarkMode}
            className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Change start of week */}
        <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-900 pt-4">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">بداية الأسبوع المفضل</p>
            <p className="text-[10px] text-slate-400 font-sans">تحديد اليوم الذي يبدأ به عرض شبكة التقويم الذكي</p>
          </div>
          <select 
            value={startOfWeek}
            onChange={(e) => onChangeStartOfWeek(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300"
          >
            <option value="saturday">السبت (الأكثر شيوعاً عربياً)</option>
            <option value="sunday">الأحد</option>
            <option value="monday">الاثنين</option>
          </select>
        </div>

        {/* Language option */}
        <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-900 pt-4">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">لغة التطبيق الافتراضية</p>
            <p className="text-[10px] text-slate-400 font-sans">اللغة الأساسية لواجهات وأزرار تتبع الأهداف</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-xs font-bold font-sans">
            <Globe className="w-4 h-4" />
            <span>العربية الفصحى (افتراضي)</span>
          </div>
        </div>
      </div>

      {/* Notifications and Alerts Block */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase font-sans">التنبيهات والإشعارات الذكية</h4>

        <div className="flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">تفعيل إشعارات التذكير اليومية</p>
            <p className="text-[10px] text-slate-400 font-sans">تلقي تنبيهات لطيفة تذكرك بالمهام غير المكتملة قبل نهاية اليوم</p>
          </div>
          <button 
            onClick={onToggleNotifications}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans border transition-all ${
              notificationsEnabled 
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            {notificationsEnabled ? 'مفعّلة' : 'معطّلة'}
          </button>
        </div>
      </div>

      {/* Cloud Sync & Backup Data Block */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase font-sans">المزامنة والنسخ الاحتياطي السحابي</h4>

        {/* Sync now button */}
        <div className="flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">مزامنة البيانات السحابية الافتراضية</p>
            <p className="text-[10px] text-slate-400 font-sans">مزامنة فضلية سريعة لبياناتك بين عدة أجهزة مختلفة</p>
          </div>
          <button 
            onClick={simulateCloudSync}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Cloud className="w-4 h-4" />
            <span>مزامنة الآن</span>
          </button>
        </div>

        {/* Local export / import */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
          {/* Backup */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">إنشاء نسخة احتياطية محلية</p>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">تحميل ملف نسخة احتياطية JSON يحتوي على أهدافك وإحصائياتك لحفظه بمكان آمن.</p>
            <button 
              onClick={onBackupData}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تصدير النسخة الاحتياطية</span>
            </button>
          </div>

          {/* Restore */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">استيراد واستعادة البيانات</p>
            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">قم برفع ملف النسخة الاحتياطية JSON الخاص بك لاسترجاع جميع أهدافك ومستواك فوراً.</p>
            <input 
              type="file" 
              id="restore-file-input" 
              accept=".json" 
              onChange={onRestoreData} 
              className="hidden" 
            />
            <button 
              onClick={triggerFileInput}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>رفع واستعادة البيانات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
