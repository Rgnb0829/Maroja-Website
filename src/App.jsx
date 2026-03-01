import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

// Public
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Warta from './pages/Warta'
import WartaDetail from './pages/WartaDetail'
import Keuangan from './pages/Keuangan'
import Tentang from './pages/Tentang'
import Kontak from './pages/Kontak'

// Auth
import LoginJamaah from './pages/auth/LoginJamaah'
import RegisterJamaah from './pages/auth/RegisterJamaah'
import PendingVerification from './pages/auth/PendingVerification'

// Admin
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import PostsList from './pages/admin/PostsList'
import PostForm from './pages/admin/PostForm'
import FinanceList from './pages/admin/FinanceList'
import FinanceForm from './pages/admin/FinanceForm'
import UserList from './pages/admin/UserList'
import ProfileSettings from './pages/admin/ProfileSettings'
import PengurusList from './pages/admin/PengurusList'
import PengurusForm from './pages/admin/PengurusForm'
import InventarisList from './pages/admin/InventarisList'
import InventarisForm from './pages/admin/InventarisForm'
import JadwalJumatList from './pages/admin/JadwalJumatList'
import JadwalJumatForm from './pages/admin/JadwalJumatForm'
import ZakatList from './pages/admin/ZakatList'
import ZakatForm from './pages/admin/ZakatForm'

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
                            <Route path="warta/:id" element={<WartaDetail />} />

                            {/* Fitur Khusus Jamaah */}
                            <Route element={<ProtectedRoute allowedRoles={['jamaah', 'admin', 'superadmin']} requiresVerification={true} redirectTo="/login" />}>
                                <Route path="keuangan" element={<Keuangan />} />
                                <Route path="tentang" element={<Tentang />} />
                                <Route path="kontak" element={<Kontak />} />
                            </Route>
                        </Route>

                        {/* Auth / Jamaah */}
                        <Route path="/login" element={<LoginJamaah />} />
                        <Route path="/register" element={<RegisterJamaah />} />
                        <Route path="/pending" element={<PendingVerification />} />

                        {/* Admin */}
                        <Route path="/admin/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'superadmin']} redirectTo="/admin/login">
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
                            <Route path="users" element={<UserList />} />
                            <Route path="profile" element={<ProfileSettings />} />
                            <Route path="pengurus" element={<PengurusList />} />
                            <Route path="pengurus/new" element={<PengurusForm />} />
                            <Route path="pengurus/:id" element={<PengurusForm />} />
                            <Route path="inventaris" element={<InventarisList />} />
                            <Route path="inventaris/new" element={<InventarisForm />} />
                            <Route path="inventaris/:id" element={<InventarisForm />} />
                            <Route path="jumat" element={<JadwalJumatList />} />
                            <Route path="jumat/new" element={<JadwalJumatForm />} />
                            <Route path="jumat/:id" element={<JadwalJumatForm />} />
                            <Route path="zakat" element={<ZakatList />} />
                            <Route path="zakat/new" element={<ZakatForm />} />
                            <Route path="zakat/:id" element={<ZakatForm />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
                <SpeedInsights />
            </DataProvider>
        </AuthProvider>
    )
}

export default App
