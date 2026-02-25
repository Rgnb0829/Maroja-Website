import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Newspaper, TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

export default function Dashboard() {
    const { posts, finance, financeSummary } = useData()

    const stats = [
        { label: 'Total Berita', value: posts.length, icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
        { label: 'Pemasukan', value: formatCurrency(financeSummary.totalIn), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
        { label: 'Pengeluaran', value: formatCurrency(financeSummary.totalOut), icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', iconBg: 'bg-red-100' },
        { label: 'Saldo Kas', value: formatCurrency(financeSummary.saldo), icon: Wallet, color: 'text-primary', bg: 'bg-accent', iconBg: 'bg-primary/10' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Ringkasan data masjid</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`${stat.bg} rounded-2xl p-5 border border-gray-100`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon size={18} className={stat.color} />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            </div>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Posts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 text-sm">Berita Terbaru</h3>
                        <Link to="/admin/posts/new" className="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1">
                            <Plus size={14} /> Tambah
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {posts.slice(0, 5).map((post) => (
                            <Link
                                key={post.id}
                                to={`/admin/posts/${post.id}`}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{post.category} • {post.date}</p>
                                </div>
                            </Link>
                        ))}
                        {posts.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">Belum ada berita</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900 text-sm">Transaksi Terbaru</h3>
                        <Link to="/admin/keuangan/new" className="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1">
                            <Plus size={14} /> Tambah
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {finance.slice(0, 5).map((tx) => (
                            <Link
                                key={tx.id}
                                to={`/admin/keuangan/${tx.id}`}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                        {tx.type === 'in' ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-red-500" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                                        <p className="text-xs text-gray-400">{tx.date}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-bold ml-3 ${tx.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </p>
                            </Link>
                        ))}
                        {finance.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">Belum ada transaksi</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
