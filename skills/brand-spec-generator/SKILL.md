---
name: brand-spec-generator
description: "Use when turning a short brand brief into a full WCAG 2.1 AA HTML design system spec with color tokens, type scale, and a cursorrules block."
---

# brand-spec-generator

**Version:** 1.0  
**Specimen:** a real branding spec (anonymized) — 1,332 lines, 13 sections, WCAG 2.1 AA  
**Category:** 5 — Project bootstrap (new project only)  
**Output:** Complete branded HTML design system spec + .cursorrules token block

---

## What this skill does and doesn't do

**Does:** Takes a 10-minute brand brief → produces the full HTML branding spec
with WCAG-checked color tokens, typography scale, component patterns, do/don't
rules, and a ready-to-paste cursorrules block. What took 2+ iterations and
significant discussion on a real project can be done in one session for the next
project.

**Doesn't:** Choose the brand personality, color direction, or target audience.
Those come from the brief — this skill implements decisions already made.

**What must come from the human first:**

- Product name + tagline
- Brand personality (2–3 adjectives)
- Target user (who, what context, what device)
- Color direction (give a primary color or describe a feeling)
- Font preference (or "use Inter" for default)
- "NOT" list (what this brand should explicitly avoid)

---

## Inputs required

```
product_name:       string   # e.g. "<your product>"
client_name:        string   # e.g. "<white-label brand>" (if white-labeled)
tagline:            string   # e.g. "Financial Intelligence for Luxury Rentals"
personality:        string[] # e.g. ["Trusted", "Sophisticated", "Efficient"]
tone:               string   # e.g. "Professional but warm. Data-dense without overwhelming."
target_user:        string   # e.g. "Caribbean luxury villa owners, French + English speaking"
aesthetic:          string   # e.g. "Refined minimalism. Deep navy depth. Clean white cards."
not_this:           string   # e.g. "Not playful. Not dark-mode heavy. Not startup-generic."
primary_color:      string   # from brief — hex or description, e.g. "deep navy purple" (example only — replace with client color)
accent_color:       string   # from brief — hex or description, e.g. "warm gold for premium signals" (example only — replace with client color)
font_primary:       string   # e.g. "Inter" (default) or "Plus Jakarta Sans"
font_mono:          string   # e.g. "JetBrains Mono" (default)
languages:          string[] # e.g. ["FR", "EN"] — affects i18n section
tech_stack:         string   # e.g. "Next.js 15, Tailwind CSS 4, TypeScript strict"
```

**Cold-install note:** This skill ships with no bundled brand config. If no brief
is provided, ask the user for the product name, three personality adjectives, the
color direction, and the NOT-list before generating — never fall back to a
pre-set palette.

---

## WCAG 2.1 AA color generation rules

**Always apply these checks before finalizing any color token:**

| Pair type | Minimum contrast ratio | Standard |
|---|---|---|
| Body text on background | 4.5:1 | SC 1.4.3 |
| Large text (18px+ bold) on background | 3:1 | SC 1.4.3 |
| UI components / borders on adjacent | 3:1 | SC 1.4.11 |
| Focus ring on adjacent color | 3:1 | SC 2.4.7 |

**Decorative fills** (chart bars, card backgrounds, illustration fills) are
exempt from contrast requirements — they convey no information.

