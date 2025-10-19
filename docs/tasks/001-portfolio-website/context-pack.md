# Context Pack — Personal Design Portfolio Website

## Goal Summary
Build a performant, CMS-driven personal design portfolio that showcases projects through immersive scroll-based storytelling with smooth animations, powered by Next.js + Payload CMS + Cloudflare stack.

## Sources
- **Prompt**: Project brief for portfolio website with detailed requirements
- **Context Engineering Doc**: `/AI Dev tasks/context-engineering.md`
- **Figma Designs**:
  - Home Desktop: `36:8459`
  - Home Mobile: `36:8787`
  - Colors: `3:19700`
  - Typography: `3:18936`
  - Button Component: `3:19681`
  - Components Library: `42:8879`
- **Design Variables Extracted**: Colors, typography, spacing, button styles
- **Repo**: Not yet created (greenfield project)

## Context Breakdown

### Problem Statement
Designer needs a portfolio website that feels handcrafted and interactive (like a case study book) while remaining easy to update via CMS, without requiring code changes for new projects or content.

### Objectives
1. Create visually refined, motion-rich portfolio experience
2. Enable non-technical content management through Payload CMS
3. Achieve <2s load time on 4G connections
4. Support desktop + mobile responsive design
5. Deploy on Cloudflare (Workers + R2 + D1) for zero-cost hosting
6. Maintain accessibility standards (keyboard navigation, reduced motion)

### Target Users
- **Primary**: Portfolio owner (designer) — adding/editing projects
- **Secondary**: Potential clients/employers — viewing portfolio

### Primary Flows

**Flow 1: Landing Page Experience**
1. User lands on home page
2. See hero with auto-scrolling horizontal carousel (pauses on hover)
3. Navigate via header links (Work, About, CV download)
4. Click carousel item to expand/view project

**Flow 2: Work Section Browsing**
1. User scrolls down from landing
2. Full-height project sections appear sequentially
3. Background color transitions between sections
4. Each section shows: project visual, title, description, metadata, CTA
5. Click "View Case Study" to go deeper

**Flow 3: Case Study Deep Dive**
1. Navigate to case study page
2. View structured content blocks (problem, process, visuals, metrics)
3. Scroll through modular sections
4. Return to main portfolio

**Flow 4: About Section**
1. User scrolls to About section
2. View text summary + auto-scrolling horizontal image carousel
3. Access social links, email, CV download

**Flow 5: CMS Content Management**
1. Designer logs into Payload CMS
2. Edit/add project data (title, description, images, metadata)
3. Manage case study content blocks
4. Publish changes
5. Site auto-deploys via GitHub integration

### Interfaces & Artifacts

**Design System (from Figma)**:
- **Colors**: 
  - Neutral Dark: `#2a2119`
  - Primary Text: `#0b0c11`
  - Background Shell: `#fdfcfb`
  - System White: `#ffffff`
  - Secondary labels with opacity variants
- **Typography**:
  - Heading Serif: `LT Superior Serif` (Regular)
  - Body Sans: `Instrument Sans` (Medium, SemiBold)
  - UI Mono: `Geist Mono` (Regular)
  - Scale: 12px–80px with specific line heights and letter spacing
- **Spacing**: `4, 8, 12, 16, 32, 48, 80, 120px`
- **Components**: NavHeader, CaseStudy card, Button (Large/Small), Skills Chips, Image Carousel

**Pages Required**:
1. Home (landing + hero carousel + featured project card)
2. Work Section (multiple full-height sections)
3. Case Study pages (dynamic, modular content blocks)
4. About section (text + image carousel)

**Tech Stack**:
- Frontend: Next.js 14+ (App Router)
- Styling: CSS-in-JS or CSS Modules (NO Tailwind per Figma instructions)
- Animation: Framer Motion
- CMS: Payload CMS (self-hosted)
- Hosting: Cloudflare Workers + R2 (assets) + D1 (database)
- Deployment: GitHub Actions → Cloudflare

### Data

**Entities to Model**:

1. **Project**
   - `id`, `slug`, `title`, `subtitle`, `description`
   - `heroImage`, `backgroundColor` (for work section)
   - `role`, `team`, `timeline`, `category[]`, `outcome[]`
   - `featured: boolean`
   - `carouselImages[]`

2. **CaseStudy**
   - `id`, `projectId` (relation)
   - `contentBlocks[]` (flexible array of block types)
   
3. **ContentBlock** (polymorphic)
   - Types: `text`, `image`, `imageGallery`, `metrics`, `problemStatement`, `process`
   - Each type has specific fields

4. **AboutSection**
   - `bio` (rich text)
   - `imageCarousel[]`

5. **SiteConfig**
   - `name`, `location`, `email`, `socialLinks[]`
   - `cvFile` (media)

**PII Considerations**: Email address only (low sensitivity)

**Data Sources**: All content managed via Payload CMS, images stored in Cloudflare R2

### Assumptions

1. **Assumption**: Designer has GitHub account and can set up repo
   - **Rationale**: Required for deployment pipeline
   - **Impact**: If not, need alternative deployment method

