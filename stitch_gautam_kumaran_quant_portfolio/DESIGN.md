---
name: Quant Precision
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#343536'
  on-surface: '#e4e2e4'
  on-surface-variant: '#c5c6cd'
  inverse-surface: '#e4e2e4'
  inverse-on-surface: '#303032'
  outline: '#8f9097'
  outline-variant: '#44474d'
  surface-tint: '#b9c7e4'
  primary: '#b9c7e4'
  on-primary: '#233148'
  primary-container: '#0a192f'
  on-primary-container: '#74829d'
  inverse-primary: '#515f78'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#e7bf99'
  on-tertiary: '#432b10'
  tertiary-container: '#281400'
  on-tertiary-container: '#9d7b5a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#e7bf99'
  on-tertiary-fixed: '#2b1701'
  on-tertiary-fixed-variant: '#5d4124'
  background: '#131315'
  on-background: '#e4e2e4'
  surface-variant: '#343536'
  status-success: '#10B981'
  status-wip: '#F59E0B'
  text-primary: '#FFFFFF'
  text-secondary: '#94A3B8'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1120px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is engineered for the **Quantitative Finance enthusiast**, prioritizing clarity, data integrity, and intellectual rigor. The brand personality is scholarly yet modern, evoking the atmosphere of a high-end quantitative research lab. It speaks to an audience that values evidence over intuition and precision over decoration.

The visual style is a refined **Minimalism** with a **Corporate / Modern** influence. It utilizes high-contrast typography and a structured grid to manage information-dense content. By removing heavy shadows and complex animations, the focus remains entirely on the logic, tech stacks, and mathematical results of the projects. The emotional response should be one of "calm authority"—the interface feels stable, reliable, and deeply technical.

## Colors

This design system uses a **dark-first color mode** to reduce eye strain during deep technical reading and to align with developer-centric environments. 

- **Primary Background:** A deep navy (`#0A192F`) serves as the foundation, providing a professional, terminal-like atmosphere.
- **Secondary / Slate:** Used for borders, icons, and less-critical UI elements to create subtle hierarchy without breaking the minimalist aesthetic.
- **High-Contrast White:** Reserved for primary headlines and body copy to ensure maximum legibility against the dark background.
- **Functional Accents:** Emerald green (`#10B981`) is strictly reserved for "Completed" states or positive deltas. Soft amber (`#F59E0B`) is used exclusively for "Work in Progress" or cautionary data points.

Avoid using gradients or saturated background colors; maintain the "ink on dark paper" feel.

## Typography

The typography system pairs the geometric precision of **Outfit** for headings with the functional neutrality of **Inter** for long-form prose.

- **Headlines:** Use Outfit with tight letter spacing for a "technical luxury" look. 
- **Body:** Inter is set with a generous line height (1.6) to ensure that dense project descriptions remain approachable.
- **Data/Labels:** A monospaced font (**JetBrains Mono**) is introduced for technical metadata, tags, and snippets to reinforce the quantitative nature of the work.

Maintain a clear typographic scale where headlines clearly anchor sections. On mobile, reduce headline sizes to prevent excessive line-breaking.

## Layout & Spacing

This design system uses a **fixed grid model** centered on the screen for desktop to maintain a manageable line length for technical reading.

- **Grid:** A 12-column grid with 24px gutters.
- **Whitespace:** Use the "Stack" variables to maintain vertical rhythm. `stack-xl` should be used between major project sections, while `stack-md` is the standard for spacing within a card or between paragraphs.
- **Responsive Behavior:** 
  - **Desktop (1024px+):** Fixed 1120px container.
  - **Tablet (768px - 1023px):** Fluid container with 40px side margins.
  - **Mobile (<767px):** 1-column layout with 20px side margins.

## Elevation & Depth

Depth is established through **Tonal Layering** rather than shadows. 

- **Level 0 (Base):** `#0A192F` (Main background).
- **Level 1 (Cards/Navigation):** Use a slightly lightened version of the primary navy or a 1px border of `#64748B` at 20% opacity.
- **Level 2 (Hover/Interactions):** A subtle background shift or a brighter border stroke.

Shadows are entirely avoided to maintain a "flat, clinical" look. Instead, use thin, low-contrast outlines to define boundaries between components.

## Shapes

The shape language is **Soft (0.25rem)**. This subtle rounding removes the aggressive edge of sharp corners while maintaining the structured, professional feel required for a finance portfolio.

- **Buttons & Cards:** 4px (0.25rem) corner radius.
- **Tags/Chips:** 4px (0.25rem) to match, or sharp if used in a tabular context.
- **Inputs:** 4px (0.25rem) for consistency.

## Components

- **Navigation Bar:** A fixed, top-aligned bar with a high-transparency blur or a solid `#0A192F` background and a 1px bottom border. Keep links simple and monospaced.
- **Project Cards:** Large containers with a subtle border. Use `headline-md` for titles. Include a "Status Tag" in the top right corner using the emerald or amber named colors.
- **Call-to-Action (CTA):** Primary buttons should be solid white with navy text. Hover states should simply reduce opacity to 90% or change the border intensity—no motion or glow.
- **Tags/Chips:** Used for "Tech Stack" items. Use `label-mono`, small padding (4px 8px), and a slate-gray outline.
- **Lists:** Use custom bullets (e.g., a simple slate-gray dash) rather than default circles.
- **Data Blocks:** For highlighting results (e.g., "8.3% move frequency"), use a large Outfit font weight with a slate label underneath to give it a "dashboard" feel.