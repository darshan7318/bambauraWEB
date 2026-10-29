# BAMBAURA STOREFRONT: CLIENT DEMONSTRATION & EVALUATION GUIDE

**Document Version:** 1.0.0  
**Target Audience:** Agency Leads, Presenting Engineers, Product Managers & Client Stakeholders  
**Repository:** `bambaura-storefront`  
**Node Requirement:** Node.js v18+ (tested on Node v22.19.0)  

---

## 1. Quick Start: Running the Demo Locally

Follow these three commands in any terminal:

```bash
# 1. Navigate to the storefront directory
cd c:\Dev\CLIENTS\BAMBAURAWEB\bambaura-storefront

# 2. Start the local preview server
cmd /c "npm run dev"
```

The Vite development server will start at:  
👉 **`http://localhost:5173`** (or next available port).

To test the optimized production build locally:
```bash
cmd /c "npm run build"
cmd /c "npm run preview"
```
Preview server will start at:  
👉 **`http://localhost:4173`**.

---

## 2. Page-by-Page Guided Demonstration Script

### 2.1 Global Header & Navigation
* **Country & Currency Switcher:** Click the country flag in the navigation bar. Switch between **India (₹ INR)**, **United States ($ USD)**, **United Kingdom (£ GBP)**, **Europe (€ EUR)**, and **UAE (AED)**. Notice how all product prices, Amazon affiliate links, and free-shipping thresholds dynamically update across the entire storefront instantly.
* **Dark / Light Brand Mode:** Click the Sun/Moon icon to toggle between editorial warm cream and rich cellar burgundy. Notice the typography contrast and border reflections.
* **Rotating Announcement Bar:** Displays genuine craft milestones, target lab protocols, and direct direct concierge links.
* **Accessible Dialog Drawers:** Open the cart drawer, mobile drawer, or modal windows; press `Escape` on your keyboard to demonstrate smooth keyboard accessibility.

---

### 2.2 Home Page (`/`)
* **Editorial Hero:** Features genuine imagery of the 100g canister, gold barrier pouch, and brownish crystals. Demonstrates direct pricing from ₹1,450.
* **Why 9X Craft Journey:** Interactive 21-day timeline explaining the patient high-heat firings.
* **Culinary Pairing Stage:** An interactive 5-dish culinary carousel highlighting soft-boiled eggs, grilled ribeye/paneer, watermelon, dark chocolate, and cocktail rims. Clicking each dish updates the culinary notes and imagery.
* **Culinary Perspectives:** Truthfully framed culinary benchmarking notes from pre-launch panel tastings (zero fake customer reviews).

---

### 2.3 Single Product Showcase (`/product`)
* **Interactive Media Gallery:** Click through real photography:
  1. 100g Signature Canister
  2. 250g Duo Showcase with Gold Barrier Pouch
  3. Size Reference: Crystals on Spoon & Hand
  4. Triple-Barrier Gold Freshness Pouch
  5. Real 9X Brownish Roasted Salt Crystals
  6. Kiln packing & artisanal firings
  7. 4-step packaging ritual
