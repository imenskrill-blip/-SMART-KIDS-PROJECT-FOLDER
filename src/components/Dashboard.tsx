import { useAuth } from '../contexts/AuthContext'
import { Award, Flame, Star, TrendingUp, BookOpen, Bot, Zap } from 'lucide-react'

export function Dashboard() {
  const { profile } = useAuth()
  const weeklyActivity = [65, 80, 45, 90, 70, 55, 85]
  const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  const progress = profile?.points || 0, maxProgress = 500
  const progressPercent = Math.min((progress / maxProgress) * 100, 100)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً، {profile?.display_name || 'المستخدم'}!</h1>
        <p className="text-blue-100">استمر في التعلم واكسب النقاط</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3"><div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><Star className="w-6 h-6 text-yellow-500" /></div><div><p className="text-sm text-gray-500">النقاط</p><p className="text-2xl font-bold">{profile?.points || 0}</p></div></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><Flame className="w-6 h-6 text-orange-500" /></div><div><p className="text-sm text-gray-500">التتابع</p><p className="text-2xl font-bold">{profile?.streak_days || 0} يوم</p></div></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-green-500" /></div><div><p className="text-sm text-gray-500">الدورات</p><p className="text-2xl font-bold">{profile?.completed_courses || 0}</p></div></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-purple-500" /></div><div><p className="text-sm text-gray-500">المستوى</p><p className="text-2xl font-bold">{profile?.current_level || 1}</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">تقدم المستوى</h2>
          <div className="relative pt-4"><div className="flex justify-between mb-2 text-sm text-gray-500"><span>المستوى {profile?.current_level || 1}</span><span>المستوى {(profile?.current_level || 1) + 1}</span></div><div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} /></div><div className="absolute top-0 inset-x-0 flex justify-center"><div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg"><Zap className="w-7 h-7 text-blue-500" /></div></div></div>
          <p className="text-center text-sm text-gray-500 mt-4">{Math.max(0, maxProgress - progress)} نقطة للانتقال</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">النشاط الأسبوعي</h2>
          <div className="flex items-end justify-between h-32 gap-2">{weeklyActivity.map((v, i) => <div key={i} className="flex flex-col items-center gap-2 flex-1"><div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${v}%` }} /><span className="text-xs text-gray-500">{days[i]}</span></div>)}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">الشارات</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-yellow-50 rounded-xl p-3"><Award className="w-8 h-8 text-yellow-500" /><div><p className="font-medium">البداية</p><p className="text-sm text-gray-500">أكمل أول درس</p></div></div>
          <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3"><Bot className="w-8 h-8 text-blue-500" /><div><p className="font-medium">مستكشف الكود</p><p className="text-sm text-gray-500">اكتب أول برنامج</p></div></div>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-3 opacity-50"><Star className="w-8 h-8 text-gray-400" /><div><p className="font-medium text-gray-500">سيد التتابع</p><p className="text-sm text-gray-400">تتابع 7 أيام</p></div></div>
        </div>
      </div>
    </div>
  )
}

  )
}
