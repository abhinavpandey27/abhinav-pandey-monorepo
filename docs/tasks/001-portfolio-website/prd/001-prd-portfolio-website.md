# PRD-001: Personal Design Portfolio Website

**Version:** 1.0  
**Date:** 2025-10-15  
**Status:** Full PRD  
**Author:** AI Development Assistant  
**Context Pack:** `/context-pack.md`

---

## 1. Overview

### Problem Statement
Designer needs a portfolio website that feels handcrafted and interactive (like a case study book) while remaining easy to update via CMS, without requiring code changes for new projects or content.

### Goal Summary
Build a performant, CMS-driven personal design portfolio that showcases projects through immersive scroll-based storytelling with smooth animations, powered by Next.js + Payload CMS + Cloudflare stack.

### Context Snapshot
- **Target Users**: Portfolio owner (designer) for content management; potential clients/employers for viewing
- **Primary Experience**: Scroll-based storytelling with full-height project sections, auto-scrolling carousels, and smooth transitions
- **Technical Approach**: Next.js 14 App Router + Payload CMS + Cloudflare Workers/R2/D1
- **Design System**: Figma-derived design tokens (no hardcoded Tailwind values)

**Sources:**
- Project Brief (user prompt)
- Figma Designs: Home Desktop (`36:8459`), Home Mobile (`36:8787`), Colors (`3:19700`), Typography (`3:18936`), Button (`3:19681`), Components (`42:8879`)
- Context Pack: `/context-pack.md`

---

## 2. Objectives & Success Metrics

### Primary Objectives
1. **Visual Quality**: Create visually refined, motion-rich portfolio experience that feels like an interactive case study book
2. **Content Autonomy**: Enable non-technical content management through Payload CMS
3. **Performance**: Achieve <2s load time on 4G connections with Lighthouse score >90
4. **Responsiveness**: Support desktop + mobile responsive design with touch-friendly interactions
5. **Zero-Cost Hosting**: Deploy on Cloudflare free tier (Workers + R2 + D1)
6. **Accessibility**: Maintain WCAG 2.1 AA compliance with keyboard navigation and reduced motion support

### Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Lighthouse Performance Score | >90 | Chrome DevTools Lighthouse |
| First Contentful Paint (FCP) | <1.2s | Web Vitals |
| Largest Contentful Paint (LCP) | <2.0s | Web Vitals |
| Time to Interactive (TTI) | <2.0s | Web Vitals |
| CMS Content Addition Time | <5 minutes | User testing (adding new project) |
| WCAG Compliance | AA Level | axe DevTools audit |
| Mobile Touch Response | <100ms | Interaction testing |
| Hosting Cost | $0/month | Cloudflare billing dashboard |

---

## 3. Users & Scenarios

### Primary User: Portfolio Owner (Designer)
**Access Level:** Admin (CMS authenticated via OAuth)

**Core Scenarios:**
1. Add a new project with images, metadata, and description
2. Update About section bio and image carousel
3. Upload and manage CV/resume file
4. Update social links and contact information

### Secondary User: Portfolio Viewer (Client/Employer)
**Access Level:** Public (no authentication)

**Core Scenarios:**
1. Browse portfolio projects via smooth scrolling
2. View auto-scrolling image carousels
3. Access About section and contact information
4. Download CV/resume
5. Navigate via keyboard (accessibility)

---

## 4. Scope

### In-Scope Capabilities (v1)

**Frontend Experience:**
- Landing page with hero section and auto-scrolling horizontal carousel
- Featured project card on landing page
- Full-height work sections with sequential scroll reveal
- Background color transitions between work sections
- Auto-scrolling image carousels (pause on hover, infinite loop)
- Smooth scroll navigation to sections
- About section with bio and auto-scrolling image carousel
- Navigation header with section links and CV download
- Responsive mobile and desktop layouts

**CMS & Content Management:**
- Payload CMS integration with OAuth (Google/GitHub) authentication
- Project collection with metadata (title, role, team, timeline, categories, outcomes)
- About section management
- Site configuration (name, location, email, social links, CV file)
- Media management with Cloudflare R2 storage

**Technical Infrastructure:**
- Next.js 14 App Router architecture
- Design system with CSS variables (from Figma tokens)
- Framer Motion animations
- Google Fonts integration (Instrument Sans, Geist Mono)
- Cloudflare Workers deployment
- Cloudflare R2 for media assets
- Cloudflare D1 for database
- GitHub integration with CI/CD

**SEO & Performance:**
- Full SEO optimization (meta tags, OpenGraph, structured data)
- Dynamic sitemap generation
- Image optimization with Next.js Image component
- Lazy loading for media and carousels
- `prefers-reduced-motion` support

**Testing:**
- E2E tests for key user flows (Playwright)
- Visual regression tests for components
- Accessibility tests (axe)

### Non-Goals (Explicitly Out of Scope)
- **Case study deep dive pages** (deferred to future iteration)
- Multi-language/i18n support
- Blog or articles section
- Contact form (email link sufficient)
- Analytics dashboard in CMS
- User comments or interactions
- Dark mode theme
- Password-protected projects
- Video hosting (external links acceptable)
- Search functionality
- Social media auto-posting
- Real-time collaboration
- Version history/content rollback

---

## 5. Primary User Flows

### Flow 1: Landing Page Experience (Viewer)
1. **Trigger:** User navigates to portfolio URL
2. **System loads:** Landing page with navigation header
3. **User sees:** 
   - Hero section with name, tagline, and location
   - Auto-scrolling horizontal carousel (auto-advances every 3-5 seconds)
   - Featured project card with thumbnail
4. **User hovers:** Carousel pauses auto-scroll
5. **User clicks carousel item:** System navigates to corresponding work section (smooth scroll)

**Exit Conditions:**
- Success: User engaged with portfolio content and scrolls to work sections
- Alternative: User navigates away

### Flow 2: Work Section Browsing (Viewer)
1. **Trigger:** User scrolls down from landing section
2. **System reveals:** First full-height work section with entrance animation
3. **User sees:**
   - Background color transition to project-specific color
   - Project header (icon, title, subtitle, description)
   - Project metadata (role, team, timeline, categories, outcomes)
   - Auto-scrolling horizontal image carousel
4. **User continues scrolling:** Next work section appears with color transition
5. **Pattern repeats:** For all projects in sequence

**Exit Conditions:**
- Success: User reaches About section and views all projects

