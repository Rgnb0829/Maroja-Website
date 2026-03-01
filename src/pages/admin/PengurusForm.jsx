import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function PengurusForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addPengurus, updatePengurus, getPengurus } = useData()

    const isEditing = Boolean(id)

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        contact: '',
        photo: ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isEditing) {
            const person = getPengurus(id)
            if (person) {
                setFormData(person)
            } else {
                navigate('/admin/pengurus')
            }
        }
    }, [id, isEditing, getPengurus, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            if (isEditing) {
                await updatePengurus(Number(id), formData)
            } else {
                await addPengurus(formData)
            }
            navigate('/admin/pengurus')
        } catch (error) {
            console.error("Error saving pengurus:", error)
            alert("Gagal menyimpan data pengurus. Silakan coba lagi.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/pengurus"
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? 'Perbarui informasi anggota kepengurusan.' : 'Tambahkan anggota kepengurusan baru.'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700">Foto</label>
                        <div className="flex items-start gap-6">
                            {formData.photo ? (
                                <div className="relative group">
                                    <img
                                        src={formData.photo}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-2xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                                        className="absolute inset-0 bg-black/50 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-xs">Kosong</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="photo-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    Pilih Foto
                                </label>
                                <p className="mt-2 text-xs text-gray-500">
                                    Format: JPG, PNG. Maksimal 2MB. (Opsional)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Masukkan nama pengurus"
                            />
                        </div>

                        {/* Jabatan */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Jabatan</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Contoh: Ketua DKM"
                            />
                        </div>

                        {/* Kontak */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kontak (Opsional)</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="No. HP atau WhatsApp"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <Link
                            to="/admin/pengurus"
                            className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Batal
                        </Link>
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
                                    Simpan Pengurus
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
