import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Edit, CalendarDays } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function JadwalJumatList() {
    const { jumatSchedules, deleteJumatSchedule } = useData()
    const [search, setSearch] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = jumatSchedules.filter((s) => {
        const dObj = new Date(s.tanggal)
        const dString = dObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase()
        return s.khatib.toLowerCase().includes(search.toLowerCase()) ||
            s.imam.toLowerCase().includes(search.toLowerCase()) ||
            dString.includes(search.toLowerCase())
    })

    const handleDelete = async (id) => {
        try {
            await deleteJumatSchedule(id)
            setDeleteConfirm(null)
        } catch (error) {
            console.error("Failed to delete schedule:", error)
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal Jumat</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola petugas shalat Jumat mingguan</p>
                </div>
                <Link
                    to="/admin/jumat/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={16} /> Tambah Jadwal
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama petugas atau tanggal..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
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
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Khatib</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Imam</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Muadzin</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={16} className="text-primary/70" />
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {new Date(s.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-700">{s.khatib}</td>
                                        <td className="px-5 py-4 text-sm text-gray-700">{s.imam}</td>
                                        <td className="px-5 py-4 text-sm text-gray-700">{s.muadzin}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/jumat/${s.id}`}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-accent transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm(s.id)}
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
                    <div className="text-center py-16">
                        <CalendarDays size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-500">Tidak ada jadwal ditemukan</p>
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
                        <h3 className="font-bold text-gray-900 mb-2">Hapus Jadwal?</h3>
                        <p className="text-sm text-gray-500 mb-6">Jadwal yang dihapus tidak dapat dikembalikan.</p>
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
