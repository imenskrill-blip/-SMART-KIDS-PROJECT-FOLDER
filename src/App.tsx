import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { Simulator } from './components/Simulator'
import { Courses } from './components/Courses'
import { Leaderboard } from './components/Leaderboard'
import { LearningPath } from './components/LearningPath'
import { Competitions } from './components/Competitions'
import { ParentDashboard } from './components/ParentDashboard'
import { AdminPanel } from './components/AdminPanel'
import { Home, BookOpen, Bot, Trophy, Map, Users, Settings, Menu, X, Sun, Moon, LogOut, User, Bell } from 'lucide-react'

function AppContent() {
  const { user, profile, loading, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [page, setPage] = useState('dashboard')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => { document.documentElement.classList.toggle('dark', isDark) }, [isDark])

  const nav = [
    { key: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { key: 'courses', label: 'الدورات', icon: BookOpen },
    { key: 'learning-path', label: 'مسارات التعلم', icon: Map },
    { key: 'simulator', label: 'المحاكي', icon: Bot },
    { key: 'competitions', label: 'المسابقات', icon: Trophy },
    { key: 'leaderboard', label: 'المتصدرين', icon: Trophy },
    ...(profile?.role === 'parent' ? [{ key: 'parent', label: 'الأطفال', icon: Users }] : []),
    ...(profile?.role === 'admin' ? [{ key: 'admin', label: 'الإدارة', icon: Settings }] : []),
  ]

  const renderPage = () => {
    const pages: Record<string, JSX.Element> = { dashboard: <Dashboard />, courses: <Courses />, 'learning-path': <LearningPath />, simulator: <Simulator />, competitions: <Competitions />, leaderboard: <Leaderboard />, parent: <ParentDashboard />, admin: <AdminPanel /> }
    return pages[page] || <Dashboard />
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" /></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <aside className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transition-all ${sidebarOpen ? 'w-64' : 'w-20'} ${mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && <div className="flex items-center gap-2"><Bot className="w-8 h-8 text-blue-500" /><span className="font-bold">ركن الأطفال</span></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Menu className="w-5 h-5 text-gray-500" /></button>
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <nav className="p-4 space-y-2">{nav.map(n => { const Icon = n.icon; return <button key={n.key} onClick={() => { setPage(n.key); setMobileOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${page === n.key ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Icon className="w-5 h-5" />{sidebarOpen && <span>{n.label}</span>}</button> })}</nav>
        {user && <div className="absolute bottom-0 right-0 left-0 p-4 border-t"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{profile?.display_name?.charAt(0) || 'U'}</div>{sidebarOpen && <div><p className="font-medium text-sm">{profile?.display_name}</p><p className="text-xs text-gray-500">{profile?.role === 'admin' ? 'مسؤول' : profile?.role === 'parent' ? 'ولي أمر' : 'متعلم'}</p></div>}</div><button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><LogOut className="w-5 h-5" />{sidebarOpen && <span>خروج</span>}</button></div>}
      </aside>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      <header className="fixed top-0 left-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-20 right-0"><div className="h-full px-4 flex items-center justify-between"><button onClick={() => setMobileOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5 text-gray-600" /></button><div className="flex items-center gap-3"><button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">{isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}</button>{!user ? <button onClick={() => setShowAuth(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><User className="w-4 h-4" /><span>تسجيل الدخول</span></button> : <button className="p-2 hover:bg-gray-100 rounded-lg relative"><Bell className="w-5 h-5 text-gray-600" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>}</div></div></header>
      <main className="pt-20 min-h-screen"><div className="p-4 md:p-6 max-w-7xl mx-auto">{renderPage()}</div></main>
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default function App() { return <AuthProvider><AppContent /></AuthProvider> }
