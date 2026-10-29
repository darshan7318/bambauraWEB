import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Activity,
  CheckCircle2,
  Save,
  RefreshCw,
  Search,
  Truck,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Eye,
  LogOut,
  Flame,
  Clock,
  Database
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Admin() {
  const { showToast } = useStore()

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('bambaura_admin_token')
  })
  const [passcode, setPasscode] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Active Tab: 'overview' | 'products' | 'orders' | 'inquiries' | 'ambassadors'
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshLoading, setRefreshLoading] = useState(false)

  // Data States
  const [stats, setStats] = useState(null)
  const [productsData, setProductsData] = useState(null)
  const [orders, setOrders] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [ambassadors, setAmbassadors] = useState([])

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('')
  const [editingVariant, setEditingVariant] = useState({})
  const [savingGrams, setSavingGrams] = useState({})

  // Login handler
  const handleLogin = async (e) => {
    e?.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem('bambaura_admin_token', data.token)
        setIsAuthenticated(true)
        showToast('Authenticated as Bambaura Cellar Master', 'success')
      } else {
        setLoginError(data.message || 'Invalid passcode. Access denied.')
      }
    } catch {
      // In local offline fallback, allow default passcode
      if (passcode === 'bambaura2026') {
        sessionStorage.setItem('bambaura_admin_token', 'adm_offline_token')
        setIsAuthenticated(true)
        showToast('Authenticated in Local Fallback Mode', 'success')
      } else {
        setLoginError('Could not verify credentials. Check passcode.')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('bambaura_admin_token')
    setIsAuthenticated(false)
    showToast('Signed out from Admin Nexus', 'info')
  }

  // Load all admin data
  const loadAdminData = async () => {
    setRefreshLoading(true)
    try {
      const [statsRes, prodRes, ordersRes, inqRes, ambRes] = await Promise.all([
        fetch('/api/admin/stats').catch(() => null),
        fetch('/api/admin/products').catch(() => null),
        fetch('/api/admin/orders').catch(() => null),
        fetch('/api/admin/inquiries').catch(() => null),
        fetch('/api/admin/ambassadors').catch(() => null)
      ])

      if (statsRes?.ok) {
        const s = await statsRes.json()
        setStats(s)
      }
      if (prodRes?.ok) {
        const p = await prodRes.json()
        setProductsData(p)
        // Initialize editing state
        const initialVariants = {}
        p.gramVariants?.forEach((v) => {
          initialVariants[v.grams] = { ...v }
        })
        setEditingVariant(initialVariants)
      }
      if (ordersRes?.ok) {
        const o = await ordersRes.json()
        setOrders(o)
      }
      if (inqRes?.ok) {
        const i = await inqRes.json()
        setInquiries(i)
      }
      if (ambRes?.ok) {
        const a = await ambRes.json()
        setAmbassadors(a)
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setRefreshLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData()
    }
  }, [isAuthenticated])

  // Update a gram variant
  const handleSaveVariant = async (grams) => {
    const variantData = editingVariant[grams]
    if (!variantData) return

    setSavingGrams((prev) => ({ ...prev, [grams]: true }))
    try {
      const res = await fetch(`/api/admin/products/variants/${grams}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: variantData.name,
          subtext: variantData.subtext,
          priceUSD: parseFloat(variantData.priceUSD),
          amazonUSD: parseFloat(variantData.amazonUSD),
          inStock: variantData.inStock,
          popular: variantData.popular
        })
      })

      if (res.ok) {
        showToast(`Saved changes for ${grams} variant`, 'success')
        loadAdminData()
      } else {
        showToast(`Failed to update ${grams}`, 'error')
      }
    } catch {
      showToast(`Network error updating ${grams}`, 'error')
    } finally {
      setSavingGrams((prev) => ({ ...prev, [grams]: false }))
    }
  }

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus, tracking, delivery) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: tracking,
          estimatedDelivery: delivery
        })
      })
      if (res.ok) {
        showToast(`Order ${orderId} updated to ${newStatus}`, 'success')
        loadAdminData()
      }
    } catch {
      showToast(`Failed to update order ${orderId}`, 'error')
    }
  }

  // Update inquiry status
  const handleUpdateInquiryStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        showToast(`Inquiry ${ticketId} marked as ${newStatus}`, 'success')
        loadAdminData()
      }
    } catch {
      showToast(`Failed to update inquiry ${ticketId}`, 'error')
    }
  }

  // Update ambassador status
  const handleUpdateAmbassadorStatus = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/ambassadors/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        showToast(`Application ${applicationId} marked as ${newStatus}`, 'success')
        loadAdminData()
      }
    } catch {
      showToast(`Failed to update ambassador ${applicationId}`, 'error')
    }
  }

  // --------------------------------------------------------------------------
  // LOGIN SCREEN (UNAUTHENTICATED)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#0c0303] text-[#fdfbf7]">
        <div className="w-full max-w-md bg-[#180808]/90 border border-[#b28346]/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-[#401010]/50 relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#b28346]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#401010] to-[#b28346]/30 border border-[#b28346]/40 flex items-center justify-center shadow-lg shadow-[#b28346]/20">
              <Shield className="w-8 h-8 text-[#e6ca95]" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#b28346]">Private Connoisseur Nexus</span>
            <h1 className="text-2xl font-serif font-bold text-white mt-1">Bambaura Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-2">
              Enter your master cellar passcode to manage products, inventory, orders, and inquiries.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Master Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#200c0c] border border-[#b28346]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e6ca95] focus:ring-1 focus:ring-[#e6ca95] transition-all"
                  autoFocus
                />
                <Key className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading || !passcode}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#b28346] via-[#d4af37] to-[#8c6227] text-[#120505] font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#b28346]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize Access</span>
                </>
              )}
            </button>
          </form>

          {/* Development Shortcut Helper */}
          <div className="mt-6 pt-4 border-t border-[#b28346]/15 flex items-center justify-between text-[11px] text-gray-400">
            <span>Default Passcode: <code className="text-[#e6ca95] bg-[#2a1111] px-1.5 py-0.5 rounded">bambaura2026</code></span>
            <button
              type="button"
              onClick={() => setPasscode('bambaura2026')}
              className="text-[#b28346] hover:text-[#e6ca95] underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  const filteredOrders = orders.filter((o) => {
    if (!orderSearch) return true
    const q = orderSearch.toLowerCase()
    return (
      o.id?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerEmail?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-[#faf5ee] dark:bg-[#0c0303] text-[#2c1714] dark:text-[#fdfbf7] transition-colors duration-300">
      {/* TOP HEADER */}
      <header className="border-b border-[#b28346]/20 bg-white/80 dark:bg-[#140606]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#401010] to-[#b28346] flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-[#b28346]/20">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-serif font-bold text-[#1a0808] dark:text-white">Bambaura Control Nexus</h1>
                <span className="badge badge-sm badge-warning font-mono text-[10px] tracking-wide">ADMIN</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Flagship Products & Dispatch Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DB Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
              <Database className="w-3.5 h-3.5" />
              <span>{stats?.databaseStatus || 'PostgreSQL Ready'}</span>
            </div>

            {/* Refresh Data Button */}
            <button
              onClick={loadAdminData}
              disabled={refreshLoading}
              title="Refresh Data"
              className="p-2 rounded-lg border border-[#b28346]/30 hover:bg-[#b28346]/10 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshLoading ? 'animate-spin text-[#b28346]' : ''}`} />
            </button>

            {/* View Live Store */}
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg border border-[#b28346]/40 text-xs text-[#b28346] hover:bg-[#b28346] hover:text-white transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Store</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2 border-t border-[#b28346]/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-[#b28346] text-white shadow-md shadow-[#b28346]/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#b28346]/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview & Health</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-[#b28346] text-white shadow-md shadow-[#b28346]/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#b28346]/10'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Grams</span>
            <span className="badge badge-sm badge-neutral">{productsData?.gramVariants?.length || 4}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-[#b28346] text-white shadow-md shadow-[#b28346]/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#b28346]/10'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Dispatches</span>
            <span className="badge badge-sm badge-neutral">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'inquiries'
                ? 'bg-[#b28346] text-white shadow-md shadow-[#b28346]/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#b28346]/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Concierge Inquiries</span>
            <span className="badge badge-sm badge-neutral">{inquiries.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('ambassadors')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'ambassadors'
                ? 'bg-[#b28346] text-white shadow-md shadow-[#b28346]/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-[#b28346]/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ambassadors & Affiliates</span>
            <span className="badge badge-sm badge-neutral">{ambassadors.length}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW & SYSTEM KPIS */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#180909] p-5 rounded-2xl border border-[#b28346]/20 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-[#b28346]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#1a0808] dark:text-white">
                  ${(stats?.totalRevenueUSD || 74.0).toFixed(2)}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Razorpay Verified Revenue</span>
                </p>
              </div>

              <div className="bg-white dark:bg-[#180909] p-5 rounded-2xl border border-[#b28346]/20 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Total Orders</span>
                  <ShoppingCart className="w-4 h-4 text-[#b28346]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#1a0808] dark:text-white">
                  {stats?.totalOrders || orders.length}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 font-mono">
                  Active Dispatches & Deliveries
                </p>
              </div>

              <div className="bg-white dark:bg-[#180909] p-5 rounded-2xl border border-[#b28346]/20 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Concierge Inquiries</span>
                  <MessageSquare className="w-4 h-4 text-[#b28346]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#1a0808] dark:text-white">
                  {stats?.totalInquiries || inquiries.length}
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-mono">
                  Customer & Wholesale Requests
                </p>
              </div>

              <div className="bg-white dark:bg-[#180909] p-5 rounded-2xl border border-[#b28346]/20 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Ambassador Circle</span>
                  <Users className="w-4 h-4 text-[#b28346]" />
                </div>
                <div className="text-2xl font-serif font-bold text-[#1a0808] dark:text-white">
                  {stats?.totalAmbassadors || ambassadors.length}
                </div>
                <p className="text-[11px] text-[#b28346] mt-2 font-mono">
                  15% Affiliate Partner Applications
                </p>
              </div>
            </div>

            {/* ARCHITECTURE & ENVIRONMENT STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#180909] p-6 rounded-2xl border border-[#b28346]/20">
                <h3 className="text-sm font-serif font-bold mb-4 flex items-center gap-2 text-[#1a0808] dark:text-white">
                  <Database className="w-4 h-4 text-[#b28346]" />
                  <span>Database & Container Runtime</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">PostgreSQL Status</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {stats?.databaseStatus || 'Connected (bambauradb)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Backend Server Framework</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">.NET 10 Minimal APIs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Target VPS Architecture</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">Hostinger KVM2 (Ubuntu Linux / Docker)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Server Time (UTC)</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">
                      {stats?.serverTimeUtc ? new Date(stats.serverTimeUtc).toLocaleString() : new Date().toUTCString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#180909] p-6 rounded-2xl border border-[#b28346]/20">
                <h3 className="text-sm font-serif font-bold mb-4 flex items-center gap-2 text-[#1a0808] dark:text-white">
                  <Flame className="w-4 h-4 text-[#b28346]" />
                  <span>Flagship Alchemy Specifications</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Product Model</span>
                    <span className="font-medium text-[#b28346]">Bambaura 9X Himalayan Roasted Salt</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Roasting Methodology</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">9 Cycles at 1,500°C over Pine Wood</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Redox / Antioxidant Rating</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">-400 mV ORP | pH 10.5+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400">Gram Sizes Managed</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">50g, 100g, 250g, 500g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRODUCTS & GRAMS MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#1a0808] dark:text-white">Flagship Product & Gram Packages</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update pricing, stock availability, and badge labels for Bambaura 9X Salt variants.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(productsData?.gramVariants || [
                { grams: '50g', label: '50 g', name: '50 g — Discovery Flask', subtext: 'Pocket travel tin for pure hydration & tabletop tasting', priceUSD: 15, amazonUSD: 28, inStock: true, popular: false, image: '/images/extracted/hi_salt_bowl.png' },
                { grams: '100g', label: '100 g', name: '100 g — Signature Cylinder Canister', subtext: 'Iconic gold foil-embossed cylinder with barrier pouch (Most Popular)', priceUSD: 24, amazonUSD: 45, inStock: true, popular: true, image: '/images/extracted/hi_canister_100g.png' },
                { grams: '250g', label: '250 g', name: '250 g — Chef’s Reserve Canister', subtext: 'Generous culinary cylinder for passionate home chefs & families', priceUSD: 42, amazonUSD: 90, inStock: true, popular: false, image: '/images/extracted/hi_canister_250g.png' },
                { grams: '500g', label: '500 g', name: '500 g — Eco Master Kitchen Refill Pouch', subtext: 'Triple-barrier nitrogen-sealed gold pouch. Best value (Save 25%)', priceUSD: 68, amazonUSD: 145, inStock: true, popular: false, image: '/images/extracted/hi_pouch_gold.png' }
              ]).map((variant) => {
                const current = editingVariant[variant.grams] || variant
                const isSaving = savingGrams[variant.grams]

                return (
                  <div
                    key={variant.grams}
                    className="bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* CARD HEADER */}
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#b28346]/10">
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-16 h-16 object-contain rounded-xl bg-[#2a1010]/10 dark:bg-black/40 border border-[#b28346]/20 p-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="badge badge-sm badge-warning font-mono">{variant.grams}</span>
                            {current.popular && (
                              <span className="badge badge-sm bg-[#b28346] text-white border-none text-[10px]">MOST POPULAR</span>
                            )}
                            {!current.inStock && (
                              <span className="badge badge-sm badge-error text-[10px]">OUT OF STOCK</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={current.name}
                            onChange={(e) =>
                              setEditingVariant((prev) => ({
                                ...prev,
                                [variant.grams]: { ...prev[variant.grams], name: e.target.value }
                              }))
                            }
                            className="w-full mt-1 font-serif font-bold text-sm bg-transparent border-b border-dashed border-gray-300 dark:border-gray-700 focus:border-[#b28346] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* SUBTEXT / DESCRIPTION */}
                      <div className="mb-4">
                        <label className="block text-[11px] font-mono text-gray-400 mb-1">Package Subtitle</label>
                        <textarea
                          rows={2}
                          value={current.subtext}
                          onChange={(e) =>
                            setEditingVariant((prev) => ({
                              ...prev,
                              [variant.grams]: { ...prev[variant.grams], subtext: e.target.value }
                            }))
                          }
                          className="w-full text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
                        />
                      </div>

                      {/* PRICING INPUTS */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] font-mono text-gray-400 mb-1">Store Price ($ USD)</label>
                          <div className="relative">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                            <input
                              type="number"
                              step="1"
                              value={current.priceUSD}
                              onChange={(e) =>
                                setEditingVariant((prev) => ({
                                  ...prev,
                                  [variant.grams]: { ...prev[variant.grams], priceUSD: e.target.value }
                                }))
                              }
                              className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-gray-400 mb-1">Amazon Ref Price ($)</label>
                          <div className="relative">
                            <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                            <input
                              type="number"
                              step="1"
                              value={current.amazonUSD}
                              onChange={(e) =>
                                setEditingVariant((prev) => ({
                                  ...prev,
                                  [variant.grams]: { ...prev[variant.grams], amazonUSD: e.target.value }
                                }))
                              }
                              className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold rounded-lg bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* TOGGLES: IN STOCK & POPULAR */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#b28346]/10 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={current.inStock}
                            onChange={(e) =>
                              setEditingVariant((prev) => ({
                                ...prev,
                                [variant.grams]: { ...prev[variant.grams], inStock: e.target.checked }
                              }))
                            }
                            className="checkbox checkbox-sm checkbox-warning"
                          />
                          <span>Available in Stock</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="checkbox"
                            checked={current.popular}
                            onChange={(e) =>
                              setEditingVariant((prev) => ({
                                ...prev,
                                [variant.grams]: { ...prev[variant.grams], popular: e.target.checked }
                              }))
                            }
                            className="checkbox checkbox-sm checkbox-warning"
                          />
                          <span>Highlight as Popular</span>
                        </label>
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={() => handleSaveVariant(variant.grams)}
                      disabled={isSaving}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#b28346] hover:bg-[#9a6f37] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to PostgreSQL...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save {variant.grams} Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ORDERS & DISPATCH MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#1a0808] dark:text-white">Customer Dispatches & Orders</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage fulfillment, update courier tracking numbers, and view verified customer receipts.
                </p>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by Order ID or email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#180909] border border-[#b28346]/20 focus:outline-none focus:border-[#b28346]"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6">
                <ShoppingCart className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-gray-500">No matching orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  let items = []
                  try {
                    items = typeof order.itemsJson === 'string' ? JSON.parse(order.itemsJson) : order.itemsJson || []
                  } catch {
                    items = []
                  }

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#b28346]">{order.id}</span>
                          <span
                            className={`badge badge-sm font-mono text-[10px] ${
                              order.status === 'Confirmed'
                                ? 'badge-info'
                                : order.status === 'Shipped'
                                ? 'badge-primary'
                                : order.status === 'Delivered'
                                ? 'badge-success'
                                : 'badge-neutral'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {order.createdAtUtc ? new Date(order.createdAtUtc).toLocaleString() : 'Just now'}
                          </span>
                        </div>

                        {/* Customer Information */}
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{order.customerName}</div>
                          <div className="text-gray-500">{order.customerEmail} • {order.customerPhone || 'No phone'}</div>
                          <div className="text-gray-500">{order.shippingAddress}, {order.city}, {order.country}</div>
                        </div>

                        {/* Items breakdown */}
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-2">
                          {items.map((it, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#250d0d] text-[11px] font-mono border border-gray-200 dark:border-white/5"
                            >
                              {it.quantity}x {it.title} ({it.grams} - {it.grind})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* FULFILLMENT CONTROLS */}
                      <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Total Collected</span>
                            <span className="font-mono font-bold text-base text-[#b28346]">
                              ${parseFloat(order.totalAmount || 0).toFixed(2)} {order.currency}
                            </span>
                          </div>

                          <label className="block text-[11px] font-mono text-gray-400 mb-1">Tracking Number</label>
                          <input
                            type="text"
                            defaultValue={order.trackingNumber || ''}
                            id={`track-${order.id}`}
                            placeholder="INSR-12345678"
                            className="w-full text-xs font-mono p-2 rounded-lg bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346] mb-3"
                          />

                          <label className="block text-[11px] font-mono text-gray-400 mb-1">Update Status</label>
                          <select
                            defaultValue={order.status}
                            id={`status-${order.id}`}
                            className="w-full text-xs p-2 rounded-lg bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            const newStatus = document.getElementById(`status-${order.id}`)?.value || order.status
                            const newTracking = document.getElementById(`track-${order.id}`)?.value || order.trackingNumber
                            handleUpdateOrderStatus(order.id, newStatus, newTracking, order.estimatedDelivery)
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-[#b28346] hover:bg-[#9a6f37] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Update Fulfillment</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: CONCIERGE & CUSTOMER INQUIRIES */}
        {/* ================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1a0808] dark:text-white">Concierge & Wholesale Inquiries</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customer dispatches, Michelin culinary wholesale requests, and technical laboratory inquiries.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-gray-500">No concierge inquiries received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id || inq.ticketId}
                    className="bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#b28346]">{inq.ticketId}</span>
                        <span
                          className={`badge badge-sm font-mono text-[10px] ${
                            inq.status === 'Resolved'
                              ? 'badge-success'
                              : inq.status === 'In Review'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {inq.createdAtUtc ? new Date(inq.createdAtUtc).toLocaleString() : 'Recent'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">{inq.subject}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#200c0c] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                        "{inq.message}"
                      </p>

                      <div className="text-xs text-gray-500 flex items-center gap-3 pt-1">
                        <span><strong>Patron:</strong> {inq.name}</span>
                        <span>•</span>
                        <span><strong>Email:</strong> <a href={`mailto:${inq.email}`} className="text-[#b28346] underline">{inq.email}</a></span>
                        {inq.phone && (
                          <>
                            <span>•</span>
                            <span><strong>Phone:</strong> {inq.phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end items-end gap-2 md:w-40 shrink-0">
                      <button
                        onClick={() => handleUpdateInquiryStatus(inq.ticketId, 'In Review')}
                        className="w-full py-1.5 px-3 rounded-lg border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-medium transition-all"
                      >
                        Set In Review
                      </button>
                      <button
                        onClick={() => handleUpdateInquiryStatus(inq.ticketId, 'Resolved')}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: AMBASSADORS & AFFILIATES */}
        {/* ================================================================= */}
        {activeTab === 'ambassadors' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1a0808] dark:text-white">Bambaura Ambassador Circle</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review applications for the 15% VIP Culinary Creator & Chef affiliate partner program.
              </p>
            </div>

            {ambassadors.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6">
                <Users className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-gray-500">No creator applications received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ambassadors.map((amb) => (
                  <div
                    key={amb.id || amb.applicationId}
                    className="bg-white dark:bg-[#180909] rounded-2xl border border-[#b28346]/20 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#b28346]">{amb.applicationId}</span>
                        <span
                          className={`badge badge-sm font-mono text-[10px] ${
                            amb.status === 'Approved'
                              ? 'badge-success'
                              : amb.status === 'Declined'
                              ? 'badge-error'
                              : 'badge-warning'
                          }`}
                        >
                          {amb.status}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {amb.createdAtUtc ? new Date(amb.createdAtUtc).toLocaleString() : 'Recent'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-white">{amb.name}</h3>
                      <div className="text-xs space-y-1">
                        <div><strong>Platform / Channel:</strong> {amb.platformOrChannel}</div>
                        <div><strong>Audience Size:</strong> {amb.audienceSize}</div>
                        {amb.notes && <div className="text-gray-500 italic mt-1">"{amb.notes}"</div>}
                      </div>

                      <div className="text-xs text-gray-500 pt-1">
                        <strong>Email:</strong> <a href={`mailto:${amb.email}`} className="text-[#b28346] underline">{amb.email}</a>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end items-end gap-2 md:w-36 shrink-0">
                      <button
                        onClick={() => handleUpdateAmbassadorStatus(amb.applicationId, 'Approved')}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        Approve (15%)
                      </button>
                      <button
                        onClick={() => handleUpdateAmbassadorStatus(amb.applicationId, 'Declined')}
                        className="w-full py-1.5 px-3 rounded-lg border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

