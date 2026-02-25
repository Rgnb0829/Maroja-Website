import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode, Smartphone } from 'lucide-react'

export default function QrisModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-5 text-center relative">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <QrCode size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Infaq Digital</h3>
                            <p className="text-white/70 text-sm mt-1">Masjid Raudhatul Jannah</p>
                        </div>

                        {/* QRIS Placeholder */}
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-xl p-6 mb-4 border-2 border-dashed border-primary/20">
                                <div className="aspect-square max-w-[220px] mx-auto bg-white rounded-lg flex flex-col items-center justify-center p-4 border border-gray-200">
                                    <QrCode size={80} className="text-primary/30 mb-3" />
                                    <p className="text-xs text-gray-400 text-center">QRIS Code</p>
                                    <p className="text-xs text-gray-400 text-center">akan ditampilkan di sini</p>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-accent rounded-xl p-4 mb-4">
                                <p className="text-xs text-primary/60 font-medium mb-1">Rekening BCA</p>
                                <p className="text-primary font-bold text-lg">xxx-xxx-xxxx</p>
                                <p className="text-primary/70 text-sm">a.n. Masjid Raudhatul Jannah</p>
                            </div>

                            {/* Instructions */}
                            <div className="flex items-start gap-3 text-sm text-gray-500">
                                <Smartphone size={18} className="text-primary/50 mt-0.5 shrink-0" />
                                <p>Screenshot QRIS di atas, lalu buka aplikasi m-Banking atau e-Wallet Anda untuk melakukan pembayaran.</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
