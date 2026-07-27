# Acme Tasks — Design System Spec v1.0 (excerpt)

WCAG 2.1 AA · 13 sections · Inter + JetBrains Mono

## 1. Brand overview

| Field | Value |
|---|---|
| Personality | Focused, Calm, Reliable |
| Tone | Professional, quietly confident |
| Target user | Product teams at small startups (desktop-first) |
| Aesthetic | Calm blue-green, light UI, generous whitespace |
| NOT | Not playful, not neon, not dark-mode-first |

## 2. Color palette (example only — derived from the brief)

```css
:root {
  --primary:       #0F766E; /* Teal 700 — sidebar, CTAs — 5.12:1 on white ✅ */
  --primary-light: #CCFBF1; /* Tint — icon backgrounds, hover fills */
  --accent:        #F59E0B; /* Amber — decorative fills ONLY */
  --accent-text:   #B45309; /* Accessible amber for text — 4.52:1 on white ✅ */
  --text:          #1E293B; /* Slate 800 — primary body */
  --text-muted:    #6B7280; /* Slate 600 — 4.83:1 on white ✅ */
  --bg:            #F8FAFC; /* Off-white page bg */
  --border:        #E2E8F0; /* Decorative borders (SC 1.4.11 exempt) */
  --input-border:  #9CA3AF; /* Form borders — 3.08:1 ✅ */
  --focus-ring:    #0F766E; /* SC 2.4.7 — 3:1 on white ✅ */
  --radius:        12px;
}
```

Dual-token note: `--accent` (amber) passes as a decorative fill but fails as text,
so `--accent-text` (#B45309) is provided for any text use.

## 13. Cursor rules block (feeds .cursorrules)

```text
# DESIGN TOKENS
--primary: #0F766E        # Teal — sidebar, CTAs
--accent: #F59E0B         # Decorative fills only
--accent-text: #B45309    # Text on white (contrast 4.52:1 ✅)
--text: #1E293B           # Primary body
--bg: #F8FAFC             # Page background
--radius: 12px

# TYPOGRAPHY
Font: Inter — import from Google Fonts
Scale: H1 32/700 · H2 24/700 · Body 14/400 · Label 10/700 uppercase

# FORBIDDEN
- No text directly on --accent fills (use --accent-text)
- No color below 4.5:1 for body text
- No dark-mode-first surfaces (brief: light UI)
```
