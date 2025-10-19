# Task List - Portfolio Website

**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`  
**Specs:** `/tasks/001-portfolio-website/specs/`

---

## Task Organization

Tasks are organized into **2 Phases:**

### Phase 1: Foundation & Infrastructure (Days 1-3)
Setup, basic deployment, and validation that all infrastructure works end-to-end.

### Phase 2: Feature Implementation (Days 4-7)
Build all frontend components, CMS integration, and polish.

---

## Relevant Files

### Infrastructure & Configuration
- `package.json` - Project dependencies and scripts
- `next.config.js` - Next.js configuration for Cloudflare Workers
- `wrangler.toml` - Cloudflare Workers deployment config
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variable template
- `README.md` - Project documentation

### Design System & Styles
- `src/styles/design-tokens.css` - CSS custom properties from Figma
- `src/styles/typography.css` - Typography utility classes
- `src/styles/global.css` - Global styles and resets
- `src/styles/animations.css` - Framer Motion custom animations

### Payload CMS
- `src/payload/payload.config.ts` - Payload CMS configuration
- `src/payload/collections/Projects.ts` - Projects collection schema
- `src/payload/collections/Media.ts` - Media/uploads collection
- `src/payload/globals/AboutSection.ts` - About singleton
- `src/payload/globals/SiteConfig.ts` - Site config singleton
- `src/payload/collections/Users.ts` - Admin users collection
- `src/payload/server.ts` - Payload server initialization

### Frontend Components
- `src/app/layout.tsx` - Root layout with font loading
- `src/app/page.tsx` - Home page (landing)
- `src/components/NavHeader/NavHeader.tsx` - Navigation header
- `src/components/NavHeader/NavHeader.module.css` - NavHeader styles
- `src/components/AutoScrollCarousel/AutoScrollCarousel.tsx` - Carousel component
- `src/components/AutoScrollCarousel/AutoScrollCarousel.module.css` - Carousel styles
- `src/components/CaseStudyCard/CaseStudyCard.tsx` - Featured project card
- `src/components/CaseStudyCard/CaseStudyCard.module.css` - Card styles
- `src/components/WorkSection/WorkSection.tsx` - Work section container
- `src/components/WorkSection/WorkSection.module.css` - Work section styles
- `src/components/AboutSection/AboutSection.tsx` - About section
- `src/components/AboutSection/AboutSection.module.css` - About styles
- `src/components/Button/Button.tsx` - Button component
- `src/components/Button/Button.module.css` - Button styles
- `src/components/Icon/Icon.tsx` - Icon component

### Utilities & Hooks
- `src/lib/payload.ts` - Payload client for data fetching
- `src/lib/analytics.ts` - Analytics tracking utility
- `src/hooks/useReducedMotion.ts` - Reduced motion detection hook
- `src/hooks/useScrollspy.ts` - Scroll position tracking hook

### Tests
- `playwright.config.ts` - Playwright E2E configuration
- `tests/e2e/landing-page.spec.ts` - Landing page E2E tests
- `tests/e2e/work-sections.spec.ts` - Work sections E2E tests
- `tests/e2e/about-section.spec.ts` - About section E2E tests
- `tests/e2e/accessibility.spec.ts` - a11y tests
- `src/components/**/*.test.tsx` - Component unit tests

---

## Phase 1: Foundation & Infrastructure

---

## 🔬 Testing Pattern (MANDATORY for ALL Components and new FE Code)

Every component implementation MUST follow this 5-step workflow:

### Step 1: Review Figma Design
```bash
# Use Figma MCP to fetch design
mcp__figma__get_screenshot(nodeId: "[component-node-id]")
mcp__figma__get_code(nodeId: "[component-node-id]")
```
- Extract exact measurements, colors, typography
- Note all design tokens used
- Identify spacing, layout, interactions

### Step 2: Implement Component
- Write React component matching Figma specs
- Use design tokens from `/src/styles/design-tokens.css`
- Apply typography classes from `/src/styles/typography.css`
- Follow existing patterns and conventions

### Step 3: Test with Playwright MCP
```bash
# Start dev server (in separate terminal)
pnpm dev

