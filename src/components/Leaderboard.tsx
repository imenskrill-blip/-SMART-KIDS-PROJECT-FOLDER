import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react'

export function Leaderboard() {
  const [entries, setEntries] = useState<{ id: string; points: number; rank_position: number; profiles: { display_name: string; current_level: number } }[]>([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => { const { data } = await supabase.from('leaderboard_entries').select('id, points, rank_position').eq('period', period).order('rank_position').limit(20); setEntries((data || []).map(e => ({ ...e, profiles: { display_name: 'مستخدم', current_level: 1 } }))); setLoading(false) })() }, [period])

  const periods = [{ key: 'daily', label: 'يومي' }, { key: 'weekly', label: 'أسبوعي' }, { key: 'monthly', label: 'شهري' }, { key: 'all', label: 'الكل' }]
  const rankIcon = (r: number) => r === 1 ? <Crown className="w-6 h-6 text-yellow-500" /> : r === 2 ? <Medal className="w-6 h-6 text-gray-400" /> : r === 3 ? <Medal className="w-6 h-6 text-amber-600" /> : <span className="w-6 h-6 flex items-center justify-center text-gray-500">{r}</span>

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-purple-600 to-purple-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Trophy className="w-8 h-8" />لوحة المتصدرين</h1>
        <p className="text-purple-100">تنافس مع المتعلمين</p>
      </div>
      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">{periods.map(p => <button key={p.key} onClick={() => setPeriod(p.key)} className={`flex-1 py-2 px-4 rounded-lg font-medium ${period === p.key ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p.label}</button>)}</div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {entries.length === 0 ? <div className="p-8 text-center text-gray-500"><Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>لا توجد بيانات</p></div> :
          <div className="divide-y divide-gray-100 dark:divide-gray-700">{entries.map(e => (
            <div key={e.id} className={`flex items-center justify-between p-4 ${e.rank_position <= 3 ? 'bg-gradient-to-l from-yellow-400/10 to-yellow-500/10' : ''} border transition`}>
              <div className="flex items-center gap-4"><div className="flex items-center justify-center w-10">{rankIcon(e.rank_position)}</div><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{e.profiles.display_name.charAt(0)}</div><div><p className="font-medium">{e.profiles.display_name}</p><p className="text-sm text-gray-500">المستوى {e.profiles.current_level}</p></div></div>
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /><span className="font-bold text-lg">{e.points.toLocaleString()}</span><span className="text-sm text-gray-500">نقطة</span></div>
            </div>
          ))}</div>}
      </div>
    </div>
  )
}
