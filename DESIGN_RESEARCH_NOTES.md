# BAMBAURA STOREFRONT: DESIGN RESEARCH NOTES & ANTI-SLOP AUDIT

**Author:** Principal Brand Designer & Senior Frontend Engineer  
**Date:** October 26, 2026  
**Repository:** `bambaura-storefront`  
**Purpose:** Record evidence-based design research, inspected skills, reference studies, and anti-pattern evaluations prior to design system refactoring.

---

## 1. Skills & Internal Instruction Files Inspected

### 1.1 Inspected Files Log
1. **`generative_ui` (`C:\Users\Darshan\.gemini\antigravity\builtin\skills\generative_ui\SKILL.md`)**
   * *Status:* Fully read.
   * *Core Principles Extracted:*
     - Typography floor: never use sub-12px micro-text (`text-[10px]` or `text-[11px]` harms legibility; maintain `text-xs` / 12px minimum floor for all user-facing content).
     - Surface semantics: maintain distinct surface elevations, contrast ratios, and avoid hardcoded bright utility clashes.
     - Layout restraint: avoid nesting cards within cards; provide generous padding and natural whitespace rather than artificial container clutter.
2. **`agy-customizations` (`C:\Users\Darshan\.gemini\antigravity\builtin\skills\agy-customizations\SKILL.md`)**
   * *Status:* Fully read.
   * *Core Principles Extracted:* Loading hierarchy, project rule structure, and VCS scoping rules.
3. **`antigravity_guide` (`C:\Users\Darshan\.gemini\antigravity\builtin\skills\antigravity_guide\SKILL.md`)**
   * *Status:* Fully read.
   * *Core Principles Extracted:* Workflow orchestration, non-destructive editing, artifact lifecycle management.
4. **Workspace Search Log:**
   * Checked `.agents/skills/`, `.agent/skills/`, `_agents/`, `_agent/`: verified absent in workspace.
   * Checked `GEMINI.md`, `AGENTS.md`: verified absent in workspace.
   * Checked `~/.gemini/config/`: verified absent.

---

## 2. Real-World Specialty Brand References & Evidence

To ground Bambaura in genuine culinary brand architecture rather than generic AI landing page templates, we studied real-world specialty food, single-origin ingredient, and premium pantry leaders:

### 2.1 Jacobsen Salt Co. (Oregon, USA)
* **What works:** The product is salt. They do not hide it behind floating badges or flashy animations. Salt crystals are photographed on matte black ceramic spoons and dark slate surfaces.
* **Typographic hierarchy:** Clean, unpretentious serif headlines paired with robust, utilitarian sans-serif descriptions.
* **Ingredient education:** Clean contrast between "Finishing Salt" (flaky, crunch, tabletop pinch) and "Kosher Salt" (everyday dissolve). No exaggerated health claims.
* **Key takeaway for Bambaura:** Treat the 9 roasting cycles as an honest craft process. Let the physical distinction of brownish roasted salt granules on eggs and meats be the hero.

### 2.2 Maldon Salt Company (Essex, UK)
* **What works:** Masterclass in restraint. Iconic cyan and dark typography on crisp paper stock. No gradient text, no floating glowing orbs, no mouse-following spotlights.
* **Layout:** Generous whitespace, asymmetric product framing, high-resolution photography of natural pyramid crystals.
* **Key takeaway for Bambaura:** High status comes from quiet confidence. Clean borders, authentic paper-like backgrounds, and sharp product photography convey luxury far better than rotating conic gradients.

### 2.3 Burlap & Barrel (Single-Origin Spices)
* **What works:** Focus on origin, harvesting partner, and sensory tasting notes. Packaging is utilitarian and elegant.
* **Transparency:** Detailed tasting notes (e.g. "Smoky, raisin, chocolate notes") rather than vague wellness hype.
* **Key takeaway for Bambaura:** The 5-dish culinary pairing stage (eggs, grilled steak/paneer, watermelon, dark chocolate, cocktail rims) should feel like a chef's pairing guide, not a marketing gimmick.

### 2.4 Tartine / SingleThread / Aesop
* **What works:** Tactile material palette. Earth tones derived directly from the physical materials (clay, wood, wax, unbleached cotton, amber glass).
* **Dividers:** Hairline borders (`border-[#e6d8c4]`, `border-[#381616]`), structured grid alignments, zero repetitive card containers.
* **Key takeaway for Bambaura:** Bamboo stalks, yellow mountain clay, pine firewood, and brownish amber salt crystals provide an authentic, natural palette.

