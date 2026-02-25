import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Sun, Sunset, Moon, CloudSun, SunDim, MoonStar } from 'lucide-react'

const prayerIcons = {
    Imsak: MoonStar,
    Fajr: Sun,
    Dhuhr: CloudSun,
    Asr: SunDim,
    Maghrib: Sunset,
    Isha: Moon,
}

const prayerNames = {
    Imsak: 'Imsak',
    Fajr: 'Subuh',
    Dhuhr: 'Dzuhur',
    Asr: 'Ashar',
    Maghrib: 'Maghrib',
    Isha: 'Isya',
}

export default function PrayerSchedule() {
    const [times, setTimes] = useState(null)
    const [countdown, setCountdown] = useState('')
    const [nextPrayer, setNextPrayer] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const today = new Date()
                const dd = String(today.getDate()).padStart(2, '0')
                const mm = String(today.getMonth() + 1).padStart(2, '0')
                const yyyy = today.getFullYear()
                const res = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Bantul&country=Indonesia&method=20&state=Yogyakarta`
                )
                const data = await res.json()
                setTimes(data.data.timings)
            } catch (err) {
                // Fallback times
                setTimes({
                    Imsak: '04:22',
                    Fajr: '04:32',
                    Dhuhr: '11:48',
                    Asr: '15:10',
                    Maghrib: '17:58',
                    Isha: '19:08',
                })
            } finally {
                setLoading(false)
            }
        }
        fetchTimes()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Helper to parse time string (handles "04:22 (WIB)" format from API)
    const parseTime = (timeStr) => {
        const clean = timeStr.replace(/\s*\(.*\)/, '').trim()
        const [h, m] = clean.split(':').map(Number)
        return { h, m }
    }

    const formatCountdown = (diff) => {
        const hours = Math.floor(diff / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    useEffect(() => {
        if (!times) return

        const now = currentTime
        const prayerOrder = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

        for (const prayer of prayerOrder) {
            const { h, m } = parseTime(times[prayer])
            const prayerTime = new Date(now)
            prayerTime.setHours(h, m, 0, 0)

            if (prayerTime > now) {
                setNextPrayer(prayer)
                setCountdown(formatCountdown(prayerTime - now))
                return
            }
        }

        // After Isha → countdown to tomorrow's Imsak
        setNextPrayer('Imsak')
        const { h, m } = parseTime(times['Imsak'])
        const tomorrowImsak = new Date(now)
        tomorrowImsak.setDate(tomorrowImsak.getDate() + 1)
        tomorrowImsak.setHours(h, m, 0, 0)
        setCountdown(formatCountdown(tomorrowImsak - now))
    }, [times, currentTime])

    const prayerOrder = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-primary/5 p-6 lg:p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 overflow-hidden"
        >
            {/* Header with countdown */}
            <div className="bg-primary p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Jadwal Shalat</h3>
                            <p className="text-white/60 text-xs">Kab. Bantul, Yogyakarta</p>
                        </div>
                    </div>
                    {nextPrayer && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-right">
                            <p className="text-white/70 text-xs mb-0.5">{prayerNames[nextPrayer]} dalam</p>
                            <p className="text-white font-mono font-bold text-xl tracking-wider">{countdown}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Prayer times grid */}
            <div className="p-4 lg:p-6">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {times &&
                        prayerOrder.map((prayer) => {
                            const Icon = prayerIcons[prayer]
                            const isNext = prayer === nextPrayer
                            return (
                                <motion.div
                                    key={prayer}
                                    whileHover={{ y: -2 }}
                                    className={`text-center p-3 lg:p-4 rounded-xl transition-all duration-300 ${isNext
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-accent/50 text-primary hover:bg-accent'
                                        }`}
                                >
                                    <Icon size={20} className={`mx-auto mb-2 ${isNext ? 'text-white/80' : 'text-primary/50'}`} />
                                    <p className={`text-xs font-medium mb-1 ${isNext ? 'text-white/80' : 'text-primary/60'}`}>
                                        {prayerNames[prayer]}
                                    </p>
                                    <p className={`font-bold text-lg ${isNext ? 'text-white' : 'text-primary'}`}>
                                        {times[prayer]}
                                    </p>
                                </motion.div>
                            )
                        })}
                </div>
            </div>
        </motion.div>
    )
}
