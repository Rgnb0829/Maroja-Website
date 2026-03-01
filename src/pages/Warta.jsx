import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Search } from 'lucide-react'
import { useData } from '../contexts/DataContext'

const categories = ['Semua', 'Kajian', 'Jumat Berkah', 'Pengumuman']

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

export default function Warta() {
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [search, setSearch] = useState('')
    const { posts, isLoading } = useData()

    const filtered = posts.filter((post) => {
        const matchCategory = activeCategory === 'Semua' || post.category === activeCategory
        const matchSearch = post.title.toLowerCase().includes(search.toLowerCase())
        return matchCategory && matchSearch
    })

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
                        <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Berita & Kegiatan</p>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Warta Masjid</h1>
                        <p className="text-white/70 max-w-xl">
                            Informasi terbaru seputar kegiatan kajian, dokumentasi Jumat Berkah, dan pengumuman penting dari Masjid Raudhatul Jannah.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-gray-100 text-gray-600 hover:bg-accent hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Posts Grid */}
                {filtered.length > 0 ? (
                    <motion.div
                        key={activeCategory + search}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((post) => (
                            <motion.article
                                key={post.id}
                                variants={item}
                                whileHover={{ y: -4 }}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative"
                            >
                                <Link to={`/warta/${post.id}`} className="absolute inset-0 z-10">
                                    <span className="sr-only">Baca selengkapnya {post.title}</span>
                                </Link>
                                <div className="aspect-[16/10] bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center overflow-hidden">
                                    {post.image ? (
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <span className="text-primary/30 text-3xl font-bold">م</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-medium text-primary bg-accent px-2.5 py-1 rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Tidak ada berita ditemukan.</p>
                    </div>
                )}
            </section>
        </motion.div>
    )
}