### Flow 3: About Section (Viewer)
1. **Trigger:** User scrolls to bottom of work sections OR clicks "About" in navigation
2. **System reveals:** About section with entrance animation
3. **User sees:**
   - Bio text (multiple paragraphs)
   - Auto-scrolling horizontal image carousel
   - Social links (Twitter, LinkedIn, Email)
   - CV download button
   - Colophon and acknowledgments
4. **User clicks social link:** Opens in new tab
5. **User clicks CV download:** Browser downloads PDF file

**Exit Conditions:**
- Success: User downloads CV or contacts via email
- Alternative: User explores social profiles

### Flow 4: CMS Content Management (Admin)
1. **Trigger:** Admin navigates to `/admin` route
2. **System shows:** OAuth login screen (Google/GitHub)
3. **Admin authenticates:** Via OAuth provider
4. **System grants access:** Admin dashboard with collections
5. **Admin navigates to:** Projects collection
6. **Admin clicks:** "Create New" project
7. **Admin fills in:**
   - Title, subtitle, description
   - Role, team, timeline
   - Categories (chips/tags)
   - Outcomes (list items)
   - Hero image upload
   - Background color picker
   - Carousel images (multiple uploads)
   - Featured flag (checkbox)
8. **Admin saves:** Project
9. **System validates:** Required fields
10. **System creates:** New project record
11. **System triggers:** Build and deploy (GitHub Actions → Cloudflare)
12. **Admin views:** Live site with new project

**Exit Conditions:**
- Success: New project visible on live site within 2-3 minutes
- Error: Validation errors shown, admin corrects and retries

---

## 6. Functional Requirements (ARS/EARS)

### 6.1 Landing Page & Navigation

#### R-001: Landing Page Load
**WHEN** a user navigates to the portfolio root URL  
**THE SYSTEM SHALL** display the landing page with:
- Navigation header (name, location, section links, menu button)
- Hero section with tagline and location
- Auto-scrolling horizontal carousel
- Featured project card

**Acceptance Criteria:**
- [ ] Page loads within 2 seconds on 4G connection
- [ ] All critical content visible above the fold (desktop: 1920×1080, mobile: 375×667)
- [ ] Carousel begins auto-scrolling after 1 second delay
- [ ] Featured project card is clickable

**Source:** Context Pack Flow 1, Figma Home Desktop `36:8459`

---

#### R-002: Navigation Header
**WHEN** the landing page is displayed  
**THE SYSTEM SHALL** render a persistent navigation header containing:
- Designer name and current location (left side)
- Section scroll links ("☩ Work", "☩ About") (center-left)
- Social links (Twitter, LinkedIn, Email) (right side)
- CV download button (right side)
- "MENU" button (far right)

**Acceptance Criteria:**
- [ ] Header persists across all scroll positions (sticky/fixed positioning)
- [ ] Section links trigger smooth scroll to respective sections
- [ ] External links open in new tabs (`target="_blank" rel="noopener noreferrer"`)
- [ ] CV download triggers browser download (not navigation)
- [ ] Header is responsive on mobile (stacked or hamburger menu)

**Source:** Context Pack, Figma NavHeader component

---

#### R-003: Auto-Scrolling Carousel
**WHEN** the landing page carousel is visible  
**THE SYSTEM SHALL** auto-advance through carousel items every 4 seconds in an infinite loop

**Acceptance Criteria:**
- [ ] Carousel auto-scrolls with smooth transition (300-500ms duration)
- [ ] Auto-scroll pauses when user hovers over carousel
- [ ] Auto-scroll resumes 1 second after hover ends
- [ ] Carousel loops infinitely (after last item, returns to first)
- [ ] Touch gestures supported on mobile (swipe left/right)
- [ ] Carousel respects `prefers-reduced-motion` (no auto-scroll, manual only)

**Source:** Context Pack Flow 1, Decision B6

**Notes:** Use Framer Motion or CSS transforms for performance.

---

#### R-004: Featured Project Card
**WHEN** the landing page displays a featured project  
**THE SYSTEM SHALL** render a project card with:
- Project thumbnail image
- Project title and one-line description
- Border and backdrop blur styling per design system

**Acceptance Criteria:**
- [ ] Card displays the project marked as `featured: true` in CMS
- [ ] Card is responsive (desktop: 565×auto, mobile: 90% width)
- [ ] Hover state shows subtle scale/shadow animation
- [ ] Card is purely decorative (no clickable action in v1)

**Source:** Context Pack Flow 1, Figma CaseStudy component `41:8452`

**Notes:** Case study deep dive deferred to future iteration. Card serves as visual highlight only.

---

### 6.2 Work Sections

#### R-005: Work Section Rendering
**WHEN** a user scrolls past the landing section  
**THE SYSTEM SHALL** display work sections in sequence, each occupying full viewport height

**Acceptance Criteria:**
- [ ] Each work section is at least 100vh tall
- [ ] Sections appear in the order defined in CMS (sortable)
- [ ] Section entrance animations trigger when 30% visible in viewport
- [ ] Sections include: header, metadata grid, image carousel, CTA button

**Source:** Context Pack Flow 2

---

#### R-006: Work Section Background Transitions
**WHEN** a user scrolls between work sections  
**THE SYSTEM SHALL** smoothly transition the background color from the previous project's color to the current project's color

**Acceptance Criteria:**
- [ ] Background color animates over 500-800ms duration
- [ ] Transition uses easing function (ease-in-out or custom cubic-bezier)
- [ ] Background color is defined per project in CMS (`backgroundColor` field)
- [ ] Transition respects `prefers-reduced-motion` (instant color change)

**Source:** Context Pack Flow 2, Figma annotation "Background color is a value in the work section model"

**Notes:** Implementation can use Intersection Observer + Framer Motion or scroll-linked animations.

---

#### R-007: Work Section Header
**WHEN** a work section is displayed  
**THE SYSTEM SHALL** render a project header with:
- App icon/logo (64×64px, rounded 12.8px)
- Project title (28px semibold, Instrument Sans)
- Project subtitle (28px semibold, 60% opacity, Instrument Sans)
- Project description (16px medium, Instrument Sans, max 3-4 lines)
- "View Case Study" CTA button

**Acceptance Criteria:**
- [ ] Header follows 12-column grid layout (5 columns wide)
- [ ] Text wraps appropriately on mobile
- [ ] CTA button matches Button component design (large variant)

**Source:** Figma Header component `4:8218`

---

#### R-008: Work Section Metadata Grid
**WHEN** a work section is displayed  
**THE SYSTEM SHALL** render project metadata in a grid with:
- **Team** (text, multiple lines)
- **Category** (chip/badge array, wrapping)
- **Role** (single line text)
- **Timeline** (date range, e.g., "Q2 2022 - Q4 2022")
- **Outcome** (bulleted list, semibold 28px)

