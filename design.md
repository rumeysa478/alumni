# Alumni Tracking System (CONNEXT) — Design System & Style Reference
> Electric lime & canary yellow ink on a university newsroom desk

**Theme:** light  
**Palette Profile:** High-contrast Monochrome + Dual Chromatic Spark (Voltage Lime & Canary Yellow) + University Emerald Heritage  
**Core Aesthetic:** The editorial rigor of **Substack**, the high-energy neon spark of **Handshake**, the airy mathematical breathing room of **SpatialChat**, the personal parenthetical whimsy of **School**, the calm text-first stream of **Threads**, and the floating dark architectural framing of **Wizz**.

---

## 📌 Executive Philosophy

The Alumni Tracking System interface is designed as an **editorial career command center and academic social fabric**. It moves away from cold corporate HR portals and generic social media feeds, positioning itself as a **living, breathing university publication desk**:

1. **Substack's Editorial Restraint:** Surfaces remain mostly unadorned white paper; visual hierarchy is dictated by typographic density (12–13px metadata vs. 15–18px body vs. prominent display serifs) and hairline dividers rather than heavy drop shadows.
2. **Handshake's Voltage Lime Energy:** Against a disciplined monochrome field, **Voltage Lime (`#d3fb52`)** functions as the primary chromatic ignition point for primary actions, active navigation pills, and hero glows.
3. **Canary & Highlighter Yellow Accents (School & Handshake):** Warm Canary Yellow (`#facc15`) and flat Highlighter Yellow (`#f9f5a2`) provide warmth, student achievement recognition, and micro-delight via highlighted-letter swaps.
4. **University Heritage Emerald (`#005b38`):** Deep academic green anchors the institution's 1453 legacy, verified alumni ticks, and primary institutional stamps.
5. **SpatialChat's Airy Breathing Room:** Alternating two-column product showcase layouts, 4px/8px rhythm, subtle 6%-opacity elevation, and two-button CTA pairings (filled lime + ghost dark).
6. **School's Monospace Desktop Metaphor:** Thoughtful parenthetical captions (`(Y)our alumni profile.`, `(Y)our job applications.`, `(Y)our mentorship match.`) that give the platform an intimate, student-friendly personality.
7. **Threads' Text-First Content Flow:** Clean 640px post feed columns with 1px hairlines, circular avatars, and borderless engagement bars.
8. **Wizz's Floating Dark Architecture:** A floating dark pill navigation bar (`#052326`) and stamped all-caps eyebrow labels with `0.05em` letter-spacing.

---

## 🎨 Tokens — Colors

The palette is predominantly high-contrast monochrome (90% paper white, deep carbon ink, and hairline grays) electrified by a **vibrant yellow-green spectrum**.

| Token Name | Hex / Value | Token | Role & Usage |
|:---|:---|:---|:---|
| **Voltage Lime** | `#d3fb52` | `--color-voltage-lime` | **Primary Chromatic Ignition:** Primary action buttons (`Quick Apply`, `Sign In`), active nav pills, search highlight, hero glow endpoint. |
| **Canary Yellow** | `#facc15` | `--color-canary-yellow` | **Secondary Chromatic Accent:** Star ratings, scholarship/award tags, active job filters, spotlight highlights. |
| **Highlight Yellow** | `#f9f5a2` | `--color-highlight-yellow` | **Typographic Highlight:** Flat letter/word background block for customizable variables (e.g. `(y)our alumni`). |
| **University Emerald** | `#005b38` | `--color-univ-emerald` | **Heritage & Verification:** Official university emblem, verified alumni checkmark, positive status (`ACCEPTED`, `UP`). |
| **Deep Forest Abyss** | `#052326` | `--color-forest-abyss` | **Dark Structural Surfaces:** Floating navigation bar, footer background, dark button surfaces, high-contrast badges. |
| **Carbon Ink** | `#14151c` | `--color-carbon-ink` | **Primary Text & Outlines:** Headings, post titles, button labels, high-emphasis icons, 1.5px/2px borders. |
| **Warm Ink** | `#363737` | `--color-warm-ink` | **Editorial Body Copy:** Newsroom-style long-form descriptions, interview notes, relaxed reading text. |
| **Stone Neutral** | `#71717a` | `--color-stone-neutral` | **Metadata & Secondary Labels:** Timestamps, read times, company locations, salary ranges, unselected tabs. |
| **Ash Hairline** | `#e5e7eb` | `--color-ash-hairline` | **Structural Dividers:** 1px feed separators, table dividers, card outlines, search input borders. |
| **Mist Surface** | `#f3f4f6` | `--color-mist-surface` | **Recessed Elements:** Input background fills, secondary button fills, code blocks, inactive badge fills. |
| **Sage Tint** | `#f0fdf4` | `--color-sage-tint` | **Subtle Green Canvas:** Feature highlight containers, success banners, active application rows. |
| **Butter Tint** | `#fefce8` | `--color-butter-tint` | **Subtle Yellow Canvas:** Notice boxes, spotlight announcement callouts, mentorship pending alerts. |
| **Paper Canvas** | `#ffffff` | `--color-paper-canvas` | **Dominant Surface:** Card surfaces, modal sheets, nav backgrounds, text on dark fills. |
| **Canvas Off-White**| `#f8faf8` | `--color-canvas-bg` | **Root Page Canvas:** The subtle warm parchment background that makes pure white cards pop. |

