# Design Tokens - Portfolio Website

**Extracted from Figma Variables**  
**Date:** 2025-10-15  
**Breakpoint:** Desktop: `>768px` | Mobile: `<767px`

---

## 1. Color System

### 1.1 Light Mode Colors (Primary)

```css
:root {
  /* Background Fills */
  --color-bg-system-white: #ffffff;
  --color-bg-secondary: #f2f2f7;
  --color-bg-tertiary: #ebebf5;
  --color-bg-shell: #fdfcfb;
  
  /* Labels & Text */
  --color-label-primary: rgba(11, 12, 17, 1.0);        /* #0b0c11 */
  --color-label-secondary: rgba(11, 12, 17, 0.6);      /* #0b0c1199 */
  --color-label-tertiary: rgba(11, 12, 17, 0.3);       /* #0b0c114d */
  --color-label-quaternary: rgba(11, 12, 17, 0.18);    /* #0b0c112e */
  
  /* Neutral Palette */
  --color-neutral-dark-100: rgba(42, 33, 25, 1.0);     /* #2a2119 */
  --color-neutral-dark-64: rgba(42, 33, 25, 0.64);     /* #2a2119a3 */
  --color-neutral-dark-48: rgba(42, 33, 25, 0.48);     /* #2a21197a */
  --color-neutral-dark-32: rgba(42, 33, 25, 0.32);     /* #2a211952 */
  --color-neutral-dark-16: rgba(42, 33, 25, 0.16);     /* #2a211929 */
  --color-neutral-light-64: rgba(255, 255, 255, 0.64); /* #ffffffa3 */
  
  /* Materials (Blur Backgrounds) */
  --color-material-regular: rgba(255, 255, 255, 0.4);  /* #ffffff66 - 25% blur */
  --color-material-thick: rgba(255, 255, 255, 0.6);    /* #ffffff99 - 50% blur */
  --color-material-thin: rgba(255, 255, 255, 0.18);    /* #ffffff2e - 10% blur */
  
  /* Separators */
  --color-separator-opaque: #ebecec;
  --color-separator-non-opaque: rgba(11, 12, 17, 0.18);
  
  /* Special */
  --color-yellow: #ffda3d;
}
```

### 1.2 Dark Mode Colors (Work Sections)

```css
[data-theme="dark"], .dark-mode {
  /* Background Fills */
  --color-bg-system-white: #000000;
  --color-bg-secondary: #1c1c1e;
  --color-bg-tertiary: #2c2c2e;
  
  /* Labels & Text */
  --color-label-primary: #ffffff;
  --color-label-secondary: rgba(234, 234, 237, 0.6);   /* #eaeed99 */
  --color-label-tertiary: rgba(234, 234, 237, 0.3);    /* #eaeed4d */
  --color-label-quaternary: rgba(234, 234, 237, 0.18); /* #eaeed2e */
  
  /* Materials */
  --color-material-regular: rgba(0, 0, 0, 0.4);
  --color-material-thick: rgba(0, 0, 0, 0.6);
  --color-material-thin: rgba(0, 0, 0, 0.18);
  
  /* Separators */
  --color-separator-opaque: #38383a;
  --color-separator-non-opaque: rgba(84, 84, 88, 0.6); /* #545458 */
}
```

---

## 2. Typography System

### 2.1 Font Families

```css
:root {
  --font-family-heading: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-family-body: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-family-ui: 'Geist Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
}
```

### 2.2 Headings (Instrument Sans)

#### Desktop (`>768px`)

```css
/* Heading 1 */
--font-size-h1: 48px;
--line-height-h1: 56px;
--letter-spacing-h1: -1.2px;
--font-weight-h1: 600; /* SemiBold */

/* Heading 2 */
--font-size-h2: 40px;
--line-height-h2: 44px;
--letter-spacing-h2: -1.2px;
--font-weight-h2: 600; /* SemiBold */

/* Heading 3 */
--font-size-h3: 36px;
--line-height-h3: 40px;
--letter-spacing-h3: -1.2px;
--font-weight-h3: 600; /* SemiBold */

/* Heading 4 */
--font-size-h4: 28px;
--line-height-h4: 32px;
--letter-spacing-h4: -0.8px;
--font-weight-h4: 600; /* SemiBold */
```

