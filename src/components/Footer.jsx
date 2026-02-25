import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-primary text-white">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">م</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Masjid Raudhatul Jannah</h3>
                                <p className="text-white/60 text-sm">Griya Tamansari 2</p>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed max-w-md">
                            Pusat ibadah dan kegiatan keagamaan warga Griya Tamansari 2.
                            Mewujudkan masjid yang makmur, bersih, dan bermanfaat bagi umat.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Navigasi</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Beranda', path: '/' },
                                { name: 'Warta Masjid', path: '/warta' },
                                { name: 'Transparansi Keuangan', path: '/keuangan' },
                                { name: 'Tentang Kami', path: '/tentang' },
                                { name: 'Kontak & Layanan', path: '/kontak' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Kontak</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-white/50 mt-0.5 shrink-0" />
                                <span className="text-white/60 text-sm">Griya Tamansari 2, Srimartani, Piyungan, Bantul, Yogyakarta, 55792</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-white/50 shrink-0" />
                                <span className="text-white/60 text-sm">0812-xxxx-xxxx</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-white/50 shrink-0" />
                                <span className="text-white/60 text-sm">masjid.rj@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-white/40 text-xs flex items-center justify-center gap-1">
                        © 2026 LabS10. Dibuat dengan <Heart size={12} className="text-red-400" /> untuk umat.
                    </p>
                </div>
            </div>
        </footer>
    )
}