### Gradient Specifications

| Gradient Name | CSS Value | Application |
|:---|:---|:---|
| **Cyber Emerald Aurora (Hero)** | `radial-gradient(at 55% 45%, #7af3ff 0%, #d3fb52 45%, #005b38 85%, #052326 100%)` | Full-bleed hero banner atmosphere backdrop behind the Beyazıt gate graphic. |
| **Spring Electric (Accent Bar)** | `linear-gradient(90deg, #d3fb52 0%, #facc15 50%, #10b981 100%)` | Thin 3px accent bar atop cards, active tabs, and notification ribbons. |
| **Sage Parchment (Subtle Card)** | `linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)` | Featured job cards, applicant profile cards, and spotlight containers. |

---

## 🔤 Tokens — Typography

A disciplined 4-family typographic architecture that balances **academic authority**, **newsroom density**, **developer precision**, and **modern readability**.

### 1. Font Family Architecture

```css
:root {
  /* Editorial Display Serifs (Headings, Branding, Milestone Numbers) */
  --font-display-serif: 'Playfair Display', Charter, 'Source Serif Pro', Georgia, serif;

  /* Primary UI & Body Sans (Controls, Forms, Feed Copy, Navigation) */
  --font-primary-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Long-Form Editorial Serif (Articles, Detailed Job Descriptions, Stories) */
  --font-editorial-serif: 'Spectral', Charter, 'Iowan Old Style', Georgia, serif;

  /* Monospace (Parenthetical Captions, Timestamps, API Metrics, Badges) */
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', SFMono-Regular, Menlo, monospace;
}
```

### 2. Type Scale & Metric Hierarchy

| Role | Family | Weight | Size | Line Height | Letter Spacing | Purpose & Example |
|:---|:---|:---|:---|:---|:---|:---|
| **Display Hero** | Display Serif | `900` | `64px / 72px` | `1.05` | `-0.02em` | `İSTANBUL UNIVERSITY ALUMNI WEB PAGE` |
| **Display Headline** | Display Serif | `800` | `40px` | `1.15` | `-0.015em` | Section anchors: `Öne Çıkan İş & Staj İlanları` |
| **Section Eyebrow**| Primary Sans | `700` | `12px` | `1.0` | `+0.06em` | Stamped all-caps: `CAREER ACCELERATION • 2026` |
| **Parenthetical** | Mono | `400 / 500` | `11px` | `1.4` | `0` | School-style: `(Y)our alumni network.` |
| **Card Heading** | Display Serif | `700` | `22px` | `1.25` | `0` | Job titles: `Senior Full-Stack Node.js Engineer` |
| **Subheading** | Primary Sans | `600` | `18px` | `1.35` | `-0.01em` | Subsection leads, modal titles |
| **Body (Default)** | Primary Sans | `400 / 500` | `15px` | `1.54` | `0` | Newsroom UI density body copy |
| **Body (Editorial)**| Editorial Serif| `400` | `18px` | `1.45` | `0` | Long-form alumni essays & interviews |
| **Body Small** | Primary Sans | `400` | `13px` | `1.45` | `0` | Card helper descriptions, form hints |
| **Caption / Meta** | Primary Sans | `500` | `12px` | `1.25` | `0` | Timestamps, applicant count, salary pills |
| **Stat Numeral** | Mono / Serif | `700 / 900` | `32px` | `1.0` | `-0.02em` | Metric counters: `12,450+` |

