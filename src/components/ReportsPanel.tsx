/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Calendar, ListTodo, Award, CheckCircle2, Circle
} from 'lucide-react';
import { AnnualGoal, MonthlyGoal, WeeklyGoal, DailyTask } from '../types';

interface ReportsPanelProps {
  annualGoals: AnnualGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
}

export default function ReportsPanel({
  annualGoals,
  monthlyGoals,
  weeklyGoals,
  dailyTasks
}: ReportsPanelProps) {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  // Filter or group data based on selected type
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = dailyTasks.filter(t => t.date === todayStr);
  const completedToday = todayTasks.filter(t => t.completed).length;

  const currentMonthGoals = monthlyGoals.filter(g => g.month === 7); // July
  const currentYearGoals = annualGoals.filter(g => g.year === 2026);

  // Trigger Print layout
  const handlePrint = () => {
    window.print();
  };

  // Export CSV (Excel compatible)
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel Arabic support
    
    if (reportType === 'daily') {
      csvContent += "المهمة اليومية,التصنيف,الأولوية,الحالة,التاريخ\n";
      todayTasks.forEach(t => {
        csvContent += `"${t.title}","${t.category}","${t.priority}","${t.completed ? 'مكتمل' : 'معلق'}","${t.date}"\n`;
      });
    } else if (reportType === 'weekly') {
      csvContent += "الهدف الأسبوعي,التصنيف,المستهدف,التقدم,الحالة\n";
      weeklyGoals.forEach(g => {
        csvContent += `"${g.title}","${g.category}",${g.targetValue},${g.currentValue},"${g.status}"\n`;
      });
    } else if (reportType === 'monthly') {
      csvContent += "الهدف الشهري,التصنيف,المستهدف,التقدم,الحالة,الشهر\n";
      monthlyGoals.forEach(g => {
        csvContent += `"${g.title}","${g.category}",${g.targetValue},${g.currentValue},"${g.status}",${g.month}\n`;
      });
    } else {
      csvContent += "الهدف السنوي,التصنيف,الأولوية,المستهدف,التقدم,الحالة,السنة\n";
      annualGoals.forEach(g => {
        csvContent += `"${g.title}","${g.category}","${g.priority}",${g.targetValue},${g.currentValue},"${g.status}",${g.year}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_أهدافي_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Selector and Actions row */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span>نظام إعداد وتصدير التقارير</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">قم بتصدير تقرير تقدمك السلوكي والعملي لحفظه أو طباعته</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold font-sans text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="daily">تقرير الإنجاز اليومي</option>
            <option value="weekly">تقرير الإنجاز الأسبوعي</option>
            <option value="monthly">تقرير الإنجاز الشهري</option>
            <option value="yearly">تقرير الإنجاز السنوي</option>
          </select>

          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة كملف PDF</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير كجدول Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Card Design Preview */}
      <div id="printable-report-area" className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
        {/* Report Header */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-900 pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-500 font-sans tracking-wide">تطبيق أهدافي الذكي</span>
            <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-sans">
              {reportType === 'daily' && 'تقرير الإنتاجية والإنجاز اليومي'}
              {reportType === 'weekly' && 'تقرير متابعة الأهداف الأسبوعية'}
              {reportType === 'monthly' && 'تقرير أداء الأهداف الشهري'}
              {reportType === 'yearly' && 'التقرير والبيان السنوي المتكامل'}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">تاريخ التصدير: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-[10px] text-slate-400 font-sans uppercase">حالة الحساب</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">ملتزم بالخطة</p>
          </div>
        </div>

        {/* Report Stats Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-900 text-center">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">نوع التقرير</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
              {reportType === 'daily' && 'يومي (اليوم)'}
              {reportType === 'weekly' && 'أسبوعي (أسبوع 1)'}
              {reportType === 'monthly' && 'شهري (شهر 7)'}
              {reportType === 'yearly' && 'سنوي (عام 2026)'}
            </p>
          </div>
          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-slate-800 py-2 sm:py-0">
            <span className="text-[10px] text-slate-400 font-sans">معدل الإتمام التقريبي</span>
            <p className="text-xs font-bold text-emerald-500 font-mono">
              {reportType === 'daily' && `${todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0}%`}
              {reportType === 'weekly' && `${weeklyGoals.length > 0 ? Math.round((weeklyGoals.filter(g => g.status === 'completed').length / weeklyGoals.length) * 100) : 0}%`}
              {reportType === 'monthly' && `${monthlyGoals.length > 0 ? Math.round((monthlyGoals.filter(g => g.status === 'completed').length / monthlyGoals.length) * 100) : 0}%`}
              {reportType === 'yearly' && `${annualGoals.length > 0 ? Math.round((annualGoals.filter(g => g.status === 'completed').length / annualGoals.length) * 100) : 0}%`}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">إجمالي السجلات المسجلة</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {reportType === 'daily' && `${todayTasks.length} مهام`}
              {reportType === 'weekly' && `${weeklyGoals.length} أهداف`}
              {reportType === 'monthly' && `${monthlyGoals.length} أهداف`}
              {reportType === 'yearly' && `${annualGoals.length} أهداف`}
            </p>
          </div>
        </div>

        {/* Dynamic Report list content */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans border-b border-slate-100 dark:border-slate-900 pb-2">جدول تفاصيل السجلات:</h5>
          
          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {reportType === 'daily' && (
              todayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 font-sans">لا توجد سجلات مهام مدونة لليوم.</p>
              ) : (
                todayTasks.map(t => (
                  <div key={t.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-lg flex justify-between items-center text-xs">
                    <span className={`font-sans ${t.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{t.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-sans ${t.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                      {t.completed ? 'مكتمل' : 'معلق'}
                    </span>
                  </div>
                ))
              )
            )}

            {reportType === 'weekly' && (
              weeklyGoals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 font-sans">لا توجد سجلات أهداف أسبوعية بعد.</p>
              ) : (
                weeklyGoals.map(g => (
                  <div key={g.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-lg flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-sans">{g.title}</span>
                    <span className="font-mono text-slate-500">{g.currentValue}/{g.targetValue} {g.unit}</span>
                  </div>
                ))
              )
            )}

            {reportType === 'monthly' && (
              monthlyGoals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 font-sans">لا توجد سجلات أهداف شهرية بعد.</p>
              ) : (
                monthlyGoals.map(g => (
                  <div key={g.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-lg flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-sans">{g.title}</span>
                    <span className="font-mono text-slate-500">{g.currentValue}/{g.targetValue} {g.unit}</span>
                  </div>
                ))
              )
            )}

            {reportType === 'yearly' && (
              annualGoals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 font-sans">لا توجد سجلات أهداف سنوية بعد.</p>
              ) : (
                annualGoals.map(g => (
                  <div key={g.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-lg flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-sans">{g.title}</span>
                    <span className="font-mono text-slate-500">{g.currentValue}/{g.targetValue} {g.unit}</span>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Report Footer signatures */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px] text-slate-400 font-sans">
          <span>صُنِع بذكاء وإتقان لتحقيق أهدافي المستدامة</span>
          <span>صفحة 1 من 1</span>
        </div>
      </div>
    </div>
  );
}
