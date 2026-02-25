import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'masjid2026',
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('mrj_auth')
        return saved ? JSON.parse(saved) : null
    })

    useEffect(() => {
        if (user) {
            localStorage.setItem('mrj_auth', JSON.stringify(user))
        } else {
            localStorage.removeItem('mrj_auth')
        }
    }, [user])

    const login = (username, password) => {
        if (
            username === ADMIN_CREDENTIALS.username &&
            password === ADMIN_CREDENTIALS.password
        ) {
            setUser({ username, role: 'admin' })
            return { success: true }
        }
        return { success: false, error: 'Username atau password salah' }
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