---

## 📐 Tokens — Spacing, Shapes & Elevation

### Spacing Cadence (4px / 8px Base Unit)

- `--spacing-4`: `4px` (Micro gaps, icon offsets)
- `--spacing-8`: `8px` (Compact element gaps, badge padding, chip margins)
- `--spacing-12`: `12px` (Standard inner padding, input vertical padding)
- `--spacing-16`: `16px` (Card inner padding, list item gaps)
- `--spacing-24`: `24px` (Section sub-elements, card padding on desktop)
- `--spacing-32`: `32px` (Feed post separation, module gutters)
- `--spacing-48`: `48px` (Two-column section column gaps)
- `--spacing-80`: `80px` (Major section vertical separation)

### Border Radius Hierarchy

The design intentionally contrasts **pillow-soft containers** with **crisp, compact interactive controls**:

| Element Type | Value | Rationale |
|:---|:---|:---|
| **Tags, Chips, Suggestion Pills** | `9999px` | Fully rounded pills that feel like removable physical labels. |
| **Primary & Secondary Buttons** | `8px` or `9999px` | Compact 8px for data buttons; 9999px for hero CTAs. |
| **Search Bars & Hero Inputs** | `24px` | Pillow-soft 24px radius from Handshake; feels approachable and inviting. |
| **Standard Cards & Modals** | `16px` | SpatialChat 16px sweet spot; clean containment. |
| **Hero Containers & Showcase Cards**| `24px` | Large architectural radius framing featured content. |
| **Avatars & Crest Badges** | `9999px` | Pure circular user identities. |

### Elevation & Depth System

Surfaces stay largely flat to maintain newsroom speed, with carefully rationed elevation:

```css
:root {
  /* SpatialChat 6%-opacity subtle card float */
  --shadow-card-subtle: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 10px 28px rgba(0, 0, 0, 0.09);

  /* Threads container spread halo */
  --shadow-feed-halo: 0 0 12px rgba(0, 0, 0, 0.04), 0 0 0 48px #f8faf8;

  /* Handshake button inset pressed-paper feel */
  --shadow-btn-pressed: rgba(255, 255, 255, 0.25) 0 1px 0 0 inset, rgba(0, 0, 0, 0.12) 0 -1px 0 0 inset;

  /* Floating dark nav shadow */
  --shadow-nav-floating: 0 8px 32px rgba(5, 35, 38, 0.18);
}
```

---

## 🧩 Component Anatomy & Design Patterns

### 1. Floating Dark Navigation Bar (Wizz + Handshake)
- **Container:** Max-width `1200px`, centered, floating `16px` from top viewport.
- **Surface:** `#052326` Deep Forest Abyss, `999px` pill border-radius, `1px solid rgba(255,255,255,0.12)`.
- **Left:** University Emblem 🎓 + `CONNEXT` logotype in Playfair Display (white, `0.25em` tracking).
- **Center:** Navigation items in Plus Jakarta Sans 14px/500 (white, `#ffffff`), hover adds subtle `#143d42` pill wash.
- **Right:** Search pill + **Voltage Lime Primary CTA** (`#d3fb52` background, `#000000` text, `9999px` radius, `8px 20px` padding, 14px/700).

```html
<header class="floating-nav-pill">
  <div class="nav-brand">
    <div class="iu-seal">🎓</div>
    <span class="brand-text">CONNEXT</span>
  </div>
  <nav class="nav-links">
    <a href="/users">Mezunlar</a>
    <a href="/jobs">İş & Staj</a>
    <a href="/applications">Başvurular</a>
    <a href="/events">Buluşmalar</a>
    <a href="/announcements">Duyurular</a>
  </nav>
  <div class="nav-actions">
    <a href="/jobs/new" class="btn-ghost-white">+ İlan Ver</a>
    <a href="/users/new" class="btn-voltage-lime">Ağa Katıl</a>
  </div>
</header>
```

---

