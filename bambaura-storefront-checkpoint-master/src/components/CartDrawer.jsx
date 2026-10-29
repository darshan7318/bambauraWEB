import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight,
  Truck, Lock, Sparkles, Gift, MessageSquare
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotalUSD,
    countryConfig,
    formatPrice,
    startRazorpayCheckout
  } = useStore()

  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  if (!isCartOpen) return null

  // Luxury gift wrap fee: ₹150 in India (~$2.00 USD)
  const giftWrapFeeUSD = isGift ? 2.0 : 0.0

  const freeShipThreshold = countryConfig.freeShip
  const effectiveSubtotalUSD = cartTotalUSD + giftWrapFeeUSD
  const freeShipProgress = Math.min(100, Math.round((cartTotalUSD / (freeShipThreshold / countryConfig.rate)) * 100))
  const remainingForFreeShip = Math.max(0, (freeShipThreshold / countryConfig.rate) - cartTotalUSD)
  const isFreeShip = cartTotalUSD * countryConfig.rate >= freeShipThreshold
  const shippingFeeUSD = isFreeShip ? 0 : 8
  const finalTotalUSD = effectiveSubtotalUSD + shippingFeeUSD

  const handleCheckout = () => {
    startRazorpayCheckout({
      isGift,
      giftMessage: isGift ? giftMessage : undefined,
      totalUSD: finalTotalUSD
    })
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false)
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="w-full max-w-md bg-[#faf5ee] dark:bg-[#150606] h-full flex flex-col shadow-2xl border-l border-[#e6d8c4] dark:border-[#381616]"
      >
        {/* HEADER */}
        <div className="p-6 bg-white dark:bg-[#1a0808] border-b border-[#e6d8c4] dark:border-[#381616] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#b28346]" />
            <h3 className="font-serif text-xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              Your Cart
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#faf5ee] dark:hover:bg-[#280c0c] text-[#6b534b] dark:text-[#c2ada4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FREE SHIPPING PROGRESS BAR */}
        <div className="px-6 py-3 bg-[#f5eedf] dark:bg-[#200c0c] border-b border-[#e6d8c4] dark:border-[#381616] text-xs">
          <div className="flex items-center justify-between text-[#6b534b] dark:text-[#c2ada4] mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-[#b28346]" />
              {isFreeShip ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Complimentary Insured Shipping Unlocked!
                </span>
              ) : (
                <span>
                  Add {formatPrice(remainingForFreeShip)} more for Free Shipping
                </span>
              )}
            </span>
            <span className="font-mono font-bold text-[#401010] dark:text-[#dfb983]">
              {freeShipProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#e6d8c4] dark:bg-[#381616] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b28346] to-[#dfb983] transition-all duration-300"
              style={{ width: `${freeShipProgress}%` }}
            />
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#e6d8c4]/40 dark:bg-[#2a0e0e] text-[#8c6027] dark:text-[#dfb983] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="font-serif text-lg text-[#401010] dark:text-[#f7ebd9]">
                Your cart is currently empty.
              </p>
              <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] max-w-xs mx-auto">
                Discover our 100g and 250g bamboo roasted salt canisters.
              </p>
              <Link
                to="/product"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] text-xs font-semibold uppercase tracking-wider shadow-md"
              >
                <span>Shop Bambaura 9X</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={`${item.grams}-${item.grind}-${index}`}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1e0a0a] border border-[#e6d8c4] dark:border-[#381616] flex gap-4 shadow-sm"
                >
                  <img
                    src={item.image || '/images/extracted/bambaura_canister_front_100g.jpg'}
                    alt={item.title}
                    className="w-16 h-16 object-contain bg-[#faf5ee] dark:bg-[#280e0e] rounded-xl p-1"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
                          {item.grams} — {item.grams === '500g' ? 'Eco Refill Pouch' : item.grams === '50g' ? 'Discovery Flask' : 'Signature Canister'}
                        </h4>
                        <p className="text-[11px] text-[#8c6027] dark:text-[#dfb983] font-medium capitalize">
                          {item.grind}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1 text-[#9c8378] hover:text-rose-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center border border-[#e6d8c4] dark:border-[#381616] rounded-lg overflow-hidden bg-[#faf5ee] dark:bg-[#250d0d]">
                        <button
                          onClick={() => updateCartQuantity(index, -1)}
                          className="px-2 py-1 text-[#6b534b] dark:text-[#c2ada4] hover:bg-black/5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#401010] dark:text-[#f7ebd9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, 1)}
                          className="px-2 py-1 text-[#6b534b] dark:text-[#c2ada4] hover:bg-black/5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* ITEM PRICE */}
                      <span className="font-serif font-bold text-sm text-[#401010] dark:text-[#dfb983]">
                        {formatPrice(item.priceUSD * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* GIFTING OPTION (BRIEF ITEM 13) */}
              <div className="p-4 rounded-2xl bg-[#faf5ee] dark:bg-[#1a0808] border border-[#b28346]/40 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="mt-1 rounded text-[#b28346] focus:ring-[#b28346] w-4 h-4 accent-[#b28346]"
                  />
                  <div>
                    <span className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9] flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#b28346]" /> Send as a gift (+{formatPrice(2)})
                    </span>
                    <p className="text-[11px] text-[#6b534b] dark:text-[#c2ada4]">
                      Includes premium gift box packaging and a custom handwritten card.
                    </p>
                  </div>
                </label>

                <AnimatePresence>
                  {isGift && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pt-2 border-t border-[#b28346]/20"
                    >
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#401010] dark:text-[#dfb983] mb-1">
                        Handwritten Message Card:
                      </label>
                      <textarea
                        rows={2}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write your custom message for the recipient..."
                        className="w-full p-2.5 rounded-xl border border-[#b28346]/40 bg-white dark:bg-[#120404] text-xs text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CORPORATE GIFTING NOTICE */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#6b534b] dark:text-[#c2ada4] flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-[#401010] dark:text-[#f7ebd9]">Corporate & Wedding Gifts?</p>
                  <p className="text-[10px]">Custom hampers for Diwali, weddings & events.</p>
                </div>
                <a
                  href="https://wa.me/919845012345?text=Hello%20Bambaura,%20we%20are%20inquiring%20about%20corporate%20or%20wedding%20gifting%20boxes"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#b28346] text-[#240808] font-bold text-[10px] uppercase tracking-wider shrink-0 hover:bg-[#dfb983] transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {cart.length > 0 && (
          <div className="p-6 bg-white dark:bg-[#1a0808] border-t border-[#e6d8c4] dark:border-[#381616] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6b534b] dark:text-[#c2ada4]">
                <span>Bag Subtotal</span>
                <span className="font-mono font-bold text-[#401010] dark:text-[#f7ebd9]">
                  {formatPrice(cartTotalUSD)}
                </span>
              </div>
              {isGift && (
                <div className="flex justify-between text-[#6b534b] dark:text-[#c2ada4]">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3 text-[#b28346]" /> Premium Gift Box & Card
                  </span>
                  <span className="font-mono font-semibold text-[#401010] dark:text-[#dfb983]">
                    {formatPrice(giftWrapFeeUSD)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#6b534b] dark:text-[#c2ada4]">
                <span>Insured Freight</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {isFreeShip ? 'FREE' : formatPrice(shippingFeeUSD)}
                </span>
              </div>
              <div className="flex justify-between font-serif text-lg font-bold text-[#401010] dark:text-[#dfb983] pt-2 border-t border-[#e6d8c4] dark:border-[#381616]">
                <span>Total Due</span>
                <span>
                  {formatPrice(finalTotalUSD)}
                </span>
              </div>
            </div>

            {/* RAZORPAY CHECKOUT BUTTON */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-widest hover:bg-[#5c1718] dark:hover:bg-[#f5ebd9] transition-all flex items-center justify-center gap-2 shadow-xl group"
            >
              <Lock className="w-4 h-4 text-[#dfb983] dark:text-[#401010]" />
              <span>Checkout with Razorpay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#6b534b] dark:text-[#c2ada4]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                UPI, Cards & NetBanking
              </span>
              <span>•</span>
              <span>Ships in 24–48 hours</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
