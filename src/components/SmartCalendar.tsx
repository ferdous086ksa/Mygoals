/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle, Circle, Trash2, Move, AlertCircle
} from 'lucide-react';
import { DailyTask, Category, Priority } from '../types';
import { categoriesMeta, prioritiesMeta } from '../data/defaultData';

interface SmartCalendarProps {
  dailyTasks: DailyTask[];
  onAddTask: (title: string, priority: Priority, category: Category, date: string, weeklyGoalId?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newDate: string) => void;
}

export default function SmartCalendar({
  dailyTasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask
}: SmartCalendarProps) {
  // We will display July 2026 as the target month
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed, so 6 is July

  const [selectedDate, setSelectedDate] = useState<string>('2026-07-02');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>('self_dev');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');

  const monthNamesArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysOfWeekArabic = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Format date string from day number
  const formatDateString = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const handleAddTaskOnSelectedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, newTaskPriority, newTaskCategory, selectedDate);
    setNewTaskTitle('');
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMoveTask(taskId, targetDate);
    }
  };

  // Generate blank cells and day cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ isBlank: true, day: 0, dateStr: '' });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ isBlank: false, day, dateStr: formatDateString(day) });
  }

  // Tasks for the selected date
  const selectedDateTasks = dailyTasks.filter(task => task.date === selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid card */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">التقويم الذكي وتوزيع المهام</h3>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1">
            <button onClick={prevMonth} className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans px-2 min-w-[90px] text-center">
              {monthNamesArabic[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Drag tips banner */}
        <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[10px] text-indigo-500 font-sans flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5" />
          <span>تلميح ذكي: يمكنك سحب أي مهمة من الجدول الجانبي وإفلاتها على أي خلية في التقويم لتغيير تاريخ إنجازها!</span>
        </div>

        {/* Days of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeekArabic.map(day => (
            <div key={day} className="text-[10px] font-bold text-slate-400 font-sans py-1">{day}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            if (cell.isBlank) {
              return <div key={`blank-${idx}`} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-lg"></div>;
            }

            const isSelected = cell.dateStr === selectedDate;
            const dayTasks = dailyTasks.filter(t => t.date === cell.dateStr);
            const totalTasks = dayTasks.length;
            const completedTasks = dayTasks.filter(t => t.completed).length;
            const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;

            // Highlight streaks - consecutive fully completed days get a nice border or glowing amber ring!
            return (
              <div 
                key={`day-${cell.day}`}
                onClick={() => setSelectedDate(cell.dateStr)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, cell.dateStr)}
                className={`aspect-square p-1.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20' 
                    : isAllCompleted 
                      ? 'border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/15'
                      : totalTasks > 0
                        ? 'border-slate-200 dark:border-slate-800 bg-amber-500/5 hover:border-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cell.day}
                  </span>
                  
                  {isAllCompleted && (
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  )}
                </div>

                {totalTasks > 0 && (
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-500">
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Tasks Panel for selected date */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-emerald-500 font-sans">جدول المهام المخصصة</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">
              يوم {selectedDate.split('-')[2]} من {monthNamesArabic[Number(selectedDate.split('-')[1]) - 1]} {selectedDate.split('-')[0]}
            </h4>
          </div>

          {/* Task Addition Form for selected date */}
          <form onSubmit={handleAddTaskOnSelectedDate} className="space-y-2 pb-2 border-b border-slate-100 dark:border-slate-900">
            <input 
              type="text" 
              placeholder="إضافة مهمة لهذا اليوم..."
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            
            <div className="flex gap-2.5">
              <select 
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as Category)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-700 dark:text-slate-300"
              >
                {Object.entries(categoriesMeta).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>

              <select 
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-700 dark:text-slate-300"
              >
                {Object.entries(prioritiesMeta).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>

              <button 
                type="submit"
                className="px-3 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 flex items-center justify-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          </form>

          {/* List of Tasks for selected date */}
          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-sans">
                لا توجد مهام مجدولة لهذا التاريخ.
              </div>
            ) : (
              selectedDateTasks.map(task => {
                const cat = categoriesMeta[task.category];
                return (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-grab active:cursor-grabbing bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800 transition-all ${task.completed ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className="text-slate-400 hover:text-emerald-500 flex-shrink-0"
                      >
                        {task.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4" />}
                      </button>
                      
                      <span className={`text-xs font-sans truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`text-[8px] px-1.5 py-0.2 rounded-full border ${cat?.bgClass}`}>
                        {cat?.label}
                      </span>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Legend block */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">دليل الألوان</span>
          <div className="flex flex-wrap gap-2 text-[9px] text-slate-500 dark:text-slate-400 font-sans">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> مكتمل بالكامل</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> يحتوي مهام نشطة</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 border border-slate-300 dark:border-slate-700 rounded-full"></span> فارغ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
