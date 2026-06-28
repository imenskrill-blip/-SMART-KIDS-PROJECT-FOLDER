import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Users, BookOpen, Award, Trophy, Settings, BarChart3, Plus } from 'lucide-react'

export function AdminPanel() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, courses: 0, competitions: 0, badges: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile?.role === 'admin') fetchStats() }, [profile])
  async function fetchStats() { const [u, c, cm, b] = await Promise.all([supabase.from('profiles').select('*', { count: 'exact', head: true }), supabase.from('courses').select('*', { count: 'exact', head: true }), supabase.from('competitions').select('*', { count: 'exact', head: true }), supabase.from('badges').select('*', { count: 'exact', head: true })]); setStats({ users: u.count || 0, courses: c.count || 0, competitions: cm.count || 0, badges: b.count || 0 }); setLoading(false) }

  if (profile?.role !== 'admin') return <div className="space-y-6" dir="rtl"><div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"><Settings className="w-12 h-12 text-red-500 mx-auto mb-3" /><h2 className="text-lg font-bold mb-2">لوحة الإدارة</h2><p className="text-gray-600">متاحة فقط للمسؤولين</p></div></div>
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  const tabs = [{ key: 'overview', label: 'نظرة عامة', icon: BarChart3 }, { key: 'users', label: 'المستخدمين', icon: Users }, { key: 'courses', label: 'الدورات', icon: BookOpen }, { key: 'badges', label: 'الشارات', icon: Award }, { key: 'competitions', label: 'المسابقات', icon: Trophy }]
  const tabIcon = (k: string) => ({ users: Users, courses: BookOpen, badges: Award, competitions: Trophy }[k] || Users)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-gray-800 to-gray-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Settings className="w-8 h-8" />لوحة الإدارة</h1>
        <p className="text-gray-300">إدارة وإشراف</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">{tabs.map(t => { const Icon = t.icon; return <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === t.key ? 'bg-gray-800 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'}`}><Icon className="w-4 h-4" />{t.label}</button> })}</div>
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{ label: 'مستخدم', value: stats.users, color: 'blue', icon: Users }, { label: 'دورة', value: stats.courses, color: 'green', icon: BookOpen }, { label: 'شارة', value: stats.badges, color: 'purple', icon: Award }, { label: 'مسابقة', value: stats.competitions, color: 'red', icon: Trophy }].map(s => { const Icon = s.icon; return (<div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"><div className={`w-12 h-12 bg-${s.color}-100 rounded-xl flex items-center justify-center mb-4`}><Icon className={`w-6 h-6 text-${s.color}-500`} /></div><p className="text-3xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>) })}
        </div>
      )}
      {activeTab !== 'overview' && (() => { const Icon = tabIcon(activeTab); return (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center"><Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">إدارة {tabs.find(t => t.key === activeTab)?.label}</p><button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 mx-auto"><Plus className="w-4 h-4" />إضافة</button></div>) })()}
    </div>
  )
}
