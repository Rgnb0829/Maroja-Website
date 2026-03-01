import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, Wallet, Settings, Users, Box, LogOut, Menu, X, ChevronRight, UserCheck, CalendarDays, Gift } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Jadwal Jumat', path: '/admin/jumat', icon: CalendarDays },
    { name: 'Zakat & Qurban', path: '/admin/zakat', icon: Gift },
    { name: 'Kelola Berita', path: '/admin/posts', icon: Newspaper },
    { name: 'Kelola Keuangan', path: '/admin/keuangan', icon: Wallet },
    { name: 'Data Jamaah', path: '/admin/users', icon: UserCheck },
    { name: 'Kepengurusan', path: '/admin/pengurus', icon: Users },
    { name: 'Inventaris', path: '/admin/inventaris', icon: Box },
    { name: 'Profil Website', path: '/admin/profile', icon: Settings }
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin'
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-primary z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">م</span>
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-sm">Admin Panel</h2>
                                    <p className="text-white/50 text-xs">Masjid RJ</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-white/60 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon
                            const active = isActive(link.path)
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {link.name}
                                    {active && <ChevronRight size={14} className="ml-auto" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User / Logout */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 py-2 mb-3">
                            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-white text-xs font-medium">{user?.username}</p>
                                <p className="text-white/40 text-xs">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all w-full"
                        >
                            <LogOut size={18} />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 px-4 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="hidden lg:block" />
                    <Link
                        to="/"
                        className="text-xs text-primary font-medium hover:text-primary-light transition-colors flex items-center gap-1"
                    >
                        Lihat Website →
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
