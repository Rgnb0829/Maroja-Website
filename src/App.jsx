import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

// Public
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Warta from './pages/Warta'
import Keuangan from './pages/Keuangan'
import Tentang from './pages/Tentang'
import Kontak from './pages/Kontak'

// Admin
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import PostsList from './pages/admin/PostsList'
import PostForm from './pages/admin/PostForm'
import FinanceList from './pages/admin/FinanceList'
import FinanceForm from './pages/admin/FinanceForm'

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Beranda />} />
                            <Route path="warta" element={<Warta />} />
                            <Route path="keuangan" element={<Keuangan />} />
                            <Route path="tentang" element={<Tentang />} />
                            <Route path="kontak" element={<Kontak />} />
                        </Route>

                        {/* Admin */}
                        <Route path="/admin/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="posts" element={<PostsList />} />
                            <Route path="posts/new" element={<PostForm />} />
                            <Route path="posts/:id" element={<PostForm />} />
                            <Route path="keuangan" element={<FinanceList />} />
                            <Route path="keuangan/new" element={<FinanceForm />} />
                            <Route path="keuangan/:id" element={<FinanceForm />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
                <SpeedInsights />
            </DataProvider>
        </AuthProvider>
    )
}

export default App
