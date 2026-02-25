import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Edit, Newspaper } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

const categories = ['Semua', 'Kajian', 'Jumat Berkah', 'Pengumuman']

export default function PostsList() {
    const { posts, deletePost } = useData()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('Semua')
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = posts.filter((p) => {
        const matchCat = category === 'Semua' || p.category === category
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const handleDelete = (id) => {
        deletePost(id)
        setDeleteConfirm(null)
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-sm text-gray-500 mt-1">{posts.length} total berita</p>
                </div>
                <Link
                    to="/admin/posts/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={16} /> Tambah Berita
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                    />
                </div>
                <div className="flex gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${category === cat
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {filtered.length > 0 ? (
                    <>
                        {/* Desktop */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Judul</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((post) => (
                                        <tr key={post.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-900">{post.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{post.excerpt}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-xs font-medium text-primary bg-accent px-2.5 py-1 rounded-full">{post.category}</span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{post.date}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/posts/${post.id}`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-accent transition-colors"
                                                    >
                                                        <Edit size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteConfirm(post.id)}
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
                            {filtered.map((post) => (
                                <div key={post.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{post.title}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs font-medium text-primary bg-accent px-2 py-0.5 rounded-full">{post.category}</span>
                                                <span className="text-xs text-gray-400">{post.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Link to={`/admin/posts/${post.id}`} className="p-2 rounded-lg text-gray-400 hover:text-primary">
                                                <Edit size={15} />
                                            </Link>
                                            <button onClick={() => setDeleteConfirm(post.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Newspaper size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400">Tidak ada berita ditemukan</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
                    >
                        <h3 className="font-bold text-gray-900 mb-2">Hapus Berita?</h3>
                        <p className="text-sm text-gray-500 mb-6">Berita yang dihapus tidak dapat dikembalikan.</p>
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
