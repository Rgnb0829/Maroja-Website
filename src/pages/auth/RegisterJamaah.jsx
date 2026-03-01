import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, MapPin, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterJamaah() {
    const { signupJamaah, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        fullName: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    if (isAuthenticated && !success) {
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            return <Navigate to="/admin" replace />
        }
        return <Navigate to="/" replace />
    }

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        if (!form.email || !form.password || !form.fullName || !form.address) {
            setError('Semua field wajib diisi')
            return
        }

        if (form.password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        if (form.password !== form.confirmPassword) {
            setError('Password dan Konfirmasi Password tidak cocok')
            return
        }

        setError('')
        setLoading(true)

        const result = await signupJamaah(form.email, form.password, form.fullName, form.address)
        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Gagal mendaftar. Silakan coba lagi nanti.')
        }

        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 islamic-pattern">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100"
                >
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 my-6 text-left">
                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-500 mt-0.5 shrink-0" size={24} />
                            <div>
                                <h3 className="font-semibold text-blue-900 text-sm mb-1">Cek Inbox Email Anda!</h3>
                                <p className="text-blue-800 text-sm leading-relaxed">
                                    Kami telah mengirimkan tautan (link) verifikasi ke email Anda. <strong>Silakan buka kotak masuk email Anda dan klik link tersebut sebelum melakukan proses Login.</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm">
                        Setelah email dikonfirmasi, akun Anda akan <span className="font-semibold text-yellow-600">berstatus Pending</span> dan menunggu verifikasi Takmir Masjid untuk fitur tambahan.
                    </p>
                    <Link
                        to="/login"
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors"
                    >
                        Lanjut Login
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 islamic-pattern">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
                    <span className="text-primary font-bold text-4xl">م</span>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Daftar Akun
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
                            <h3 className="text-lg font-bold text-gray-900">Buat Akun Baru</h3>
                            <p className="text-sm text-gray-500 mt-1">Lengkapi data diri Anda sebagai warga</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                        placeholder="Nama Sesuai KTP"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Alamat (Blok & No Rumah)
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                        placeholder="Contoh: Blok A No. 12"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1 relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                            placeholder="Min. 6 karakter"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Ulangi Password
                                    </label>
                                    <div className="mt-1 relative rounded-xl shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 transition-colors"
                                            placeholder="Ulangi password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Daftar
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link to="/login" className="font-medium text-primary hover:text-primary-dark hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
