# Frontend Visual Specification

**Project:** Portfolio Website  
**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`  
**Design Tokens:** `/tasks/001-portfolio-website/design-system/design-tokens.md`

---

## 1. Overview

This specification defines the frontend visual implementation for a personal design portfolio website. The experience is scroll-based with immersive storytelling, auto-scrolling carousels, smooth transitions, and fullscreen case study takeovers.

### Key Design Principles
1. **Motion-First:** Smooth animations and transitions enhance storytelling
2. **Responsive by Default:** Typography, spacing, and layouts adapt across breakpoints
3. **Accessibility Core:** Keyboard navigation, reduced motion, screen reader support
4. **Design Token Adherence:** All values from Figma variables (no hardcoded values)

---

## 2. Design System Foundation

### 2.1 Design Tokens

#### 2.1.1 Token Source
All design tokens extracted from:
- `/figma-variables/Colors.json` (Light/Dark modes)
- `/figma-variables/Typography.json` (Desktop/Mobile scales)
- `/figma-variables/Spacing.json` (Responsive spacing)
- `/figma-variables/Radius.json` (Border radius)

**Implementation File:** `/src/styles/design-tokens.css`

#### 2.1.2 Responsive Strategy
- **Desktop:** `>768px` (default)
- **Mobile:** `<767px` (overrides via media query)
- **Method:** CSS custom properties with `@media (max-width: 767px)` overrides

#### 2.1.3 Color Contrast (R-036)
All text/background combinations meet WCAG AA:
- Primary text on white: `#0b0c11` on `#ffffff` = 19.5:1 ✅
- Secondary text on white: `rgba(11,12,17,0.6)` on `#ffffff` = 7.5:1 ✅
- White text on dark: `#ffffff` on `#090e03` = 20.3:1 ✅
- Secondary on dark: `rgba(234,234,237,0.6)` on `#090e03` = 11.2:1 ✅

**Traceability:** R-036

---

### 2.2 Typography Implementation

#### 2.2.1 Font Loading (R-033)
```tsx
// app/layout.tsx
import { Instrument_Sans, Geist_Mono } from 'next/font/google';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-family-body',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-family-ui',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Traceability:** R-033

#### 2.2.2 Typography Classes
Utility classes for consistent typography application:

```css
/* /src/styles/typography.css */
.heading-1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h1);
  line-height: var(--line-height-h1);
  letter-spacing: var(--letter-spacing-h1);
  font-weight: 600;
  font-variation-settings: 'wdth' 100;
}

.heading-4 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-h4);
  letter-spacing: var(--letter-spacing-h4);
  font-weight: 600;
  font-variation-settings: 'wdth' 100;
}

.body-medium {
  font-family: var(--font-family-body);
  font-size: var(--font-size-b2);
  line-height: var(--line-height-b2);
  letter-spacing: var(--letter-spacing-b2);
  font-weight: 500;
  font-variation-settings: 'wdth' 100;
}

.label-large {
  font-family: var(--font-family-ui);
  font-size: var(--font-size-label-l);
  line-height: var(--line-height-label-l);
  letter-spacing: var(--letter-spacing-label-l);
  font-weight: 400;
  text-transform: uppercase;
}

.button-text-large {
  font-family: var(--font-family-ui);
  font-size: var(--font-size-button-l);
  line-height: var(--line-height-button-l);
  letter-spacing: var(--letter-spacing-button-l);
  font-weight: 400;
  text-transform: uppercase;
}
```

**Traceability:** PRD Appendix B, Design Tokens § 2

---

### 2.3 Spacing & Layout

#### 2.3.1 Container System
```css
.container-desktop {
  padding: var(--space-120); /* 120px desktop, 80px mobile */
  max-width: 1920px;
  margin: 0 auto;
}

.container-mobile {
  padding: var(--space-16); /* 16px desktop, 12px mobile */
}
```

#### 2.3.2 Grid System
```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-32); /* 32px desktop, 24px mobile */
}