### 2. Voltage Lime CTA & Ghost Action Pairing (Handshake + SpatialChat)
Every hero or high-intent section uses the **two-button rhythm**:
- **Primary:** `#d3fb52` Voltage Lime background, `#000000` bold text, `8px` or `9999px` radius. Hover states lift slightly (`translateY(-2px)`) with subtle glow.
- **Secondary Ghost:** Transparent background, `1.5px solid #14151c` border, `#14151c` text, hover fills with `#facc15` (Canary Yellow) or `#eeeeee`.

---

### 3. Parenthetical Caption Widget Cards (School)
Every modular dashboard card opens with a small parenthetical monospace label:
- Font: `IBM Plex Mono`, `11px`, weight `400`, color `#71717a` (or `#005b38`).
- Pattern: `(Y)our [resource].`
- Examples:
  - `(Y)our alumni profile.`
  - `(Y)our active job applications.`
  - `(Y)our upcoming reunions.`
  - `(Y)our mentorship connections.`

---

### 4. The Highlighted-Letter Interaction (School + Handshake)
To celebrate individuality and connection without marketing clutter, key headlines feature a **flat highlighter-yellow or voltage-lime block behind a single character or syllable**:
```html
<h2 class="editorial-headline">
  İstanbul University is <span class="highlight-letter yellow">(y)</span>our lifelong springboard.
</h2>
<p class="editorial-subhead">
  C<span class="highlight-letter lime">(o)</span>nnext with 12,450+ verified alumni across the globe.
</p>
```
- The highlight block sits flat behind the glyph at text baseline with zero border-radius, resembling a physical fluorescent highlighter stroke on newsprint.

---

### 5. Newsroom Feed Post Card (Substack + Threads)
- **Container:** Flat white background, no card shadow, separated by `1px solid #e5e7eb` bottom hairline and `24px` vertical padding.
- **Header:**
  - `40px` circular avatar with optional verified university ring.
  - Author Name in Plus Jakarta Sans 15px/600 `#14151c`.
  - University Emerald Verified Tick: small `#005b38` circle with white check.
  - Department & Graduation Tag: `YBS '24` in `IBM Plex Mono 12px #71717a`.
  - Timestamp in `12px #71717a`.
  - Top-Right Action: Inline `+ Takip Et` or `İlana Git` in Voltage Lime text (`#84cc16`).
- **Body:** Post text in Plus Jakarta Sans 15px/1.54 or Spectral 18px.
- **Engagement Bar:** 4 line icons (heart, comment bubble, repost, share) with numeric counts in 13px `#71717a`. Hover shifts icon to `#14151c`.

---

### 6. High-Density Job & Internship Listing Card (Handshake + Substack)
- **Surface:** `#ffffff` card with `1px solid #e5e7eb`, `16px` border-radius, `20px` padding.
- **Top Row:** Company Logo (`48px` rounded-12px) + Company Name (`14px` bold) + Posted Date (`12px` stone).
- **Title:** Playfair Display 20px/800 `#14151c` (strictly enforced `maxlength="120"` characters).
- **Metadata Badges:**
  - `FULL_TIME` / `INTERNSHIP` -> Tag in `#d1fae5` (Sage Mint) with `#065f46` text.
  - `REMOTE` / `HYBRID` -> Tag in `#fef3c7` (Soft Canary) with `#92400e` text.
  - `City / Salary` -> `IBM Plex Mono 12px` text.
- **Action:** Right-aligned Voltage Lime chip: `Başvur (Apply) ↗`.

---

### 7. Two-Column Feature Section with Stat Grid (SpatialChat)
- **Left Column:**
  - All-caps eyebrow label: `CAREER ACCELERATION` in `#005b38` (Emerald) with `+0.05em` tracking.
  - Section Title in Playfair Display 36px/800 `#14151c`.
  - Bulleted value propositions with `8px` filled emerald discs (`#005b38`).
  - **2x3 Stat Block Grid:**
    - `12,450+` (Playfair 28px bold `#14151c`) / `Kayıtlı Mezun ve Öğrenci` (13px `#71717a`)
    - `850+` / `Aktif Kariyer & Staj İlanı`
    - `1,280+` / `Başarılı Mentörlük Eşleşmesi`
- **Right Column:**
  - Interactive UI Card Mockup (`16px` radius, `0 4px 28px rgba(0,0,0,0.06)` shadow) showcasing the live application status tracker (`PENDING` -> `REVIEWING` -> `INTERVIEW` -> `OFFERED`).

