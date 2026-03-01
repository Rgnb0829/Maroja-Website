import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useData } from '../../contexts/DataContext'

export default function ZakatForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getZakatDistribution, addZakatDistribution, updateZakatDistribution } = useData()
    const isEdit = Boolean(id)

    const [formData, setFormData] = useState({
        tipe_program: '',
        tanggal: new Date().toISOString().split('T')[0],
        penerima: '',
        jumlah_distribusi: '',
        keterangan: ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const data = getZakatDistribution(id)
            if (data) {
                setFormData({
                    tipe_program: data.tipe_program,
                    tanggal: data.tanggal,
                    penerima: data.penerima,
                    jumlah_distribusi: data.jumlah_distribusi,
                    keterangan: data.keterangan || ''
                })
            } else {
                navigate('/admin/zakat')
            }
        }
    }, [id, isEdit, navigate, getZakatDistribution])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (isEdit) {
                await updateZakatDistribution(id, formData)
            } else {
                await addZakatDistribution(formData)
            }
            navigate('/admin/zakat')
        } catch (error) {
            console.error("Failed to save data:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Default suggestions for program types
    const programSuggestions = ['Zakat Fitrah 1447 H', 'Qurban 1447 H', 'Fidyah', 'Sedekah Anak Yatim', 'Sembako Dhuafa']

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/zakat"
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Data Distribusi' : 'Tambah Data Distribusi'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Catat infomasi penyaluran Zakat, Infaq, Sedekah, atau Qurban
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipe Program */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nama Program</label>
                        <input
                            type="text"
                            name="tipe_program"
                            required
                            list="program-suggestions"
                            value={formData.tipe_program}
                            onChange={handleChange}
                            placeholder="Contoh: Zakat Fitrah 1447 H"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <datalist id="program-suggestions">
                            {programSuggestions.map(p => <option key={p} value={p} />)}
                        </datalist>
                    </div>

                    {/* Tanggal */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tanggal Distribusi</label>
                        <input
                            type="date"
                            name="tanggal"
                            required
                            value={formData.tanggal}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Penerima */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Nama Penerima / Kelurahan / Panti</label>
                        <input
                            type="text"
                            name="penerima"
                            required
                            value={formData.penerima}
                            onChange={handleChange}
                            placeholder="Contoh: Panti Asuhan Tunas Harapan, Warga RT 02"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Jumlah Distribusi */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Jumlah / Bentuk Distribusi</label>
                        <input
                            type="text"
                            name="jumlah_distribusi"
                            required
                            value={formData.jumlah_distribusi}
                            onChange={handleChange}
                            placeholder="Contoh: 1 Ekor Sapi, 50 Kg Beras, Rp 5.000.000"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Keterangan */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Keterangan Tambahan (Opsional)</label>
                        <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            placeholder="Catatan tambahan mengenai distribusi ini..."
                            rows="3"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Link
                        to="/admin/zakat"
                        className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-70"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