@media (max-width: 767px) {
  .grid-12 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-16);
  }
}
```

**Traceability:** Design Tokens § 3, Figma Grid System

---

## 3. Component Specifications

### 3.1 LandingPage Component (R-001)

**Purpose:** Root landing page with hero, carousel, and featured project  
**Route:** `/`  
**Wireframe:** N/A (composed of sub-components)

**Props/Inputs:**
```tsx
interface LandingPageProps {
  featuredProject: Project | null;
  heroCarouselImages: MediaFile[];
  siteConfig: SiteConfig;
}
```

**States:**
- `loading`: Show skeleton placeholders
- `default`: Fully loaded with data
- `empty`: No featured project (hide featured card)

**Layout Structure:**
1. Navigation Header (sticky)
2. Hero Section with intro text
3. Auto-scrolling carousel
4. Featured project card
5. Scroll indicator (optional)

**Accessibility:**
- h1: Site title/name
- Skip to content link (before nav)
- Landmark regions: header, main, nav

**Traceability:** R-001, R-002, R-003, R-004

---

### 3.2 NavHeader Component (R-002)

**Purpose:** Persistent navigation header with section links and menu  
**Wireframes:** `wireframes/NavHeader.lg.default.wire`, `wireframes/NavHeader.sm.default.wire`

**Props/Inputs:**
```tsx
interface NavHeaderProps {
  siteConfig: {
    name: string;
    location: string;
    socialLinks: { platform: string; url: string }[];
    cvFile: { url: string };
  };
  activeSection?: 'work' | 'about' | null;
}
```

**States:**
- `default`: Initial transparent/semi-transparent
- `scrolled`: Backdrop blur + background when scrollY > 50px
- `menu-open`: Mobile menu drawer visible (mobile only)

**Interactions:**
- Click section link → Smooth scroll to section + update `activeSection` highlight
- Click social link → Open in new tab
- Click CV → Download file
- Click Menu (mobile) → Open menu drawer

**Styling:**
```css
.nav-header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  padding: var(--space-24);
  transition: background-color var(--transition-base), backdrop-filter var(--transition-base);
}

.nav-header.scrolled {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(25px);
}

@media (max-width: 767px) {
  .nav-header {
    padding: var(--space-16);
    height: 72px;
  }
}
```

**Accessibility:**
- Role: `navigation`
- ARIA label: "Main navigation"
- Skip to content: First focusable element
- Focus visible: All links have 2px outline

**Responsive Behavior:**
- Desktop: All links visible horizontally
- Mobile: Compress to name + work/about + menu button
- Mobile menu: Slide-in drawer from right with backdrop

**Traceability:** R-002

---

### 3.3 AutoScrollCarousel Component (R-003, R-009)

**Purpose:** Horizontal auto-scrolling image carousel  
**Wireframe:** `wireframes/Carousel.lg.default.wire`

**Props/Inputs:**
```tsx
interface AutoScrollCarouselProps {
  images: MediaFile[];
  autoScrollInterval?: number; // Default: 4000ms
  pauseOnHover?: boolean;      // Default: true
  infiniteLoop?: boolean;      // Default: true
  variant?: 'hero' | 'work';   // Layout variant
}
```

**States:**
- `default`: Auto-scrolling
- `paused`: Mouse hover or user interaction
- `manual`: `prefers-reduced-motion` enabled (no auto-scroll)

**Interactions:**
- Auto-scroll: translateX animation every 4s
- Hover: Pause auto-scroll, resume 1s after mouse leave
- Touch: Swipe left/right to navigate
- Keyboard: Arrow keys navigate (if carousel is focused)

**Animation Logic:**
```typescript
// Pseudo-code
const startAutoScroll = () => {
  intervalId = setInterval(() => {
    scrollToNextItem();
  }, autoScrollInterval);
};

const pauseAutoScroll = () => {
  clearInterval(intervalId);
  resumeTimeout = setTimeout(() => {
    startAutoScroll();
  }, 1000);
};

const scrollToNextItem = () => {
  currentIndex = (currentIndex + 1) % images.length;
  containerRef.current.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
};
```

**Styling:**
```css
.carousel-container {
  display: flex;
  gap: var(--space-24); /* 24px desktop, 16px mobile */
  overflow: hidden;
  will-change: transform;
}

