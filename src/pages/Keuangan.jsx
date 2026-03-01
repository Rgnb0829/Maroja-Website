import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react'
import { useData } from '../contexts/DataContext'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

export default function Keuangan() {
    const { finance: financeData, financeSummary, zakatDistribution, isLoading } = useData()
    const [activeTab, setActiveTab] = useState('kas')

    const summaryCards = [
        {
            label: 'Total Pemasukan',
            value: financeSummary.totalIn,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            iconBg: 'bg-emerald-100',
        },
        {
            label: 'Total Pengeluaran',
            value: financeSummary.totalOut,
            icon: TrendingDown,
            color: 'text-red-500',
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
        },
        {
            label: 'Saldo Kas',
            value: financeSummary.saldo,
            icon: Wallet,
            color: 'text-primary',
            bg: 'bg-accent',
            iconBg: 'bg-primary/10',
        },
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Page Header */}
            <section className="bg-primary islamic-pattern py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Akuntabilitas</p>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Transparansi Keuangan</h1>
                        <p className="text-white/70 max-w-xl">
                            Laporan kas masjid secara transparan. Seluruh pemasukan dan pengeluaran dicatat untuk akuntabilitas kepada jamaah.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-1 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('kas')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium text-sm transition-all relative ${activeTab === 'kas' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <Wallet size={16} />
                        Kas Masjid
                        {activeTab === 'kas' && (
                            <motion.div layoutId="activeTabKeuangan" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('zakat')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium text-sm transition-all relative ${activeTab === 'zakat' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <Gift size={16} />
                        Zakat & Qurban
                        {activeTab === 'zakat' && (
                            <motion.div layoutId="activeTabKeuangan" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                {activeTab === 'kas' ? (
                    <>
                        {/* Period badge */}
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-medium">
                                <Wallet size={16} />
                                Periode: {financeSummary.period}
                            </span>
                        </div>

                        {/* Summary Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-12"
                        >
                            {summaryCards.map((card, i) => {
                                const Icon = card.icon
                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -2 }}
                                        className={`${card.bg} rounded-2xl p-6 border border-gray-100`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                                                <Icon size={20} className={card.color} />
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                                        </div>
                                        <p className={`text-2xl lg:text-3xl font-bold ${card.color}`}>
                                            {formatCurrency(card.value)}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </motion.div>

                        {/* Transactions Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">Rincian Transaksi</h3>
                            </div>

                            {/* Desktop table */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody variants={container} initial="hidden" animate="show">
                                        {financeData.map((tx) => (
                                            <motion.tr
                                                key={tx.id}
                                                variants={item}
                                                className="border-t border-gray-50 hover:bg-accent/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{tx.description}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tx.type === 'in'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-red-50 text-red-500'
                                                        }`}>
                                                        {tx.type === 'in' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                        {tx.type === 'in' ? 'Masuk' : 'Keluar'}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'in' ? 'text-emerald-600' : 'text-red-500'
                                                    }`}>
                                                    {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="sm:hidden divide-y divide-gray-50"
                            >
                                {financeData.map((tx) => (
                                    <motion.div key={tx.id} variants={item} className="px-5 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${tx.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount)}
                                                </p>
                                                <span className={`text-xs ${tx.type === 'in' ? 'text-emerald-500' : 'text-red-400'}`}>
                                                    {tx.type === 'in' ? 'Masuk' : 'Keluar'}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        key="zakat"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                    >
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Distribusi Zakat & Qurban</h3>
                        </div>

                        {zakatDistribution && zakatDistribution.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/80">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Program</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Penerima</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Distribusi</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody variants={container} initial="hidden" animate="show">
                                        {zakatDistribution.map((z) => (
                                            <motion.tr
                                                key={z.id}
                                                variants={item}
                                                className="border-t border-gray-50 hover:bg-accent/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(z.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap">
                                                        <Gift size={12} />
                                                        {z.tipe_program}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{z.penerima}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{z.jumlah_distribusi}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{z.keterangan || '-'}</td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Gift size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-500">Belum ada data distribusi zakat atau qurban.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </section>
        </motion.div>
    )
}