#### Mobile (`<767px`)

```css
/* Heading 1 Mobile */
--font-size-h1-mobile: 40px;
--line-height-h1-mobile: 44px;
--letter-spacing-h1-mobile: -1.2px;

/* Heading 2 Mobile */
--font-size-h2-mobile: 32px;
--line-height-h2-mobile: 36px;
--letter-spacing-h2-mobile: -1.2px;

/* Heading 3 Mobile */
--font-size-h3-mobile: 28px;
--line-height-h3-mobile: 32px;
--letter-spacing-h3-mobile: -1.2px;

/* Heading 4 Mobile */
--font-size-h4-mobile: 22px;
--line-height-h4-mobile: 26px;
--letter-spacing-h4-mobile: -0.8px;
```

### 2.3 Body Text (Instrument Sans)

#### Desktop (`>768px`)

```css
/* Body Large (B1) */
--font-size-b1: 18px;
--line-height-b1: 26px;
--letter-spacing-b1: -0.4px;
--font-weight-b1-medium: 500;
--font-weight-b1-bold: 600;
--paragraph-spacing-b1: 28px;

/* Body Medium (B2) */
--font-size-b2: 16px;
--line-height-b2: 24px;
--letter-spacing-b2: -0.2px;
--font-weight-b2-medium: 500;
--font-weight-b2-bold: 600;

/* Body Small (B3) */
--font-size-b3: 14px;
--line-height-b3: 20px;
--letter-spacing-b3: -0.2px;
--font-weight-b3-medium: 500;
--font-weight-b3-bold: 600;
--paragraph-spacing-b3: 20px;
```

#### Mobile (`<767px`)

```css
/* Body Large Mobile */
--font-size-b1-mobile: 16px;
--line-height-b1-mobile: 24px;
--letter-spacing-b1-mobile: -0.2px;

/* Body Medium Mobile */
--font-size-b2-mobile: 14px;
--line-height-b2-mobile: 20px;
--letter-spacing-b2-mobile: 0px;

/* Body Small Mobile */
--font-size-b3-mobile: 12px;
--line-height-b3-mobile: 16px;
--letter-spacing-b3-mobile: 0px;
```

### 2.4 UI Text (Geist Mono)

#### Buttons

```css
/* Button Large - Desktop & Mobile (same) */
--font-size-button-l: 14px;
--line-height-button-l: 24px;
--letter-spacing-button-l: 2px;
--font-weight-button: 400; /* Regular */
--paragraph-spacing-button-l: 0;

/* Button Small - Desktop */
--font-size-button-s: 12px;
--line-height-button-s: 16px;
--letter-spacing-button-s: 1px;
--paragraph-spacing-button-s: 0;

/* Button Small - Mobile */
--font-size-button-s-mobile: 10px;
--line-height-button-s-mobile: 14px;
--letter-spacing-button-s-mobile: 2px;
```

#### Labels

```css
/* Label Large */
--font-size-label-l: 14px;
--line-height-label-l: 16px;
--letter-spacing-label-l: 1px;
--font-weight-label: 400; /* Regular */
--paragraph-spacing-label-l: 0;

/* Label Small */
--font-size-label-s: 12px;
--line-height-label-s: 16px;
--letter-spacing-label-s: 2px;
--paragraph-spacing-label-s: 0;

/* Label Extra Small (Mobile metadata) */
--font-size-label-xs: 10px;
--line-height-label-xs: 14px;
--letter-spacing-label-xs: 2px;
```

---

## 3. Spacing System

### 3.1 Spacing Scale (Responsive)

