import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Warta', path: '/warta' },
    { name: 'Keuangan', path: '/keuangan' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()
    const { profile } = useData()
    const { isAuthenticated, user, logout } = useAuth()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all overflow-hidden"
                            style={{ backgroundColor: profile?.logoBgColor || '#1B3C35' }}
                        >
                            {profile?.logo && profile.logo.length > 5 ? (
                                <img src={profile.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="text-white font-bold text-lg lg:text-xl">{profile?.logo || 'م'}</span>
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-primary font-bold text-sm lg:text-base leading-tight">{profile?.name || 'Masjid Raudhatul Jannah'}</h1>
                            <p className="text-primary/50 text-xs">{profile?.description?.slice(0, 30) || 'Griya Tamansari 2'}...</p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            // Sembunyikan link tertentu jika belum login atau belum terverifikasi
                            const isRestricted = ['/keuangan', '/tentang', '/kontak'].includes(link.path)
                            if (isRestricted && (!isAuthenticated || !user?.is_verified)) return null

                            const isActive = location.pathname === link.path
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                                        ? 'text-primary bg-accent'
                                        : 'text-gray-600 hover:text-primary hover:bg-accent/50'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center gap-4 relative">
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                            >
                                Login / Daftar
                            </Link>
                        ) : (
                            <div className="relative group">
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900 leading-none">{user?.full_name || 'Jamaah'}</p>
                                        <p className="text-xs text-primary">{user?.role === 'admin' ? 'Admin' : 'Jamaah'}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
                                        {(user?.full_name || 'J')[0].toUpperCase()}
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                                    <div className="p-2">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between"
                                        >
                                            Keluar Akun
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-primary hover:bg-accent transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-primary/10 overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => {
                                const isRestricted = ['/keuangan', '/tentang', '/kontak'].includes(link.path)
                                if (isRestricted && (!isAuthenticated || !user?.is_verified)) return null

                                const isActive = location.pathname === link.path
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'text-primary bg-accent'
                                            : 'text-gray-600 hover:text-primary hover:bg-accent/50'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            })}

                            <hr className="my-2 border-gray-100" />

                            {!isAuthenticated ? (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 mt-4 text-center rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                                >
                                    Login / Daftar
                                </Link>
                            ) : (
                                <div className="mt-4 px-4 py-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
                                            {(user?.full_name || 'J')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none">{user?.full_name || 'Jamaah'}</p>
                                            <p className="text-xs text-primary">{user?.role === 'admin' ? 'Admin' : 'Jamaah'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="text-xs text-red-500 font-medium px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
