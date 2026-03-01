import { motion } from 'framer-motion'
import { Users, CalendarDays, Mic, UserRound } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export default function JadwalJumatCard() {
    const { jumatSchedules } = useData()

    // Find the next upcoming Friday schedule based on today
    // Or just show the first one if there are only past schedules
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // As jumatSchedules are sorted descending in DataContext, 
    // to find the 'next' we filter for >= today and take the last one,
    // or just sort ascending and take the first.
    let upcoming = null;
    if (jumatSchedules && jumatSchedules.length > 0) {
        // Sort descending locally to be sure
        const sorted = [...jumatSchedules].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
        upcoming = sorted.find(s => new Date(s.tanggal) >= today) || sorted[sorted.length - 1] // Fallback to the latest one if all are past
    }

    if (!upcoming) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 p-6 h-full flex flex-col items-center justify-center text-center"
            >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <CalendarDays className="text-primary/50" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Jadwal Jumat</h3>
                <p className="text-sm text-gray-500">Belum ada jadwal tersedia saat ini.</p>
            </motion.div>
        )
    }

    const { tanggal, khatib, imam, muadzin } = upcoming
    const dateObj = new Date(tanggal)
    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const isToday = today.getTime() === dateObj.getTime()

    const roles = [
        { label: 'Khatib', name: khatib, icon: Mic, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Imam', name: imam, icon: UserRound, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Muadzin', name: muadzin, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 overflow-hidden h-full flex flex-col"
        >
            <div className="bg-primary/5 p-4 lg:p-6 border-b border-primary/10 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <CalendarDays size={18} className="text-primary" />
                        Jadwal Jumat
                    </h3>
                    <p className="text-xs text-primary/70 font-medium mt-1">
                        {formattedDate} {isToday && <span className="text-red-500 ml-1">(Hari Ini)</span>}
                    </p>
                </div>
            </div>

            <div className="p-4 lg:p-6 flex-1 flex flex-col justify-center gap-4">
                {roles.map((role, i) => {
                    const Icon = role.icon
                    return (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${role.bg}`}>
                                <Icon size={20} className={role.color} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{role.label}</p>
                                <p className="font-bold text-gray-900">{role.name}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
