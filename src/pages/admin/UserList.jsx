import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [actionLoading, setActionLoading] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'jamaah')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            setErrorMsg('Gagal mengambil data jamaah')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (userId, currentStatus) => {
        try {
            setActionLoading(userId)
            const { data, error } = await supabase
                .from('users')
                .update({ is_verified: !currentStatus })
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error

            setUsers(users.map(u =>
                u.id === userId ? { ...u, is_verified: !currentStatus } : u
            ))
        } catch (error) {
            console.error('Error updating verification:', error)
            alert('Gagal mengupdate status verifikasi')
        } finally {
            setActionLoading(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold border-l-4 border-primary pl-3 text-gray-900">
                        Data Jamaah
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 pl-4 flex items-center gap-2">
                        <UserCheck size={14} />
                        Kelola dan verifikasi akun jamaah
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
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama atau nomor WA..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Nama Jamaah
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Alamat Rumah
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span className="text-sm font-medium">Memuat data jamaah...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <UserCheck size={32} className="text-gray-300" />
                                            <p className="text-sm">Tidak ada jamaah ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        key={user.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{user.full_name || '-'}</div>
                                            <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{user.address || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_verified
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                {user.is_verified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {user.is_verified ? 'Terverifikasi' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => handleVerify(user.id, user.is_verified)}
                                                disabled={actionLoading === user.id}
                                                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all text-xs disabled:opacity-50 min-w-[120px] ${user.is_verified
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                    }`}
                                            >
                                                {actionLoading === user.id ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : user.is_verified ? (
                                                    <>
                                                        <XCircle size={14} className="mr-1.5" />
                                                        Cabut Akses
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={14} className="mr-1.5" />
                                                        Verifikasi
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