#### Desktop (`>768px`)

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;
--space-32: 32px;
--space-48: 48px;
--space-64: 64px;
--space-80: 80px;
--space-120: 120px;
--space-160: 160px;
```

#### Mobile (`<767px`)

```css
--space-4-mobile: 4px;     /* Fixed */
--space-8-mobile: 6px;     /* 8 → 6 */
--space-12-mobile: 8px;    /* 12 → 8 */
--space-16-mobile: 12px;   /* 16 → 12 */
--space-20-mobile: 16px;   /* 20 → 16 */
--space-24-mobile: 16px;   /* 24 → 16 */
--space-32-mobile: 24px;   /* 32 → 24 */
--space-48-mobile: 32px;   /* 48 → 32 */
--space-64-mobile: 48px;   /* 64 → 48 */
--space-80-mobile: 64px;   /* 80 → 64 */
--space-120-mobile: 80px;  /* 120 → 80 */
--space-160-mobile: 120px; /* 160 → 120 */
```

### 3.2 Grid System

```css
/* Desktop Grid */
--grid-columns-desktop: 12;
--grid-gap-desktop: 32px;
--grid-container-padding-desktop: 120px;

/* Mobile Grid */
--grid-columns-mobile: 4;
--grid-gap-mobile: 16px;
--grid-container-padding-mobile: 16px;
```

---

## 4. Border Radius

### 4.1 Radius Scale (Responsive)

#### Desktop (`>768px`)

```css
--radius-1: 24px; /* Card containers */
--radius-2: 16px; /* Sub-sections */
--radius-3: 8px;  /* Small cards */
--radius-4: 48px; /* XXL (rare use) */
--radius-5: 44px; /* XL (rare use) */
--radius-6: 4px;  /* Image thumbnails */
--radius-button: 32px; /* Button pill shape */
```

#### Mobile (`<767px`)

```css
--radius-1-mobile: 16px; /* 24 → 16 */
--radius-2-mobile: 0px;  /* 16 → 0 (flat) */
--radius-3-mobile: 4px;  /* 8 → 4 */
--radius-4-mobile: 48px; /* Fixed */
--radius-5-mobile: 44px; /* Fixed */
--radius-6-mobile: 4px;  /* Fixed */
--radius-button-mobile: 32px; /* Fixed */
```

---

## 5. Shadows & Effects

### 5.1 Backdrop Blur

```css
--backdrop-blur-regular: blur(25px); /* Material Regular */
--backdrop-blur-thick: blur(50px);   /* Material Thick */
--backdrop-blur-thin: blur(10px);    /* Material Thin */
```

### 5.2 Card Shadows (Optional)

```css
--shadow-card-light: 0 1px 3px rgba(11, 12, 17, 0.08);
--shadow-card-medium: 0 4px 12px rgba(11, 12, 17, 0.12);
--shadow-hover: 0 8px 24px rgba(11, 12, 17, 0.16);
```

---

## 6. Transitions & Animations

### 6.1 Duration

```css
--transition-fast: 200ms;
--transition-base: 300ms;
--transition-slow: 500ms;
--transition-smooth: 800ms; /* For color transitions between sections */
```

### 6.2 Easing Functions

```css
--ease-default: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
```

### 6.3 Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 100ms;
    --transition-smooth: 0ms;
  }
}
```

---

## 7. Breakpoints

```css
:root {
  --breakpoint-mobile-max: 767px;
  --breakpoint-tablet-min: 768px;
  --breakpoint-tablet-max: 1023px;
  --breakpoint-desktop-min: 1024px;
  --breakpoint-desktop-large: 1440px;
  --breakpoint-desktop-xlarge: 1920px;
}
```

### Usage in Media Queries

```css
/* Mobile First */
@media (min-width: 768px) {
  /* Tablet & Desktop styles */
}

@media (min-width: 1024px) {
  /* Desktop only */
}

/* Desktop First (if needed) */
@media (max-width: 767px) {
  /* Mobile styles */
}
```

---

## 8. Component-Specific Tokens

### 8.1 Buttons

