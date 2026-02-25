import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Edit, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

export default function FinanceList() {
    const { finance, financeSummary, deleteTransaction } = useData()
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = finance.filter((tx) => {
        const matchType = typeFilter === 'all' || tx.type === typeFilter
        const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase())
        return matchType && matchSearch
    })

    const handleDelete = (id) => {
        deleteTransaction(id)
        setDeleteConfirm(null)
    }

    const summaryCards = [
        { label: 'Pemasukan', value: financeSummary.totalIn, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
        { label: 'Pengeluaran', value: financeSummary.totalOut, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', iconBg: 'bg-red-100' },
        { label: 'Saldo', value: financeSummary.saldo, icon: Wallet, color: 'text-primary', bg: 'bg-accent', iconBg: 'bg-primary/10' },
    ]

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Keuangan</h1>
                    <p className="text-sm text-gray-500 mt-1">{finance.length} total transaksi</p>
                </div>
                <Link
                    to="/admin/keuangan/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={16} /> Tambah Transaksi
                </Link>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {summaryCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`${card.bg} rounded-2xl p-5 border border-gray-100`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon size={18} className={card.color} />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                            </div>
                            <p className={`text-xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'in', label: 'Masuk' },
                        { key: 'out', label: 'Keluar' },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setTypeFilter(opt.key)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${typeFilter === opt.key
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {filtered.length > 0 ? (
                    <>
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Deskripsi</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((tx) => (
                                        <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{tx.date}</td>
                                            <td className="px-5 py-4 text-sm text-gray-900 font-medium">{tx.description}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                                    }`}>
                                                    {tx.type === 'in' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                    {tx.type === 'in' ? 'Masuk' : 'Keluar'}
                                                </span>
                                            </td>
                                            <td className={`px-5 py-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'in' ? 'text-emerald-600' : 'text-red-500'
                                                }`}>
                                                {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/keuangan/${tx.id}`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-accent transition-colors"
                                                    >
                                                        <Edit size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteConfirm(tx.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="sm:hidden divide-y divide-gray-50">
                            {filtered.map((tx) => (
                                <div key={tx.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === 'in' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                {tx.type === 'in' ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-red-500" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                                                <p className="text-xs text-gray-400">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-bold ${tx.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </p>
                                            <Link to={`/admin/keuangan/${tx.id}`} className="p-1.5 text-gray-400 hover:text-primary">
                                                <Edit size={14} />
                                            </Link>
                                            <button onClick={() => setDeleteConfirm(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Wallet size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400">Tidak ada transaksi ditemukan</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
                    >
                        <h3 className="font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
                        <p className="text-sm text-gray-500 mb-6">Transaksi yang dihapus tidak dapat dikembalikan.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