.carousel-track {
  display: flex;
  gap: inherit;
  transition: transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.carousel-image {
  border-radius: var(--radius-6); /* 4px all sizes */
  object-fit: cover;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none;
  }
}
```

**Accessibility:**
- Role: `region`, aria-label: "Image carousel"
- ARIA live region: `aria-live="polite"`, announces "Slide X of Y"
- Pause button: If auto-scrolling, provide pause/play control
- Keyboard: Not individually focusable (decorative images)

**Performance:**
- Use CSS transforms (GPU-accelerated)
- Lazy load images outside viewport (loading="lazy")
- Intersection Observer to start auto-scroll when visible

**Traceability:** R-003, R-009, R-024

---

### 3.4 CaseStudyCard Component (R-004)

**Purpose:** Featured project card on landing page  
**Wireframe:** `wireframes/CaseStudyCard.lg.default.wire`

**Props/Inputs:**
```tsx
interface CaseStudyCardProps {
  project: {
    slug: string;
    title: string;
    description: string;
    heroImage: MediaFile;
  };
  variant?: 'default' | 'compact'; // Desktop vs Mobile
}
```

**States:**
- `default`: Idle state
- `hover`: Scale animation + shadow (desktop only)
- `loading`: Skeleton placeholder

**Interactions:**
- Hover: Scale(1.02) + shadow transition (300ms)
- Click: No action in v1 (purely decorative)

**Notes:** Case study deep dive deferred to future iteration.

**Styling:**
```css
.case-study-card {
  display: flex;
  gap: var(--space-12);
  padding: var(--space-16);
  border: 0.5px solid var(--color-separator-non-opaque);
  border-radius: var(--radius-1); /* 24px desktop, 16px mobile */
  background: var(--color-bg-system-white);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.case-study-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(11, 12, 17, 0.16);
}

.case-study-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.case-study-card-image {
  width: 150px;
  border-radius: 13px;
  object-fit: cover;
  align-self: stretch;
}

@media (max-width: 767px) {
  .case-study-card {
    padding: var(--space-12);
    gap: var(--space-8);
  }
}
```

**Button Styling (View Case Study):**
```css
.case-study-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px 16px;
  border-radius: var(--radius-button);
  background: var(--color-material-regular);
  backdrop-filter: blur(25px);
  border: 1px solid var(--color-label-tertiary);
  font-family: var(--font-family-ui);
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
```

**Accessibility:**
- Role: `article` (not interactive)
- No ARIA label needed (purely visual)
- Not focusable (no tab stop)

**Traceability:** R-004

---

### 3.5 WorkSection Component (R-005, R-006)

**Purpose:** Full-height project showcase section with color transitions  
**Wireframe:** `wireframes/WorkSectionHeader.lg.default.wire`

**Props/Inputs:**
```tsx
interface WorkSectionProps {
  project: Project;
  isActive: boolean; // Currently visible in viewport
  previousColor: string; // For color transition
}
```

**States:**
- `entering`: Scroll reveal animation (fade + translateY)
- `active`: Fully visible, color transition complete
- `exiting`: Scrolling out of view

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│ [Background color from project.backgroundColor]│
│ [Padding: 56px top/bottom, 24px left/right]   │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Header (12-column grid)                     ││
│ │ - Cols 1-5: Icon, title, description, CTA  ││
│ │ - Cols 6-9: Team, category, role, timeline ││
│ │ - Cols 10-12: Outcomes (bulleted list)     ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Image Carousel (auto-scrolling)             ││
│ │ [Height: 629px desktop, 386px mobile]       ││
│ └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

**Color Transition Logic (R-006):**
```typescript
// When section becomes active
useEffect(() => {
  if (isActive) {
    document.body.style.setProperty(
      '--current-bg-color',
      project.backgroundColor
    );
  }
}, [isActive, project.backgroundColor]);
```

```css
body {
  background-color: var(--current-bg-color);
  transition: background-color 800ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  body {
    transition: none;
  }
}
```

**Intersection Observer:**
```typescript
const observerOptions = {
  root: null,
  threshold: 0.5, // 50% visible triggers active state
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveSection(entry.target.dataset.projectId);
    }
  });
}, observerOptions);
```

**Traceability:** R-005, R-006

---

### 3.6 WorkSectionHeader Component (R-007, R-008)

**Purpose:** Project metadata header within work section  
**Wireframe:** `wireframes/WorkSectionHeader.lg.default.wire`

**Props/Inputs:**
```tsx
interface WorkSectionHeaderProps {
  project: {
    icon: MediaFile;
    title: string;
    subtitle: string;
    description: string;
    team: string;
    categories: string[];
    role: string;
    timeline: string;
    outcomes: string[];
  };
}
```

**Grid Layout:**
```css
.work-header-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-32);
  padding: var(--space-24);
}

