import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Heart, Facebook, Instagram, Youtube } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export default function Footer() {
    const { profile } = useData()

    return (
        <footer className="bg-primary text-white">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: profile?.logoBgColor || 'rgba(255, 255, 255, 0.15)' }}
                            >
                                {profile?.logo && profile.logo.length > 5 ? (
                                    <img src={profile.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-white font-bold text-lg">{profile?.logo || 'م'}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{profile?.name || 'Masjid Raudhatul Jannah'}</h3>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed max-w-md">
                            {profile?.description || 'Pusat ibadah dan kegiatan keagamaan warga Griya Tamansari 2. Mewujudkan masjid yang makmur, bersih, dan bermanfaat bagi umat.'}
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
                                <span className="text-white/60 text-sm">{profile?.address || 'Alamat Belum Diatur'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-white/50 shrink-0" />
                                <span className="text-white/60 text-sm">{profile?.phone || 'Telepon Belum Diatur'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-white/50 shrink-0" />
                                <span className="text-white/60 text-sm">{profile?.email || 'Email Belum Diatur'}</span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        {(profile?.facebook || profile?.instagram || profile?.youtube) && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-3">Sosial Media</h4>
                                <div className="flex items-center gap-3">
                                    {profile.facebook && (
                                        <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-all">
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {profile.instagram && (
                                        <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-all">
                                            <Instagram size={18} />
                                        </a>
                                    )}
                                    {profile.youtube && (
                                        <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-all">
                                            <Youtube size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
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
