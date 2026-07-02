/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Users, FolderHeart, BellRing, BarChart3, Plus, Trash2, Check, AlertCircle, Sparkles
} from 'lucide-react';
import { Category } from '../types';
import { categoriesMeta } from '../data/defaultData';

export default function AdminPanel() {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'categories' | 'broadcast' | 'stats'>('users');

  // Simulated Admin data
  const [mockUsers, setMockUsers] = useState([
    { id: 'usr-1', name: 'أحمد محمود', email: 'ahmed@example.com', level: 'خبير الإنجاز', points: 4890, status: 'نشط' },
    { id: 'usr-2', name: 'سارة العلي', email: 'sara@example.com', level: 'ملتزم', points: 1240, status: 'نشط' },
    { id: 'usr-3', name: 'خالد عمر', email: 'khaled@example.com', level: 'نشيط', points: 420, status: 'نشط' },
    { id: 'usr-4', name: 'فاطمة حسن', email: 'fatima@example.com', level: 'مبتدئ', points: 80, status: 'خامل' },
  ]);

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('عام');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastMessage('');
    }, 3000);
  };

  const handleToggleUserStatus = (id: string) => {
    setMockUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'نشط' ? 'محظور' : 'نشط' } : u));
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center gap-2.5 bg-slate-100/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">لوحة التحكم والإدارة (Admin Space)</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">إعدادات الصلاحيات والمراقبة للمسؤولين فقط</p>
        </div>
      </div>

      {/* Selector pills */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
        <button 
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
            activeAdminSubTab === 'users' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'
          }`}
        >
          إدارة المستخدمين ({mockUsers.length})
        </button>

        <button 
          onClick={() => setActiveAdminSubTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
            activeAdminSubTab === 'broadcast' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'
          }`}
        >
          إرسال إشعار جماعي
        </button>

        <button 
          onClick={() => setActiveAdminSubTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
            activeAdminSubTab === 'stats' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'
          }`}
        >
          مراقبة الإحصائيات العامة
        </button>
      </div>

      {/* Sub tabs displays */}

      {/* 1. Users list */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-900 text-slate-500">
              <tr>
                <th className="p-4 font-sans">اسم المستخدم</th>
                <th className="p-4 font-sans">البريد الإلكتروني</th>
                <th className="p-4 font-sans">المستوى</th>
                <th className="p-4 font-sans">النقاط</th>
                <th className="p-4 font-sans">الحالة</th>
                <th className="p-4 font-sans">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {mockUsers.map(user => (
                <tr key={user.id} className="text-slate-700 dark:text-slate-300">
                  <td className="p-4 font-sans font-semibold">{user.name}</td>
                  <td className="p-4 font-mono">{user.email}</td>
                  <td className="p-4 font-sans">{user.level}</td>
                  <td className="p-4 font-mono font-bold">{user.points}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${user.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans border transition-all ${
                        user.status === 'نشط' ? 'border-rose-200 text-rose-500 hover:bg-rose-50' : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'نشط' ? 'حظر الحساب' : 'تفعيل'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Broadcast panel */}
      {activeAdminSubTab === 'broadcast' && (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg mx-auto space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-900">
            <BellRing className="w-5 h-5 text-rose-500" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">بث إشعارات جماعية لكافة المستخدمين</h4>
          </div>

          {broadcastSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>تم بث الإشعار بنجاح لجميع المستخدمين المسجلين!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">تصنيف الإشعار</label>
              <select 
                value={broadcastCategory}
                onChange={(e) => setBroadcastCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              >
                <option value="عام">تحديث عام بالنظام</option>
                <option value="تحفيز">إشعار تشجيعي وأقوال</option>
                <option value="صيانة">تنبيه صيانة ومزامنة</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">محتوى رسالة الإشعار البثية</label>
              <textarea 
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="اكتب الإشعار هنا..."
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs h-28 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-colors"
            >
              بث الإشعار الجماعي الآن
            </button>
          </form>
        </div>
      )}

      {/* 3. Overall Stats */}
      {activeAdminSubTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
            <span className="text-xs text-slate-400 font-sans">إجمالي مستخدمي التطبيق</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">24,890</p>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.2 rounded-full font-sans">+12% هذا الأسبوع</span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
            <span className="text-xs text-slate-400 font-sans">الأهداف السنوية المنشأة كلياً</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">154,230</p>
            <span className="text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.2 rounded-full font-sans">بمتوسط 6 أهداف/مستخدم</span>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
            <span className="text-xs text-slate-400 font-sans">معدل الاحتفاظ بالالتزام</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">82.5%</p>
            <span className="text-[10px] text-purple-500 bg-purple-500/10 px-2 py-0.2 rounded-full font-sans">نسبة ممتازة للالتزام</span>
          </div>
        </div>
      )}
    </div>
  );
}
