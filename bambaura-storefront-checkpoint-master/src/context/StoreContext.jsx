import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import INITIAL_REGIONS from '../data/regions.json'
import INITIAL_PRODUCT from '../data/product.json'

const StoreContext = createContext()

export const COUNTRIES_DATA = INITIAL_REGIONS
export const FLAGSHIP_PRODUCT = INITIAL_PRODUCT

export function StoreProvider({ children }) {
  // 1. Toast Notification System (Declared first for safe hoisting in all handlers)
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  // Product Data state (seeded with FLAGSHIP_PRODUCT and synced with backend /api/products)
  const [productData, setProductData] = useState(FLAGSHIP_PRODUCT)

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('API offline')
      })
      .then(data => {
        if (data && data.gramVariants) {
          setProductData(prev => ({
            ...prev,
            name: data.name || prev.name,
            tagline: data.tagline || prev.tagline,
            shortDescription: data.shortDescription || prev.shortDescription,
            gramVariants: data.gramVariants
          }))
        }
      })
      .catch(() => {
        // Safe offline fallback
      })
  }, [])
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bambaura_theme') || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('bambaura_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'bambauraDark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'bambauraLight')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Regions & Currency Data state (seeded with regions.json and synced with backend /api/regions)
  const [regionsData, setRegionsData] = useState(COUNTRIES_DATA)

  useEffect(() => {
    fetch('/api/regions')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          const normalized = {}
          Object.entries(data).forEach(([k, v]) => {
            normalized[k] = {
              name: v.name || v.Name,
              flag: v.flag || v.Flag,
              code: v.currencyCode || v.CurrencyCode || v.code || v.Code,
              symbol: v.currencySymbol || v.CurrencySymbol || v.symbol || v.Symbol,
              rate: v.exchangeRate || v.ExchangeRate || v.rate || 1,
              freeShip: v.freeShippingThreshold || v.FreeShippingThreshold || v.freeShip || 50,
              amazonDomain: v.amazonDomain || v.AmazonDomain || 'amazon.com'
            }
          })
          setRegionsData(prev => ({ ...prev, ...normalized }))
        }
      })
      .catch(() => {})
  }, [])

  // 2. Global Country / Currency State (Default to US, auto-detect IP, strictly IN/US/GB)
  const [country, setCountry] = useState(() => {
    const saved = localStorage.getItem('bambaura_country')
    if (saved && ['IN', 'US', 'GB'].includes(saved)) return saved
    return 'US'
  })

  // IP Geolocation Auto-Detection
  useEffect(() => {
    const saved = localStorage.getItem('bambaura_country')
    if (!saved) {
      const detectUserCountry = async () => {
        try {
          const res = await fetch('https://api.country.is/', { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            const code = (data?.country || '').toUpperCase()
            if (code === 'IN') {
              setCountry('IN')
            } else if (code === 'GB' || code === 'UK') {
              setCountry('GB')
            } else {
              setCountry('US')
            }
            return
          }
        } catch {
          // Primary failed, try fallback
        }

        try {
          const res2 = await fetch('https://ipapi.co/json/')
          if (res2.ok) {
            const data2 = await res2.json()
            const code2 = (data2?.country_code || '').toUpperCase()
            if (code2 === 'IN') setCountry('IN')
            else if (code2 === 'GB' || code2 === 'UK') setCountry('GB')
            else setCountry('US')
            return
          }
        } catch {
          // If offline or blocked, stay on default US
          setCountry('US')
        }
      }

      detectUserCountry()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bambaura_country', country)
  }, [country])

  const countryConfig = useMemo(() => {
    const effectiveCode = ['IN', 'US', 'GB'].includes(country) ? country : 'US'
    return regionsData[effectiveCode] || regionsData.US || COUNTRIES_DATA.US
  }, [country, regionsData])

  const formatPrice = (usdAmount) => {
    const converted = Math.round(usdAmount * countryConfig.rate)
    return `${countryConfig.symbol}${converted.toLocaleString()}`
  }

  // 3. User Google SSO State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bambaura_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('bambaura_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('bambaura_user')
    }
  }, [user])

  const loginWithGoogle = (googleUserData) => {
    setUser(googleUserData)
    showToast(`Welcome back, ${googleUserData.name.split(' ')[0]}!`, 'success')
  }

  const logout = () => {
    setUser(null)
    showToast('Signed out successfully.', 'info')
  }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // 4. Shopping Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bambaura_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bambaura_cart', JSON.stringify(cart))
  }, [cart])

  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (item) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.grams === item.grams && i.grind === item.grind
      )
      if (existingIndex > -1) {
        const copy = [...prev]
        copy[existingIndex].quantity += item.quantity || 1
        return copy
      } else {
        return [...prev, { ...item, quantity: item.quantity || 1 }]
      }
    })
    setIsCartOpen(true)
    showToast(`Added ${item.grams} (${item.grind}) to bag`, 'success')
  }

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      const copy = [...prev]
      copy[index].quantity += delta
      if (copy[index].quantity <= 0) {
        return copy.filter((_, i) => i !== index)
      }
      return copy
    })
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
    showToast('Item removed from bag', 'info')
  }

  const clearCart = () => setCart([])

  const cartTotalUSD = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0)
  }, [cart])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // 5. Razorpay Checkout State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false)
  const [checkoutPayload, setCheckoutPayload] = useState(null)
  const [orderConfirmation, setOrderConfirmation] = useState(null)

  const startRazorpayCheckout = (customPayload = null) => {
    if (customPayload) {
      setCheckoutPayload(customPayload)
    } else {
      if (cart.length === 0) {
        showToast('Your bag is empty.', 'error')
        return
      }
      setCheckoutPayload({
        items: cart,
        totalUSD: cartTotalUSD,
        type: 'cart'
      })
    }
    setIsCartOpen(false)
    setIsRazorpayModalOpen(true)
  }

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        country,
        setCountry,
        countryConfig,
        formatPrice,
        user,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalUSD,
        cartItemsCount,
        isCartOpen,
        setIsCartOpen,
        isRazorpayModalOpen,
        setIsRazorpayModalOpen,
        checkoutPayload,
        startRazorpayCheckout,
        orderConfirmation,
        setOrderConfirmation,
        toast,
        showToast,
        productData,
        setProductData,
        regionsData,
        setRegionsData
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