**Acceptance Criteria:**
- [ ] Metadata follows 12-column grid layout (columns 6-9 and 10-12)
- [ ] Category chips render with 8px border radius and 18% white background
- [ ] Outcome items display as bulleted list with custom bullet styling
- [ ] All text colors follow design system (white with opacity variants)

**Source:** Figma Header component, Context Pack data model

---

#### R-009: Work Section Image Carousel
**WHEN** a work section includes carousel images  
**THE SYSTEM SHALL** display a horizontal auto-scrolling carousel

**Acceptance Criteria:**
- [ ] Carousel displays 3-4 images simultaneously (responsive sizing)
- [ ] Images have 4px border radius
- [ ] Carousel auto-scrolls at 30-40px per second (smooth continuous scroll)
- [ ] Auto-scroll pauses on hover
- [ ] Touch gestures supported (swipe left/right on mobile)
- [ ] Images lazy load (only load when carousel in viewport)
- [ ] Respects `prefers-reduced-motion` (no auto-scroll)

**Source:** Context Pack Flow 2, Figma AdavancedImageCarousel `36:9570`

---

### 6.3 Case Study Pages

#### R-010: Case Study Fullscreen Takeover
**WHEN** a user clicks a "View Case Study" button  
**THE SYSTEM SHALL** transition to a fullscreen case study view

**Acceptance Criteria:**
- [ ] Transition animates from clicked element to fullscreen (scale + fade)
- [ ] Transition duration is 400-600ms
- [ ] Back button/close control appears at top of viewport (fixed position)
- [ ] Body scroll is locked to case study content only
- [ ] Browser history is updated (pushState with project slug)
- [ ] Back button click returns to previous scroll position on main page

**Source:** Context Pack Decision C8, Flow 3

**Notes:** Consider route-based implementation (`/work/[slug]` with fullscreen overlay styling).

---

#### R-011: Case Study Content Blocks
**WHEN** a case study is displayed  
**THE SYSTEM SHALL** render content blocks in the order defined in CMS

**Acceptance Criteria:**
- [ ] Blocks render sequentially (vertical stack)
- [ ] Block types supported: text, image, imageGallery, metrics, problemStatement, process
- [ ] Each block type follows its specific design pattern
- [ ] Blocks lazy load images as they enter viewport
- [ ] Block spacing follows design system (48-120px vertical gaps)

**Source:** Context Pack data model, Flow 3

---

#### R-012: Case Study Text Block
**WHEN** a text block is rendered in a case study  
**THE SYSTEM SHALL** display rich text content with:
- Paragraphs (16-18px, Instrument Sans Medium)
- Headings (28-40px, Instrument Sans SemiBold)
- Lists (bulleted/numbered)
- Links (underlined, opens in new tab if external)

**Acceptance Criteria:**
- [ ] Text content renders with proper line height and spacing
- [ ] Links are keyboard accessible (tab navigation)
- [ ] Rich text editor output is sanitized (XSS protection)
- [ ] Block max-width is 800-1000px (centered on wide screens)

**Source:** Context Pack ContentBlock data model

---

#### R-013: Case Study Image Gallery Block
**WHEN** an imageGallery block is rendered  
**THE SYSTEM SHALL** display images in a responsive grid or carousel

**Acceptance Criteria:**
- [ ] Desktop: 2-3 column grid
- [ ] Mobile: Single column stack or horizontal scroll
- [ ] Images have 4-8px border radius
- [ ] Images maintain aspect ratio (no distortion)
- [ ] Images use Next.js Image component with optimization
- [ ] Click on image opens lightbox/modal view (optional enhancement)

**Source:** Context Pack ContentBlock data model

---

### 6.4 About Section

#### R-014: About Section Rendering
**WHEN** a user scrolls to the About section  
**THE SYSTEM SHALL** display:
- Bio text (2-3 paragraphs, 18px medium)
- Auto-scrolling horizontal image carousel
- Social links (Twitter, LinkedIn, Email)
- CV download button
- Colophon text (smaller font, 60% opacity)

