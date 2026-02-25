import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send, Truck, Heart, HelpCircle } from 'lucide-react'

const serviceTypes = [
    { value: '', label: 'Pilih Jenis Layanan' },
    { value: 'ambulans', label: '🚑 Ambulans' },
    { value: 'jenazah', label: '🕊️ Pengurusan Jenazah' },
    { value: 'konsultasi', label: '📖 Konsultasi Agama' },
    { value: 'lainnya', label: '📋 Lainnya' },
]

export default function Kontak() {
    const [form, setForm] = useState({
        nama: '',
        phone: '',
        layanan: '',
        pesan: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setForm({ nama: '', phone: '', layanan: '', pesan: '' })
        }, 3000)
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
                        <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-wider">Hubungi Kami</p>
                        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Kontak & Layanan</h1>
                        <p className="text-white/70 max-w-xl">
                            Hubungi kami untuk informasi atau permohonan layanan Masjid Raudhatul Jannah.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Map + Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Google Maps */}
                        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-6">
                            <iframe
                                title="Lokasi Masjid Raudhatul Jannah"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8663!2d107.0!3d-6.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTgnMDAuMCJTIDEwN8KwMDAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-3">
                            {[
                                {
                                    icon: MapPin,
                                    label: 'Alamat',
                                    value: 'Perumahan Griya Tamansari 2, Bekasi, Jawa Barat',
                                },
                                {
                                    icon: Phone,
                                    label: 'Telepon',
                                    value: '0812-xxxx-xxxx (Ketua Takmir)',
                                },
                                {
                                    icon: Mail,
                                    label: 'Email',
                                    value: 'masjid.rj@email.com',
                                },
                            ].map((contact, i) => {
                                const Icon = contact.icon
                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 4 }}
                                        className="flex items-start gap-4 bg-accent/50 rounded-xl p-4 hover:bg-accent transition-colors duration-300"
                                    >
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium mb-0.5">{contact.label}</p>
                                            <p className="text-sm text-gray-700 font-medium">{contact.value}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Quick Services */}
                        <div className="mt-8">
                            <h3 className="font-bold text-gray-900 mb-4">Layanan Tersedia</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: Truck, label: 'Ambulans', color: 'text-red-500', bg: 'bg-red-50' },
                                    { icon: Heart, label: 'Jenazah', color: 'text-purple-500', bg: 'bg-purple-50' },
                                    { icon: HelpCircle, label: 'Konsultasi', color: 'text-blue-500', bg: 'bg-blue-50' },
                                ].map((service, i) => {
                                    const Icon = service.icon
                                    return (
                                        <div key={i} className={`${service.bg} rounded-xl p-4 text-center`}>
                                            <Icon size={24} className={`${service.color} mx-auto mb-2`} />
                                            <p className="text-xs font-medium text-gray-600">{service.label}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm sticky top-24">
                            <h3 className="font-bold text-xl text-gray-900 mb-2">Formulir Permohonan Layanan</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Isi formulir di bawah ini dan pengurus akan menghubungi Anda.
                            </p>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={24} className="text-primary" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">Terkirim!</h4>
                                    <p className="text-sm text-gray-500">Terima kasih. Pengurus akan segera menghubungi Anda.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.nama}
                                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                            placeholder="Masukkan nama Anda"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">No. HP / WhatsApp</label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                            placeholder="08xx-xxxx-xxxx"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Layanan</label>
                                        <select
                                            required
                                            value={form.layanan}
                                            onChange={(e) => setForm({ ...form, layanan: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none"
                                        >
                                            {serviceTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan</label>
                                        <textarea
                                            rows={4}
                                            value={form.pesan}
                                            onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                                            placeholder="Tuliskan pesan atau detail kebutuhan Anda..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Send size={16} />
                                        Kirim Permohonan
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    )
}