---

### 8. Pillow-Soft Search Bar & Suggestion Chips (Handshake)
- **Hero Search Input:** Full-width, `#ffffff` background, `1.5px solid #14151c`, `24px` border-radius, `16px` vertical / `24px` horizontal padding. Placeholder: `Pozisyon, mezun veya şirket adı yazın...`.
- **Magnifier Icon:** Left-aligned 20px stroke `#14151c`.
- **Submit Button:** Integrated Voltage Lime circular button right-aligned.
- **Suggestion Chips Row:** Horizontal list below search with `9999px` pills:
  - `💼 Backend Developer`
  - `🎓 YBS Mezunları`
  - `🌟 Staj Programları 2026`
  - `🤝 Mentör Arayanlar`
  - *Active Chip:* Fills `#d3fb52` Voltage Lime with `#000000` text.

---

### 9. System Health & Guardian Status Dock
- **Surface:** `#052326` or `#f3f4f6`, `16px` radius, `12px 20px` padding.
- **Status Indicator:** Pulsing green emerald disc (`#10b981`) showing `Sistem Sağlıklı: UP (59/59 Test)`.
- **Guardian Chips:**
  - `Logger: time method route restype duration`
  - `404 Guardian: Reason + Smart 302`
  - `5xx Guardian: Safe fallback`
  - `Error Log: logs/error.logs`

---

## 📐 Layout Architecture

Desktop adopts a **responsive hybrid grid**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [🎓 CONNEXT]     Mezunlar   İş & Staj   Buluşmalar   Duyurular  [Ağa Katıl] │ <- Floating Nav
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      [ 🏛️ İSTANBUL ÜNİVERSİTESİ ]                       │
│           İSTANBUL UNIVERSITY ALUMNI WEB PAGE                          │ <- Hero Aurora
│          C(o)nnext your career with 12,450+ verified alumni            │
│                                                                        │
│      [ 🔍 Pozisyon, şirket veya mezun ara...             (Bul ↗) ]     │ <- Pillow Search
│      (Tümü)  (Node.js)  (Yapay Zeka)  (YBS)  (Staj 2026)  (Mentörlük)   │ <- Chips Row
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┬────────────────────────┬────────────────────┐ │
│ │ (Y)our profile.      │ (Y)our newsfeed.       │ (Y)our spotlight.  │ │ <- 3-Column Desk
│ │ • Frosty Franklin    │ • 32px Avatar + Name   │ • Hot Jobs List    │ │
│ │ • YBS 2024           │ • Post content...      │ • Class of 2026    │ │
│ │ • 15-Pills Matrix    │ • ❤️ 💬 🔁 ↗           │ • Quick Apply CTA  │ │
│ └──────────────────────┴────────────────────────┴────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────┬────────────────────────────────┐ │
│ │ Two-Column Feature Block          │ Interactive UI Showcase Card   │ │ <- SpatialChat 2-Col
│ │ • 8px Emerald Bullets             │ • Live Application Tracker     │ │
│ │ • 2x3 Metric Grid (12k+, 850+)    │ • Status: INTERVIEW (Lime)     │ │
│ └───────────────────────────────────┴────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ 🟢 Sistem Sağlığı: UP • 404/5xx Guardians Aktif • Swagger UI • OpenAPI  │ <- System Dock
├────────────────────────────────────────────────────────────────────────┤
│ © 2026 CONNEXT • İstanbul Üniversitesi Mezun Takip Sistemi             │ <- Dark Footer
└────────────────────────────────────────────────────────────────────────┘
```

- **Container Max-Width:** `1200px` centered with auto horizontal margins.
- **Center Feed Max-Width:** `640px` (optimized for line-length reading comfort).
- **Responsive Breakpoint (768px):** Sidebars collapse into drawer tabs; floating nav anchors to top screen; multi-column cards stack vertically.

---

## ✅ Do's and Don'ts

### Do
- **Do** use **Voltage Lime (`#d3fb52`)** as the primary chromatic action color — on high-intent CTAs, active pills, and hero spark.
- **Do** use **Canary Yellow (`#facc15`)** and **Highlighter Yellow (`#f9f5a2`)** for badges, ratings, and School-style character highlight swaps.
- **Do** use **University Emerald (`#005b38`)** for institutional verification badges, success indicators, and heritage crests.
- **Do** pair **Playfair Display** (headlines) with **Plus Jakarta Sans** (UI body) and **IBM Plex Mono** (parenthetical captions & metadata).
- **Do** format modular widget titles with parenthetical captions: `(Y)our [topic].` to preserve the human, creative studio voice.
- **Do** separate newsroom feed items with `1px solid #e5e7eb` hairlines and generous vertical whitespace.
- **Do** strictly limit card shadows to the subtle 6%-opacity token (`0 4px 16px rgba(0,0,0,0.06)`).

