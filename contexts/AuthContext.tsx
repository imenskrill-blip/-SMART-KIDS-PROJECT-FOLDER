import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile } from '../types/database'

interface Ctx { user: User | null; session: Session | null; profile: Profile | null; loading: boolean; signUp: (e: string, p: string, n: string, r: 'child' | 'parent', a?: number) => Promise<{ error: Error | null }>; signIn: (e: string, p: string) => Promise<{ error: Error | null }>; signOut: () => Promise<void> }
const C = createContext<Ctx | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => { setSession(s); setUser(s?.user ?? null); if (s?.user) fetchP(s.user.id); else setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => { setSession(s); setUser(s?.user ?? null); if (s?.user) fetchP(s.user.id); else { setProfile(null); setLoading(false) } })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchP(uid: string) { const { data } = await supabase.from('profiles').select('*').eq('user_id', uid).maybeSingle(); if (data) setProfile(data); setLoading(false) }
  async function signUp(e: string, p: string, n: string, r: 'child' | 'parent', a?: number) { const { data, error } = await supabase.auth.signUp({ email: e, password: p }); if (error) return { error }; if (data.user) { const { error: err } = await supabase.from('profiles').insert({ user_id: data.user.id, display_name: n, role: r, age: a }); if (err) return { error: err } }; return { error: null } }
  async function signIn(e: string, p: string) { const { error } = await supabase.auth.signInWithPassword({ email: e, password: p }); return { error } }
  async function signOut() { await supabase.auth.signOut(); setUser(null); setSession(null); setProfile(null) }

  return <C.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>{children}</C.Provider>
}
export function useAuth() { const c = useContext(C); if (!c) throw new Error('useAuth'); return c }
