 import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Competition } from '../types/database'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, Calendar, Users, Clock, Award, X, Play } from 'lucide-react'

export function Competitions() {
  const { profile, user } = useAuth()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Competition | null>(null)

  useEffect(() => { (async () => { const { data } = await supabase.from('competitions').select('*').order('start_date'); if (data) setCompetitions(data); setLoading(false) })() }, [])

  const statusColor = (s: string) => s === 'active' ? 'bg-green-100 text-green-700' : s === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
  const statusText = (s: string) => s === 'active' ? 'جارية' : s === 'upcoming' ? 'قادمة' : 'منتهية'
  const diffText = (d: string) => d === 'beginner' ? 'مبتدئ' : d === 'intermediate' ? 'متوسط' : 'متقدم'
  const filtered = competitions.filter(c => filter === 'all' || c.status === filter)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Trophy className="w-8 h-8" />المسابقات</h1>
        <p className="text-red-100">شارك واربح الجوائز</p>
      </div>
      <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">{['all', 'active', 'upcoming', 'completed'].map(f => <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 px-4 rounded-lg font-medium ${filter === f ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{f === 'all' ? 'الكل' : f === 'active' ? 'جارية' : f === 'upcoming' ? 'قادمة' : 'منتهية'}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelected(c)} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md">
            <div className="h-32 bg-gradient-to-l from-red-500 to-orange-500 relative flex items-center justify-center"><span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded ${statusColor(c.status)}`}>{statusText(c.status)}</span><Trophy className="w-16 h-16 text-white/30" /></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{c.title_ar}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description_ar}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4"><div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{new Date(c.start_date).toLocaleDateString('ar')}</span></div><div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{c.max_participants || '∞'}</span></div></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" /><span className="font-bold text-yellow-600">{c.prize_points} نقطة</span></div><span className="text-sm text-gray-500">{diffText(c.difficulty)}</span></div>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-l from-red-500 to-orange-500 relative flex items-center justify-center"><button onClick={() => setSelected(null)} className="absolute top-3 left-3 p-2 bg-black/20 rounded-lg text-white"><X className="w-5 h-5" /></button><Trophy className="w-20 h-20 text-white/30" /></div>
            <div className="p-6">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColor(selected.status)}`}>{statusText(selected.status)}</span>
              <h2 className="text-xl font-bold mt-2 mb-2">{selected.title_ar}</h2><p className="text-gray-600 mb-4">{selected.description_ar}</p>
              <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center gap-2 text-gray-500 mb-1"><Calendar className="w-4 h-4" /><span className="text-sm">البداية</span></div><p className="font-medium">{new Date(selected.start_date).toLocaleDateString('ar')}</p></div><div className="bg-gray-50 rounded-lg p-3"><div className="flex items-center gap-2 text-gray-500 mb-1"><Clock className="w-4 h-4" /><span className="text-sm">النهاية</span></div><p className="font-medium">{new Date(selected.end_date).toLocaleDateString('ar')}</p></div></div>
              <div className="bg-yellow-50 rounded-lg p-4 mb-6 flex items-center gap-3"><Award className="w-8 h-8 text-yellow-500" /><div><p className="text-sm text-gray-600">الجائزة</p><p className="font-bold text-yellow-600">{selected.prize_points} نقطة</p></div></div>
              {selected.status === 'active' && <button disabled={!profile || !user} className="w-full py-3 bg-gradient-to-l from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 flex items-center justify-center gap-2 disabled:opacity-50"><Play className="w-5 h-5" />انضم</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

  )
}
