 import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LearningPath as LP } from '../types/database'
import { Target, Lock, Play } from 'lucide-react'

export function LearningPath() {
  const [paths, setPaths] = useState<LP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => { const { data } = await supabase.from('learning_paths').select('*').order('level_number'); if (data) setPaths(data); setLoading(false) })() }, [])

  const getIcon = (l: number) => l === 1 ? '📖' : l === 2 ? '🤖' : l === 3 ? '🌐' : '🧠'
  const getStatus = (i: number) => i === 0 ? 'in_progress' : 'locked'
  const getBg = (s: string) => s === 'in_progress' ? 'bg-gradient-to-l from-blue-500 to-blue-400' : 'bg-gradient-to-l from-gray-400 to-gray-300'

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-teal-600 to-teal-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Target className="w-8 h-8" />مسارات التعلم</h1>
        <p className="text-teal-100">تقدم خطوة بخطوة</p>
      </div>
      <div className="relative">
        <div className="absolute right-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-8">{paths.map((p, i) => { const status = getStatus(i); return (
          <div key={p.id} className="relative">
            <div className="absolute right-6 top-6 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 z-10"><div className={`absolute inset-0 rounded-full ${status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'}`} /></div>
            <div className="mr-16">
              <div className={`${getBg(status)} rounded-2xl p-6 text-white relative overflow-hidden`}>
                {status === 'locked' && <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm"><div className="bg-white/20 rounded-full p-4"><Lock className="w-8 h-8 text-white" /></div></div>}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2"><span className="text-3xl">{getIcon(p.level_number)}</span><div><h3 className="text-xl font-bold">{p.title_ar}</h3><p className="text-sm opacity-80">{p.description_ar}</p></div></div>
                    <div className="flex items-center gap-4 mt-4"><Target className="w-4 h-4" /><span className="text-sm">المستوى {p.level_number}</span></div>
                  </div>
                  {status === 'in_progress' && <button className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 hover:bg-white/30"><Play className="w-4 h-4" /><span className="text-sm font-medium">استمر</span></button>}
                </div>
              </div>
            </div>
          </div>
        )})}</div>
      </div>
    </div>
  )
}
