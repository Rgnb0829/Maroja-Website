import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Calendar, ChevronRight, Landmark } from 'lucide-react'
import PrayerSchedule from '../components/PrayerSchedule'
import QrisModal from '../components/QrisModal'
import { useData } from '../contexts/DataContext'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

export default function Beranda() {
    const [qrisOpen, setQrisOpen] = useState(false)
    const { posts } = useData()
    const latestPosts = posts.slice(0, 3)

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-primary min-h-[85vh] flex items-center">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
                    {/* Islamic pattern overlay */}
                    <div className="absolute inset-0 islamic-pattern opacity-30" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="max-w-3xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6"
                        >
                            <span className="w-2 h-2 bg-mint rounded-full animate-pulse" />
                            <span className="text-white/80 text-sm font-medium">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                            Masjid
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                Raudhatul Jannah
                            </span>
                        </h1>
                        <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                            Pusat ibadah dan kegiatan keagamaan warga Griya Tamansari 2.
                            Mewujudkan masjid yang makmur dan bermanfaat bagi umat.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/tentang"
                                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Tentang Kami
                                <ArrowRight size={16} />
                            </Link>
                            <button
                                onClick={() => setQrisOpen(true)}
                                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <Heart size={16} />
                                Infaq Digital
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-16 grid grid-cols-3 gap-4 max-w-md"
                    >
                        {[
                            { value: '500+', label: 'Jamaah' },
                            { value: '5x', label: 'Shalat Berjamaah' },
                            { value: '2x', label: 'Kajian / Minggu' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-white font-bold text-xl lg:text-2xl">{stat.value}</p>
                                <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Prayer Schedule */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <PrayerSchedule />
            </section>

            {/* Infaq Digital Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 islamic-pattern opacity-20" />
                    <div className="relative p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
                                <Landmark size={14} className="text-white/70" />
                                <span className="text-white/70 text-xs font-medium">QRIS BCA</span>
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                                Infaq & Sedekah Digital
                            </h2>
                            <p className="text-white/70 text-sm leading-relaxed max-w-md">
                                Salurkan infaq dan sedekah Anda dengan mudah melalui QRIS.
                                Cukup scan, pilih nominal, dan transfer. Jazakumullahu khairan.
                            </p>
                        </div>
                        <button
                            onClick={() => setQrisOpen(true)}
                            className="shrink-0 bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Heart size={18} />
                            Buka QRIS
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Latest News */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <p className="text-primary/60 text-sm font-medium mb-2 uppercase tracking-wider">Kabar Terbaru</p>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Warta Masjid</h2>
                    </div>
                    <Link
                        to="/warta"
                        className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                    >
                        Lihat Semua
                        <ChevronRight size={16} />
                    </Link>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {latestPosts.map((post) => (
                        <motion.article
                            key={post.id}
                            variants={item}
                            whileHover={{ y: -4 }}
                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-300"
                        >
                            {/* Image */}
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
                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                <div className="sm:hidden mt-6 text-center">
                    <Link
                        to="/warta"
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium"
                    >
                        Lihat Semua Berita
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </section>

            <QrisModal isOpen={qrisOpen} onClose={() => setQrisOpen(false)} />
        </>
    )
}
