import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useData } from '../../contexts/DataContext'

export default function JadwalJumatForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getJumatSchedule, addJumatSchedule, updateJumatSchedule } = useData()
    const isEdit = Boolean(id)

    const [formData, setFormData] = useState({
        tanggal: '',
        khatib: '',
        imam: '',
        muadzin: ''
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const schedule = getJumatSchedule(id)
            if (schedule) {
                setFormData({
                    tanggal: schedule.tanggal,
                    khatib: schedule.khatib,
                    imam: schedule.imam,
                    muadzin: schedule.muadzin
                })
            } else {
                navigate('/admin/jumat')
            }
        }
    }, [id, isEdit, navigate, getJumatSchedule])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (isEdit) {
                await updateJumatSchedule(id, formData)
            } else {
                await addJumatSchedule(formData)
            }
            navigate('/admin/jumat')
        } catch (error) {
            console.error("Failed to save schedule:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/jumat"
                    className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Jadwal Jumat' : 'Tambah Jadwal Jumat'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Formulir pendaftaran petugas Jumat
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tanggal */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Tanggal Jumat</label>
                        <input
                            type="date"
                            name="tanggal"
                            required
                            value={formData.tanggal}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Khatib */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Khatib</label>
                        <input
                            type="text"
                            name="khatib"
                            required
                            value={formData.khatib}
                            onChange={handleChange}
                            placeholder="Nama Khatib"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Imam */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Imam</label>
                        <input
                            type="text"
                            name="imam"
                            required
                            value={formData.imam}
                            onChange={handleChange}
                            placeholder="Nama Imam"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    {/* Muadzin */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Muadzin</label>
                        <input
                            type="text"
                            name="muadzin"
                            required
                            value={formData.muadzin}
                            onChange={handleChange}
                            placeholder="Nama Muadzin"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Link
                        to="/admin/jumat"
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
                        {isSaving ? 'Menyimpan...' : 'Simpan Jadwal'}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