```css
/* Large Button */
.button-large {
  padding: 8px 16px 8px 12px; /* top right bottom left */
  border-radius: var(--radius-button);
  font-family: var(--font-family-ui);
  font-size: var(--font-size-button-l);
  line-height: var(--line-height-button-l);
  letter-spacing: var(--letter-spacing-button-l);
  font-weight: var(--font-weight-button);
  text-transform: uppercase;
  gap: 4px; /* Text to icon */
}

/* Small Button */
.button-small {
  padding: 8px 16px 8px 12px;
  border-radius: var(--radius-button);
  font-family: var(--font-family-ui);
  font-size: var(--font-size-button-s);
  line-height: var(--line-height-button-s);
  letter-spacing: var(--letter-spacing-button-s);
  font-weight: var(--font-weight-button);
  text-transform: uppercase;
  gap: 4px;
}

@media (max-width: 767px) {
  .button-small {
    font-size: var(--font-size-button-s-mobile);
    line-height: var(--line-height-button-s-mobile);
  }
}
```

### 8.2 NavHeader

```css
/* Desktop */
.nav-header-desktop {
  padding: 24px;
  height: auto;
  gap: 64px; /* Between sections */
}

/* Mobile */
.nav-header-mobile {
  padding: 16px;
  height: 72px;
  gap: 20px;
}
```

### 8.3 Project Cards (Case Study)

```css
/* Desktop */
.case-study-card-desktop {
  padding: 16px;
  gap: 12px;
  border-radius: var(--radius-1); /* 24px */
  border: 0.5px solid var(--color-separator-non-opaque);
  background: var(--color-bg-system-white);
}

/* Mobile */
.case-study-card-mobile {
  padding: 12px;
  gap: 8px;
  border-radius: var(--radius-1-mobile); /* 16px */
  border: 0.5px solid var(--color-separator-non-opaque);
}
```

### 8.4 Image Carousels

```css
.carousel-image {
  border-radius: var(--radius-6); /* 4px on all sizes */
  object-fit: cover;
}

.carousel-container {
  gap: 16px; /* Desktop */
  gap: 12px; /* Mobile */
}
```

### 8.5 Skills Chips

```css
.skills-chip {
  padding: 2px 8px;
  border-radius: var(--radius-3); /* 8px desktop, 4px mobile */
  background: rgba(234, 234, 237, 0.18); /* Dark mode */
  font-family: var(--font-family-body);
  font-size: var(--font-size-b3); /* 14px desktop, 12px mobile */
  line-height: var(--line-height-b3);
  font-weight: var(--font-weight-b3-medium);
  color: #ffffff; /* Dark sections */
}
```

---

## 9. Z-Index Scale

```css
--z-index-base: 1;
--z-index-dropdown: 100;
--z-index-sticky: 200;
--z-index-fixed: 300;
--z-index-modal-backdrop: 400;
--z-index-modal: 500;
--z-index-popover: 600;
--z-index-tooltip: 700;
```

---

## 10. Implementation Example (CSS Variables)

### Complete CSS Custom Properties File

```css
/* design-tokens.css */

:root {
  /* ===== Colors ===== */
  --color-bg-system-white: #ffffff;
  --color-bg-shell: #fdfcfb;
  --color-label-primary: #0b0c11;
  --color-label-secondary: rgba(11, 12, 17, 0.6);
  --color-label-tertiary: rgba(11, 12, 17, 0.3);
  --color-neutral-dark-100: #2a2119;
  --color-material-regular: rgba(255, 255, 255, 0.4);
  
  /* ===== Typography ===== */
  --font-family-heading: 'Instrument Sans', system-ui, sans-serif;
  --font-family-body: 'Instrument Sans', system-ui, sans-serif;
  --font-family-ui: 'Geist Mono', monospace;
  
  /* Desktop Sizes */
  --font-size-h1: 48px;
  --line-height-h1: 56px;
  --letter-spacing-h1: -1.2px;
  
  --font-size-h4: 28px;
  --line-height-h4: 32px;
  --letter-spacing-h4: -0.8px;
  
  --font-size-b2: 16px;
  --line-height-b2: 24px;
  --letter-spacing-b2: -0.2px;
  
  /* ===== Spacing ===== */
  --space-4: 4px;
  --space-8: 8px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-48: 48px;
  --space-64: 64px;
  --space-120: 120px;
  
  /* ===== Radius ===== */
  --radius-1: 24px;
  --radius-6: 4px;
  --radius-button: 32px;
  
  /* ===== Transitions ===== */
  --transition-base: 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Mobile Overrides */
@media (max-width: 767px) {
  :root {
    /* Typography Mobile */
    --font-size-h1: 40px;
    --line-height-h1: 44px;
    
    --font-size-h4: 22px;
    --line-height-h4: 26px;
    
    --font-size-b2: 14px;
    --line-height-b2: 20px;
    --letter-spacing-b2: 0px;
    
    /* Spacing Mobile */
    --space-8: 6px;
    --space-12: 8px;
    --space-16: 12px;
    --space-24: 16px;
    --space-32: 24px;
    --space-48: 32px;
    --space-64: 48px;
    --space-120: 80px;
    
    /* Radius Mobile */
    --radius-1: 16px;
    --radius-2: 0px;
  }
}

/* Dark Mode (Work Sections) */
[data-theme="dark"] {
  --color-bg-system-white: #000000;
  --color-label-primary: #ffffff;
  --color-label-secondary: rgba(234, 234, 237, 0.6);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-base: 0ms;
  }
}
```