2. **Assumption**: Cloudflare free tier sufficient for expected traffic
   - **Rationale**: Personal portfolio unlikely to exceed limits
   - **Impact**: Need to monitor usage

3. **~~Assumption~~** → **Decision**: Use Google Fonts (Instrument Sans, Geist Mono) only, no LT Superior Serif
   - **Rationale**: Confirmed by user, fonts available on Google Fonts
   - **Impact**: Need to update Figma-derived heading styles to use Instrument Sans instead of LT Superior Serif

4. **Assumption**: Auto-scrolling carousels should respect `prefers-reduced-motion`
   - **Rationale**: Accessibility requirement stated in brief
   - **Impact**: Need alternative static view for reduced motion

5. **Assumption**: Case study content blocks can be reordered via CMS drag-and-drop
   - **Rationale**: "modular so they can be rearranged" in brief
   - **Impact**: Payload CMS supports this natively

### Decisions Made (Answers to Open Questions)

**A. Development & Deployment**
1. ✅ **GitHub**: Create new repo
2. ✅ **Cloudflare**: Need setup guidance (not yet configured)
3. ✅ **CMS Auth**: OAuth (Google/GitHub)

**B. Content & Design**
4. ✅ **Fonts**: 
   - ~~LT Superior Serif~~ (NOT used)
   - Instrument Sans (Google Fonts)
   - Geist Mono (Google Fonts)
5. ✅ **Initial Projects**: Use Striker project data from Figma as template
6. ✅ **Carousels**: Infinite loop auto-scroll (with pause on hover)

**C. Features & Scope**
7. ✅ **Navigation**: Smooth scroll on same page
8. ✅ **Case Studies**: Fullscreen takeover with back button
9. ✅ **SEO**: Full optimization (meta tags, OG images, structured data, sitemap)
10. ✅ **Testing**: E2E tests for key user flows (Playwright)

### Non-Goals (Out of Scope for v1)
- Multi-language support
- Blog/articles section
- Contact form (email link sufficient)
- Analytics dashboard
- User comments or interactions
- Dark mode (design only specifies light mode with dark work sections)
- Password-protected projects
- Video hosting (external links OK)
- Search functionality

### Success Metrics
1. **Performance**: Lighthouse score >90 on all metrics
2. **Load Time**: <2s on 4G connection
3. **CMS Usability**: Designer can add new project in <5 minutes
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Mobile Experience**: Touch-friendly, smooth scroll on iOS/Android

### Constraints
- **Budget**: Zero hosting cost requirement (Cloudflare free tier)
- **Tech**: Must use specified stack (Next.js, Payload, Cloudflare)
- **Design**: Must match Figma pixel-perfect, no Tailwind hardcoded values
- **Fonts**: Must use exact fonts from Figma variables
- **Performance**: <2s load time non-negotiable

### Dependencies
- **External Services**: Cloudflare (Workers, R2, D1)
- **Build Tools**: Node.js 18+, pnpm/npm
- **Design Assets**: Font files (if custom fonts used)
- **Content**: Initial project content/images from designer

## Risks & Edge Cases

1. **Font Licensing**: Custom fonts may not be available/licensed
   - **Mitigation**: Prepare fallback font stack

2. **Cloudflare Limits**: Free tier has request/storage limits
   - **Mitigation**: Document limits, add monitoring

3. **Image Optimization**: Large project images could slow performance
   - **Mitigation**: Next.js Image component + R2 with Cloudflare CDN

4. **CMS Complexity**: Payload may have learning curve
   - **Mitigation**: Create documentation, simple initial schema

5. **Carousel Performance**: Auto-scroll animations could be janky
   - **Mitigation**: Use CSS transforms, requestAnimationFrame, Framer Motion

6. **Mobile Carousels**: Touch gestures need careful implementation
   - **Mitigation**: Use proven library or thorough testing

## Readiness Assessment

- ✅ Goal and target user clearly stated
- ✅ Primary flows identified (5 core flows)
- ⚠️ Key constraints captured (awaiting font licensing answer)
- ✅ Success criteria defined
- ✅ Non-goals listed to bound scope
- ⚠️ Open questions enumerated (10 questions blocking detailed implementation)
- ✅ Facts sourced from Figma, brief, and context doc

**Ready for PRD**: **YES** ✅

All questions answered. Key decisions:
- GitHub repo to be created
- Cloudflare setup guidance needed
- OAuth authentication for CMS
- Google Fonts only (Instrument Sans + Geist Mono)
- Striker project as initial template
- Infinite auto-scroll carousels
- Smooth scroll navigation
- Fullscreen case study takeovers
- Full SEO optimization
- E2E testing with Playwright

---

## Next Steps — CONFIRMED

Ready to proceed with:
1. ✅ Project structure setup (Next.js 14 + Payload CMS)
2. ✅ Design system implementation (CSS variables from Figma)
3. ✅ Core components (NavHeader, Carousel, CaseStudy cards)
4. ✅ CMS schema and collections
5. ✅ Cloudflare deployment configuration
6. ✅ E2E test setup
7. ✅ Striker template project population
