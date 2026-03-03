import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Trash2, Search, Inbox, AlertCircle, Clock } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

export default function PesanList() {
    const { contactMessages, markMessageAsRead, deleteMessage, isLoading } = useData()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('Semua') // Semua, Belum Dibaca, Sudah Dibaca
    const [actionLoading, setActionLoading] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')

    const filteredMessages = contactMessages.filter(msg => {
        const matchesSearch =
            msg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.phone.includes(searchTerm) ||
            msg.layanan.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter =
            filterStatus === 'Semua' ? true :
                filterStatus === 'Belum Dibaca' ? !msg.is_read :
                    msg.is_read

        return matchesSearch && matchesFilter
    })

    const handleMarkAsRead = async (id) => {
        try {
            setActionLoading(id)
            await markMessageAsRead(id)
        } catch (error) {
            console.error('Error marking message as read:', error)
            setErrorMsg('Gagal menandai pesan.')
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini permanen?')) return
        try {
            setActionLoading(id)
            await deleteMessage(id)
        } catch (error) {
            console.error('Error deleting message:', error)
            setErrorMsg('Gagal menghapus pesan.')
        } finally {
            setActionLoading(null)
        }
    }

    const unreadCount = contactMessages.filter(m => !m.is_read).length

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold border-l-4 border-primary pl-3 text-gray-900 flex items-center gap-2">
                        Pesan Layanan
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                {unreadCount} Baru
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 pl-4 flex items-center gap-2">
                        <Inbox size={14} />
                        Kotak masuk permohonan layanan dari jamaah
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    <p className="font-medium text-sm">{errorMsg}</p>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama pengirim, nomor WA, atau jenis layanan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                    {['Semua', 'Belum Dibaca', 'Sudah Dibaca'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterStatus === status
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200/50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p>Memuat pesan masuk...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-500">
                        <Inbox size={48} className="text-gray-300 mb-4" />
                        <p className="font-medium text-gray-900">Tidak ada pesan</p>
                        <p className="text-sm mt-1">
                            {searchTerm || filterStatus !== 'Semua'
                                ? 'Tidak ada pesan yang sesuai dengan pencarian/filter.'
                                : 'Kotak masuk Anda kosong saat ini.'}
                        </p>
                    </div>
                ) : (
                    filteredMessages.map((msg, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={msg.id}
                            className={`p-5 md:p-6 rounded-2xl border transition-all ${msg.is_read
                                    ? 'bg-white border-gray-100'
                                    : 'bg-primary/5 border-primary/20 shadow-sm'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`text-lg font-bold ${msg.is_read ? 'text-gray-800' : 'text-gray-900'}`}>
                                            {msg.nama}
                                        </h3>
                                        {!msg.is_read && (
                                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                Baru
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                        <a
                                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors flex items-center gap-1.5"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {msg.phone}
                                        </a>
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium uppercase tracking-wide">
                                            {msg.layanan}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
                                    <Clock size={14} />
                                    {new Date(msg.created_at).toLocaleString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="bg-gray-50/80 rounded-xl p-4 text-gray-700 text-sm md:text-base border border-gray-100/80 whitespace-pre-wrap font-medium">
                                "{msg.pesan}"
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                {!msg.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(msg.id)}
                                        disabled={actionLoading === msg.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle size={16} />
                                        Tandai Sudah Dibaca
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    disabled={actionLoading === msg.id}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
