import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Box } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../../contexts/DataContext'

export default function InventarisList() {
    const { inventaris, deleteInventaris } = useData()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCondition, setFilterCondition] = useState('Semua')

    const filteredInventaris = inventaris.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterCondition === 'Semua' || item.condition === filterCondition
        return matchesSearch && matchesFilter
    })

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus barang ini dari inventaris?')) {
            deleteInventaris(id)
        }
    }

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'Baik':
                return 'bg-green-100 text-green-700'
            case 'Perlu Servis':
                return 'bg-yellow-100 text-yellow-700'
            case 'Rusak':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventaris Masjid</h1>
                    <p className="text-gray-600">Kelola daftar barang dan aset masjid.</p>
                </div>
                <Link
                    to="/admin/inventaris/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shrink-0"
                >
                    <Plus size={20} />
                    Tambah Barang
                </Link>
            </div>

            {/* Quick Actions / Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama barang atau lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {['Semua', 'Baik', 'Perlu Servis', 'Rusak'].map((cond) => (
                        <button
                            key={cond}
                            onClick={() => setFilterCondition(cond)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterCondition === cond
                                ? 'bg-primary text-white'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cond}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Nama Barang</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Jumlah</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Kondisi</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Lokasi</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Terakhir Diperbarui</th>
                                <th className="py-4 px-6 text-sm font-semibold text-gray-600 w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventaris.length > 0 ? (
                                filteredInventaris.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <Box size={20} />
                                                </div>
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-gray-900">{item.quantity}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {item.location}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(item.lastUpdated).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/inventaris/${item.id}`}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                        Tidak ada barang ditemukan.
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
