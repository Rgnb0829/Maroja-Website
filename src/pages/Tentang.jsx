import { motion } from 'framer-motion'
import { Users, BookOpen, CheckCircle2, Phone } from 'lucide-react'
import { takmir, facilities } from '../data/takmir'

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

export default function Tentang() {
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
                        <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Profil</p>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Tentang Kami</h1>
                        <p className="text-white/70 max-w-xl">
                            Mengenal lebih dekat Masjid Raudhatul Jannah — sejarah, struktur organisasi, dan fasilitas yang tersedia.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sejarah */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                            <BookOpen size={20} className="text-primary" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Sejarah Singkat</h2>
                    </div>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Masjid Raudhatul Jannah didirikan pada tahun 2010 oleh para warga pendiri perumahan Griya Tamansari 2.
                            Bermula dari musholla kecil berukuran 6x8 meter, masjid ini terus berkembang berkat semangat gotong royong
                            dan infaq jamaah yang tidak pernah putus.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Pada tahun 2015, dilakukan renovasi besar-besaran yang memperluas kapasitas masjid hingga mampu menampung
                            500 jamaah. Pembangunan lantai 2 dimulai pada tahun 2024 dan saat ini masih dalam proses penyelesaian.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Nama "Raudhatul Jannah" yang berarti "Taman Surga" dipilih sebagai doa dan harapan agar masjid ini
                            menjadi tempat yang penuh keberkahan, ilmu, dan ketenangan bagi seluruh umat yang beribadah di dalamnya.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-100" />
            </div>

            {/* Struktur Organisasi */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-primary" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Struktur Organisasi Takmir</h2>
                    </div>
                    <p className="text-gray-500 ml-13 mt-2">Periode 2025 — 2027</p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {takmir.map((member) => (
                        <motion.div
                            key={member.id}
                            variants={item}
                            whileHover={{ y: -3 }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            {/* Avatar */}
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                                <span className="text-white font-bold text-lg">
                                    {member.name.charAt(0)}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm">{member.name}</h3>
                            <p className="text-primary text-xs font-medium mt-1 mb-3">{member.role}</p>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Phone size={12} />
                                <span className="text-xs">{member.phone}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-100" />
            </div>

            {/* Fasilitas */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-primary" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Fasilitas Masjid</h2>
                    </div>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                    {facilities.map((facility, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="flex items-center gap-3 bg-accent/50 rounded-xl p-4 hover:bg-accent transition-colors duration-300"
                        >
                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">{facility}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </motion.div>
    )
}
