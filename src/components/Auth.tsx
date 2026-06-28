import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { X, Mail, Lock, User } from 'lucide-react'

export function Auth({ onClose }: { onClose: () => void }) {
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState('')
  const [role, setRole] = useState<'child' | 'parent'>('child'), [age, setAge] = useState(10)
  const [loading, setLoading] = useState(false), [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      if (isSignUp) { const { error: err } = await signUp(email, password, name, role, age); if (err) throw err }
      else { const { error: err } = await signIn(email, password); if (err) throw err }
      onClose()
    } catch (err) { setError(err instanceof Error ? err.message : 'خطأ') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative" dir="rtl">
        <button onClick={onClose} className="absolute top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
        <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (<>
            <div><label className="block text-sm font-medium mb-1">الاسم</label><div className="relative"><User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg" required /></div></div>
            <div><label className="block text-sm font-medium mb-1">نوع الحساب</label><div className="flex gap-4"><button type="button" onClick={() => setRole('child')} className={`flex-1 py-2 rounded-lg border ${role === 'child' ? 'border-blue-500 bg-blue-50 text-blue-600' : ''}`}>طفل</button><button type="button" onClick={() => setRole('parent')} className={`flex-1 py-2 rounded-lg border ${role === 'parent' ? 'border-blue-500 bg-blue-50 text-blue-600' : ''}`}>ولي أمر</button></div></div>
            {role === 'child' && <div><label className="block text-sm font-medium mb-1">العمر</label><input type="number" value={age} onChange={e => setAge(parseInt(e.target.value))} min={7} max={17} className="w-full px-4 py-2 border rounded-lg" /></div>}
          </>)}
          <div><label className="block text-sm font-medium mb-1">البريد الإلكتروني</label><div className="relative"><Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg" required /></div></div>
          <div><label className="block text-sm font-medium mb-1">كلمة المرور</label><div className="relative"><Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-10 pl-4 py-2 border rounded-lg" required minLength={6} /></div></div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'جاري...' : isSignUp ? 'إنشاء' : 'دخول'}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">{isSignUp ? 'لديك حساب؟' : 'ليس لديك حساب؟'}<button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 mr-1">{isSignUp ? 'سجل دخول' : 'أنشئ حساب'}</button></p>
      </div>
    </div>
  )
}