* **Dynamic Variant Suite:**
  * **Step 1:** Select between 100g (Bestseller), 250g (Chef's Reserve), 50g (Discovery Flask), and 500g (Kitchen Refill). Notice pinch estimator calculations.
  * **Step 2:** Toggle between Fine Granules (table seasoning) and Coarse Crystals (crunch finishing).
  * **Step 3:** Toggle One-Time Purchase vs Subscribe & Save (15% auto-discount).
* **Deep Product Tabs:**
  * *Overview & Story:* Flavor profile notes and characteristics.
  * *The 9 Roasting Cycles:* Feature cards detailing traditional craft.
  * *Salt Comparison Matrix:* Detailed comparison against regular table salt, kosher salt, and Himalayan pink salt.
  * *Packaging Ritual:* 4-step diagram showing airtight zip seal.
  * *Mandatory Legal & FSSAI:* Clean compliance card showing application in progress and concierge email desk.
  * *Customer Reviews:* Displays an honest pre-launch status card with a clear notice: *"Our initial small-batch canisters are in preparation. Verified customer ratings will appear here post-commercial delivery."*
  * *[Demo] Test Review Submission:* Click the button to open the accessible modal. Enter a name and comments; submit to see the review render in current session state tagged with `[DEMO PREVIEW]`.

---

### 2.4 Process & Roasting Science (`/process`)
* **Interactive 9-Cycle Stepper:** Click any of the 9 roasting cycles. Watch the dynamic thermometer meter rise from 800°C up to 1,500°C liquid salt melt, with dynamic color transformation from natural sea brine to brownish amber.
* **21-Day Craft Timeline:** 5-phase structured roadmap from bamboo cutting to clay sealing and final sorting.

---

### 2.5 Science & Quality Benchmarks (`/science`)
* **Spectrometry Explorer:** Displays AOAC / ICP-MS toxicology limits for Lead, Arsenic, Cadmium, Mercury, and PAHs, reporting realistic Limits of Detection (LOD).
* **Alkaline Spectrum:** Visual comparison of table salt (pH 5.8 acidic) versus Bambaura 9X (natural pH 9.8–10.2).
* **Target Protocol Modal:** Click *"View Target Lab Protocol (PDF/COA)"* to open the reference specification sheet modal. Demonstrates document printing and modal accessibility (`role="dialog"`).

---

### 2.6 Recipes & Taste Profile (`/recipes`)
* Highlights the three sensory pillars: *Smoky, Mineral, Savoury*.
* Features the finishing rule: *"A small pinch is enough. Use it as a finishing salt, not for cooking."*
* Includes full ingredient lists, prep instructions, and pairing tips for all 5 signature preparations.

---

### 2.7 Safe Client Demo Checkout Flow
* Add any variant to cart, or click *"Buy Now with Razorpay"*.
* The **Razorpay Modal** appears with:
  * An unambiguous amber banner: `[DEMO CHECKOUT MODE — NO REAL TRANSACTION OCCURS]`.
  * Simulated Payment Methods: UPI QR, Instant Cards, NetBanking.
  * Click *"Simulate Demo Success"*:
  * Displays an official **Demo Preview Receipt** marked:
    * `DEMO PREVIEW RECEIPT (UNPROCESSED)`
    * `STATUS: Client Demonstration Preview (Not a live transaction)`
    * Simulation ID: `DEMO-BAMB-SIM-XXXXXX`
  * Clears cart cleanly without recording fake orders on external gateways.

---

### 2.8 Control Nexus / Admin Portal (`/admin`)
* Visit `/admin`.
* Enter default demonstration passcode: `bambaura2026`.
* Explore live product gram pricing editor, simulated dispatch overview, and system health status.
* When disconnected from live PostgreSQL, cleanly indicates `Demo Mode (No Live Charges)`.

---

### 2.9 Navigation Recovery (404 Page)
* Visit any invalid URL (e.g. `http://localhost:5173/non-existent-page`).
* Shows dedicated `NotFound.jsx` screen with brand compass graphic and a clear *"Return to Home"* button.

---

## 3. Explaining Unconfigured Integrations to the Client

When presenting this build to client stakeholders, use the following points:

1. **Why is the Razorpay modal labeled Demo Mode?**  
   *"We have isolated the payment flow with an explicit Client Demo preview mode so you can test the complete customer purchase journey without charging personal cards or triggering false courier dispatch webhooks. Once your live Razorpay merchant key is connected in `.env`, the real Razorpay payment sheet activates seamlessly."*

2. **Why are there no customer reviews on the live product page yet?**  
   *"Under Indian e-commerce consumer protection regulations and ethical brand guidelines, publishing invented customer reviews is illegal. We have prepared the storefront with an honest pre-launch reserve status and an interactive test review submission tool so you can see exactly how verified customer reviews will appear after launch."*

3. **Why does the FSSAI section say 'In Progress'?**  
   *"Displaying an unassigned or invented FSSAI license number is a legal offense. We have placed compliant pending registration notices in the footer, navigation, and product compliance tabs. As soon as your official 14-digit FSSAI license is granted, it drops directly into the configuration."*

---

## 4. Client Approval & Launch Sign-Off Checklist

- [ ] **Brand Aesthetics:** Dark burgundy, warm cream, gold accents, serif headlines approved.
- [ ] **Packaging Imagery:** Real canister, gold barrier pouch, and crystal photography verified.
- [ ] **Pricing Matrix:** ₹1,450 (100g direct) and international exchange rates approved.
- [ ] **Pairing Content:** 5 signature dish preparations and taste profile approved.
- [ ] **Legal Credentials:** FSSAI number and company incorporation details ready for production `.env`.
- [ ] **Payment Keys:** Razorpay live API credentials ready for deployment.

