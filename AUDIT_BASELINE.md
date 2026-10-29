# AUDIT_BASELINE.md: Bambaura Storefront Initial Baseline

*Date of Baseline Audit:* October 26, 2026  
*Environment:* Node.js v22.19.0, npm 11.6.0, Vite 8.3.5, React 18 / Tailwind CSS 3.4.17  
*Repository Root:* `c:\Dev\CLIENTS\BAMBAURAWEB\bambaura-storefront`  
*Working Branch:* `client-demo-ready`  
*Recoverable Backup Checkpoint:* `c:\Dev\CLIENTS\BAMBAURAWEB\bambaura-storefront-checkpoint-master`

---

## 1. Directory & Architectural Mapping

The storefront is a Single Page Application (SPA) built using React, Vite, Tailwind CSS, DaisyUI, and Framer Motion.

```
bambaura-storefront/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── images/ (extracted canister, crystal, packaging, and recipe assets)
└── src/
    ├── main.jsx (Vite entry point)
    ├── App.jsx (Route definitions & global layouts)
    ├── styles.css (Global Tailwind & custom styles)
    ├── components/
    │   ├── Navbar.jsx (Header navigation, ticker, currency selector, mega-menu)
    │   ├── Footer.jsx (Global footer & compliance details)
    │   ├── CartDrawer.jsx (Slide-out cart, shipping bar, gifting)
    │   ├── RazorpayModal.jsx (Checkout & payment modal)
    │   ├── GoogleSSOModal.jsx (Patron sign-in modal)
    │   ├── ChatBubble.jsx / WhatsAppBubble.jsx (Concierge support widgets)
    │   ├── Toast.jsx (Global notification toast)
    │   ├── SaltComparison.jsx (Comparative salt matrix)
    │   ├── BenefitsSection.jsx (Culinary benefits cards)
    │   ├── hero/ (HeroSection.jsx, HeroClinical.jsx, HeroEditorial.jsx, HeroImperial.jsx)
    │   └── ui/ (AnimatedCounter, AnimatedPillTabs, HeroSlider, Marquee, ShimmerButton, ShineBorder, SpotlightCard)
    ├── context/
    │   └── StoreContext.jsx (Global state: cart, currency, theme, auth, checkout, toast)
    ├── data/
    │   ├── product.json (Flagship product & variants)
    │   ├── regions.json (Supported markets: US, IN, GB)
    │   ├── homeData.json (Homepage text & trust badges)
    │   ├── about.json (Brand purpose & sourcing inputs)
    │   ├── process.json (Roasting cycles & 21-day timeline)
    │   ├── science.json (Analytical parameters & nutritional facts)
    │   ├── recipes.json (Culinary recipes & 5 everyday uses)
    │   ├── contact.json (Contact channels & FAQs)
    │   ├── faqs.json (Curated FAQs)
    │   └── affiliate.json (Partner program data)
    └── pages/
        ├── Home.jsx
        ├── Product.jsx
        ├── Process.jsx
        ├── Science.jsx
        ├── Recipes.jsx
        ├── About.jsx
        ├── Contact.jsx
        ├── Affiliate.jsx
        └── Admin.jsx
```

---

## 2. Existing Routes & Navigation

| Path | Component | Purpose | Baseline Status |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Flagship landing page, hero, 5 uses, slider, benefits | Functional |
| `/product` | `Product.jsx` | Detail page, canister sizes, grinds, tabs, reviews | Functional |
| `/process` | `Process.jsx` | 9-cycle kiln journey & 21-day timeline | Functional |
| `/science` | `Science.jsx` | Quality, lab test results, nutrition, minerals | Functional |
| `/recipes` | `Recipes.jsx` | Culinary recipes, pairing notes, decanting ritual | Functional |
| `/about` | `About.jsx` | Brand story, artisanal sourcing, packaging care | Functional |
| `/contact` | `Contact.jsx` | Concierge dispatch form, contact channels, FAQs | Functional |
| `/affiliate` | `Affiliate.jsx` | Culinary partner commission calculator & application | Functional |
| `/admin` | `Admin.jsx` | Internal administrative panel | Present (Internal) |
| `*` | N/A | Catch-all wildcard | **Defect**: Renders `Home` instead of a 404 page |

---

## 3. High-Risk Deficiencies & Product Claim Risks (Pre-Remediation)

1. **Simulated Payment / Order Success in Fallback**:
   - `RazorpayModal.jsx` previously generated a pseudo order ID (`BAMB-9X-...`) and claimed *"Order confirmed and queued for fulfillment"* even when no backend or live transaction occurred.
   - *Fix needed*: Create an unambiguous, visibly labeled **Client Demo Checkout Preview** mode that clearly states no payment has been taken and no real order has been placed.

2. **Fabricated Customer Reviews & Star Ratings**:
   - `Product.jsx` and `Home.jsx` contained simulated reviews with names like "Aditi S.", "Rohan M.", "David K.", and a static "4.96 Rating" badge.
   - *Fix needed*: Remove simulated customer quotes presented as verified buyers. Replace with honest pre-launch status: *"Customer Reviews (Pre-Launch / Initial Allocations — Verified buyer reviews will be collected post-launch)"*.

3. **Simulated Laboratory Credentials & Personnel**:
   - `science.json` contained references to a specific fictitious laboratory analyst (`Dr. V. Ramanathan, Ph.D.`) and fictitious report numbers (`COA-BAM-2026-9X04`).
   - *Fix needed*: Frame all analytical specifications as **Target Quality Benchmarks & Laboratory Standard Protocol (Official Signed COA Pending Supplier Batch Certificate)**.

4. **Placeholder Contact & Regulatory Numbers**:
   - `contact.json` and `Navbar.jsx` contained placeholder phone numbers (`+91 98450 12345`) and fictitious FSSAI registration numbers (`10024011000189`).
   - *Fix needed*: Clearly designate compliance details as *Application in Process / Pending Commercial Pack Details*, and link customer care to verified brand channels (`care@bambaura.com`).

5. **Missing 404 Not Found Page**:
   - Navigating to an invalid URL silently rendered the homepage rather than a designated 404 page with navigation recovery.
   - *Fix needed*: Implement `src/pages/NotFound.jsx` and update routing in `src/App.jsx`.

6. **Accessibility & Focus Management**:
   - Modal dialogs (Razorpay, Reviews, Google SSO, COA) lack explicit escape key handlers in certain instances, focus trap controls, and ARIA modal attributes.
   - Color contrast on subtle secondary text needs verification against WCAG AA (4.5:1).

7. **Test Suite Absence**:
   - `package.json` had no automated test script (`npm test`).
   - *Fix needed*: Implement reproducible automated test suite validating routes, cart calculations, variant switching, and demo mode safety.

---

## 4. Dependencies & Runtime Verification

- **Package Manager**: npm 11.6.0
- **Node.js**: v22.19.0
- **Current Build Status**: `npm run build` exits 0 (tested clean, bundles to `dist/`).
- **Production Server Compatibility**: Self-contained static bundle served by Nginx / ASP.NET Core static files.