**Acceptance Criteria:**
- [ ] About section occupies full viewport height minimum
- [ ] Bio text max-width is 600-800px
- [ ] Image carousel auto-scrolls (same behavior as work carousels)
- [ ] Social links and CV download match navigation header styling
- [ ] Section uses light background (#fdfcfb or #ffffff)

**Source:** Context Pack Flow 4, Figma About section `36:8754`

---

### 6.5 Responsive Design

#### R-015: Mobile Responsive Layouts
**WHEN** the viewport width is <768px  
**THE SYSTEM SHALL** render mobile-optimized layouts

**Acceptance Criteria:**
- [ ] Navigation header collapses to hamburger menu or stacked layout
- [ ] Landing carousel scales to single item view with horizontal scroll
- [ ] Work section metadata switches from multi-column to single-column stack
- [ ] Font sizes scale down (responsive typography)
- [ ] Touch targets are minimum 44×44px
- [ ] Horizontal carousels support touch gestures (swipe)

**Source:** Context Pack Objective 4, Figma Home Mobile `36:8787`

---

#### R-016: Tablet Responsive Layouts
**WHEN** the viewport width is 768px-1024px  
**THE SYSTEM SHALL** render tablet-optimized layouts

**Acceptance Criteria:**
- [ ] Grid layouts adjust to 8-column system
- [ ] Font sizes scale proportionally
- [ ] Touch gestures supported
- [ ] Carousel displays 2-3 items simultaneously

**Source:** Context Pack Objective 4

---

### 6.6 CMS Administration

#### R-017: CMS Authentication
**WHEN** a user navigates to `/admin`  
**THE SYSTEM SHALL** require OAuth authentication (Google or GitHub)

**Acceptance Criteria:**
- [ ] Unauthenticated users are redirected to OAuth login screen
- [ ] OAuth providers: Google and GitHub
- [ ] Successful authentication creates session with 7-day expiry
- [ ] Failed authentication shows error message with retry option
- [ ] Session persists across browser refreshes

**Source:** Context Pack Decision A3, Flow 5

---

#### R-018: Project Collection Management
**WHEN** an authenticated admin accesses the Projects collection  
**THE SYSTEM SHALL** display a list of all projects with:
- Title, status (draft/published), and last modified date
- "Create New" button
- Edit/delete actions per project
- Drag handles for reordering

**Acceptance Criteria:**
- [ ] Projects list is sortable by drag-and-drop
- [ ] "Create New" opens project creation form
- [ ] Edit action opens project in form view
- [ ] Delete action shows confirmation dialog
- [ ] Project order persists and affects front-end display order

**Source:** Context Pack Flow 5, Payload CMS conventions

---

#### R-019: Project Form Fields
**WHEN** an admin creates or edits a project  
**THE SYSTEM SHALL** provide form fields for:
- Title (text, required)
- Subtitle (text, required)
- Description (textarea, required, 200-500 chars)
- Slug (text, auto-generated from title, editable)
- Role (text, required)
- Team (textarea)
- Timeline (text, e.g., "Q2 2022 - Q4 2022")
- Categories (tags/chips, multiple)
- Outcomes (array of text items)
- Hero Image (file upload, required)
- Background Color (color picker, hex value)
- Carousel Images (multiple file uploads, 3-10 images)
- Featured (checkbox, default false)
- Status (draft/published)

**Acceptance Criteria:**
- [ ] Required fields show validation errors if empty
- [ ] Slug auto-generates from title (lowercase, hyphenated)
- [ ] Color picker shows preview
- [ ] Image uploads show thumbnails after upload
- [ ] Images upload to Cloudflare R2
- [ ] Form saves draft on blur/auto-save every 30 seconds
- [ ] "Publish" button validates and publishes project

**Source:** Context Pack data model Project entity, Flow 5

---



#### R-020: About Section Management
**WHEN** an admin edits the About section  
**THE SYSTEM SHALL** provide form fields for:
- Bio (rich text, required)
- Image Carousel (multiple file uploads, 4-12 images)

**Acceptance Criteria:**
- [ ] Rich text editor supports paragraphs and basic formatting
- [ ] Image uploads to Cloudflare R2
- [ ] Changes publish immediately (or save as draft)

**Source:** Context Pack data model AboutSection entity

---

#### R-021: Site Configuration Management
**WHEN** an admin edits Site Configuration  
**THE SYSTEM SHALL** provide form fields for:
- Name (text, required)
- Location (text, required)
- Email (email, required)
- Social Links array (platform + URL pairs)
- CV File (file upload, PDF)

**Acceptance Criteria:**
- [ ] Email field validates email format
- [ ] Social links array has "Add Link" and "Remove Link" buttons
- [ ] Social platform dropdown includes: Twitter, LinkedIn, GitHub, Dribbble, Behance, Instagram, Custom
- [ ] CV file upload accepts PDF only, max 5MB
- [ ] CV file uploads to Cloudflare R2
- [ ] Changes publish immediately

**Source:** Context Pack data model SiteConfig entity

---

### 6.7 Animations & Interactions

#### R-022: Reduced Motion Support
**WHEN** a user has `prefers-reduced-motion: reduce` enabled  
**THE SYSTEM SHALL** disable or reduce all non-essential animations:
- Carousels do not auto-scroll (manual controls only)
- Page transitions are instant or very brief (<100ms)
- Scroll animations are replaced with instant reveals
- Background color transitions are instant

**Acceptance Criteria:**
- [ ] System detects `prefers-reduced-motion` media query
- [ ] All auto-scrolling stops
- [ ] Essential animations (loading spinners, focus indicators) remain
- [ ] Interaction feedback is instant (no delays)

**Source:** Context Pack Assumption 4, Objective 6

---

#### R-023: Smooth Scroll Navigation
**WHEN** a user clicks a section link in the navigation  
**THE SYSTEM SHALL** smoothly scroll to the corresponding section

**Acceptance Criteria:**
- [ ] Scroll animation duration is 800-1200ms
- [ ] Scroll easing is smooth (ease-in-out)
- [ ] Target section aligns to top of viewport
- [ ] Browser history is updated with hash (#work, #about)
- [ ] Direct navigation to hash URLs (e.g., `/#about`) scrolls on page load

**Source:** Context Pack Decision C7

---

#### R-024: Hover Interactions
**WHEN** a user hovers over interactive elements  
**THE SYSTEM SHALL** provide visual feedback:
- Buttons: background color change or slight scale (1.05x)
- Links: underline or color change
- Carousel items: pause auto-scroll
- Project cards: subtle shadow or scale animation

**Acceptance Criteria:**
- [ ] Hover transitions are 200-300ms duration
- [ ] Hover states use design system colors
- [ ] Hover is disabled on touch devices (use active/focus states)

**Source:** Figma component variants, general UX patterns

---

### 6.8 SEO & Metadata

#### R-025: Page Metadata
**WHEN** any page is rendered  
**THE SYSTEM SHALL** include SEO metadata:
- `<title>` tag (page-specific or default: "[Name] - Product Designer")
- `<meta name="description">` (page-specific or default site description)
- OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Canonical URL (`<link rel="canonical">`)

**Acceptance Criteria:**
- [ ] Home page uses site-level metadata
- [ ] OpenGraph image is 1200×630px (auto-generated or uploaded)
- [ ] All metadata renders in `<head>` (Next.js Metadata API)

**Source:** Context Pack Decision C9, Objective 1

**Notes:** Case study pages deferred to future iteration.

---

#### R-026: Structured Data
**WHEN** the home page is rendered  
**THE SYSTEM SHALL** include JSON-LD structured data for:
- Person schema (name, jobTitle, email, sameAs[social links])
- Organization schema (if applicable)

**Acceptance Criteria:**
- [ ] JSON-LD scripts are valid per schema.org validator
- [ ] Structured data improves rich snippet eligibility

**Source:** Context Pack Decision C9

---

#### R-027: Sitemap Generation
**WHEN** the site is built  
**THE SYSTEM SHALL** generate a `sitemap.xml` with:
- Home page URL
- About section URL (as hash or separate route)
- Last modified date

**Acceptance Criteria:**
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Sitemap follows XML sitemap protocol
- [ ] Sitemap updates on each build
- [ ] Sitemap is submitted to Google Search Console

**Source:** Context Pack Decision C9

**Notes:** Case study page URLs deferred to future iteration.

---

#### R-028: Robots.txt
**WHEN** a search engine crawler accesses `/robots.txt`  
**THE SYSTEM SHALL** provide a robots.txt file that:
- Allows all crawlers (`User-agent: *`)
- Allows all paths (`Allow: /`)
- References sitemap (`Sitemap: https://[domain]/sitemap.xml`)
- Disallows admin path (`Disallow: /admin`)

**Acceptance Criteria:**
- [ ] File is accessible at `/robots.txt`
- [ ] File syntax is valid

**Source:** Context Pack Decision C9

---

### 6.9 Performance & Optimization

#### R-029: Image Optimization
**WHEN** images are displayed  
**THE SYSTEM SHALL** optimize images using Next.js Image component

**Acceptance Criteria:**
- [ ] Images served in modern formats (WebP, AVIF with fallbacks)
- [ ] Images lazy load (loading="lazy") when below fold
- [ ] Images include width/height attributes (prevent layout shift)
- [ ] Images use responsive srcset for different viewport sizes
- [ ] Images served via Cloudflare CDN with caching headers

**Source:** Context Pack Objective 3, Risk 3

---

#### R-030: Code Splitting
**WHEN** the application is built  
**THE SYSTEM SHALL** implement code splitting:
- Route-based splitting (Next.js App Router default)
- Component-level dynamic imports for heavy components (e.g., rich text editor in CMS)

**Acceptance Criteria:**
- [ ] Initial bundle size <200KB (gzipped)
- [ ] Route chunks load on-demand
- [ ] Common vendor code is extracted to shared chunk

**Source:** Context Pack Objective 3

---

#### R-031: Font Loading
**WHEN** the page loads  
**THE SYSTEM SHALL** load fonts optimally:
- Use `next/font/google` for Instrument Sans and Geist Mono
- Fonts self-host via Next.js (not external requests)
- Font display strategy: `swap` (show fallback, then custom font)

**Acceptance Criteria:**
- [ ] Fonts load without blocking render
- [ ] Font files are served from same domain (no CORS)
- [ ] FOUT (Flash of Unstyled Text) is minimized with font-display: swap

**Source:** Context Pack Decision B4, Objective 3

---

### 6.10 Accessibility

#### R-032: Keyboard Navigation
**WHEN** a user navigates via keyboard  
**THE SYSTEM SHALL** support full keyboard accessibility:
- Tab order follows visual order
- All interactive elements are focusable
- Focus indicators are visible (2px outline, design system color)
- Enter/Space activates buttons and links

**Acceptance Criteria:**
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Skip to main content link provided (hidden until focused)
- [ ] No keyboard traps
- [ ] Focus visible on all interactive elements

**Source:** Context Pack Objective 6, Success Metrics

---

#### R-033: Screen Reader Support
**WHEN** a screen reader user accesses the site  
**THE SYSTEM SHALL** provide:
- Semantic HTML (header, nav, main, section, article, footer)
- ARIA labels for icon-only buttons
- Alt text for all images (descriptive, not decorative)
- ARIA live regions for dynamic content (e.g., carousel changes)
- Proper heading hierarchy (h1 → h2 → h3, no skips)

**Acceptance Criteria:**
- [ ] All images have alt text (empty alt="" for decorative)
- [ ] Icon buttons have aria-label (e.g., "Menu")
- [ ] Carousel announces current item to screen readers
- [ ] Form inputs have associated labels

**Source:** Context Pack Objective 6, Success Metrics

---

#### R-034: Color Contrast
**WHEN** text or UI elements are displayed  
**THE SYSTEM SHALL** meet WCAG AA contrast requirements:
- Normal text: 4.5:1 contrast minimum
- Large text (18px+ or 14px+ bold): 3:1 contrast minimum
- UI components: 3:1 contrast minimum

**Acceptance Criteria:**
- [ ] Design system colors pass contrast checks (verified with axe DevTools)
- [ ] Text on colored backgrounds meets contrast ratios
- [ ] Links are distinguishable by more than color alone (underline or icon)

**Source:** Context Pack Success Metrics, WCAG 2.1 AA

---

---

## 7. State & Data Model

### 7.1 Data Entities

**Note:** CaseStudy and ContentBlock entities removed (deferred to future iteration).

#### Project
```typescript
{
  id: string;                    // UUID
  slug: string;                  // URL-friendly, unique (e.g., "striker-fantasy")
  title: string;                 // e.g., "Striker"
  subtitle: string;              // e.g., "NFT-based Cricket Fantasy Game"
  description: string;           // 200-500 chars
  role: string;                  // e.g., "Product Designer II"
  team: string;                  // e.g., "2 Designers, 2 PMs, ..."
  timeline: string;              // e.g., "Q2 2022 - Q4 2022"
  categories: string[];          // e.g., ["Real Money Gaming", "Fantasy Sports", "Web3"]
  outcomes: string[];            // e.g., ["25K Daily Active Users", "1M USD Traded Volume"]
  heroImage: MediaFile;          // Relation to Media
  backgroundColor: string;       // Hex color (e.g., "#090e03")
  carouselImages: MediaFile[];   // Array of Media relations (3-10 images)
  featured: boolean;             // Default: false
  status: 'draft' | 'published'; // Default: draft
  order: number;                 // For display ordering
  createdAt: Date;
  updatedAt: Date;
}
```

**Relationships:**
- Has many MediaFile (heroImage, carouselImages)

**Indexes:**
- `slug` (unique)
- `status`, `order` (composite for listing published projects)

**PII:** None

---

#### AboutSection (Singleton)
```typescript
{
  id: string;                    // Singleton ID (always "about")
  bio: RichText;                 // HTML or structured JSON
  imageCarousel: MediaFile[];    // Array of Media relations (4-12 images)
  updatedAt: Date;
}
```

**Relationships:**
- Has many MediaFile (imageCarousel)

**PII:** None

---

#### SiteConfig (Singleton)
```typescript
{
  id: string;                    // Singleton ID (always "siteConfig")
  name: string;                  // e.g., "Abhinav Pandey"
  location: string;              // e.g., "Mumbai, India"
  email: string;                 // e.g., "hello@example.com" (PII)
  socialLinks: { platform: string; url: string; }[];
  cvFile: MediaFile;             // Relation to Media (PDF)
  updatedAt: Date;
}
```

**PII:** `email` (low sensitivity, public contact)

---

#### MediaFile
```typescript
{
  id: string;                    // UUID
  filename: string;              // Original filename
  mimeType: string;              // e.g., "image/jpeg", "application/pdf"
  url: string;                   // Cloudflare R2 URL
  width?: number;                // For images
  height?: number;               // For images
  altText?: string;              // For images (accessibility)
  createdAt: Date;
}
```

**Storage:** Cloudflare R2

**PII:** None (unless image contains faces/identifiable people)

---

### 7.2 State Transitions

#### Project Status
```
draft → published → draft (unpublish)
```

**Rules:**
- Only `published` projects appear on front-end
- `draft` projects visible only in CMS

---

## 8. Non-Functional Requirements

### 8.1 Performance
- **Load Time:** First Contentful Paint (FCP) <1.2s, Largest Contentful Paint (LCP) <2.0s on 4G
- **Lighthouse Score:** >90 across all metrics (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive (TTI):** <2.0s
- **Image Optimization:** All images served as WebP/AVIF with lazy loading
- **Code Splitting:** Route-based and component-level splitting for <200KB initial bundle

**Source:** Context Pack Objectives 3, Success Metrics

---

### 8.2 Availability
- **Uptime:** Target 99.9% uptime (Cloudflare Workers SLA)
- **Error Handling:** Graceful degradation if CMS API unavailable (show cached data or error page)
- **Failover:** Static generation ensures site availability even if CMS is down

**Source:** Cloudflare Workers reliability expectations

---

### 8.3 Security
- **Authentication:** OAuth 2.0 (Google/GitHub) for CMS access
- **Authorization:** Role-based access (admin role only)
- **Session Management:** Secure, HTTP-only cookies with 7-day expiry
- **Content Security Policy (CSP):** Strict CSP headers to prevent XSS
- **Rate Limiting:** CMS API rate limiting (100 requests/minute per user)
- **Input Validation:** Sanitize rich text editor output (prevent XSS)
- **File Uploads:** Validate file types, size limits (images: max 10MB, PDF: max 5MB)

**Source:** General security best practices, Payload CMS conventions

---

### 8.4 Accessibility
- **WCAG Compliance:** AA level (minimum 4.5:1 contrast, keyboard navigation, screen reader support)
- **Keyboard Navigation:** Full site navigable via keyboard (Tab, Enter, Escape, Arrow keys)
- **Screen Readers:** Semantic HTML, ARIA labels, alt text for images
- **Reduced Motion:** Respect `prefers-reduced-motion` (disable auto-scroll, reduce animations)

**Source:** Context Pack Objective 6, Success Metrics

---

### 8.5 Browser Support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers:** iOS Safari 14+, Chrome Android 90+
- **No IE Support:** Internet Explorer not supported

**Source:** Modern web development standards

---

### 8.6 Observability
- **Error Tracking:** Integrate Sentry or similar for client and server errors
- **Performance Monitoring:** Web Vitals reporting (FCP, LCP, CLS, FID)
- **CMS Audit Logs:** Track content changes (who, what, when)
- **Cloudflare Analytics:** Monitor request counts, bandwidth, cache hit rates

**Source:** Context Pack Success Metrics, operational needs

---

## 9. Constraints & Dependencies

### 9.1 Technical Constraints
- **Hosting Platform:** Cloudflare Workers + R2 + D1 (cannot use other cloud providers)
- **Zero-Cost Requirement:** Must fit within Cloudflare free tier limits:
  - Workers: 100,000 requests/day
  - R2: 10GB storage, 10M read requests/month, 1M write requests/month
  - D1: 5GB storage, 5M reads/day, 100K writes/day
- **Framework:** Next.js 14+ with App Router (cannot use Pages Router or other frameworks)
- **CMS:** Payload CMS (cannot use other CMS like Contentful, Sanity, Strapi)
- **Design System:** Must use exact Figma design tokens (no hardcoded Tailwind values)

**Source:** Context Pack Constraints, Objectives 5

---

### 9.2 Design Constraints
- **Fonts:** Instrument Sans (Google Fonts), Geist Mono (Google Fonts) only
- **Colors:** Use Figma-extracted design tokens
- **Spacing:** Use design system spacing scale (4, 8, 12, 16, 32, 48, 80, 120px)
- **Typography:** Match Figma line heights, letter spacing, font weights exactly

**Source:** Context Pack Decisions B4, Constraints

---

### 9.3 External Dependencies
- **Google Fonts:** For Instrument Sans and Geist Mono
- **GitHub:** For repository hosting and CI/CD triggers
- **Cloudflare:** For hosting, storage, database, CDN
- **OAuth Providers:** Google and GitHub for CMS authentication

**Source:** Context Pack Decisions A1, A2, A3, B4

---

### 9.4 Development Environment
- **Node.js:** 18+ LTS
- **Package Manager:** pnpm (preferred) or npm
- **Git:** Version control required
- **Local Development:** Docker optional for Payload CMS + Postgres (or use SQLite locally)

**Source:** Context Pack Dependencies

---

## 10. Design References

### 10.1 Figma Files
- **Home Desktop:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=36-8459&m=dev`
- **Home Mobile:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=36-8787&m=dev`
- **Colors:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=3-19700&m=dev`
- **Typography:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=3-18936&m=dev`
- **Button:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=3-19681&m=dev`
- **Components:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=42-8879&m=dev`

### 10.2 Design Tokens Extracted

**Colors:**
```css
--neutral-dark-100: #2a2119;
--neutral-dark-16: rgba(42, 33, 25, 0.16);
--primary-text: #0b0c11;
--bg-shell: #fdfcfb;
--system-white: #ffffff;
--label-secondary: rgba(11, 12, 17, 0.6);
--label-tertiary: rgba(11, 12, 17, 0.3);
--separator-opaque-light: #ebecec;
--separator-non-opaque-light: rgba(11, 12, 17, 0.18);
```

**Typography:**
```css
/* Heading 4 (28px SemiBold) */
--font-family-heading: 'Instrument Sans', sans-serif;
--font-size-h4: 28px;
--font-weight-semibold: 600;
--line-height-h4: 32px;
--letter-spacing-h4: -0.8px;

/* Body Medium (16px) */
--font-family-body: 'Instrument Sans', sans-serif;
--font-size-b2: 16px;
--font-weight-medium: 500;
--line-height-b2: 24px;
--letter-spacing-b2: -0.2px;

/* Label Large (14px) */
--font-family-ui: 'Geist Mono', monospace;
--font-size-label-l: 14px;
--font-weight-regular: 400;
--line-height-label-l: 16px;
--letter-spacing-label-l: 1px;
```

**Spacing:**
```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-24: 24px;
--space-32: 32px;
--space-48: 48px;
--space-64: 64px;
--space-80: 80px;
--space-120: 120px;
```

**Border Radius:**
```css
--radius-button: 32px;
--radius-card: 24px;
--radius-2: 8px;
--radius-6: 4px;
```

**Source:** Figma variable definitions extraction, Context Pack

---

## 11. Instrumentation & Telemetry

### 11.1 Analytics Events

**Page View Events:**
- `page_view` (route, referrer, timestamp)

**Interaction Events:**
- `carousel_interaction` (action: auto-scroll | hover | click, item_index)
- `project_card_click` (project_slug, location: hero | work_section)
- `case_study_open` (project_slug)
- `case_study_close` (project_slug, time_spent_seconds)
- `nav_link_click` (target: work | about | cv_download | social_link)
- `cv_download` (timestamp)

**Performance Events:**
- `web_vitals` (fcp, lcp, cls, fid, ttfb)

**Error Events:**
- `error` (error_type, error_message, stack_trace, user_agent)

### 11.2 CMS Audit Logs
- `project_created` (admin_user, project_slug, timestamp)
- `project_updated` (admin_user, project_slug, fields_changed, timestamp)
- `project_published` (admin_user, project_slug, timestamp)
- `case_study_created` (admin_user, project_slug, timestamp)
- `media_uploaded` (admin_user, filename, file_size, timestamp)

### 11.3 Dashboards
- **Public Site Dashboard:** Page views, bounce rate, top referrers, device breakdown
- **Performance Dashboard:** Web Vitals trends, Lighthouse scores over time
- **CMS Dashboard:** Content changes per week, active admin users, content publish frequency

**Source:** Context Pack Success Metrics, operational monitoring

---

## 12. Rollout & Risk Mitigation

### 12.1 Phased Rollout Plan

**Phase 1: MVP (Week 1-2)**
- Initialize Next.js + Payload CMS project
- Implement design system (CSS variables)
- Build static landing page with mock data
- Deploy to Cloudflare Workers (staging)

**Phase 2: Core Features (Week 3-4)**
- Integrate Payload CMS collections (Project, CaseStudy, AboutSection, SiteConfig)
- Implement work sections with carousels
- Implement case study takeover views
- Deploy to Cloudflare Workers (staging)

**Phase 3: Interactivity & Polish (Week 5)**
- Add Framer Motion animations
- Implement auto-scrolling carousels
- Add smooth scroll navigation
- Responsive mobile layouts
- Deploy to Cloudflare Workers (staging)

**Phase 4: Testing & Optimization (Week 6)**
- E2E tests with Playwright
- Performance optimization (image optimization, code splitting)
- Accessibility audit (axe DevTools)
- SEO optimization (metadata, sitemap, structured data)
- Deploy to Cloudflare Workers (production)

**Phase 5: Content Population (Week 7)**
- Populate CMS with Striker project template data
- Add About section content
- Upload CV and configure social links
- Final production deployment

---

### 12.2 Risk Mitigation Strategies

#### Risk: Font Licensing Issues
**Mitigation:** Use Google Fonts (Instrument Sans, Geist Mono) which are free and open-source. No licensing concerns.

#### Risk: Cloudflare Free Tier Limits Exceeded
**Mitigation:**
- Monitor usage via Cloudflare dashboard
- Implement aggressive caching (1 hour cache for static pages)
- Use Cloudflare R2 with CDN caching for images
- Alert if approaching 80% of limits

#### Risk: Image Optimization Performance Issues
**Mitigation:**
- Use Next.js Image component with automatic optimization
- Serve images via Cloudflare CDN with caching headers
- Compress images on upload (max 2MB per image after compression)
- Lazy load all images below the fold

#### Risk: CMS Learning Curve
**Mitigation:**
- Create detailed CMS documentation with screenshots
- Include sample data (Striker project) as reference
- Use Payload CMS's intuitive admin UI (low learning curve)
- Provide video walkthrough (Loom/YouTube)

#### Risk: Carousel Performance/Jank
**Mitigation:**
- Use CSS transforms (translateX) for smooth hardware-accelerated animations
- Use requestAnimationFrame for auto-scroll timing
- Test on low-end devices (iPhone SE, older Android)
- Provide fallback to static grid if performance degrades

#### Risk: Mobile Touch Gestures Not Working
**Mitigation:**
- Use proven library (e.g., Swiper.js or Embla Carousel) for touch gestures
- Test on real devices (iOS Safari, Chrome Android)
- Implement touch event polyfills if needed

---

### 12.3 Rollback Strategy

**If critical issue found in production:**
1. **Immediate Rollback:** Revert to previous Cloudflare Workers deployment (via Cloudflare dashboard or CLI)
2. **Investigate:** Review error logs in Sentry and Cloudflare logs
3. **Fix:** Apply hotfix in development branch
4. **Test:** Re-run E2E tests in staging
5. **Redeploy:** Push fix to production

**Rollback Time Target:** <5 minutes (via Cloudflare CLI: `wrangler rollback`)

---

## 13. Open Questions

**No critical open questions remaining.** All blocking questions were resolved in Context Pack (Decisions Made section).

**Deferred to Future Iterations:**
1. **Case study deep dive pages** with modular content blocks (text, images, galleries, metrics, problem statements, process steps)
2. Fullscreen case study takeover views with back navigation
3. Case study-specific SEO metadata and structured data
4. CMS scheduling (publish project at future date/time)
5. Social sharing buttons for project pages

---

## 14. References

### 14.1 Source Documents
- **Context Pack:** `/context-pack.md`
- **Context Engineering Doc:** `/AI Dev tasks/context-engineering.md`
- **PRD Creation Doc:** `/AI Dev tasks/create-prd.md`
- **Design Tokens (Extracted):** `/tasks/001-portfolio-website/design-system/design-tokens.md`

### 14.2 External References
- **Figma Design System:** `https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website`
- **Next.js 14 Documentation:** `https://nextjs.org/docs`
- **Payload CMS Documentation:** `https://payloadcms.com/docs`
- **Cloudflare Workers Documentation:** `https://developers.cloudflare.com/workers/`
- **Cloudflare R2 Documentation:** `https://developers.cloudflare.com/r2/`
- **Cloudflare D1 Documentation:** `https://developers.cloudflare.com/d1/`
- **Framer Motion Documentation:** `https://www.framer.com/motion/`
- **WCAG 2.1 Guidelines:** `https://www.w3.org/WAI/WCAG21/quickref/`

### 14.3 Design Tokens Extraction
- **Source Files:** 
  - `/figma-variables/Colors.json` (Light/Dark mode colors)
  - `/figma-variables/Typography.json` (Responsive font system)
  - `/figma-variables/Spacing.json` (Desktop/Mobile spacing scale)
  - `/figma-variables/Radius.json` (Border radius values)
- **Processed Tokens:** `/tasks/001-portfolio-website/design-system/design-tokens.md`
- **Figma Nodes:** Colors (`3:19700`), Typography (`3:18936`), Button (`3:19681`), Components (`42:8879`)
- **Modes:** Desktop (`>768px`), Mobile (`<767px`)

---

## Appendix A: Design System CSS Variables (Responsive)

**📖 Full Documentation:** See `/tasks/001-portfolio-website/design-system/design-tokens.md`

### Responsive Breakpoints
- **Desktop:** `>768px`
- **Mobile:** `<767px`

### Core Variables (Desktop)

```css
:root {
  /* ===== Colors (Light Mode) ===== */
  --color-bg-system-white: #ffffff;
  --color-bg-shell: #fdfcfb;
  --color-label-primary: #0b0c11;
  --color-label-secondary: rgba(11, 12, 17, 0.6);
  --color-label-tertiary: rgba(11, 12, 17, 0.3);
  --color-label-quaternary: rgba(11, 12, 17, 0.18);
  --color-neutral-dark-100: #2a2119;
  --color-neutral-dark-64: rgba(42, 33, 25, 0.64);
  --color-neutral-dark-16: rgba(42, 33, 25, 0.16);
  --color-material-regular: rgba(255, 255, 255, 0.4);
  --color-material-thick: rgba(255, 255, 255, 0.6);
  --color-separator-opaque: #ebecec;
  --color-separator-non-opaque: rgba(11, 12, 17, 0.18);
  
  /* ===== Typography - Font Families ===== */
  --font-family-heading: 'Instrument Sans', system-ui, sans-serif;
  --font-family-body: 'Instrument Sans', system-ui, sans-serif;
  --font-family-ui: 'Geist Mono', monospace;
  
  /* ===== Typography - Desktop Sizes ===== */
  --font-size-h1: 48px;
  --line-height-h1: 56px;
  --letter-spacing-h1: -1.2px;
  
  --font-size-h2: 40px;
  --line-height-h2: 44px;
  --letter-spacing-h2: -1.2px;
  
  --font-size-h4: 28px;
  --line-height-h4: 32px;
  --letter-spacing-h4: -0.8px;
  
  --font-size-b1: 18px;
  --line-height-b1: 26px;
  --letter-spacing-b1: -0.4px;
  
  --font-size-b2: 16px;
  --line-height-b2: 24px;
  --letter-spacing-b2: -0.2px;
  
  --font-size-b3: 14px;
  --line-height-b3: 20px;
  --letter-spacing-b3: -0.2px;
  
  --font-size-label-l: 14px;
  --line-height-label-l: 16px;
  --letter-spacing-label-l: 1px;
  
  --font-size-button-l: 14px;
  --line-height-button-l: 24px;
  --letter-spacing-button-l: 2px;
  
  /* ===== Spacing - Desktop ===== */
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-48: 48px;
  --space-64: 64px;
  --space-80: 80px;
  --space-120: 120px;
  --space-160: 160px;
  
  /* ===== Border Radius - Desktop ===== */
  --radius-1: 24px;
  --radius-2: 16px;
  --radius-3: 8px;
  --radius-6: 4px;
  --radius-button: 32px;
  
  /* ===== Transitions ===== */
  --transition-fast: 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  --transition-base: 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
  --transition-smooth: 800ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* ===== Mobile Overrides (<767px) ===== */
@media (max-width: 767px) {
  :root {
    /* Typography - Mobile Sizes */
    --font-size-h1: 40px;
    --line-height-h1: 44px;
    
    --font-size-h2: 32px;
    --line-height-h2: 36px;
    
    --font-size-h4: 22px;
    --line-height-h4: 26px;
    
    --font-size-b1: 16px;
    --line-height-b1: 24px;
    --letter-spacing-b1: -0.2px;
    
    --font-size-b2: 14px;
    --line-height-b2: 20px;
    --letter-spacing-b2: 0px;
    
    --font-size-b3: 12px;
    --line-height-b3: 16px;
    --letter-spacing-b3: 0px;
    
    /* Spacing - Mobile (Scaled Down) */
    --space-8: 6px;
    --space-12: 8px;
    --space-16: 12px;
    --space-24: 16px;
    --space-32: 24px;
    --space-48: 32px;
    --space-64: 48px;
    --space-80: 64px;
    --space-120: 80px;
    --space-160: 120px;
    
    /* Border Radius - Mobile */
    --radius-1: 16px;
    --radius-2: 0px;
    --radius-3: 4px;
  }
}

/* ===== Dark Mode (Work Sections) ===== */
[data-theme="dark"] {
  --color-bg-system-white: #000000;
  --color-label-primary: #ffffff;
  --color-label-secondary: rgba(234, 234, 237, 0.6);
  --color-separator-opaque: #38383a;
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 100ms;
    --transition-smooth: 0ms;
  }
}
```

### Usage Notes
- All values extracted from `/figma-variables/*.json`
- Typography scales responsively across breakpoints
- Spacing reduces by ~20-40% on mobile
- Border radius adapts (radius-2: 16px → 0px on mobile)
- No hardcoded Tailwind values allowed

---

## Appendix B: Typography Scale Reference (Responsive)

| Style | Font Family | Desktop Size | Mobile Size | Weight | Desktop LH | Mobile LH | Letter Spacing | Use Case |
|-------|------------|--------------|-------------|--------|------------|-----------|----------------|----------|
| Heading 1 | Instrument Sans | 48px | 40px | SemiBold (600) | 56px | 44px | -1.2px | Hero titles |
| Heading 2 | Instrument Sans | 40px | 32px | SemiBold (600) | 44px | 36px | -1.2px | Section titles |
| Heading 4 | Instrument Sans | 28px | 22px | SemiBold (600) | 32px | 26px | -0.8px | Project titles |
| Body Large (B1) | Instrument Sans | 18px | 16px | Medium (500) | 26px | 24px | -0.4px / -0.2px | About bio |
| Body Medium (B2) | Instrument Sans | 16px | 14px | Medium (500) | 24px | 20px | -0.2px / 0px | Descriptions |
| Body Small (B3) | Instrument Sans | 14px | 12px | Medium (500) | 20px | 16px | -0.2px / 0px | Metadata text |
| Label Large | Geist Mono | 14px | 14px | Regular (400) | 16px | 16px | 1px | Metadata labels (uppercase) |
| Label Small | Geist Mono | 12px | 10px | Regular (400) | 16px | 14px | 2px | Small labels (uppercase) |
| Button Large | Geist Mono | 14px | 12px | Regular (400) | 24px | 14px | 2px / 1px | Primary CTAs (uppercase) |
| Button Small | Geist Mono | 12px | 10px | Regular (400) | 16px | 14px | 1px / 2px | Secondary CTAs (uppercase) |

**Note:** Letter spacing adjusts on mobile (desktop → mobile shown with `/`)

---

**End of PRD**

**Next Steps:**
This PRD is complete and ready for implementation. Proceed to:
1. **Technical Specification** (using `generate-spec.md`)
2. **Task Breakdown** (using `generate-tasks.md`)

**Ready to generate the spec from this PRD? Reply 'Go' to proceed.**
