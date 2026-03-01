import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'

export default function PengurusList() {
    const { pengurus, deletePengurus } = useData()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredPengurus = pengurus.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengurus ini?')) {
            deletePengurus(id)
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Struktur Kepengurusan</h1>
                    <p className="text-gray-600">Kelola daftar pengurus masjid dan perannya.</p>
                </div>
                <Link
                    to="/admin/pengurus/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shrink-0"
                >
                    <Plus size={20} />
                    Tambah Pengurus
                </Link>
            </div>

            {/* Quick Actions / Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama atau jabatan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-4">
                    Total: <span className="text-primary">{filteredPengurus.length} Pengurus</span>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Pengurus</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Jabatan</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Kontak</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPengurus.length > 0 ? (
                                filteredPengurus.map((person) => (
                                    <tr key={person.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                                                    {person.photo ? (
                                                        <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserCircle size={24} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">{person.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {person.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 text-sm">
                                            {person.contact || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/pengurus/${person.id}`}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(person.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500">
                                        Tidak ada data pengurus ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
