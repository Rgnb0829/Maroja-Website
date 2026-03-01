import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export default function WartaDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getPost, isLoading } = useData()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        )
    }

    const post = getPost(id)

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h2>
                <button
                    onClick={() => navigate('/warta')}
                    className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Kembali ke Warta
                </button>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-20"
        >
            {/* Header / Hero */}
            <section className="bg-primary islamic-pattern pt-16 pb-32 lg:pt-24 lg:pb-40 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link
                        to="/warta"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Warta
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-semibold text-primary bg-white px-3 py-1 rounded-full uppercase tracking-wider">
                                {post.category}
                            </span>
                            <span className="text-sm text-white/80 flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 lg:-mt-32 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-gray-100"
                >
                    {/* Featured Image */}
                    {post.image && (
                        <div className="w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 sm:p-10 lg:p-12">
                        {/* 
                          Since we only collected excerpt in PostForm, we display it here.
                          If there's actual HTML content later, we can use dangerouslySetInnerHTML.
                        */}
                        <div className="prose prose-lg prose-primary max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {post.content || post.excerpt}
                        </div>
                    </div>
                </motion.div>
            </section>
        </motion.div>
    )
}
