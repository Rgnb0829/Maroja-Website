import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function PendingVerification() {
    const { isAuthenticated, user, logout } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.is_verified) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 islamic-pattern">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100"
            >
                <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={40} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Mohon Tunggu, {user?.full_name?.split(' ')[0] || 'Jamaah'}!
                </h1>

                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                    Sistem kami mendeteksi Anda baru saja mendaftar. Akses ke menu jamaah (seperti Laporan Keuangan) sedang menunggu verifikasi oleh Takmir Masjid Raudhatul Jannah untuk memastikan Anda adalah warga perumahan asli.
                </p>

                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm mb-8 text-left">
                    <p className="font-semibold mb-1">Informasi:</p>
                    <p>Verifikasi biasanya membutuhkan waktu 1x24 jam. Jika dalam 24 jam belum diverifikasi, silakan hubungi pengurus DKM atau Takmir via WhatsApp.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        to="/"
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Beranda
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 text-gray-500 hover:text-red-500 transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} />
                        Keluar / Ganti Akun
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
