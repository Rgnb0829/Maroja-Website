import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function FinanceForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addTransaction, updateTransaction, getTransaction } = useData()
    const isEdit = !!id

    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'in',
        amount: '',
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const tx = getTransaction(id)
            if (tx) {
                setForm({
                    date: tx.date,
                    description: tx.description,
                    type: tx.type,
                    amount: String(tx.amount),
                })
            } else {
                navigate('/admin/keuangan')
            }
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (isEdit) {
                await updateTransaction(Number(id), form)
            } else {
                await addTransaction(form)
            }
            navigate('/admin/keuangan')
        } catch (error) {
            console.error("Error saving transaction:", error)
            alert("Gagal menyimpan transaksi. Silakan coba lagi.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/keuangan')}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit ? 'Perbarui data transaksi' : 'Catat pemasukan atau pengeluaran baru'}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, type: 'in' })}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${form.type === 'in'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                ↗ Pemasukan
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, type: 'out' })}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${form.type === 'out'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                ↘ Pengeluaran
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                        <input
                            type="text"
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            placeholder="Contoh: Infaq Jumat, Listrik & Air, dll."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/keuangan')}
                            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                        >
                            <Save size={16} />
                            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
