import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { AlertTriangle, Home } from 'lucide-react'

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/login", requiresVerification = false }) {
    const { isAuthenticated, user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        // Redirect to appropriate login based on intended route
        return <Navigate to={redirectTo} replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Jika user teregistrasi tapi role-nya tidak diizinkan masuk sini
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center"
                >
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Maaf, role <span className="font-semibold">{user?.role}</span> tidak memiliki izin untuk mengakses halaman ini.
                    </p>
                    <Navigate to="/" replace />
                </motion.div>
            </div>
        )
    }

    if (requiresVerification && user?.is_verified === false) {
        return <Navigate to="/pending" replace />
    }

    return children ? children : <Outlet />
}