---

## 11. Typography Utility Classes

```css
/* Headings */
.heading-1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-h1);
  letter-spacing: var(--letter-spacing-h1);
  font-weight: 600;
}

.heading-4 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-h4);
  letter-spacing: var(--letter-spacing-h4);
  font-weight: 600;
}

/* Body */
.body-medium {
  font-family: var(--font-family-body);
  font-size: var(--font-size-b2);
  line-height: var(--line-height-b2);
  letter-spacing: var(--letter-spacing-b2);
  font-weight: 500;
}

/* Labels */
.label-large {
  font-family: var(--font-family-ui);
  font-size: var(--font-size-label-l);
  line-height: var(--line-height-label-l);
  letter-spacing: var(--letter-spacing-label-l);
  font-weight: 400;
  text-transform: uppercase;
}
```

---

## 12. Figma Variable Mapping Reference

| Figma Variable | CSS Variable | Desktop Value | Mobile Value |
|----------------|--------------|---------------|--------------|
| `Size/h1` | `--font-size-h1` | `48px` | `40px` |
| `Size/h2` | `--font-size-h2` | `40px` | `32px` |
| `Size/h3` | `--font-size-h3` | `36px` | `28px` |
| `Size/h4` | `--font-size-h4` | `28px` | `22px` |
| `Size/b1` | `--font-size-b1` | `18px` | `16px` |
| `Size/b2` | `--font-size-b2` | `16px` | `14px` |
| `Size/b3` | `--font-size-b3` | `14px` | `12px` |
| `Spacing/120` | `--space-120` | `120px` | `80px` |
| `Spacing/80` | `--space-80` | `80px` | `64px` |
| `Spacing/64` | `--space-64` | `64px` | `48px` |
| `Spacing/48` | `--space-48` | `48px` | `32px` |
| `Spacing/32` | `--space-32` | `32px` | `24px` |
| `Spacing/24` | `--space-24` | `24px` | `16px` |
| `Radius 1` | `--radius-1` | `24px` | `16px` |
| `Radius 2` | `--radius-2` | `16px` | `0px` |
| `Radius 3` | `--radius-3` | `8px` | `4px` |

---

## 13. Usage Guidelines

### 13.1 Do's

✅ Always use CSS custom properties for responsive values  
✅ Use Figma variable names as comments for traceability  
✅ Test across breakpoints (375px, 768px, 1024px, 1920px)  
✅ Apply `prefers-reduced-motion` for animations  
✅ Use semantic color names (label-primary vs #0b0c11)

### 13.2 Don'ts

❌ Don't hardcode values (use variables)  
❌ Don't mix Tailwind utilities with design tokens  
❌ Don't create custom spacing not in the scale  
❌ Don't override font families without reason  
❌ Don't ignore mobile breakpoint variations

---

**End of Design Tokens Document**
