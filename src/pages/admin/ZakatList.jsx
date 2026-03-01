import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Edit, Gift } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function ZakatList() {
    const { zakatDistribution, deleteZakatDistribution } = useData()
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = zakatDistribution.filter((z) => {
        const matchType = typeFilter === 'all' || z.tipe_program === typeFilter
        const matchSearch = z.penerima.toLowerCase().includes(search.toLowerCase()) ||
            z.keterangan?.toLowerCase().includes(search.toLowerCase())
        return matchType && matchSearch
    })

    const handleDelete = async (id) => {
        try {
            await deleteZakatDistribution(id)
            setDeleteConfirm(null)
        } catch (error) {
            console.error("Failed to delete record:", error)
        }
    }

    const uniqueTypes = [...new Set(zakatDistribution.map(z => z.tipe_program))]

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Zakat & Qurban</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola data distribusi zakat dan qurban</p>
                </div>
                <Link
                    to="/admin/zakat/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={16} /> Tambah Data
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari penerima atau keterangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-4 py-2 shrink-0 rounded-xl text-xs font-medium transition-all ${typeFilter === 'all'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Semua
                    </button>
                    {uniqueTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 shrink-0 rounded-xl text-xs font-medium transition-all ${typeFilter === type
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Penerima</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Distribusi</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((z) => (
                                    <tr key={z.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(z.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap">
                                                <Gift size={12} />
                                                {z.tipe_program}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{z.penerima}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-700 font-semibold truncate max-w-[150px]">{z.jumlah_distribusi}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/zakat/${z.id}`}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-accent transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm(z.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm">Tidak ada data distribusi zakat atau qurban.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
                    >
                        <h3 className="font-bold text-gray-900 mb-2">Hapus Data?</h3>
                        <p className="text-sm text-gray-500 mb-6">Data distribusi yang dihapus tidak dapat dikembalikan.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm"
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