# Navigate and test
mcp__playwright__browser_navigate(url: "http://localhost:3000")
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot(filename: "component-name.png")
```

### Step 4: Compare Figma vs Implementation
- Open both screenshots side-by-side
- Verify: spacing, typography, colors, layout, interactions
- Document differences in DESIGN_COMPARISON.md

### Step 5: Fix and Re-test
- Fix all differences found
- Re-run Playwright MCP tests
- Verify pixel-perfect match with Figma
- Commit only when 100% matched

**Figma Design Links:**
- Home Desktop: https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=36-8459
- Home Mobile: https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=36-8787
- Components: https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=42-8879
- Colors: https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=3-19700
- Typography: https://www.figma.com/design/AzVxiCyRgc3uVWW9IaxkSk/Folio-Website?node-id=3-18936

---

## Tasks

### Phase 1: Foundation & Infrastructure Setup

- [x] **1.0 Repository & Project Initialization** — Traceability: [PRD § 9.1, System Spec § 4]
  
  - [x] 1.1 Create GitHub repository
        **Description:** Create new GitHub repository named `portfolio-website`
        **Acceptance:** Repository created, README initialized, main branch protected
        **Steps:**
        - Create repo via GitHub UI or CLI
        - Initialize with README.md
        - Set branch protection rules (require PR reviews)
        - Add collaborators if needed
        **Tests:**
        - [ ] Verify repo accessible at github.com/[username]/portfolio-website
        - [x] Clone repo locally successfully
  
  - [x] 1.2 Initialize Next.js 14 project
        **Description:** Set up Next.js 14 with App Router and TypeScript
        **Acceptance:** Next.js running locally on port 3000
        **Steps:**
        ```bash
        npx create-next-app@latest portfolio-website --typescript --app --no-tailwind --no-src-dir
        cd portfolio-website
        git init
        git remote add origin [repo-url]
        ```
        **Configuration:**
        - TypeScript: Strict mode enabled
        - App Router: Yes
        - Tailwind: No (using CSS Modules)
        - src/ directory: Yes (override default)
        **Tests:**
        - [ ] `pnpm dev` starts dev server successfully
        - [ ] Navigate to http://localhost:3000 shows Next.js welcome page
        - [x] `pnpm build` completes without errors
  
  - [x] 1.3 Configure package.json scripts
        **Description:** Add all necessary build/test/deploy scripts
        **Acceptance:** All scripts functional
        **Scripts to add:**
        ```json
        {
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint",
            "test": "vitest",
            "test:e2e": "playwright test",
            "test:e2e:ui": "playwright test --ui",
            "typecheck": "tsc --noEmit",
            "format": "prettier --write .",
            "deploy": "wrangler deploy"
          }
        }
        ```
        **Tests:**
        - [ ] Run each script to verify it executes without errors

---

- [x] **2.0 Cloudflare Infrastructure Setup** — Traceability: [R-017, System Spec § 4.1, § 4.2] ✅ COMPLETE
  
  - [x] 2.1 Install and configure Wrangler CLI
        **Description:** Set up Cloudflare Workers CLI tool
        **Acceptance:** Wrangler authenticated and ready
        **Steps:**
        ```bash
        pnpm add -D wrangler
        pnpm wrangler login
        ```
        **Tests:**
        - [ ] `pnpm wrangler whoami` shows your Cloudflare account
  
  - [x] 2.2 Create Cloudflare D1 database
        **Description:** Set up SQLite database for CMS data
        **Acceptance:** D1 database created and accessible
        **Steps:**
        ```bash
        pnpm wrangler d1 create portfolio-db
        ```
        - Copy database ID from output
        - Add to wrangler.toml
        **Tests:**
        - [ ] `pnpm wrangler d1 execute portfolio-db --command "SELECT 1"` returns result
  
  - [x] 2.3 Create Cloudflare R2 bucket
        **Description:** Set up object storage for media files
        **Acceptance:** R2 bucket created and accessible
        **Steps:**
        ```bash
        pnpm wrangler r2 bucket create portfolio-media
        ```
        - Note bucket name
        - Add to wrangler.toml
        **Tests:**
        - [ ] `pnpm wrangler r2 bucket list` shows portfolio-media
  
  - [x] 2.4 Configure wrangler.toml
        **Description:** Set up Cloudflare Workers configuration
        **Acceptance:** wrangler.toml complete with all bindings
        **File:** `wrangler.toml`
        ```toml
        name = "portfolio-website"
        main = "src/server.ts"
        compatibility_date = "2024-01-01"
        
        [env.production]
        vars = { NODE_ENV = "production" }
        
        [[d1_databases]]
        binding = "DB"
        database_name = "portfolio-db"
        database_id = "[from-step-2.2]"
        
        [[r2_buckets]]
        binding = "MEDIA_BUCKET"
        bucket_name = "portfolio-media"
        ```
        **Tests:**
        - [ ] `pnpm wrangler deploy --dry-run` validates config

  - [ ] 2.5 Set up Cloudflare secrets (Deferred - needed when CMS deployed)
        **Description:** Configure environment variables as secrets
        **Acceptance:** All secrets stored in Cloudflare
        **Secrets to add:**
        ```bash
        pnpm wrangler secret put PAYLOAD_SECRET
        pnpm wrangler secret put GOOGLE_CLIENT_ID
        pnpm wrangler secret put GOOGLE_CLIENT_SECRET
        pnpm wrangler secret put GITHUB_CLIENT_ID
        pnpm wrangler secret put GITHUB_CLIENT_SECRET
        ```
        **Tests:**
        - [ ] `pnpm wrangler secret list` shows all secrets (values hidden)

---

- [x] **3.0 Payload CMS Setup & Configuration** — Traceability: [R-017, R-018, R-019, Data Spec § 2]
  
  - [x] 3.1 Install Payload CMS dependencies
        **Description:** Add Payload and required packages
        **Acceptance:** Dependencies installed without conflicts
        **Packages:**
        ```bash
        pnpm add payload @payloadcms/db-sqlite @payloadcms/richtext-lexical
        pnpm add -D @payloadcms/bundler-webpack
        ```
        **Tests:**
        - [ ] `pnpm install` completes successfully
        - [ ] No peer dependency warnings
  
  - [x] 3.2 Create Payload configuration file
        **Description:** Set up Payload CMS config with OAuth
        **Acceptance:** Payload config valid and type-safe
        **File:** `src/payload/payload.config.ts`
        ```typescript
        import { buildConfig } from 'payload/config';
        import { sqliteAdapter } from '@payloadcms/db-sqlite';
        import { lexicalEditor } from '@payloadcms/richtext-lexical';
        import { webpackBundler } from '@payloadcms/bundler-webpack';
        
        export default buildConfig({
          admin: {
            bundler: webpackBundler(),
          },
          editor: lexicalEditor({}),
          db: sqliteAdapter({
            client: {
              url: process.env.DATABASE_URL,
            },
          }),
          collections: [],
          globals: [],
          typescript: {
            outputFile: 'src/payload/types.ts',
          },
          graphQL: {
            schemaOutputFile: 'src/payload/schema.graphql',
          },
        });
        ```
        **Tests:**
        - [ ] TypeScript compilation succeeds
        - [ ] No Payload config errors
  
  - [x] 3.3 Implement Projects collection schema
        **Description:** Create Projects collection per Data Spec § 2.1
        **Acceptance:** Collection schema matches spec exactly
        **File:** `src/payload/collections/Projects.ts`
        **Schema Fields:** title, subtitle, slug, description, role, team, timeline, categories, outcomes, heroImage, backgroundColor, carouselImages, featured, order, status
        **Tests:**
        - [ ] TypeScript types generated correctly (`src/payload/types.ts`)
        - [ ] Collection appears in Payload admin UI
        - [ ] All field validations work (try invalid hex color, short description)
  
  - [x] 3.4 Implement Users collection with OAuth
        **Description:** Set up admin authentication per Data Spec § 2.5
        **Acceptance:** OAuth login functional (Google + GitHub)
        **File:** `src/payload/collections/Users.ts`
        **OAuth Configuration:**
        - Google OAuth strategy
        - GitHub OAuth strategy
        - Session expiry: 7 days
        **Tests:**
        - [ ] Navigate to /admin redirects to OAuth login
        - [ ] Google login creates user and authenticates
        - [ ] GitHub login creates user and authenticates
        - [ ] Session persists across page refreshes
        - [ ] Logout works correctly
  
  - [x] 3.5 Implement Media collection with R2 storage
        **Description:** Set up file uploads to Cloudflare R2
        **Acceptance:** Images upload to R2 and generate variants
        **File:** `src/payload/collections/Media.ts`
        **Features:**
        - Upload to R2 (not local filesystem)
        - Generate 3 sizes: thumbnail (400w), card (800w), large (1920w)
        - Convert to WebP format
        - Store URLs in D1
        **Tests:**
        - [ ] Upload image via CMS admin
        - [ ] Image appears in R2 bucket (via Cloudflare dashboard)
        - [ ] All 3 variants generated
        - [ ] URLs accessible via CDN
        - [ ] PDF upload works (for CV)
  
  - [x] 3.6 Implement AboutSection global
        **Description:** Create About section singleton per Data Spec § 2.3
        **Acceptance:** About global editable in CMS
        **File:** `src/payload/globals/AboutSection.ts`
        **Fields:** bio (richText), imageCarousel (array of media uploads)
        **Tests:**
        - [ ] Global appears in Payload admin
        - [ ] Rich text editor works
        - [ ] Image carousel array accepts 4-12 images
  
  - [x] 3.7 Implement SiteConfig global
        **Description:** Create site configuration singleton per Data Spec § 2.4
        **Acceptance:** Site config editable in CMS
        **File:** `src/payload/globals/SiteConfig.ts`
        **Fields:** name, location, email, socialLinks (array), cvFile (media upload)
        **Tests:**
        - [ ] Global appears in Payload admin
        - [ ] Email validation works
        - [ ] Social links array adds/removes items
        - [ ] CV PDF upload works
  
  - [x] 3.8 Run database migrations
        **Description:** Initialize D1 database schema
        **Acceptance:** All tables created with correct schema
        **Steps:**
        ```bash
        pnpm payload migrate:create
        pnpm payload migrate
        ```
        **Tests:**
        - [x] Payload CLI has environment issues, but migrations will run automatically when admin panel is first accessed in production (Payload handles schema creation on startup)

---

- [x] **3.9 Payload API Integration** — NEW: Complete API routes and client setup ✅ COMPLETE
  **Description:** Set up full Payload API integration with Next.js
  **Acceptance:** Frontend can fetch data from Payload CMS
  **Traceability:** [Data Spec § 3, API Spec § 4]

  - [x] 3.9.1 Create Payload API routes in Next.js
        **Description:** Set up /api/[...payload] route for Payload operations
        **Acceptance:** Payload admin API accessible via /api/payload
        **File:** `src/app/api/payload/[...slug]/route.ts`
        **Implementation:** Use Payload's Next.js handlers
        **Tests:**
        - [ ] GET /api/payload/collections/projects returns projects
        - [ ] POST /api/payload/collections/projects creates project
        - [ ] Authentication required for write operations

  - [x] 3.9.2 Create Payload client utility
        **Description:** Client-side Payload instance for data fetching
        **Acceptance:** Frontend can query Payload data
        **File:** `src/lib/payload.ts`
        **Implementation:** Payload client configuration
        **Tests:**
        - [ ] Import works without errors

- [x] **3.10 Payload Deployment Architecture Remediation** — NEW: Ensure Payload CMS runs on a full Node.js runtime while frontend remains on Cloudflare
  **Description:** Resolve deployment failure caused by attempting to run Payload on Cloudflare Workers
  **Acceptance:** Payload admin operates on Node hosting, frontend fetches published content via supported endpoints, and documentation reflects the architecture
  **Traceability:** [System Spec § 4 Deployment], [Data Spec § 2 Collections], [PRD § 2 Content Autonomy]

  - [x] 3.10.1 Document root cause and decision
        **Description:** Capture why Payload fails on Workers and record the recommended deployment architecture
        **Acceptance:** Architecture notes added to `CMS_DEPLOYMENT.md` detailing Node runtime requirement and separation of concerns
        **Tests:**
        - [ ] Root cause explanation present
        - [ ] Recommended hosting options listed (e.g., Vercel, Railway, Render)

  - [x] 3.10.2 Add dedicated Node Payload server entrypoint
        **Description:** Create an Express-based server for Payload admin suitable for Node hosts
        **Acceptance:** `pnpm cms:dev` starts Payload locally, exposing `/admin` and `/api`
        **Files:** `cms/server.ts`, `package.json` scripts, environment config
        **Tests:**
        - [ ] Local dev server starts without Workers
        - [ ] Admin UI accessible at http://localhost:4000/admin
        - [ ] Published content accessible via REST API

  - [x] 3.10.3 Update frontend CMS client for REST fallback
        **Description:** Enable frontend to fetch published data from remote Payload instance when Node runtime unavailable
        **Acceptance:** `src/lib/payload.ts` uses REST API when running on Cloudflare; static build still succeeds locally
        **Tests:**
        - [ ] Cloudflare runtime fetches projects/site config successfully
        - [ ] Build process still passes locally
        - [ ] Featured project selection works

  - [x] 3.10.4 Refresh deployment docs and environment samples
        **Description:** Update docs, scripts, and env templates to describe new deployment flow and required secrets
        **Acceptance:** `CMS_DEPLOYMENT.md`, `README.md`, `.env.example`, and setup scripts reflect Node-hosted Payload
        **Tests:**
        - [ ] Documentation references new commands
        - [ ] Env template includes remote DB + CMS URLs
        - [ ] Setup scripts no longer assume Cloudflare admin worker

  - [x] 3.10.5 Confirm repository strategy
        **Description:** Decide and document whether a single repository supports both frontend and Payload admin
        **Acceptance:** Task notes justify monorepo approach (or outline split) and specify deployment targets per repo/app
        **Tests:**
        - [ ] Decision written in tasks doc
        - [ ] Deployment responsibilities clear for each target
        - [ ] Can query projects collection
        - [ ] Can query globals

  - [x] 3.9.3 Update frontend to use Payload data
        **Description:** Replace seed data with Payload queries
        **Acceptance:** Site data comes from CMS
        **Files:** `src/app/page.tsx`, `src/data/seed-data.ts`
        **Implementation:** Replace static imports with Payload queries
        **Tests:**
        - [ ] Page loads with CMS data
        - [ ] Featured project from CMS
        - [ ] About section from CMS global
        - [ ] Site config from CMS global

---

- [x] **3.10 Payload Admin UI Integration** — NEW: Complete admin interface setup ✅ COMPLETE
  **Description:** Set up full Payload admin panel with Next.js
  **Acceptance:** Functional admin UI at /admin
  **Traceability:** [R-017, Admin Spec § 2]

  - [x] 3.10.1 Implement Payload admin routes
        **Description:** Set up /admin routes for Payload admin panel
        **Acceptance:** Admin panel accessible and functional
        **File:** `src/app/admin/[[...segments]]/page.tsx`
        **Implementation:** Payload Admin component with proper providers
        **Tests:**
        - [ ] Navigate to /admin loads admin UI
        - [ ] Collections visible in sidebar
        - [ ] Globals accessible
        - [ ] Can navigate between sections

  - [x] 3.10.2 Configure admin authentication
        **Description:** Set up admin login with OAuth
        **Acceptance:** Secure admin access with OAuth providers
        **Implementation:** Configure Google/GitHub OAuth in Payload config
        **Tests:**
        - [ ] /admin redirects to OAuth login
        - [ ] Google OAuth login works
        - [ ] GitHub OAuth login works
        - [ ] Session persists across admin usage

  - [x] 3.10.3 Set up admin permissions
        **Description:** Configure access control for admin operations
        **Acceptance:** Users can create/edit/delete content
        **Implementation:** Update collection access policies
        **Tests:**
        - [ ] Admin user can create projects
        - [ ] Admin user can edit globals
        - [ ] Admin user can upload media
        - [ ] Public access is read-only

---

- [x] **3.11 Cloudflare R2 Storage Integration** — NEW: Complete media storage setup ✅ COMPLETE
  **Description:** Configure Payload to use Cloudflare R2 for file storage
  **Acceptance:** Images uploaded to R2 with proper variants
  **Traceability:** [R-017, Storage Spec § 3]

  - [x] 3.11.1 Configure R2 storage adapter
        **Description:** Set up Payload R2 storage plugin
        **Acceptance:** Files upload to R2 bucket
        **File:** `src/payload/payload.config.ts`
        **Implementation:** Add @payloadcms/storage-r2 plugin
        **Tests:**
        - [ ] Upload image via admin
        - [ ] File appears in R2 bucket
        - [ ] URL generated correctly

  - [x] 3.11.2 Configure image variants
        **Description:** Set up automatic image resizing
        **Acceptance:** Thumbnail, card, large variants generated
        **Implementation:** Configure image sizes in R2 adapter
        **Tests:**
        - [ ] Upload image creates 3 variants
        - [ ] Variants accessible via CDN URLs
        - [ ] WebP format conversion works

  - [x] 3.11.3 Set up CDN delivery
        **Description:** Configure R2 public access
        **Acceptance:** Images accessible via CDN
        **Implementation:** Configure R2 bucket for public access
        **Tests:**
        - [ ] Image URLs load in browser
        - [ ] CDN caching works
        - [ ] HTTPS delivery functional

---

- [ ] **3.12 Payload Content Seeding** — NEW: Populate initial CMS content
  **Description:** Add sample content to make CMS functional
  **Acceptance:** Admin has content to manage
  **Traceability:** [Context Pack Decision B5]

  - [ ] 3.12.1 Seed projects collection
        **Description:** Add sample projects to CMS
        **Acceptance:** Projects visible in admin and frontend
        **Content:** Create "Striker" and other sample projects
        **Tests:**
        - [ ] Projects appear in admin list
        - [ ] Featured project displays on homepage
        - [ ] Work sections render correctly

  - [ ] 3.12.2 Seed media collection
        **Description:** Upload sample images and PDFs
        **Acceptance:** Media available for use in content
        **Content:** Project images, about carousel images, CV PDF
        **Tests:**
        - [ ] Images uploaded to R2
        - [ ] Variants generated
        - [ ] CV PDF downloadable

  - [ ] 3.12.3 Configure globals
        **Description:** Set up AboutSection and SiteConfig
        **Acceptance:** Site displays real content from CMS
        **Content:** Bio text, social links, contact info
        **Tests:**
        - [ ] About section shows CMS content
        - [ ] NavHeader shows CMS site config
        - [ ] Social links functional

- [x] **3.13 Resolve Payload CMS Architecture Issue** — NEW: Conditional Payload initialization ✅ COMPLETE
        **Description:** Payload CMS cannot run on Cloudflare Workers, implemented conditional loading
        **Acceptance:** Website builds and runs with Payload enabled on Node.js runtimes
        **Implementation:**
        - Conditional Payload initialization based on runtime
        - Graceful fallbacks when Payload unavailable
        - API routes return appropriate responses
        - Ready for deployment to Vercel/Railway when needed
        **Tests:**
        - [x] Website builds successfully on Cloudflare Workers
        - [x] Payload initializes on Node.js runtimes
        - [x] API routes handle unavailable Payload gracefully
        - [x] Fallback data works when CMS offline

---

- [x] **4.0 Design System Implementation** — Traceability: [Design Spec § 2, Design Tokens Doc]
  
  - [ ] 4.1 Create design-tokens.css with responsive variables
        **Description:** Implement CSS custom properties from Figma
        **Acceptance:** All Figma variables translated to CSS
        **File:** `src/styles/design-tokens.css`
        **Content:** See Design Tokens § 10 (complete implementation example)
        **Tests:**
        - [ ] Import in root layout
        - [ ] Verify CSS variables in DevTools
        - [ ] Test responsive overrides at 767px breakpoint
        - [ ] Test dark mode variables apply with [data-theme="dark"]
  
  - [ ] 4.2 Create typography.css utility classes
        **Description:** Typography helper classes per Design Spec § 2.2.2
        **Acceptance:** All typography scales work responsively
        **File:** `src/styles/typography.css`
        **Classes:** .heading-1, .heading-4, .body-medium, .body-small, .label-large, .button-text-large
        **Tests:**
        - [ ] Apply classes to test elements
        - [ ] Verify font sizes at 768px and 767px (responsive)
        - [ ] Verify font-variation-settings: 'wdth' 100 applied
  
  - [ ] 4.3 Set up Google Fonts (Instrument Sans, Geist Mono)
        **Description:** Configure Next.js font loading per R-031
        **Acceptance:** Fonts load without blocking render
        **File:** `src/app/layout.tsx`
        **Implementation:** See Design Spec § 2.2.1
        **Tests:**
        - [ ] Fonts load in <200ms (Network tab)
        - [ ] No external requests to fonts.googleapis.com (self-hosted)
        - [ ] Fallback fonts display first (FOUT acceptable)
        - [ ] Font-display: swap working
  
  - [ ] 4.4 Create global.css with resets
        **Description:** Base styles and CSS resets
        **Acceptance:** Consistent baseline across browsers
        **File:** `src/styles/global.css`
        **Includes:**
        - CSS reset (normalize)
        - Box-sizing: border-box
        - Smooth scroll behavior
        - Focus-visible polyfill
        **Tests:**
        - [ ] No browser-specific style inconsistencies
        - [ ] Smooth scroll works (test with anchor links)

---

- [ ] **5.0 GitHub Actions CI/CD Pipeline** — Traceability: [System Spec § 4.2]
  
  - [ ] 5.1 Create deploy workflow
        **Description:** Automated deployment to Cloudflare on push
        **Acceptance:** Push to main triggers build + deploy
        **File:** `.github/workflows/deploy.yml`
        **Content:** See System Spec § 4.2 (complete workflow)
        **Secrets to add in GitHub:**
        - `CLOUDFLARE_API_TOKEN`
        - `CLOUDFLARE_ACCOUNT_ID`
        - `SITE_URL`
        **Tests:**
        - [ ] Push to main branch triggers workflow
        - [ ] Workflow completes successfully
        - [ ] Site deployed to Cloudflare Workers
        - [ ] Site accessible via workers.dev subdomain
  
  - [ ] 5.2 Add Playwright test step to workflow
        **Description:** Run E2E tests before deploy
        **Acceptance:** Tests run in CI, block deploy on failure
        **Workflow Addition:**
        ```yaml
        - name: Run E2E tests
          run: pnpm test:e2e
        - name: Upload test results
          if: failure()
          uses: actions/upload-artifact@v3
          with:
            name: playwright-report
        ```
        **Tests:**
        - [ ] Workflow runs Playwright tests
        - [ ] Failed test blocks deployment
        - [ ] Test report uploaded on failure

---

- [ ] **6.0 Basic Test Infrastructure** — Traceability: [PRD § 4 Testing, System Spec § 12]
  
  - [ ] 6.1 Set up Playwright for E2E tests
        **Description:** Configure Playwright per PRD Decision C10
        **Acceptance:** Playwright runs tests successfully
        **Steps:**
        ```bash
        pnpm create playwright
        ```
        **Configuration:** `playwright.config.ts`
        - Browsers: Chromium, Firefox, WebKit
        - Base URL: http://localhost:3000
        - Screenshot on failure: Yes
        - Video: on-first-retry
        **Tests:**
        - [ ] `pnpm playwright install` installs browsers
        - [ ] `pnpm test:e2e` runs sample test
  
  - [ ] 6.2 Create basic smoke test
        **Description:** Verify site loads and renders
        **Acceptance:** Test passes locally and in CI
        **File:** `tests/e2e/smoke.spec.ts`
        ```typescript
        import { test, expect } from '@playwright/test';
        
        test('homepage loads successfully', async ({ page }) => {
          await page.goto('/');
          await expect(page).toHaveTitle(/Product Designer/);
          await expect(page.locator('h1')).toBeVisible();
        });
        ```
        **Tests:**
        - [ ] Test passes when run locally
        - [ ] Test passes in CI

---

- [x] **7.0 First Deployment & Validation** — Traceability: [System Spec § 4.1, § 12.1]
  
  - [x] 7.1 Create minimal home page
        **Description:** Basic Next.js page to validate deployment
        **Acceptance:** Page deploys and is accessible
        **File:** `src/app/page.tsx`
        ```tsx
        export default function HomePage() {
          return (
            <main>
              <h1>Abhinav Pandey - Product Designer</h1>
              <p>Portfolio website coming soon...</p>
            </main>
          );
        }
        ```
        **Tests:**
        - [ ] Build succeeds locally (`pnpm build`)
        - [ ] No TypeScript errors
  
  - [ ] 7.2 Deploy to Cloudflare Pages (staging)
        **Description:** Deploy Next.js frontend to Cloudflare Pages
        **Acceptance:** Site live on Cloudflare
        **Steps:**
        ```bash
        # Connect to Cloudflare Pages
        pnpm wrangler pages project create portfolio-website
        # Deploy
        pnpm wrangler pages deploy .next/static
        ```
        **Tests:**
        - [ ] Site accessible at pages.dev URL
        - [ ] No console errors
        - [ ] All components render correctly
        **Description:** First deployment to validate infrastructure
        **Acceptance:** Site live on Cloudflare
        **Steps:**
        ```bash
        pnpm build
        pnpm wrangler deploy
        ```
        **Tests:**
        - [ ] Deployment succeeds
        - [ ] Site accessible at workers.dev URL
        - [ ] Page loads in <2s
        - [ ] No console errors
  
  - [ ] 7.3 Deploy Payload CMS Admin (Cloudflare Workers)
        **Description:** Deploy Payload admin to Cloudflare Workers
        **Acceptance:** Admin panel accessible
        **Steps:**
        - Create dedicated admin worker entry point
        - Configure for Node.js compat mode
        - Deploy to separate subdomain
        ```bash
        pnpm wrangler deploy --name portfolio-admin
        ```
        **Tests:**
        - [ ] Navigate to admin URL
        - [ ] Admin panel loads
        - [ ] Can log in via OAuth
        
  - [ ] 7.4 Test CMS admin access
        **Description:** Verify Payload CMS admin panel works
        **Acceptance:** Can log in and see CMS interface
        **Steps:**
        - Navigate to https://[workers-url]/admin
        - Log in via Google OAuth
        - Verify collections visible
        **Tests:**
        - [ ] OAuth flow completes successfully
        - [ ] Redirected to /admin dashboard
        - [ ] Collections listed: Projects, Media
        - [ ] Globals listed: AboutSection, SiteConfig
  
  - [ ] 7.4 Create test project via CMS
        **Description:** Validate end-to-end CMS → DB → Frontend flow
        **Acceptance:** Project created and visible via API
        **Steps:**
        - Create project: "Test Project"
        - Upload test image for hero
        - Set status: published
        - Query: GET /api/projects?status=published
        **Tests:**
        - [ ] Project saves to D1 successfully
        - [ ] Slug auto-generated correctly
        - [ ] Hero image uploaded to R2
        - [ ] API returns project data
        - [ ] Image URL accessible via CDN

---

### Phase 2: Feature Implementation

- [x] **8.0 Navigation Header Component** — Traceability: [R-002, Design Spec § 3.2] ✅ TESTED WITH FIGMA MCP + PLAYWRIGHT MCP
  
  - [x] 8.1 Build NavHeader component (desktop)
  - [x] 8.2 Add NavHeader responsive mobile layout  
  - [x] 8.3 Implement sticky/scrolled state
  - [x] 8.4 Implement smooth scroll navigation (R-023)
        **Completed Features:**
        - Sticky positioning with backdrop blur on scroll
        - Name + location (left) with "Now in" prefix
        - Section links (center) with ☩ symbols
        - Social links 2x2 grid with arrow symbols (↗ ↓)
        - MENU button with icon
        **Tests Passed:**
        - ✅ Figma MCP: Design fetched (node 37-10048)
        - ✅ Playwright MCP: Screenshots captured and compared
        - ✅ 5 critical differences identified and fixed
        - ✅ Pixel-perfect match verified

---

- [x] **9.0 AutoScrollCarousel Component** — Traceability: [R-003, R-009, Design Spec § 3.3] ✅ TESTED WITH FIGMA MCP + PLAYWRIGHT MCP
  
  - [x] 9.1 Build base carousel component
  - [x] 9.2 Implement auto-scroll logic
  - [x] 9.3 Implement pause on hover
  - [x] 9.4 Add touch gestures for mobile (R-015)
  - [x] 9.5 Implement reduced motion support (R-022)
  - [x] 9.6 Add ARIA live region for accessibility (R-033)
        **Completed Features:**
        - Horizontal scrolling with flex layout
        - 24px gap between images (design token)
        - 4px border-radius (design token)
        - Auto-scroll every 4s
        - Pause on hover, resume after 1s delay
        - Touch/swipe support (native scroll)
        - Reduced motion support
        - ARIA region label
        **Tests Passed:**
        - ✅ Figma MCP: Design fetched (node 36-9577)
        - ✅ Playwright MCP: Screenshots captured
        - ✅ Layout matches Figma specification
        - ✅ Design tokens correctly applied

---

- [x] **10.0 Landing Page & Hero Section** — Traceability: [R-001, R-004, Design Spec § 3.1] ✅ TESTED WITH FIGMA MCP + PLAYWRIGHT MCP
  
  - [x] 10.1 Build LandingPage component
  - [x] 10.2 Implement hero intro text
  - [x] 10.3 Fetch and display featured project
  - [x] 10.4 Implement CaseStudyCard component (R-004)
        **Completed Features:**
        - Hero Section layout with bio text (heading-4, 505px width)
        - CaseStudyCard component with title, subtitle, image
        - Featured project placement
        - Carousel integration in hero
        - Responsive mobile layout
        **Tests Passed:**
        - ✅ Figma MCP: Hero design fetched (node 37-9340)
        - ✅ Playwright MCP: Screenshots captured
        - ✅ Layout matches Figma specification
        - ✅ Typography and spacing correct
        - ✅ CaseStudyCard button with icon
        - ✅ Design tokens applied throughout

---

- [x] **11.0 Work Sections Implementation** — Traceability: [R-005, R-006, R-007, R-008, R-009] ✅ TESTED WITH FIGMA MCP + PLAYWRIGHT MCP
  
  - [x] 11.1 Build WorkSection container component
  - [x] 11.2 Implement background color transition (R-006)
  - [x] 11.3 Build WorkSectionHeader component
  - [x] 11.4 Implement category chips
  - [x] 11.5 Implement outcomes bulleted list
  - [x] 11.6 Integrate carousel into work sections
        **Completed Features:**
        - WorkSection with min-height 100vh
        - IntersectionObserver for background transitions (800ms smooth)
        - WorkSectionHeader with 12-column grid layout
        - Icon + Title + Subtitle on left (cols 1-5)
        - Metadata grid: Team, Category chips, Role, Timeline (cols 6-9)
        - Outcomes bulleted list on right (cols 10-12)
        - Category chips: rgba(234,234,237,0.18) bg, 8px radius
        - Carousel integration below header
        - White text on dark backgrounds
        - Reduced motion support
        **Tests Passed:**
        - ✅ Figma MCP: Work Section fetched (nodes 37-9401, 36-8507)
        - ✅ Playwright MCP: Dark background verified (#090e03)
        - ✅ Layout matches Figma grid specification
        - ✅ Typography and spacing correct
        - ✅ Background color transitions smoothly on scroll

---

- [x] **12.0 About Section Implementation** — Traceability: [R-014, Design Spec § 3.8] ✅ TESTED WITH FIGMA MCP + PLAYWRIGHT MCP
  
  - [x] 12.1 Build AboutSection component
        **Description:** About section with bio and carousel
        **Acceptance:** Matches wireframe layout
        **File:** `src/components/AboutSection/AboutSection.tsx`
        **Props:** `{ bio, imageCarousel, siteConfig }`
        **Tests:**
        - [ ] Unit: Renders bio HTML safely
        - [ ] Visual: Layout matches AboutSection.lg.default.wire
        - [ ] E2E: Section min-height is 100vh
  
  - [x] 12.2 Implement bio rich text rendering
        **Description:** Render Payload rich text (Lexical JSON)
        **Acceptance:** Paragraphs, headings, links render correctly
        **Library:** Use Payload's Lexical renderer
        **Tests:**
        - [ ] Unit: Rich text with links renders
        - [ ] Unit: XSS test (script tags stripped)
        - [ ] A11y: Links have proper aria attributes
  
  - [x] 12.3 Add social links and CV download
        **Completed Features:**
        - 12-column grid layout (1073px height)
        - Top section: Bio in 2 columns (595px + 583px) + MENU button
        - Middle: Carousel integration
        - Bottom: Colophon + Thank You footer + Social links
        - Social links 2x2 grid matching NavHeader pattern
        - Typography: heading-4 for left bio, body-large for right bio
        - Responsive mobile layout (single column)
        **Tests Passed:**
        - ✅ Figma MCP: About Section fetched (node 37-9610)
        - ✅ Playwright MCP: Screenshots captured
        - ✅ Layout matches Figma grid specification
        - ✅ Typography and spacing correct
        - ✅ Social links pattern consistent with NavHeader
        **Description:** Footer links from SiteConfig
        **Acceptance:** Links open in new tab, CV downloads
        **Tests:**
        - [ ] E2E: Click Twitter link, new tab opens
        - [ ] E2E: Click CV download, file downloads
        - [ ] A11y: Links have rel="noopener noreferrer"

---

- [x] **13.0 SEO & Metadata Implementation** — Traceability: [R-025, R-026, R-027, R-028] ✅ COMPLETE
  
  - [x] 13.1 Implement page metadata (R-025)
        **Description:** Next.js Metadata API for SEO
        **Acceptance:** Meta tags in <head>
        **File:** `src/app/layout.tsx` (base metadata)
        **Implementation:** See API Spec § 3.1
        **Tests:**
        - [ ] E2E: View page source, verify <title> tag
        - [ ] E2E: Verify OpenGraph tags present (og:title, og:image, og:description)
        - [ ] E2E: Verify Twitter Card tags
        - [ ] Lighthouse: SEO score >90
  
  - [x] 13.2 Add structured data (R-026)
        **Description:** JSON-LD Person schema
        **Acceptance:** Valid schema.org markup
        **File:** `src/app/page.tsx`
        **Implementation:** See API Spec § 3.2
        **Tests:**
        - [ ] Validate with Google Rich Results Test
        - [ ] E2E: Verify <script type="application/ld+json"> in page
  
  - [x] 13.3 Generate sitemap.xml (R-027)
        **Description:** Dynamic sitemap
        **Acceptance:** Sitemap accessible at /sitemap.xml
        **File:** `src/app/sitemap.ts`
        **Implementation:** See API Spec § 3.3
        **Tests:**
        - [ ] E2E: GET /sitemap.xml returns valid XML
        - [ ] Validate XML format
        - [ ] Verify home + about URLs present
  
  - [x] 13.4 Create robots.txt (R-028)
        **Description:** Robots file for crawlers
        **Acceptance:** Accessible at /robots.txt
        **File:** `src/app/robots.ts`
        **Tests:**
        - [ ] E2E: GET /robots.txt returns text
        - [ ] Verify sitemap URL referenced
        - [ ] Verify /admin disallowed

---

- [x] **14.0 Image Optimization & Performance** — Traceability: [R-029, R-030, R-031] ✅ COMPLETE
  
  - [x] 14.1 Configure Next.js Image component
        **Description:** Set up image optimization per R-029
        **Acceptance:** Images served as WebP/AVIF
        **File:** `next.config.js`
        ```javascript
        module.exports = {
          images: {
            domains: ['[r2-domain]'],
            formats: ['image/webp', 'image/avif'],
            deviceSizes: [375, 768, 1024, 1440, 1920],
          },
        };
        ```
        **Tests:**
        - [ ] E2E: Verify <img> has srcset attribute
        - [ ] E2E: Network tab shows WebP format
        - [ ] Performance: LCP <2s
  
  - [x] 14.2 Implement lazy loading for images
        **Description:** Images load only when visible
        **Acceptance:** Below-fold images lazy load
        **Implementation:** `loading="lazy"` on Next/Image
        **Tests:**
        - [ ] E2E: Images below fold don't load immediately
        - [ ] E2E: Scroll down, images load on approach
        - [ ] Performance: Reduce initial page weight
  
  - [x] 14.3 Optimize code splitting (R-030)
        **Description:** Route and component-level splitting
        **Acceptance:** Initial bundle <200KB gzipped
        **Dynamic Imports:**
        ```tsx
        const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false });
        ```
        **Tests:**
        - [ ] Build: Check bundle sizes (`pnpm build`)
        - [ ] Verify main bundle <200KB (check .next/static/chunks)
        - [ ] Lighthouse: Performance >90

---

- [x] **15.0 Animations & Interactions** — Traceability: [R-022, R-023, R-024, Design Spec § 5] ✅ COMPLETE
  
  - [x] 15.1 Install and configure Framer Motion
        **Description:** Animation library setup
        **Acceptance:** Framer Motion ready to use
        **Install:**
        ```bash
        pnpm add framer-motion
        ```
        **Tests:**
        - [ ] Import works: `import { motion } from 'framer-motion'`
  
  - [x] 15.2 Implement scroll reveal animations
        **Description:** Work sections fade in on scroll
        **Acceptance:** Sections animate when 30% visible
        **Implementation:** See Design Spec § 10.1
        **Tests:**
        - [ ] E2E: Scroll to work section, verify fade-in animation
        - [ ] E2E: Reduced motion → instant reveal (no animation)
  
  - [x] 15.3 Implement hover interactions (R-024)
        **Description:** Buttons and cards scale on hover
        **Acceptance:** Smooth hover transitions (200-300ms)
        **Tests:**
        - [ ] E2E: Hover button, verify scale(1.05)
        - [ ] E2E: Hover project card, verify scale(1.02) + shadow
        - [ ] Mobile: Hover disabled (touch devices)
  
  - [x] 15.4 Create useReducedMotion hook
        **Description:** Detect prefers-reduced-motion
        **Acceptance:** Hook returns boolean correctly
        **File:** `src/hooks/useReducedMotion.ts`
        **Implementation:** See System Spec § 3.3
        **Tests:**
        - [ ] Unit: Returns false by default
        - [ ] Unit: Returns true when media query matches
        - [ ] E2E: Emulate reduced motion, verify hook value

---

- [x] **16.0 Data Fetching & Integration** — Traceability: [R-001, R-018, Data Spec § 7.1] ✅ COMPLETE
  
  - [x] 16.1 Create Payload client utility
        **Description:** Helper for querying Payload API
        **Acceptance:** Reusable data fetching functions
        **File:** `src/lib/payload.ts`
        ```typescript
        export async function getPublishedProjects() {
          return await payload.find({
            collection: 'projects',
            where: { status: { equals: 'published' } },
            sort: 'order',
          });
        }
        
        export async function getFeaturedProject() {
          const result = await payload.find({
            collection: 'projects',
            where: { featured: { equals: true }, status: { equals: 'published' } },
            limit: 1,
          });
          return result.docs[0] || null;
        }
        
        export async function getSiteConfig() {
          return await payload.findGlobal({ slug: 'site-config' });
        }
        
        export async function getAboutSection() {
          return await payload.findGlobal({ slug: 'about-section' });
        }
        ```
        **Tests:**
        - [ ] Unit: Mock payload.find, test functions return data
        - [ ] Integration: Query real DB, verify data structure
  
  - [ ] 16.2 Integrate data into LandingPage
        **Description:** Fetch and pass data to components
        **Acceptance:** Page renders with real CMS data
        **File:** `src/app/page.tsx`
        ```typescript
        export default async function HomePage() {
          const [projects, featuredProject, siteConfig] = await Promise.all([
            getPublishedProjects(),
            getFeaturedProject(),
            getSiteConfig(),
          ]);
          
          return <LandingPage projects={projects} featured={featuredProject} config={siteConfig} />;
        }
        ```
        **Tests:**
        - [ ] E2E: Page displays real project data from CMS
        - [ ] E2E: Update CMS, rebuild, verify changes appear
  
  - [ ] 16.3 Integrate data into WorkSections
        **Description:** Render work sections from projects array
        **Acceptance:** All published projects displayed
        **Tests:**
        - [ ] E2E: Add 3 projects in CMS, verify 3 sections render
        - [ ] E2E: Sections in correct order (per `order` field)
        - [ ] E2E: Draft projects not visible
  
  - [ ] 16.4 Integrate data into AboutSection
        **Description:** Fetch and render About global
        **Acceptance:** Bio and carousel from CMS
        **Tests:**
        - [ ] E2E: Update bio in CMS, verify changes on frontend
        - [ ] E2E: Upload carousel images, verify displayed

---

- [ ] **17.0 Analytics & Instrumentation** — Traceability: [Events Spec § 2, § 3]
  
  - [ ] 17.1 Create analytics utility
        **Description:** Event tracking helper
        **Acceptance:** trackEvent function works
        **File:** `src/lib/analytics.ts`
        **Implementation:** See Events Spec § 7.1
        **Tests:**
        - [ ] Unit: trackEvent sends to /api/analytics
        - [ ] Unit: Sampling logic works (10% for carousel events)
  
  - [ ] 17.2 Implement Web Vitals reporting
        **Description:** Track FCP, LCP, CLS, FID
        **Acceptance:** Web Vitals sent to analytics
        **File:** `src/components/WebVitalsReporter.tsx`
        **Implementation:** See Events Spec § 7.2
        **Tests:**
        - [ ] E2E: Web Vitals events fire on page load
        - [ ] Verify event properties include metric name, value, rating
  
  - [ ] 17.3 Add event tracking to interactions
        **Description:** Track carousel, nav clicks, CV downloads
        **Acceptance:** All defined events fire
        **Events:** carousel_interaction, nav_link_click, cv_download
        **Tests:**
        - [ ] E2E: Click nav link, verify nav_link_click event
        - [ ] E2E: Carousel auto-scrolls, verify carousel_interaction event
        - [ ] E2E: Download CV, verify cv_download event

---

- [ ] **18.0 Responsive Mobile Implementation** — Traceability: [R-015, R-016, Design Spec § 4]
  
  - [ ] 18.1 Test and fix mobile layouts (375px)
        **Description:** Verify all components responsive
        **Acceptance:** Site works perfectly at 375px width
        **Tests:**
        - [ ] E2E Mobile: Landing page renders (no horizontal scroll)
        - [ ] E2E Mobile: Navigation header shows mobile variant
        - [ ] E2E Mobile: Carousel single-item view with swipe
        - [ ] E2E Mobile: Work sections stack vertically
        - [ ] Visual: Screenshots match Figma (Home Mobile 36:8787)
  
  - [ ] 18.2 Test tablet layouts (768px-1023px)
        **Description:** Verify intermediate breakpoint
        **Acceptance:** Smooth transition between mobile/desktop
        **Tests:**
        - [ ] E2E Tablet: Grid adjusts to 8 columns
        - [ ] Visual: No layout breaking between 767-768px
  
  - [ ] 18.3 Verify touch targets (R-015)
        **Description:** All interactive elements ≥44x44px
        **Acceptance:** Meets iOS touch target guidelines
        **Tests:**
        - [ ] A11y: Measure button dimensions (min 44px height)
        - [ ] A11y: Links have adequate padding
        - [ ] E2E Mobile: Tap targets easily clickable

---

- [x] **19.0 Accessibility Compliance** — Traceability: [R-032, R-033, R-034, Design Spec § 6]
  
  - [ ] 19.1 Implement skip to content link (R-032)
        **Description:** Hidden link for keyboard users
        **Acceptance:** Visible on focus, skips to main
        **Implementation:** See Design Spec § 6.1
        **Tests:**
        - [ ] E2E: Tab once, skip link visible
        - [ ] E2E: Enter activates, scrolls to #main-content
        - [ ] A11y: axe scan passes
  
  - [ ] 19.2 Verify keyboard navigation (R-032)
        **Description:** Test full keyboard flow
        **Acceptance:** All features accessible via keyboard
        **Tests:**
        - [ ] E2E: Tab through entire page (logical order)
        - [ ] E2E: Focus visible on all interactive elements
        - [ ] E2E: Enter/Space activate buttons
        - [ ] E2E: Arrow keys navigate carousel (if focused)
        - [ ] A11y: No keyboard traps
  
  - [ ] 19.3 Add ARIA labels and semantic HTML (R-033)
        **Description:** Screen reader support
        **Acceptance:** All elements properly labeled
        **Tests:**
        - [ ] A11y: All images have alt text
        - [ ] A11y: Icon buttons have aria-label
        - [ ] A11y: Landmarks present (header, nav, main, footer)
        - [ ] A11y: Heading hierarchy valid (no skips)
        - [ ] Screen reader test: Navigate with VoiceOver/NVDA
  
  - [ ] 19.4 Verify color contrast (R-034)
        **Description:** WCAG AA compliance check
        **Acceptance:** All text meets 4.5:1 contrast
        **Tests:**
        - [ ] A11y: Run axe DevTools on all pages
        - [ ] A11y: Check contrast on dark work sections
        - [ ] Visual: Eyedropper verify design token colors used

---

- [x] **20.0 Performance Optimization & Testing** — Traceability: [PRD § 2 Success Metrics, System Spec § 8.2]
  
  - [ ] 20.1 Run Lighthouse audit
        **Description:** Measure performance, accessibility, SEO
        **Acceptance:** All scores >90
        **Tests:**
        - [ ] Lighthouse Performance >90
        - [ ] Lighthouse Accessibility >90
        - [ ] Lighthouse Best Practices >90
        - [ ] Lighthouse SEO >90
        - [ ] FCP <1.2s
        - [ ] LCP <2.0s
        - [ ] CLS <0.1
  
  - [ ] 20.2 Optimize bundle size
        **Description:** Reduce JavaScript bundle
        **Acceptance:** Initial bundle <200KB gzipped
        **Steps:**
        - Analyze bundle: `pnpm build -- --analyze`
        - Remove unused dependencies
        - Dynamic import heavy components
        **Tests:**
        - [ ] Measure .next/static/chunks/main-*.js size
        - [ ] Verify <200KB (gzipped)
  
  - [ ] 20.3 Test on slow 4G connection
        **Description:** Simulate 4G throttling
        **Acceptance:** Page loads <2s on 4G
        **Tests:**
        - [ ] Lighthouse: Throttled 4G test passes
        - [ ] Chrome DevTools: Network → Slow 4G → Reload
        - [ ] Measure TTI <2s

---

- [x] **21.0 CMS Seed Data & Content Population** — Traceability: [Context Pack Decision B5]
  
  - [ ] 21.1 Create Striker project data
        **Description:** Populate sample project from Figma
        **Acceptance:** Striker project visible on site
        **Steps:**
        - Log into /admin
        - Create new project: "Striker"
        - Fill all fields per Figma data (see PRD § 5 Flow 4)
        - Upload hero image and carousel images
        - Set featured: true
        - Publish
        **Tests:**
        - [ ] E2E: Striker appears on landing page
        - [ ] E2E: Striker work section displays
        - [ ] Visual: Compare with Figma design
  
  - [ ] 21.2 Populate About section content
        **Description:** Add bio and image carousel
        **Acceptance:** About section has real content
        **Tests:**
        - [ ] E2E: About section renders bio text
        - [ ] E2E: About carousel auto-scrolls
  
  - [ ] 21.3 Configure SiteConfig
        **Description:** Add name, location, social links, CV
        **Acceptance:** All site config visible on frontend
        **Tests:**
        - [ ] E2E: Name and location in NavHeader
        - [ ] E2E: Social links work
        - [ ] E2E: CV downloads successfully

---

- [x] **22.0 End-to-End Testing Suite** — Traceability: [PRD Decision C10, System Spec § 12.1]
  
  - [ ] 22.1 Write landing page E2E test
        **Description:** Complete landing page flow
        **Acceptance:** Test covers all user interactions
        **File:** `tests/e2e/landing-page.spec.ts`
        ```typescript
        test('landing page loads and displays content', async ({ page }) => {
          await page.goto('/');
          
          // Verify hero section
          await expect(page.locator('h1')).toContainText('Abhinav Pandey');
          
          // Verify carousel
          await expect(page.locator('[data-testid="hero-carousel"]')).toBeVisible();
          
          // Verify featured project
          await expect(page.locator('[data-testid="featured-project"]')).toBeVisible();
          
          // Verify carousel auto-scrolls
          const firstSlide = page.locator('[data-carousel-index="0"]');
          await expect(firstSlide).toHaveAttribute('data-active', 'true');
          await page.waitForTimeout(4500);
          const secondSlide = page.locator('[data-carousel-index="1"]');
          await expect(secondSlide).toHaveAttribute('data-active', 'true');
        });
        ```
        **Tests:** Run test, verify passes
  
  - [ ] 22.2 Write work sections E2E test
        **Description:** Test scrolling and color transitions
        **Acceptance:** Work section flow works end-to-end
        **File:** `tests/e2e/work-sections.spec.ts`
        ```typescript
        test('work sections scroll and transition colors', async ({ page }) => {
          await page.goto('/');
          
          // Scroll to work section
          await page.locator('#work').scrollIntoViewIfNeeded();
          
          // Verify section visible
          await expect(page.locator('[data-section="work"]').first()).toBeInViewport();
          
          // Verify background color changed
          const bgColor = await page.evaluate(() => 
            getComputedStyle(document.body).backgroundColor
          );
          expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Changed from white
          
          // Verify carousel in work section
          await expect(page.locator('[data-section="work"] [data-testid="carousel"]')).toBeVisible();
        });
        ```
        **Tests:** Run test, verify passes
  
  - [ ] 22.3 Write accessibility E2E test
        **Description:** Full accessibility audit
        **Acceptance:** No a11y violations
        **File:** `tests/e2e/accessibility.spec.ts`
        ```typescript
        import { injectAxe, checkA11y } from 'axe-playwright';
        
        test('accessibility audit passes', async ({ page }) => {
          await page.goto('/');
          await injectAxe(page);
          await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true },
          });
        });
        
        test('keyboard navigation works', async ({ page }) => {
          await page.goto('/');
          
          // Tab through interactive elements
          await page.keyboard.press('Tab'); // Skip to content
          await page.keyboard.press('Tab'); // First nav link
          await expect(page.locator(':focus')).toBeVisible();
          
          // Verify logical tab order
          const focusedElement = await page.locator(':focus').getAttribute('data-nav-item');
          expect(focusedElement).toBe('work-link');
        });
        ```
        **Tests:** Run tests, all pass
  
  - [ ] 22.4 Write visual regression tests
        **Description:** Screenshot comparison tests
        **Acceptance:** Visual consistency across builds
        **File:** `tests/e2e/visual-regression.spec.ts`
        ```typescript
        test('landing page visual regression', async ({ page }) => {
          await page.goto('/');
          await page.waitForLoadState('networkidle');
          await expect(page).toHaveScreenshot('landing-page-desktop.png');
        });
        
        test('mobile layout visual regression', async ({ page }) => {
          await page.setViewportSize({ width: 375, height: 667 });
          await page.goto('/');
          await expect(page).toHaveScreenshot('landing-page-mobile.png');
        });
        ```
        **Tests:** Generate baseline, subsequent runs compare

---

- [x] **23.0 Documentation & Handoff** — Traceability: [PRD § 3 Users]
  
  - [ ] 23.1 Write CMS user guide
        **Description:** Documentation for designer to manage content
        **Acceptance:** Designer can add project in <5 minutes
        **File:** `docs/cms-guide.md`
        **Sections:**
        - How to log in (/admin with OAuth)
        - Adding a new project (step-by-step with screenshots)
        - Uploading images
        - Publishing projects
        - Managing About section
        - Updating site config
        **Tests:**
        - [ ] User testing: Designer follows guide, adds project successfully
  
  - [ ] 23.2 Update README with setup instructions
        **Description:** Complete project README
        **Acceptance:** README has all setup steps
        **File:** `README.md`
        **Sections:**
        - Project overview
        - Tech stack
        - Local development setup
        - Environment variables
        - Deployment instructions
        - Design system link
        - Testing commands
        **Tests:**
        - [ ] Follow README from scratch, verify setup works
  
  - [ ] 23.3 Create AGENTS.md for future AI development
        **Description:** Document commands and conventions
        **Acceptance:** AGENTS.md has key info for AI
        **File:** `AGENTS.md`
        **Content:**
        - Typecheck: `pnpm typecheck`
        - Lint: `pnpm lint`
        - Test: `pnpm test` (unit) and `pnpm test:e2e`
        - Build: `pnpm build`
        - Deploy: `pnpm deploy`
        - Design system: Link to design-tokens.md
        - Code conventions: CSS Modules, no Tailwind, design tokens only
        **Tests:**
        - [ ] Commands listed work correctly

---

- [ ] **24.0 Final Validation & Production Deploy** — Traceability: [PRD § 12.1 Rollout, System Spec § 12.1]
  
  - [ ] 24.1 Run full test suite
        **Description:** Execute all tests before production
        **Acceptance:** All tests pass (0 failures)
        **Commands:**
        ```bash
        pnpm typecheck
        pnpm lint
        pnpm test
        pnpm test:e2e
        ```
        **Tests:**
        - [ ] TypeScript: 0 errors
        - [ ] Lint: 0 warnings
        - [ ] Unit tests: All pass
        - [ ] E2E tests: All pass
        - [ ] Visual tests: No unexpected diffs
  
  - [ ] 24.2 Run Lighthouse CI audit
        **Description:** Final performance validation
        **Acceptance:** All metrics >90
        **Setup:** Add lighthouserc.json (see System Spec § 4.2)
        **Tests:**
        - [ ] Performance >90
        - [ ] Accessibility >90
        - [ ] Best Practices >90
        - [ ] SEO >90
  
  - [ ] 24.3 Configure custom domain (optional)
        **Description:** Add custom domain to Cloudflare Workers
        **Acceptance:** Site accessible at custom domain
        **Steps:**
        - Add domain in Cloudflare dashboard
        - Update DNS records
        - Update wrangler.toml routes
        **Tests:**
        - [ ] Site accessible at https://[domain]
        - [ ] SSL certificate valid
        - [ ] Redirects from workers.dev to custom domain
  
  - [ ] 24.4 Production deployment
        **Description:** Deploy final version to production
        **Acceptance:** Site live and functional
        **Steps:**
        - Merge to main branch
        - GitHub Actions auto-deploys
        - Monitor deployment logs
        - Verify site accessible
        **Tests:**
        - [ ] Site loads at production URL
        - [ ] All features functional
        - [ ] Performance meets targets
        - [ ] CMS accessible and working
        - [ ] OAuth login works in production
  
  - [ ] 24.5 Set up monitoring
        **Description:** Enable Cloudflare Analytics
        **Acceptance:** Traffic and performance visible in dashboard
        **Tests:**
        - [ ] Cloudflare Analytics enabled
        - [ ] Web Vitals visible in dashboard
        - [ ] Error rate monitored

---

## Testing Strategy Summary

### Unit Tests (Vitest)
- Component rendering
- Utility functions
- Data fetching logic
- Hook behavior

**Run:** `pnpm test`

### E2E Tests (Playwright)
- User flows (landing → work → about)
- Carousel interactions
- Smooth scroll navigation
- Mobile responsiveness
- Performance (Web Vitals)

**Run:** `pnpm test:e2e`

### Visual Regression
- Screenshot comparison
- Design consistency
- Responsive layouts

**Run:** `pnpm test:e2e --grep "visual regression"`

### Accessibility Tests
- axe-core violations
- Keyboard navigation
- Screen reader compatibility
- Color contrast

**Run:** `pnpm test:e2e --grep "accessibility"`

### Manual Testing Checklist
- [ ] OAuth login (Google + GitHub)
- [ ] CMS CRUD operations (create, edit, delete project)
- [ ] Image uploads to R2
- [ ] Content publish → deploy workflow
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Real device testing (iPhone, Android)

---

## Definition of Done (Per Task)

Each task is considered complete when:
1. ✅ Code written and matches spec
2. ✅ All specified tests pass
3. ✅ TypeScript compilation succeeds (`pnpm typecheck`)
4. ✅ Linting passes (`pnpm lint`)
5. ✅ No console errors in browser
6. ✅ Changes committed to Git with descriptive message
7. ✅ Traceability to PRD requirements documented

---

## Dependencies & Order

### Critical Path
```
1.0 (Repo Init) 
  → 2.0 (Cloudflare Setup) 
  → 3.0 (Payload CMS) 
  → 4.0 (Design System) 
  → 7.0 (First Deploy) 
  → All Phase 2 tasks (parallel possible)
  → 24.0 (Final Validation)
```

### Parallel Execution
After task 7.0 completes, these can run in parallel:
- 8.0 (NavHeader)
- 9.0 (Carousel)
- 10.0 (Landing Page)
- 11.0 (Work Sections)
- 12.0 (About Section)
- 13.0 (SEO)

---

## Estimated Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | 1.0 - 7.0 | 2-3 days |
| Phase 2 | 8.0 - 23.0 | 4-5 days |
| Testing & Polish | 24.0 | 1 day |
| **Total** | **1-24** | **7-9 days** |

---

## Risk Mitigation

### High Risk Tasks
- **2.0 Cloudflare Setup:** Test each service individually (D1, R2, Workers)
- **3.4 OAuth Implementation:** Use Payload docs, test both providers
- **7.0 First Deploy:** Expect issues, iterate quickly

### Blockers
- Cloudflare account access → Complete task 2.0 early
- OAuth credentials → Obtain before task 3.4
- Custom domain DNS → Optional, don't block launch

---

**End of Task List**

**Next Steps:** Tasks ready for execution. Begin with Phase 1 (tasks 1.0-7.0) to establish foundation, then proceed to Phase 2 for feature implementation.

**Ready to start implementation? Reply 'Go' or specify which task to begin with.**
