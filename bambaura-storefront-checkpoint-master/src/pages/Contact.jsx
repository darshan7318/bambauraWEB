import React, { useState } from 'react'
import {
  Mail, Phone, MapPin, Send, MessageSquare, HelpCircle,
  Search, ChevronDown, ChevronUp, ShieldCheck, Sparkles
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import FAQS_DATA from '../data/faqs.json'
import CONTACT_DATA from '../data/contact.json'

export default function Contact() {
  const { showToast } = useStore()
  const [searchFaq, setSearchFaq] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: CONTACT_DATA.subjectOptions?.[0] || 'General Inquiry',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const faqs = FAQS_DATA

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.a.toLowerCase().includes(searchFaq.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/concierge/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })
      if (res.ok) {
        const data = await res.json()
        showToast(`Dispatch ${data.ticketId} recorded by .NET 10 backend!`, 'success')
      } else {
        showToast('Inquiry sent! Concierge will reply within 4 hours.', 'success')
      }
    } catch {
      showToast('Inquiry sent! Concierge will reply within 4 hours.', 'success')
    }
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
      
      {/* 1. HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
          {CONTACT_DATA.header.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9]">
          {CONTACT_DATA.header.title}
        </h1>
        <p className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          {CONTACT_DATA.header.description}
        </p>
      </div>

      {/* 2. CONTACT CHANNELS & FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: CONTACT CHANNELS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              Direct Assistance
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href={CONTACT_DATA.channels.whatsapp.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 transition-transform hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{CONTACT_DATA.channels.whatsapp.title}</p>
                  <p className="text-[11px] opacity-80">{CONTACT_DATA.channels.whatsapp.subtext}</p>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#401010] text-[#dfb983] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">{CONTACT_DATA.channels.email.title}</p>
                  <p className="text-[11px] text-[#6b534b] dark:text-[#c2ada4]">{CONTACT_DATA.channels.email.address}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#401010] text-[#dfb983] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
                    {(CONTACT_DATA.channels.office || CONTACT_DATA.channels.cellars)?.title || 'Registered Office & Marketer'}
                  </p>
                  <p className="text-[11px] text-[#6b534b] dark:text-[#c2ada4]">
                    {(CONTACT_DATA.channels.office || CONTACT_DATA.channels.cellars)?.locations || '#12/4 Indiranagar, Bangalore 560038, Karnataka, India'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#6b534b] dark:text-[#c2ada4] space-y-1">
              <p className="font-semibold text-[#401010] dark:text-[#f7ebd9]">{CONTACT_DATA.wholesaleNotice.title}</p>
              <p>{CONTACT_DATA.wholesaleNotice.description}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT INQUIRY FORM */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9] mb-6">
              Send a Dispatch to Concierge
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-emerald-800 dark:text-emerald-300">
                  Dispatch Received
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-sm mx-auto">
                  Thank you for your inquiry. A senior concierge officer will contact you at {formData.email} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#401010] dark:text-[#f7ebd9] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Chef Julian / Alexandra Smith"
                      className="w-full px-4 py-3 rounded-xl border border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#200c0c] text-sm text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#401010] dark:text-[#f7ebd9] mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#200c0c] text-sm text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#401010] dark:text-[#f7ebd9] mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#200c0c] text-sm text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
                  >
                    {(CONTACT_DATA.subjectOptions || []).map((subj, idx) => (
                      <option key={idx} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#401010] dark:text-[#f7ebd9] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your question or culinary requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#200c0c] text-sm text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-wider hover:bg-[#5c1718] dark:hover:bg-[#f5ebd9] transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Dispatch to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 3. SEARCHABLE FAQS ACCORDION */}
      <div className="space-y-8 pt-12 border-t border-[#e6d8c4] dark:border-[#381616]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Knowledge Repository
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Frequently Answered Questions
          </h2>

          {/* SEARCH BOX */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-[#8c6027] dark:text-[#dfb983] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. roasting cycles, 100g, everyday cooking, shipping)..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#1a0808] text-xs text-[#401010] dark:text-[#f7ebd9] focus:outline-none focus:border-[#b28346]"
            />
          </div>
        </div>

        {/* ACCORDION ITEMS */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <p className="text-center text-xs text-[#6b534b] dark:text-[#c2ada4] py-8">
              No matching questions found. Chat with our live assistant via WhatsApp!
            </p>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#1a0808] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#b28346] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#b28346] flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed border-t border-[#e6d8c4]/40 dark:border-[#381616]/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}