---

## 3. Common AI-Generated Website Tropes Identified in Codebase

During the baseline inspection of `bambaura-storefront`, we identified multiple common tropes typical of AI-generated website templates. These must be systematically removed or refactored:

| Identified AI Trope | Location in Existing Code | Why It Fails & Screams "AI Template" | Required Anti-Slop Correction |
| :--- | :--- | :--- | :--- |
| **Atmospheric Gradient Blur Orbs** | `HeroSection.jsx` lines 55–56 (`blur-[110px]`, `blur-[150px]`) | Cheap shortcut to create depth; washes out contrast and makes the site look like a generic SaaS landing page. | **Remove completely**. Rely on editorial negative space, natural paper textures, and product lighting. |
| **Gradient Text Headlines** | `HeroSection.jsx` lines 72–73 (`bg-clip-text text-transparent`) | Text gradients reduce readability, look synthetic, and are ubiquitous in AI prompts. | **Solid typographic colors**. Deep burgundy (`#401010`) in light mode; crisp warm ivory (`#fdfbf7`) in dark mode. |
| **Specular Conic Borders (`ShineBorder`)** | `src/components/ui/ShineBorder.jsx` (rotating 360° gradient) | Distracting visual noise. Specialty culinary brands never put rotating rainbow lasers around food cans. | **Replace with quiet, tactile hairline borders** (`1px solid #e6d8c4` or `#b28346]/30`). |
| **Mouse-Following Spotlights (`SpotlightCard`)** | `src/components/ui/SpotlightCard.jsx` on almost all cards | Repeating the exact same hover effect across 20+ cards creates visual fatigue and feels like a copy-paste component library. | **Replace with varied architectural layouts**: editorial split sections, structured data tables, and subtle scale transitions. |
| **Floating Badges & Rating Chips** | `HeroSection.jsx` lines 321–328 (`4.96 (489)`) | Floating rounded pill chips stuck to image borders look like a generic Dribbble mockup. | **Integrate metadata cleanly into the information hierarchy** below the headline or within the specification grid. |
| **Ubiquitous Card Syndrome** | `Home.jsx`, `Process.jsx`, `Science.jsx` | Forcing every single paragraph into a rounded card container (`rounded-3xl p-6 bg-white shadow-xl`). | **Use varied typographic and structural compositions**: full-width banner tables, definition lists, typographic callouts, and photo essays. |
| **Redundant Marquee Tickers** | `Home.jsx` lines 95–108 | Tickers create unnecessary motion that competes with reading, often duplicating phrases already visible right above. | **Curate deliberate, calm editorial typography**. Remove gratuitous auto-scrolling tickers. |
| **Sub-12px Micro-Text** | Multiple components (`text-[10px]`, `text-[11px]`) | Illegible on mobile devices; violates accessibility and looks like disorganized fine print. | **Standardize on a strict typography floor**: `text-xs` (12px) as the absolute minimum. |

---

## 4. Evaluation Criteria for the Refactored Design

The refactored storefront will be evaluated against five strict criteria:

1. **Brand Specificity:** Could this storefront belong to any random salt or wellness company? If yes, it fails. It must specifically represent Bambaura 9X Bamboo Roasted Salt (the brownish color, the 9 kiln cycles, the cylinder canister, the gold barrier pouch).
2. **Editorial Gravitas:** The typography, spacing, and image framing must feel like an art-directed culinary publication (e.g. *Kinfolk*, *Cereal*, or a Michelin guide).
3. **Clarity of Purchase Action:** Can a visitor select 100g or 250g, choose Fine Granules or Coarse Crystals, see the honest direct price (₹1,450), and add to cart within 5 seconds without distraction?
4. **Information Architecture:** Does each page have a distinct visual character suited to its content (Process = step-by-step kiln engineering; Science = clean analytical spectrometry; Recipes = rich culinary photography)?
5. **Accessibility & Usability:** WCAG 2.1 AA compliance, solid contrast ratios, legible type sizes (>=12px), full keyboard operability, and smooth responsive reflow on mobile viewports.
