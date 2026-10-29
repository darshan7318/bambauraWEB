import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { toast } = useStore()

  const getIcon = () => {
    switch (toast?.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400" />
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />
    }
  }

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="px-5 py-3 rounded-full bg-[#240808]/95 dark:bg-[#150505]/95 backdrop-blur-md text-[#f7ebd9] border border-[#b28346]/40 shadow-2xl flex items-center gap-2.5 text-xs font-medium tracking-wide"
          >
            {getIcon()}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
