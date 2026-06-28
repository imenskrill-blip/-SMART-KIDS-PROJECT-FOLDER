import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Course } from '../types/database'
import { Clock, Users, Play, Check, CreditCard, X, Zap } from 'lucide-react'

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Course | null>(null)

  useEffect(() => { (async () => { const { data } = await supabase.from('courses').select('*').eq('is_published', true); if (data) setCourses(data); setLoading(false) })() }, [])

  const diffColor = (d: string) => d === 'beginner' ? 'bg-green-100 text-green-700' : d === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
  const diffText = (d: string) => d === 'beginner' ? 'مبتدئ' : d === 'intermediate' ? 'متوسط' : 'متقدم'

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-orange-600 to-orange-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">الدورات التعليمية</h1>
        <p className="text-orange-100">اكتشف دوراتنا المصممة للأطفال</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-40 bg-gradient-to-l from-blue-500 to-blue-600 relative flex items-center justify-center"><Play className="w-16 h-16 text-white/30" /></div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2"><span className={`px-2 py-0.5 text-xs font-medium rounded ${diffColor(c.difficulty)}`}>{diffText(c.difficulty)}</span><span className="text-xs text-gray-500">{c.min_age}-{c.max_age} سنة</span></div>
              <h3 className="font-bold text-lg mb-1">{c.title_ar}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description_ar}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4"><div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{c.total_hours} ساعة</span></div><div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{c.total_lessons} درس</span></div></div>
              <div className="flex items-center justify-between"><span className="text-xl font-bold">€{c.price}</span><button onClick={() => setSelected(c)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"><Zap className="w-4 h-4" />سجل</button></div>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-l from-blue-500 to-blue-600 relative"><button onClick={() => setSelected(null)} className="absolute top-3 left-3 p-2 bg-black/20 rounded-lg text-white"><X className="w-5 h-5" /></button></div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{selected.title_ar}</h2><p className="text-gray-600 mb-4">{selected.description_ar}</p>
              <div className="space-y-3 mb-6"><div className="flex items-center gap-2 text-green-600"><Check className="w-5 h-5" /><span>الوصول الكامل لجميع الدروس</span></div><div className="flex items-center gap-2 text-green-600"><Check className="w-5 h-5" /><span>مشروع عملي</span></div><div className="flex items-center gap-2 text-green-600"><Check className="w-5 h-5" /><span>شهادة إتمام</span></div></div>
              <div className="flex justify-between mb-6"><div><p className="text-sm text-gray-500">السعر</p><p className="text-2xl font-bold">€{selected.price}</p></div><div><p className="text-sm text-gray-500">المدة</p><p className="font-medium">{selected.total_hours} ساعات</p></div></div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2"><CreditCard className="w-5 h-5" />اشتراك</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