**Color lesson (from a real spec, v2.2):** Gold (#C9A961) passed as a decorative fill but
failed as text. Solution: create `--gold` (decorative) AND `--gold-text`
(#92701A, 4.61:1 on white) as separate tokens. Apply this dual-token
pattern to any color that needs both fill and text uses.

**Token naming convention:**

> **Example only — replace with client tokens.** The brand tokens (`--primary`,
> `--primary-light`, `--accent`, `--accent-text`, `--secondary`, `--focus-ring`)
> are derived from the brief, never defaulted. The neutral and semantic hex
> values below are WCAG-checked reference defaults — keep or override them per
> the client brief. Never emit a pre-set brand palette as the client's brand.

```css
:root {
  /* Primary brand */
  --primary:        #[hex];  /* Deep [color] — sidebar, CTAs, active states */
  --primary-light:  #[hex];  /* Tint — icon backgrounds, hover fills */

  /* Accent */
  --accent:         #[hex];  /* [Color name] — decorative fills ONLY */
  --accent-text:    #[hex];  /* Accessible [color] for text on white */

  /* Secondary palette */
  --secondary:      #[hex];  /* [Use case] */

  /* Text scale */
  --text:           #1E293B; /* Slate 800 — primary body (keep unless overriding) */
  --text-light:     #64748B; /* Slate 500 — secondary labels */
  --text-muted:     #6B7280; /* Slate 600 — 4.83:1 on white ✅ */

  /* Backgrounds */
  --bg:             #F8FAFC; /* Off-white page bg */
  --white:          #FFFFFF;
  --border:         #E2E8F0; /* Decorative borders (SC 1.4.11 exempt) */
  --input-border:   #9CA3AF; /* Form borders — 3.08:1 ✅ */

  /* Semantic */
  --green:          #10B981; /* Positive deltas — 4.5:1 on white ✅ */
  --red:            #EF4444; /* Negative deltas / errors — 5.9:1 on white ✅ */
  --orange:         #F59E0B; /* Warnings — icon use only, not body text */

  /* Badge text (darker for tinted backgrounds) */
  --badge-success-text: #047857;  /* 5.21:1 on #ECFDF5 ✅ */
  --badge-warning-text: #B45309;  /* 4.51:1 on #FEF3C7 ✅ */
  --badge-danger-text:  #B91C1C;  /* 5.91:1 on #FEF2F2 ✅ */

  /* Focus */
  --focus-ring:     #[secondary-or-primary]; /* SC 2.4.7 — 3:1 on white ✅ */

  /* Shape */
  --radius:         12px;
  --radius-sm:       8px;
  --sidebar-w:      [200–240]px;
  --topbar-h:        56px;
}
```

---

## Typography scale

Default (reuse for all projects unless client specifies otherwise):

- **Font:** Inter (Google Fonts, all weights 300–800)
- **Mono:** JetBrains Mono (code blocks, data labels, tokens)

Scale (matches the reference spec — don't reinvent unless client requires):

```
H1: 32px / 700 / line-height 1.2
H2: 24px / 700 / line-height 1.3
H3: 18px / 600 / line-height 1.4
H4: 14px / 600 / line-height 1.5
Body: 14px / 400 / line-height 1.6
Small: 12px / 400 / line-height 1.5
Label: 10px / 700 / uppercase / letter-spacing 1px
```

---

## Spec sections (13 sections, fixed order)

The branding spec always contains these sections in this order.
Each section has a standard template derived from the reference specimen.

### 1. Brand overview

- Brand positioning table: Personality, Tone, Target user, Aesthetic direction, NOT list
- Identity summary paragraph

### 2. Color palette

- All CSS custom properties with hex values
- WCAG contrast ratio for each text/background pair
- Swatch grid with name, hex, usage note
- ♿ annotation for any color that was modified for accessibility
- Dual-token note for colors used both as fill and text

### 3. Typography

- Font stack declaration
- Type scale table (size, weight, line-height, usage)
- Type specimen renders (H1 through Label)
- Do/Don't: weight usage rules

### 4. Logo & mark

- Logo mark spec (initial letter, dimensions, background)
- Safe area rule (minimum clear space = mark height × 0.5)
- Usage on light / dark backgrounds
- Forbidden uses (stretch, rotate, recolor, gradient overlay)

### 5. Spacing & grid

- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
- Layout grid: sidebar (fixed width) + topbar (fixed height) + content area
- Card padding: 20–28px
- Section gaps: 24–32px

### 6. Elevation & borders

- Border style: 1px solid var(--border) for layout, 1.5px for interactive
- Border radius: --radius (12px) for cards, --radius-sm (8px) for inputs/badges
- Shadow levels: none (flat), sm (cards), md (dropdowns), lg (modals)
- No gradient shadows — flat solid borders preferred

### 7. Components

- Buttons: primary, outline, ghost, danger, icon-only
- Badges: primary, light, success, warn, danger, purple
- KPI cards: default, active state
- Table rows: header, data, hover, selected
- Form inputs: default, focus, error, disabled states
- Sidebar nav: item, active item, section header
- Status pills: confirmed, pending, cancelled, no-show, blocked

### 8. Motion & transitions

- Duration scale: instant (0ms), fast (100ms), base (150ms), slow (250ms)
- Easing: ease-out for entries, ease-in for exits, linear for loading
- All transitions on: background-color, border-color, color, opacity, transform
- No transitions on: layout properties (width, height, padding) — use transforms

### 9. App layout

- Shell structure: sidebar + topbar + content area
- Sidebar: fixed left, full height, nav items + section headers
- Topbar: fixed top, breadcrumb + user menu + action buttons
- Content: scrollable, max-width 1100–1400px, 32–48px padding

### 10. Data display

- KPI grid: 4-column, responsive
- Data tables: sortable headers, alternating rows, action column
- Charts: use Recharts (already in stack) — bar, line, area only
- Empty states: illustration + heading + CTA button

### 11. Forms & inputs

- Input height: 36–40px
- Label position: above input, 10px font, uppercase
- Error: red border + error text below (never inside)
- Required: asterisk * after label
- Form layout: single column for modals, 2-column for settings pages

### 12. Do / Don't rules

- 6–8 rules per section, positive framing with explicit counterexample
- Always generate rules for: color misuse, text on decorative fills,
  gradient use, shadow overuse, typography mixing, component overrides

### 13. Cursor rules block

The most valuable section for the factory — directly feeds `.cursorrules`.
Extract all design tokens and patterns as copy-pasteable cursorrules text:

```
# DESIGN TOKENS
--primary: #[hex]          # Deep [color] — sidebar, CTAs
--primary-light: #[hex]    # Tint — icon backgrounds
--accent: #[hex]           # Decorative fills only
--accent-text: #[hex]      # Text on white (contrast: [ratio]:1 ✅)
--text: #1E293B            # Primary body
--text-light: #64748B      # Secondary labels
--text-muted: #6B7280      # Muted — 4.83:1 on white ✅
--bg: #F8FAFC              # Page background
--border: #E2E8F0          # Layout borders
--input-border: #9CA3AF    # Form borders — 3.08:1 ✅
--focus-ring: #[hex]       # Focus rings — SC 2.4.7
--radius: 12px
--radius-sm: 8px

# TYPOGRAPHY
Font: [font-name] — import from Google Fonts
Mono: JetBrains Mono — code, data labels
Scale: H1 32/700 · H2 24/700 · H3 18/600 · Body 14/400 · Label 10/700 uppercase

# COMPONENT RULES
- Buttons: primary bg = --primary, hover = darken 8%, active = scale(0.98)
- Cards: white bg, 1px --border, --radius, 24px padding
- Form inputs: 36px height, 1.5px --input-border, 8px radius, --focus-ring on focus
- Badges: 11px, 600 weight, 6px radius, use badge-*-text tokens on tinted bg
- Tables: --text header labels 10px uppercase, alternating row bg at 3% opacity

# FORBIDDEN
- No gradient backgrounds on primary UI surfaces
- No text directly on --accent or --gold fills (use --accent-text instead)
- No Tailwind max-h-[*] for modal scroll — use inline style max-h: 90vh
- No color: #94A3B8 for body text — fails WCAG (2.56:1 on white)
- No box-shadow on interactive elements — use border changes instead
```

---

## HTML spec file structure

The output is a single self-contained HTML file following the reference template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta, Google Fonts links -->
  <style>
    :root { /* All CSS custom properties */ }
    /* Doc chrome styles (dark bg for the spec itself) */
    /* Component demo styles */
  </style>
</head>
<body>
  <nav class="spec-nav"><!-- Left nav with all 13 section anchors --></nav>
  <main class="spec-main">
    <!-- Hero: product name, version, WCAG badge -->
    <!-- Section 1: Brand overview -->
    <!-- Section 2: Color palette (swatches with WCAG ratios) -->
    <!-- ... through Section 13 -->
    <!-- Section 13: Cursor rules (pre-formatted copy block) -->
  </main>
</body>
</html>
```

Key implementation detail: the spec uses a **dark chrome** (doc-bg: #0F0A1E)
to display the **light product UI** components. This separation makes it
immediately obvious which is the spec document and which is the actual product.
Copy the dark chrome CSS from the reference specimen verbatim — it's not
project-specific.

---

## Generation steps

1. **Receive the brand brief** (inputs above) — 10-minute conversation or form
2. **Generate the primary color palette** — derive all tokens from the primary
   color using lightening/darkening + WCAG checks
3. **Check every text/background contrast pair** — use the WCAG table above
4. **Apply dual-token pattern** to any color used as both fill and text
5. **Write the CSS custom properties block** — annotate each with ratio ✅/❌
6. **Generate the HTML file** following the 13-section structure
7. **Fill Section 13 (Cursor rules)** — this is the direct input to .cursorrules
8. **Version as v1.0** — subsequent changes increment the version

---

## QA checklist

- [ ] All body-text/background pairs ≥ 4.5:1
- [ ] All large-text/background pairs ≥ 3:1
- [ ] All UI component border pairs ≥ 3:1
- [ ] Focus ring ≥ 3:1 on adjacent color
- [ ] Decorative fills annotated "decorative only — WCAG SC 1.4.11 exempt"
- [ ] Dual-token pattern applied for any color used as both fill and text
- [ ] Section 13 Cursor rules block present and complete
- [ ] Google Fonts import in `<head>` for primary and mono fonts
- [ ] All 13 sections present with live component demos
- [ ] File is self-contained (no external CSS dependencies except Google Fonts)
- [ ] Version number in title and nav subtitle

---

## Reuse across projects

The following sections are ~90% reusable from the reference spec:

- Typography scale (identical unless client specifies different font)
- Spacing & grid (4px base unit, scale, card padding)
- Motion & transitions (timing + easing are universal)
- Semantic colors (--green, --red, --orange are standard)
- Badge text tokens (WCAG-checked tinted badges)
- Focus ring implementation
- Dark doc chrome (for the spec document itself)

Only these sections change per project:

- Brand overview (positioning, personality, target user)
- Primary color + derived palette
- Logo & mark
- Do/Don't rules (reflect client brand direction)
- Cursor rules Section 13 (reflects new token values)

**Estimated time with this skill:** 45–90 minutes for a complete spec from
brief. Compared to 2+ sessions on a real project (without this skill).

---

## Known failure modes

**Gold-on-white fails WCAG without dual token.** Always create a `-text`
variant of decorative colors. Never use a decorative fill color directly as
text color on white.

**Muted text color fails WCAG.** #94A3B8 (Slate 400) is a common mistake —
2.56:1 on white, fails. Use #6B7280 (Slate 600, 4.83:1) for muted text.

**Missing input-border token.** Layout borders (#E2E8F0, 1.7:1) are decorative.
Form field borders must be a separate token meeting 3:1 for SC 1.4.11.

**Section 13 not written.** This section is what makes the spec feed directly
into .cursorrules. If it's missing, the spec is documentation only, not a
factory input. Always write it last, after all tokens are finalized.

**No versioning.** The spec will change — WCAG failures get fixed, tokens
get adjusted after seeing the UI in context. Always version the file (v1.0,
v1.1, v2.0). The v2.2 number on the reference spec reflects two rounds of accessibility
fixes after the initial draft.
