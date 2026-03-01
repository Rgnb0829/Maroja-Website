import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, ImagePlus, X } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

const categoryOptions = ['Kajian', 'Jumat Berkah', 'Pengumuman']

export default function PostForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addPost, updatePost, getPost } = useData()
    const isEdit = !!id

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        category: 'Pengumuman',
        date: new Date().toISOString().split('T')[0],
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const post = getPost(id)
            if (post) {
                setForm({
                    title: post.title,
                    excerpt: post.excerpt,
                    category: post.category,
                    date: post.date,
                })
                if (post.image) setImagePreview(post.image)
            } else {
                navigate('/admin/posts')
            }
        }
    }, [id])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 2MB')
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        const postData = { ...form, image: imagePreview }

        try {
            if (isEdit) {
                await updatePost(Number(id), postData)
            } else {
                await addPost(postData)
            }
            navigate('/admin/posts')
        } catch (error) {
            console.error("Error saving post:", error)
            alert("Gagal menyimpan berita. Silakan coba lagi.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/posts')}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Berita' : 'Tambah Berita'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit ? 'Perbarui konten berita' : 'Buat berita atau pengumuman baru'}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Berita</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            placeholder="Masukkan judul berita"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none"
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Isi / Ringkasan</label>
                        <textarea
                            rows={5}
                            required
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                            placeholder="Tulis isi atau ringkasan berita..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Berita</label>
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-all">
                                <ImagePlus size={28} className="text-gray-300 mb-2" />
                                <span className="text-sm text-gray-400">Klik untuk upload foto</span>
                                <span className="text-xs text-gray-300 mt-1">JPG, PNG maks. 2MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/posts')}
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
                            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Berita'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
