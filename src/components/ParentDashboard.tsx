import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Users, TrendingUp, BookOpen, Award, Eye, Mail, UserPlus } from 'lucide-react'

export function ParentDashboard() {
  const { profile, user } = useAuth()
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user && profile?.role === 'parent') fetchChildren() }, [user, profile])
  async function fetchChildren() { const { data: rel } = await supabase.from('parent_children').select('child_id').eq('parent_id', user?.id); if (rel?.length) { const { data: kids } = await supabase.from('profiles').select('*').in('user_id', rel.map(r => r.child_id)); if (kids) setChildren(kids) } setLoading(false) }

  if (profile?.role !== 'parent') return <div className="space-y-6" dir="rtl"><div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center"><Users className="w-12 h-12 text-yellow-500 mx-auto mb-3" /><h2 className="text-lg font-bold mb-2">لوحة ولي الأمر</h2><p className="text-gray-600">متاحة فقط لولياء الأمور</p></div></div>
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="w-8 h-8" />لوحة ولي الأمر</h1>
        <p className="text-blue-100">تابع تقدم أطفالك</p>
      </div>
      {children.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">لا يوجد أطفال</h3>
          <p className="text-gray-500 mb-4">يمكنك ربط حساب طفلك</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"><Mail className="w-4 h-4" />دعوة طفل</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer">
              <div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">{c.display_name?.charAt(0) || '?'}</div><div><h3 className="font-bold">{c.display_name}</h3><p className="text-sm text-gray-500">{c.age ? `${c.age} سنة` : ''}</p></div></div><Eye className="w-5 h-5 text-gray-400" /></div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center"><TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" /><p className="text-lg font-bold">{c.points || 0}</p><p className="text-xs text-gray-500">نقطة</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><BookOpen className="w-5 h-5 text-green-500 mx-auto mb-1" /><p className="text-lg font-bold">{c.completed_courses || 0}</p><p className="text-xs text-gray-500">دورة</p></div>
                <div className="bg-orange-50 rounded-lg p-3 text-center"><Award className="w-5 h-5 text-orange-500 mx-auto mb-1" /><p className="text-lg font-bold">{c.streak_days || 0}</p><p className="text-xs text-gray-500">يوم</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
