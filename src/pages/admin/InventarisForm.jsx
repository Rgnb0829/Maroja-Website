import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function InventarisForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addInventaris, updateInventaris, getInventarisItem } = useData()

    const isEditing = Boolean(id)

    const [formData, setFormData] = useState({
        name: '',
        quantity: 1,
        condition: 'Baik',
        location: '',
        lastUpdated: new Date().toISOString().split('T')[0]
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isEditing) {
            const item = getInventarisItem(id)
            if (item) {
                setFormData({
                    ...item,
                    lastUpdated: new Date(item.lastUpdated).toISOString().split('T')[0]
                })
            } else {
                navigate('/admin/inventaris')
            }
        }
    }, [id, isEditing, getInventarisItem, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            if (isEditing) {
                await updateInventaris(Number(id), formData)
            } else {
                await addInventaris(formData)
            }
            navigate('/admin/inventaris')
        } catch (error) {
            console.error("Error saving inventaris:", error)
            alert("Gagal menyimpan data barang. Silakan coba lagi.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/inventaris"
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Edit Barang Inventaris' : 'Tambah Barang Baru'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? 'Perbarui informasi barang di inventaris masjid.' : 'Tambahkan barang baru ke inventaris masjid.'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Barang */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Nama Barang</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Masukkan nama barang"
                            />
                        </div>

                        {/* Jumlah */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Jumlah / Kuantitas</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="0"
                            />
                        </div>

                        {/* Kondisi */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kondisi</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none bg-white"
                            >
                                <option value="Baik">Baik</option>
                                <option value="Perlu Servis">Perlu Servis</option>
                                <option value="Rusak">Rusak</option>
                            </select>
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Lokasi / Penempatan</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                placeholder="Contoh: Ruang Utama, Gudang"
                            />
                        </div>

                        {/* Tanggal Terakhir Diperbarui */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Pencatatan</label>
                            <input
                                type="date"
                                name="lastUpdated"
                                value={formData.lastUpdated}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <Link
                            to="/admin/inventaris"
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
                                    Simpan Barang
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
