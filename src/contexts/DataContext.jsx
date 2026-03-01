import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { posts as defaultPosts } from '../data/posts'
import { financeData as defaultFinance } from '../data/finance'
import { profileData as defaultProfile } from '../data/profile'
import { pengurusData as defaultPengurus } from '../data/pengurus'
import { inventarisData as defaultInventaris } from '../data/inventaris'

const DataContext = createContext(null)

function loadFromStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : fallback
    } catch {
        return fallback
    }
}

export function DataProvider({ children }) {
    const [posts, setPosts] = useState([])
    const [finance, setFinance] = useState([])
    const [profile, setProfile] = useState({})
    const [pengurus, setPengurus] = useState([])
    const [inventaris, setInventaris] = useState([])
    const [jumatSchedules, setJumatSchedules] = useState([])
    const [zakatDistribution, setZakatDistribution] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Initial Data Fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true)
            try {
                // Fetch in parallel for better performance
                const [
                    { data: postsData },
                    { data: financeData },
                    { data: profileData },
                    { data: pengurusData },
                    { data: inventarisData },
                    { data: jumatSchedulesData },
                    { data: zakatData }
                ] = await Promise.all([
                    supabase.from('posts').select('*').order('date', { ascending: false }),
                    supabase.from('finance').select('*').order('date', { ascending: false }),
                    supabase.from('profiles_masjid').select('*').limit(1).single(),
                    supabase.from('pengurus').select('*').order('id', { ascending: true }),
                    supabase.from('inventaris').select('*').order('name', { ascending: true }),
                    supabase.from('jumat_schedules').select('*').order('tanggal', { ascending: false }),
                    supabase.from('zakat_qurban_distribution').select('*').order('tanggal', { ascending: false })
                ])

                setPosts(postsData || [])
                setFinance(financeData || [])
                setProfile(profileData || {})
                setPengurus(pengurusData || [])
                setInventaris(inventarisData || [])
                setJumatSchedules(jumatSchedulesData || [])
                setZakatDistribution(zakatData || [])
            } catch (error) {
                console.error("Error fetching initial data from Supabase:", error)
                // Fallback to empty states if error
            } finally {
                setIsLoading(false)
            }
        }

        fetchAllData()
    }, [])

    // Posts CRUD
    const addPost = async (post) => {
        const { data, error } = await supabase
            .from('posts')
            .insert([{ ...post, date: post.date || new Date().toISOString().split('T')[0] }])
            .select()
            .single()

        if (error) throw error
        setPosts((prev) => [data, ...prev])
        return data
    }

    const updatePost = async (id, updates) => {
        const { error } = await supabase.from('posts').update(updates).eq('id', id)
        if (error) throw error
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    }

    const deletePost = async (id) => {
        const { error } = await supabase.from('posts').delete().eq('id', id)
        if (error) throw error
        setPosts((prev) => prev.filter((p) => p.id !== id))
    }

    const getPost = (id) => posts.find((p) => p.id === Number(id))

    // Finance CRUD
    const addTransaction = async (tx) => {
        const { data, error } = await supabase
            .from('finance')
            .insert([{ ...tx, amount: Number(tx.amount) }])
            .select()
            .single()

        if (error) throw error
        setFinance((prev) => [data, ...prev])
        return data
    }

    const updateTransaction = async (id, updates) => {
        const { error } = await supabase.from('finance').update({ ...updates, amount: Number(updates.amount || 0) }).eq('id', id)
        if (error) throw error
        setFinance((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updates, amount: Number(updates.amount || t.amount) } : t))
        )
    }

    const deleteTransaction = async (id) => {
        const { error } = await supabase.from('finance').delete().eq('id', id)
        if (error) throw error
        setFinance((prev) => prev.filter((t) => t.id !== id))
    }

    const getTransaction = (id) => finance.find((t) => t.id === Number(id))

    // Finance summary
    const financeSummary = {
        totalIn: finance.filter((t) => t.type === 'in').reduce((sum, t) => sum + Number(t.amount), 0),
        totalOut: finance.filter((t) => t.type === 'out').reduce((sum, t) => sum + Number(t.amount), 0),
        get saldo() { return this.totalIn - this.totalOut },
        period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    }

    // Profile update
    const updateProfile = async (updates) => {
        const { error } = await supabase.from('profiles_masjid').update(updates).eq('id', 1)
        if (error) throw error
        setProfile((prev) => ({ ...prev, ...updates }))
    }

    // Pengurus CRUD
    const addPengurus = async (person) => {
        const { data, error } = await supabase.from('pengurus').insert([person]).select().single()
        if (error) throw error
        setPengurus((prev) => [...prev, data])
        return data
    }

    const updatePengurus = async (id, updates) => {
        const { error } = await supabase.from('pengurus').update(updates).eq('id', id)
        if (error) throw error
        setPengurus((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    }

    const deletePengurus = async (id) => {
        const { error } = await supabase.from('pengurus').delete().eq('id', id)
        if (error) throw error
        setPengurus((prev) => prev.filter((p) => p.id !== id))
    }

    const getPengurus = (id) => pengurus.find((p) => p.id === Number(id))

    // Inventaris CRUD
    const addInventaris = async (item) => {
        const { data, error } = await supabase.from('inventaris').insert([{ ...item, quantity: Number(item.quantity) }]).select().single()
        if (error) throw error
        setInventaris((prev) => [...prev, data])
        return data
    }

    const updateInventaris = async (id, updates) => {
        const { error } = await supabase.from('inventaris').update({ ...updates, quantity: updates.quantity ? Number(updates.quantity) : 0 }).eq('id', id)
        if (error) throw error
        setInventaris((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates, quantity: updates.quantity ? Number(updates.quantity) : item.quantity } : item)))
    }

    const deleteInventaris = async (id) => {
        const { error } = await supabase.from('inventaris').delete().eq('id', id)
        if (error) throw error
        setInventaris((prev) => prev.filter((item) => item.id !== id))
    }

    const getInventarisItem = (id) => inventaris.find((item) => item.id === Number(id))

    // Jumat Schedules CRUD
    const addJumatSchedule = async (schedule) => {
        const { data, error } = await supabase.from('jumat_schedules').insert([schedule]).select().single()
        if (error) throw error
        // Ensure date ordering after adding
        setJumatSchedules((prev) => [...prev, data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)))
        return data
    }

    const updateJumatSchedule = async (id, updates) => {
        const { error } = await supabase.from('jumat_schedules').update(updates).eq('id', id)
        if (error) throw error
        setJumatSchedules((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updates } : s)).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        )
    }

    const deleteJumatSchedule = async (id) => {
        const { error } = await supabase.from('jumat_schedules').delete().eq('id', id)
        if (error) throw error
        setJumatSchedules((prev) => prev.filter((s) => s.id !== id))
    }

    const getJumatSchedule = (id) => jumatSchedules.find((s) => s.id === Number(id))

    // Zakat Qurban Distribution CRUD
    const addZakatDistribution = async (data) => {
        const { data: result, error } = await supabase.from('zakat_qurban_distribution').insert([data]).select().single()
        if (error) throw error
        setZakatDistribution((prev) => [result, ...prev].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)))
        return result
    }

    const updateZakatDistribution = async (id, updates) => {
        const { error } = await supabase.from('zakat_qurban_distribution').update(updates).eq('id', id)
        if (error) throw error
        setZakatDistribution((prev) =>
            prev.map((z) => (z.id === id ? { ...z, ...updates } : z)).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        )
    }

    const deleteZakatDistribution = async (id) => {
        const { error } = await supabase.from('zakat_qurban_distribution').delete().eq('id', id)
        if (error) throw error
        setZakatDistribution((prev) => prev.filter((z) => z.id !== id))
    }

    const getZakatDistribution = (id) => zakatDistribution.find((z) => z.id === Number(id))

    return (
        <DataContext.Provider
            value={{
                posts,
                finance,
                financeSummary,
                profile,
                pengurus,
                inventaris,
                addPost,
                updatePost,
                deletePost,
                getPost,
                addTransaction,
                updateTransaction,
                deleteTransaction,
                getTransaction,
                updateProfile,
                addPengurus,
                updatePengurus,
                deletePengurus,
                getPengurus,
                addInventaris,
                updateInventaris,
                deleteInventaris,
                getInventarisItem,
                jumatSchedules,
                addJumatSchedule,
                updateJumatSchedule,
                deleteJumatSchedule,
                getJumatSchedule,
                zakatDistribution,
                addZakatDistribution,
                updateZakatDistribution,
                deleteZakatDistribution,
                getZakatDistribution
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (!context) throw new Error('useData must be used within DataProvider')
    return context
}
