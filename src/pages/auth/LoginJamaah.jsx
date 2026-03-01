import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, AlertCircle, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginJamaah() {
    const { loginJamaah, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) {
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            return <Navigate to="/admin" replace />
        }
        return <Navigate to="/" replace />
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Email dan Password wajib diisi')
            return
        }

        setError('')
        setLoading(true)

        const result = await loginJamaah(email, password)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.error || 'Gagal masuk. Periksa kembali email dan password Anda.')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 islamic-pattern">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
                    <span className="text-primary font-bold text-4xl">م</span>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sistem Jamaah
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Masjid Raudhatul Jannah
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Masuk</h3>
                            <p className="text-sm text-gray-500 mt-1">Gunakan Email dan Password Anda</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-2 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email || !password}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Masuk
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link to="/register" className="font-medium text-primary hover:text-primary-dark hover:underline">
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
