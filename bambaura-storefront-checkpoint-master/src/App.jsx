import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import RazorpayModal from './components/RazorpayModal'
import GoogleSSOModal from './components/GoogleSSOModal'
import ChatBubble from './components/ChatBubble'
import Toast from './components/Toast'

// Multi-Page Views
import Home from './pages/Home'
import Product from './pages/Product'
import Process from './pages/Process'
import Science from './pages/Science'
import Recipes from './pages/Recipes'
import About from './pages/About'
import Contact from './pages/Contact'
import Affiliate from './pages/Affiliate'
import Admin from './pages/Admin'

// Helper component: Automatically scrolls window to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#faf5ee] dark:bg-[#120505] text-[#2c1714] dark:text-[#fdfbf7] selection:bg-[#b28346] selection:text-white transition-colors duration-300">
        <ScrollToTop />
        
        {/* GLOBAL NAVIGATION HEADER */}
        <Navbar />

        {/* INTERACTIVE MODALS & DRAWERS */}
        <Toast />
        <CartDrawer />
        <RazorpayModal />
        <GoogleSSOModal />
        <ChatBubble />

        {/* MULTI-PAGE ROUTE OUTLET */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/process" element={<Process />} />
            <Route path="/science" element={<Science />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* GLOBAL LUXURY FOOTER */}
        <Footer />
      </div>
    </StoreProvider>
  )
}