.work-header-intro {
  grid-column: 1 / 6; /* Columns 1-5 */
}

.work-header-metadata {
  grid-column: 6 / 10; /* Columns 6-9 */
}

.work-header-outcomes {
  grid-column: 10 / 13; /* Columns 10-12 */
}

@media (max-width: 767px) {
  .work-header-intro,
  .work-header-metadata,
  .work-header-outcomes {
    grid-column: 1 / -1; /* Full width stack */
  }
}
```

**App Icon Styling:**
```css
.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 12.8px;
  object-fit: cover;
}

@media (max-width: 767px) {
  .app-icon {
    width: 48px;
    height: 48px;
    border-radius: 9.6px;
  }
}
```

**Category Chips:**
```css
.category-chip {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: var(--radius-3); /* 8px desktop, 4px mobile */
  background: rgba(234, 234, 237, 0.18);
  font-family: var(--font-family-body);
  font-size: var(--font-size-b2); /* 16px desktop, 14px mobile */
  line-height: var(--line-height-b2);
  font-weight: 500;
  color: #ffffff;
}
```

**Outcomes List:**
```css
.outcomes-list {
  list-style: none;
  padding: 0;
}

.outcomes-list li {
  position: relative;
  padding-left: 42px; /* Desktop */
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h4); /* 28px desktop, 22px mobile */
  line-height: var(--line-height-h4);
  font-weight: 600;
  color: #ffffff;
}

.outcomes-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  font-size: 28px;
}

@media (max-width: 767px) {
  .outcomes-list li {
    padding-left: 33px;
  }
  
  .outcomes-list li::before {
    font-size: 22px;
  }
}
```

**Traceability:** R-007, R-008

---

### 3.7 Button Component

**Purpose:** Primary and secondary CTAs  
**Variants:** `large`, `small`, `primary`, `secondary`

**Props/Inputs:**
```tsx
interface ButtonProps {
  children: React.ReactNode;
  size?: 'large' | 'small';
  variant?: 'primary' | 'secondary';
  icon?: 'arrow-right' | 'menu' | null;
  onClick?: () => void;
  disabled?: boolean;
}
```

**Styling:**
```css
/* Primary Large (White bg, black text) */
.button-primary-large {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px 16px;
  border-radius: var(--radius-button);
  background: var(--color-bg-system-white);
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.button-primary-large:hover {
  transform: scale(1.05);
}

.button-primary-large:active {
  transform: scale(0.98);
}

/* Secondary Large (Black bg, white text) */
.button-secondary-large {
  background: var(--color-label-primary);
  color: #ffffff;
}

/* Small Variant */
.button-small {
  padding: 8px 12px 8px 16px;
  font-size: var(--font-size-button-s); /* 12px desktop, 10px mobile */
  line-height: var(--line-height-button-s);
  letter-spacing: var(--letter-spacing-button-s);
}
```

**Icon Rendering:**
```tsx
// Icon: 16x16 SVG, right side
<svg width="16" height="16" viewBox="0 0 16 16">
  <path d="..." stroke="currentColor" />
</svg>
```

**Accessibility:**
- Type: `button` or `a` (depending on action)
- ARIA label: If icon-only, add aria-label
- Focus: Visible outline
- Disabled: aria-disabled="true", visual opacity: 0.5

**Traceability:** Figma Button `3:19681`, R-002, R-004

---

### 3.8 AboutSection Component (R-014)

**Purpose:** About section with bio and image carousel  
**Wireframe:** `wireframes/AboutSection.lg.default.wire`

**Props/Inputs:**
```tsx
interface AboutSectionProps {
  bio: string; // Rich HTML
  imageCarousel: MediaFile[];
  siteConfig: {
    socialLinks: SocialLink[];
    cvFile: MediaFile;
  };
}
```

**Layout:**
```css
.about-section {
  min-height: 100vh;
  background: var(--color-bg-shell);
  padding: var(--space-24);
}

.about-top {
  display: flex;
  justify-content: space-between;
  gap: var(--space-64);
  padding: var(--space-12);
}

.about-bio-primary {
  width: 595px;
  font-size: var(--font-size-h4);
  font-weight: 600;
}

.about-bio-secondary {
  width: 583px;
  font-size: var(--font-size-b1);
  color: var(--color-label-secondary);
}

.about-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--space-12);
}
```

**Traceability:** R-014

---

## 4. Responsive Layouts

### 4.1 Mobile Layouts (R-015)

**Breakpoint:** `<767px`

**Key Changes:**
1. **Navigation:** Hamburger menu with drawer
2. **Hero Text:** Stack vertically, full width
3. **Carousel:** Single item view with horizontal scroll
4. **Work Sections:** Single column stack (no grid)
5. **Metadata:** Role/Timeline side-by-side (2 columns)
6. **Case Study Card:** Compact variant (smaller padding/gaps)

**Grid Override:**
```css
@media (max-width: 767px) {
  .grid-12 {
    grid-template-columns: 1fr;
    gap: var(--space-16);
  }
  
  .work-header-intro,
  .work-header-metadata,
  .work-header-outcomes {
    grid-column: 1 / -1;
  }
}
```

**Touch Targets:**
- Minimum: 44x44px (iOS guideline)
- Buttons: Already 32px height + padding meets requirement
- Links: Increase padding if needed

**Traceability:** R-015

---

### 4.2 Tablet Layouts (R-016)

**Breakpoint:** `768px - 1023px`

**Grid Adaptation:**
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .grid-12 {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  
  .work-header-intro {
    grid-column: 1 / 5; /* 4 columns */
  }
  
  .work-header-metadata {
    grid-column: 5 / 8; /* 3 columns */
  }
  
  .work-header-outcomes {
    grid-column: 8 / 9; /* 1 column (stack vertically) */
  }
}
```

