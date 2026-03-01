import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Supabase Real-time Auth State
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchUserProfile(session?.user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserProfile(session?.user)
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserProfile = async (authUser) => {
        if (!authUser) {
            setUser(null)
            setIsLoading(false)
            return
        }

        try {
            // Cek tabel profiles untuk role dan data verifikasi
            const { data, error } = await supabase.from('users')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (error) {
                console.error("Profile not found in db, fallback to anon:", error)
            }

            // Gabungkan data dari auth.users dengan data dari public.profiles
            setUser({
                ...authUser,
                ...data,
                // Pastikan role dan is_verified punya nilai default jika data tidak ditemukan (misal trigger gagal)
                role: data?.role || 'jamaah',
                is_verified: !!data?.is_verified
            })
        } catch (error) {
            console.error('Error fetching user profile:', error)
            // Fallback basic user struct
            setUser({ ...authUser, role: 'jamaah', is_verified: false })
        } finally {
            setIsLoading(false)
        }
    }

    // --- ACTUAL EXPOSED FUNCS ---
    const signupJamaah = async (email, password, fullName, address) => {
        try {
            // 1. Register with auth and pass metadata
            // Data metadata ini akan memicu Trigger di database untuk mengisi tabel profiles
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        address: address
                    }
                }
            })
            if (authError) return { success: false, error: authError.message }

            if (!authData.user) {
                return { success: false, error: 'Pendaftaran gagal, silakan coba lagi.' }
            }

            // (Kode manual insert ke profiles dihapus karena sering gagal jika ada RLS atau Email Confirmation menyala.
            // Sebagai gantinya, pastikan Anda menjalankan Trigger SQL tambahan yang saya berikan).

            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        }
    }

    const loginJamaah = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) return { success: false, error: error.message }
        return { success: true }
    }

    const loginAdmin = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) return { success: false, error: error.message }

        // Mencegah login jika bukan admin
        const { data: profile } = await supabase.from('users').select('role').eq('id', data.user.id).single()
        if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
            await supabase.auth.signOut()
            return { success: false, error: 'Akses Ditolak: Memerlukan privilege Admin.' }
        }

        return { success: true }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            signupJamaah,
            loginJamaah,
            loginAdmin,
            logout
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