### Don't
- **Don't** use secondary chromatic colors like purple, red, cyan, or orange on primary surfaces — the palette is strictly **Monochrome + Yellow & Green**.
- **Don't** use heavy drop shadows on individual feed posts or table rows — depth must come from whitespace, 1px dividers, and border radii.
- **Don't** use serif fonts for body text or form inputs — reserve Playfair Display for headings and numbers; use Plus Jakarta Sans for UI.
- **Don't** make button radii sharp (<6px) — buttons must be either `8px` or fully pill-shaped `9999px`.
- **Don't** use pure `#000000` for long reading copy — use `#14151c` (Carbon Ink) or `#363737` (Warm Ink) to avoid eye strain.
- **Don't** place Voltage Lime text on white surfaces — `#d3fb52` is for backgrounds with black text, never as light text on light backgrounds.

---

## 💻 Quick Start — Design Tokens Implementation

### CSS Custom Properties

```css
:root {
  /* Chromatic Palette — Yellow & Green */
  --color-voltage-lime: #d3fb52;
  --color-canary-yellow: #facc15;
  --color-highlight-yellow: #f9f5a2;
  --color-univ-emerald: #005b38;
  --color-forest-abyss: #052326;

  /* Monochromatic Foundations */
  --color-carbon-ink: #14151c;
  --color-warm-ink: #363737;
  --color-stone-neutral: #71717a;
  --color-ash-hairline: #e5e7eb;
  --color-mist-surface: #f3f4f6;
  --color-paper-canvas: #ffffff;
  --color-canvas-bg: #f8faf8;

  /* Tints */
  --color-sage-tint: #f0fdf4;
  --color-butter-tint: #fefce8;

  /* Gradients */
  --gradient-aurora: radial-gradient(at 55% 45%, #7af3ff 0%, #d3fb52 50%, #005b38 90%);
  --gradient-spring: linear-gradient(90deg, #d3fb52 0%, #facc15 50%, #10b981 100%);

  /* Typography */
  --font-display-serif: 'Playfair Display', Charter, Georgia, serif;
  --font-primary-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-editorial-serif: 'Spectral', Charter, Georgia, serif;
  --font-mono: 'IBM Plex Mono', SFMono-Regular, Menlo, monospace;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-80: 80px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-subtle: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 10px 28px rgba(0, 0, 0, 0.09);
  --shadow-nav: 0 8px 32px rgba(5, 35, 38, 0.18);
}
```

### Tailwind v4 `@theme` Block

```css
@theme {
  /* Yellow & Green Palette */
  --color-voltage-lime: #d3fb52;
  --color-canary-yellow: #facc15;
  --color-highlight-yellow: #f9f5a2;
  --color-univ-emerald: #005b38;
  --color-forest-abyss: #052326;

  /* Monochromes */
  --color-carbon-ink: #14151c;
  --color-warm-ink: #363737;
  --color-stone-neutral: #71717a;
  --color-ash-hairline: #e5e7eb;
  --color-mist-surface: #f3f4f6;
  --color-paper-canvas: #ffffff;
  --color-canvas-bg: #f8faf8;

  /* Tints */
  --color-sage-tint: #f0fdf4;
  --color-butter-tint: #fefce8;

  /* Fonts */
  --font-display-serif: 'Playfair Display', Charter, Georgia, serif;
  --font-primary-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Radii */
  --radius-pill: 9999px;
  --radius-card: 16px;
  --radius-hero-card: 24px;

  /* Shadows */
  --shadow-subtle: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 10px 28px rgba(0, 0, 0, 0.09);
}
```

---

[⬅️ Ana Dokümantasyona Dön (README.md)](./README.md) • [🎨 Marka Kılavuzuna Git (brand.md)](./brand.md)