**Font Scaling:**
- Use desktop sizes but test readability
- Consider intermediate sizes if needed

**Traceability:** R-016

---

## 5. Interactions & Animations

### 5.1 Reduced Motion (R-024)

**Detection:**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Or use hook
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
```

**Behavior Changes:**
- Auto-scroll carousels: Disabled, show manual controls
- Page transitions: <100ms or instant
- Background color transitions: Instant (no animation)
- Scroll reveals: Instant (no fade/slide)
- Hover effects: Reduced or instant

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Specific overrides */
  .carousel-track {
    transition: none;
  }
  
  body {
    transition: none;
  }
}
```

**Traceability:** R-024

---

### 5.2 Smooth Scroll Navigation (R-025)

**Implementation:**
```tsx
// Smooth scroll utility
const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  
  // Update URL hash without triggering scroll
  window.history.pushState(null, '', `#${sectionId}`);
};

// On page load with hash
useEffect(() => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    setTimeout(() => {
      scrollToSection(hash);
    }, 100); // Delay for initial render
  }
}, []);
```

**Scroll Duration:** 800-1200ms (CSS `scroll-behavior: smooth` default)

**Accessibility:**
- Focus management: After scroll, move focus to section heading
- ARIA live region: Announce "Navigated to [Section Name]"

**Traceability:** R-025

---

### 5.3 Hover Interactions (R-026)

**Button Hover:**
```css
.button:hover {
  transform: scale(1.05);
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

**Link Hover:**
```css
.nav-link {
  color: var(--color-label-secondary);
  transition: color 200ms ease;
}

.nav-link:hover {
  color: var(--color-label-primary);
}
```

**Card Hover:**
```css
.case-study-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(11, 12, 17, 0.16);
  transition: transform 300ms ease, box-shadow 300ms ease;
}
```

**Touch Device Detection:**
```css
@media (hover: none) and (pointer: coarse) {
  /* Disable hover effects on touch devices */
  .button:hover,
  .case-study-card:hover {
    transform: none;
  }
  
  /* Use :active instead */
  .button:active {
    transform: scale(0.98);
  }
}
```

**Traceability:** R-026

---

## 6. Accessibility Specifications

### 6.1 Keyboard Navigation (R-034)

**Focus Order:**
1. Skip to content link
2. Navigation header links (left to right)
3. Featured project card
4. Work section buttons (top to bottom)
5. About section links
6. Footer links

**Keyboard Shortcuts:**
- `Tab`: Next focusable element
- `Shift + Tab`: Previous focusable element
- `Enter` / `Space`: Activate buttons and links
- `Escape`: Close modals/takeovers
- `Arrow Keys`: Navigate carousels (if focused)

**Focus Styles:**
```css
*:focus-visible {
  outline: 2px solid var(--color-label-primary);
  outline-offset: 2px;
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

**Skip to Content:**
```tsx
<a href="#main-content" className="skip-link">
  Skip to content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--color-label-primary);
  color: white;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

