import { useState } from 'react'
import { Save, Upload } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function ProfileSettings() {
    const { profile, updateProfile } = useData()
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        description: profile?.description || '',
        logo: profile?.logo || '',
        logo_bg_color: profile?.logo_bg_color || '#1B3C35', // default to primary
        address: profile?.address || '',
        phone: profile?.phone || '',
        email: profile?.email || '',
        facebook: profile?.facebook || '',
        instagram: profile?.instagram || '',
        youtube: profile?.youtube || '',
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateProfile(formData)
            alert('Profil berhasil diperbarui!')
        } catch (error) {
            console.error("Error saving profile:", error)
            alert("Gagal menyimpan profil. Silakan coba lagi.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Website</h1>
                <p className="text-gray-600">Kelola informasi dasar dan kontak masjid.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Masjid */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Nama Masjid</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Masukkan nama masjid"
                            />
                        </div>

                        {/* Deskripsi Singkat */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                placeholder="Tuliskan deskripsi singkat tentang masjid"
                            />
                        </div>

                        {/* Logo / Icon */}
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Logo Website & Warna</label>

                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                {/* Preview */}
                                {formData.logo ? (
                                    <div className="relative group shrink-0">
                                        <div
                                            className="w-32 h-32 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-2"
                                            style={{ backgroundColor: formData.logo_bg_color }}
                                        >
                                            <img
                                                src={formData.logo}
                                                alt="Logo Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                            className="absolute inset-0 bg-black/50 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="w-32 h-32 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shrink-0"
                                        style={{ backgroundColor: formData.logo_bg_color, color: '#fff' }}
                                    >
                                        <Upload size={32} className="mb-2 opacity-50" />
                                        <span className="text-xs opacity-75">Kosong</span>
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="flex-1 space-y-4 w-full">
                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/png, image/jpeg, image/svg+xml"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({ ...prev, logo: reader.result }))
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            Pilih Logo
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Format: JPG, PNG, atau SVG. Direkomendasikan transparan (PNG/SVG).
                                        </p>
                                    </div>

                                    {/* Color Picker */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Warna Background Logo
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                name="logo_bg_color"
                                                value={formData.logo_bg_color}
                                                onChange={handleChange}
                                                className="h-10 w-20 rounded cursor-pointer border-0 bg-transparent p-0"
                                            />
                                            <input
                                                type="text"
                                                name="logo_bg_color"
                                                value={formData.logo_bg_color}
                                                onChange={handleChange}
                                                placeholder="#HEX"
                                                className="px-3 py-2 w-32 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Telepon */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Telepon / WhatsApp</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Contoh: 08123456789"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="contoh@masjid.com"
                            />
                        </div>

                        {/* Divider */}
                        <div className="md:col-span-2 pt-4 pb-2">
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Sosial Media & Tautan</h3>
                        </div>

                        {/* Facebook */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Facebook</label>
                            <input
                                type="url"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        {/* Instagram */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Instagram</label>
                            <input
                                type="url"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        {/* Youtube */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">YouTube</label>
                            <input
                                type="url"
                                name="youtube"
                                value={formData.youtube}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="https://youtube.com/@..."
                            />
                        </div>

                        {/* Divider */}
                        <div className="md:col-span-2 pt-4 pb-2">
                            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Alamat & Lokasi</h3>
                        </div>

                        {/* Alamat */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                placeholder="Masukkan alamat lengkap masjid"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
