import { createContext, useContext, useState, useEffect } from 'react'
import { posts as defaultPosts } from '../data/posts'
import { financeData as defaultFinance } from '../data/finance'

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
    const [posts, setPosts] = useState(() => loadFromStorage('mrj_posts', defaultPosts))
    const [finance, setFinance] = useState(() => loadFromStorage('mrj_finance', defaultFinance))

    useEffect(() => {
        localStorage.setItem('mrj_posts', JSON.stringify(posts))
    }, [posts])

    useEffect(() => {
        localStorage.setItem('mrj_finance', JSON.stringify(finance))
    }, [finance])

    // Posts CRUD
    const addPost = (post) => {
        const newPost = {
            ...post,
            id: Date.now(),
            date: post.date || new Date().toISOString().split('T')[0],
            image: post.image || null,
        }
        setPosts((prev) => [newPost, ...prev])
        return newPost
    }

    const updatePost = (id, updates) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    }

    const deletePost = (id) => {
        setPosts((prev) => prev.filter((p) => p.id !== id))
    }

    const getPost = (id) => posts.find((p) => p.id === Number(id))

    // Finance CRUD
    const addTransaction = (tx) => {
        const newTx = {
            ...tx,
            id: Date.now(),
            amount: Number(tx.amount),
        }
        setFinance((prev) => [newTx, ...prev])
        return newTx
    }

    const updateTransaction = (id, updates) => {
        setFinance((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updates, amount: Number(updates.amount || t.amount) } : t))
        )
    }

    const deleteTransaction = (id) => {
        setFinance((prev) => prev.filter((t) => t.id !== id))
    }

    const getTransaction = (id) => finance.find((t) => t.id === Number(id))

    // Finance summary
    const financeSummary = {
        totalIn: finance.filter((t) => t.type === 'in').reduce((sum, t) => sum + t.amount, 0),
        totalOut: finance.filter((t) => t.type === 'out').reduce((sum, t) => sum + t.amount, 0),
        get saldo() { return this.totalIn - this.totalOut },
        period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    }

    return (
        <DataContext.Provider
            value={{
                posts,
                finance,
                financeSummary,
                addPost,
                updatePost,
                deletePost,
                getPost,
                addTransaction,
                updateTransaction,
                deleteTransaction,
                getTransaction,
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