**Traceability:** R-034

---

### 6.2 Screen Reader Support (R-035)

**Semantic HTML:**
```html
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>
  
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Nav content -->
    </nav>
  </header>
  
  <main id="main-content" role="main">
    <section aria-label="Hero">
      <!-- Landing content -->
    </section>
    
    <section aria-label="Work" id="work">
      <!-- Work sections -->
    </section>
    
    <section aria-label="About" id="about">
      <!-- About content -->
    </section>
  </main>
  
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
```

**ARIA Labels:**
- Icon-only buttons: `aria-label="Open menu"`
- Carousel: `aria-label="Project images carousel"`, `aria-live="polite"`
- Modal: `aria-modal="true"`, `aria-labelledby="dialog-title"`
- Form inputs: Associated `<label>` elements

**Alt Text Guidelines:**
- Decorative images: `alt=""`
- Meaningful images: Descriptive alt text (e.g., "Mobile app screen showing card deck")
- Avoid "Image of..." prefix

**Live Regions:**
```html
<!-- Carousel announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Slide {currentIndex + 1} of {totalSlides}
</div>
```

**Traceability:** R-035

---

## 7. Error & Edge States

### 7.1 Empty States

**No Featured Project:**
```
┌─────────────────────────────────────┐
│ No featured project yet.            │
│ Add one from the CMS.               │
│ [Centered, 16px/Medium/60% opacity] │
└─────────────────────────────────────┘
```

**No Work Projects:**
```
┌─────────────────────────────────────┐
│ Projects coming soon.               │
│ Check back later!                   │
└─────────────────────────────────────┘
```

### 7.2 Loading States

**Component Loading:**
```tsx
// Skeleton placeholder
<div className="skeleton" aria-busy="true" aria-label="Loading content">
  <div className="skeleton-header" />
  <div className="skeleton-text" />
  <div className="skeleton-image" />
</div>
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.05) 25%,
    rgba(0,0,0,0.1) 50%,
    rgba(0,0,0,0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 7.3 Error States

**Image Load Failure:**
```tsx
<img 
  src={image.url} 
  alt={image.alt}
  onError={(e) => {
    e.currentTarget.src = '/fallback-image.png';
  }}
/>
```

**Fallback Image:**
- Gray rectangle with broken image icon
- Alt text: "Image unavailable"

---

## 8. Styling Conventions

### 8.1 Styling Approach
**Method:** CSS Modules + CSS Custom Properties

**File Structure:**
```
/src/styles/
  ├── design-tokens.css       # CSS custom properties
  ├── typography.css          # Typography utilities
  ├── global.css              # Global resets and base styles
  └── animations.css          # Framer Motion custom animations

/src/components/
  ├── NavHeader/
  │   ├── NavHeader.tsx
  │   └── NavHeader.module.css
  ├── Button/
  │   ├── Button.tsx
  │   └── Button.module.css
  └── ...
```

**Why CSS Modules:**
- Scoped styles prevent conflicts
- Co-located with components
- Full control over design token usage
- No Tailwind dependency (per Figma instructions)

**Traceability:** PRD § 9.1 Constraints

---

### 8.2 Class Naming Convention

**BEM-Inspired:**
```css
/* Block */
.nav-header { }

/* Element */
.nav-header__links { }
.nav-header__link { }

/* Modifier */
.nav-header--scrolled { }
.nav-header__link--active { }

/* State */
.nav-header.is-open { }
.button.is-loading { }
```

**Data Attributes (for JS hooks):**
```html
<section data-section="work" data-project-id="striker">
  <!-- Content -->
</section>
```

---

### 8.3 Theming (Light/Dark)

**Light Mode (Default):**
- Background: `#fdfcfb` or `#ffffff`
- Text: `#0b0c11`

**Dark Mode (Work Sections):**
- Background: Project-specific (e.g., `#090e03`)
- Text: `#ffffff`
- Applied via: `data-theme="dark"` attribute

**Implementation:**
```tsx
<section data-theme="dark" style={{ backgroundColor: project.backgroundColor }}>
  <!-- Work section content -->
</section>
```

```css
[data-theme="dark"] {
  --color-label-primary: #ffffff;
  --color-label-secondary: rgba(234, 234, 237, 0.6);
  --color-separator-non-opaque: rgba(234, 234, 237, 0.18);
}

[data-theme="dark"] .button-primary-large {
  background: #ffffff;
  color: #000000;
}
```

**Traceability:** Figma Dark Mode Variables, R-005, R-006

---

## 9. Assets & Media

### 9.1 Images

**Formats:**
- Source: JPEG, PNG (from CMS uploads)
- Optimized: WebP, AVIF (Next.js automatic conversion)

**Responsive Sizes:**
- Hero carousel: 1920w, 1280w, 768w, 480w
- Project images: 1200w, 800w, 600w, 400w
- Thumbnails: 400w, 200w

**Implementation:**
```tsx
import Image from 'next/image';

<Image
  src={image.url}
  alt={image.altText}
  width={image.width}
  height={image.height}
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  loading="lazy"
  placeholder="blur"
  blurDataURL={image.blurHash}
/>
```

**Traceability:** R-031

---

### 9.2 Icons

**Source:** SVG icons (inline or sprite)

**Arrow Right Icon:**
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Menu Icon:**
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M2 4H14M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

**Implementation:**
```tsx
// /src/components/Icon.tsx
interface IconProps {
  name: 'arrow-right' | 'menu' | 'close';
  size?: number;
  color?: string;
}

export function Icon({ name, size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {iconPaths[name]}
    </svg>
  );
}
```

---

## 10. Animation Specifications

### 10.1 Scroll Reveal Animations

**Work Section Entrance:**
```tsx
// Framer Motion
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }
  },
};

<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
```

**Stagger Children:**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

---

### 10.2 Page Transitions

**Case Study Enter:**
```tsx
const takeoverVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 40
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 40,
    transition: { duration: 0.3 }
  },
};
```

---

## 11. Performance Budgets

### 11.1 Component Metrics

| Component | Max Bundle Size | Load Time | LCP |
|-----------|----------------|-----------|-----|
| NavHeader | 5KB | <100ms | N/A |
| Carousel | 20KB | <200ms | <1.5s |
| WorkSection | 30KB | <300ms | <2.0s |
| CaseStudyTakeover | 50KB | <500ms | <2.0s |

### 11.2 Image Optimization

- Max image file size (after compression): 2MB
- Lazy load threshold: 100px before entering viewport
- Blur placeholder: 20x20px JPEG (base64 encoded)

**Traceability:** R-031, R-032

---

## 12. Component Dependency Graph

```
┌─────────────────┐
│   App (Layout)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌─▼──────────┐
│NavHeader│ │ LandingPage│
└────────┘ └─┬──────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐ ┌─▼──────┐ ┌▼──────────┐
│Carousel│ │WorkSec │ │AboutSec   │
└───────┘ └─┬──────┘ └───────────┘
            │
       ┌────▼─────┐
       │CaseStudy │
       │Takeover  │
       └──────────┘
```

---

## 13. Acceptance Criteria (Spec Level)

### Visual Consistency
- [ ] All components use design tokens (no hardcoded values)
- [ ] Typography scales correctly desktop → mobile
- [ ] Spacing adapts per breakpoint
- [ ] Colors match Figma exactly (verified with eyedropper)

### Responsiveness
- [ ] Layouts tested at: 375px, 768px, 1024px, 1440px, 1920px
- [ ] No horizontal scroll on any breakpoint
- [ ] Touch targets ≥44x44px on mobile
- [ ] Text remains readable (no overflow or cut-off)

### Animations
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Auto-scroll carousels pause on hover
- [ ] Page transitions smooth (no jank, 60fps)
- [ ] Background color transitions smooth (500-800ms)

### Accessibility
- [ ] Keyboard navigation works for all flows
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces page changes
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All images have alt text

---

## 14. Open Design Questions

**None.** All design decisions resolved in Context Pack and PRD.

---

## 15. References

- **PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`
- **Design Tokens:** `/tasks/001-portfolio-website/design-system/design-tokens.md`
- **Figma:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website`
- **Wireframes:** `/tasks/001-portfolio-website/specs/wireframes/*.wire`

---

**End of Frontend Visual Spec**
