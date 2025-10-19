# System Design & Architecture Specification

**Project:** Portfolio Website  
**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`

---

## 1. Architecture Overview

### 1.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js App │  │   CMS Admin  │  │  Public Site │      │
│  │  (React)     │  │  (Payload)   │  │   (Static)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │ HTTPS            │ HTTPS            │ HTTPS
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────┐
│              CLOUDFLARE CDN + WORKERS                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Workers (Edge Runtime)                              │   │
│  │  - Next.js SSR/SSG                                   │   │
│  │  - Payload CMS API                                   │   │
│  │  - Routing + Caching                                 │   │
│  └──────────┬────────────────────────────┬──────────────┘   │
└─────────────┼────────────────────────────┼──────────────────┘
              │                            │
         ┌────▼────┐                  ┌────▼────┐
         │ D1 (DB) │                  │ R2 (S3) │
         │ SQLite  │                  │ Storage │
         │ - CMS   │                  │ - Images│
         │   Data  │                  │ - PDFs  │
         └─────────┘                  └─────────┘

External Services:
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│   Google    │  │   GitHub    │  │   GitHub     │
│   OAuth     │  │   OAuth     │  │   Actions    │
│             │  │             │  │   (CI/CD)    │
└─────────────┘  └─────────────┘  └──────────────┘
```

---

### 1.2 Technology Stack

**Frontend:**
- Framework: Next.js 14.2+ (App Router)
- Runtime: React 18+
- Styling: CSS Modules + CSS Custom Properties
- Animation: Framer Motion 11+
- State: React Server Components + Client Components

**CMS:**
- Platform: Payload CMS 2.0+
- Database Adapter: Cloudflare D1
- Storage Adapter: Cloudflare R2
- Auth: OAuth 2.0 (Google, GitHub)

**Hosting:**
- Edge Runtime: Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Storage: Cloudflare R2 (S3-compatible)
- CDN: Cloudflare CDN

**Build & Deploy:**
- CI/CD: GitHub Actions
- Package Manager: pnpm
- Node Version: 18.18+

---

## 2. Key Workflows

### 2.1 Landing Page Load (R-001)

```
[User Request] → [Cloudflare CDN]
                      ↓
              [Cache HIT?] ──Yes──→ [Return Cached HTML]
                      ↓ No
              [Cloudflare Worker]
                      ↓
         [Execute Next.js SSR/SSG]
                      ↓
      [Query D1: Featured Project + Site Config]
                      ↓
         [Query R2: Image URLs (CDN)]
                      ↓
         [Render HTML with Data]
                      ↓
         [Cache in CDN (1 hour TTL)]
                      ↓
              [Return to User]
                      ↓
    [Browser: Hydrate React, Load Images]
```

**Performance:**
- CDN cache: 1 hour
- D1 query time: <50ms
- SSR execution: <200ms
- Total TTFB: <300ms
- LCP: <2s

**Traceability:** R-001, PRD § 8.1

---

### 2.2 Work Section Scroll & Color Transition (R-005, R-006)

```
[User Scrolls] 
    ↓
[Intersection Observer Triggered]
    ↓
[Section 50% Visible?] ──No──→ [Continue Monitoring]
    ↓ Yes
[Set Active Section State]
    ↓
[Update CSS Variable: --current-bg-color]
    ↓
[CSS Transition: background-color 800ms]
    ↓
[Track Event: section_view]
```

**Implementation:**
```typescript
// Pseudo-code
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0.5) {
      const bgColor = entry.target.dataset.backgroundColor;
      document.documentElement.style.setProperty('--current-bg-color', bgColor);
    }
  });
}, { threshold: [0.5] });
```

**Traceability:** R-005, R-006

---

### 2.3 Smooth Scroll Navigation (R-023)

```
[User Clicks Nav Link]
    ↓
[Prevent Default Link Behavior]
    ↓
[Extract Target Section ID (#work, #about)]
    ↓
[Find Target Element: document.getElementById(id)]
    ↓
[Execute Smooth Scroll: scrollIntoView({ behavior: 'smooth' })]
    ↓
[Update URL Hash: pushState(#section)]
    ↓
[Track Event: nav_link_click]
    ↓
[After Scroll Complete (~1s)]
    ↓
[Move Focus to Section Heading (Accessibility)]
```

**Intersection with Reduced Motion:**
```typescript
const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

element.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
```

**Traceability:** R-023, R-022

---

## 3. Performance Optimizations

### 3.1 Static Generation (R-032)

**Next.js Config:**
```typescript
// next.config.js
module.exports = {
  output: 'export', // For Cloudflare Pages
  // Or for Workers:
  experimental: {
    runtime: 'edge',
  },
  images: {
    domains: ['r2.cloudflare.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

**Static Paths:**
```typescript
// app/work/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 100,
  });
  
  return projects.docs.map(project => ({
    slug: project.slug,
  }));
}
```

**Build Output:**
- `/` → `index.html`
- `/work/striker` → `work/striker.html`
- All static HTML pre-rendered at build time

**Traceability:** R-030, PRD § 8.1

---

### 3.2 Background Color Transition Optimization (R-006)

**Challenge:** Smooth 800ms transition without jank

**Solution:** CSS variable + GPU-accelerated transition

```css
/* Apply to body or root element */
body {
  background-color: var(--current-bg-color);
  transition: background-color 800ms cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: background-color;
}

/* Trigger via JS */
document.body.style.setProperty('--current-bg-color', newColor);
```

**Optimization:**
- Use `will-change: background-color` to hint browser
- Avoid layout thrashing (batch DOM reads/writes)
- Test on low-end devices (iPhone SE 2020)

**Traceability:** R-006

---

### 3.3 Reduced Motion Implementation (R-024)

**Detection:**
```typescript
// /src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  
  return prefersReducedMotion;
}
```

**Application:**
```tsx
// In Carousel component
const shouldAutoScroll = !useReducedMotion();

useEffect(() => {
  if (shouldAutoScroll) {
    startAutoScroll();
  }
}, [shouldAutoScroll]);
```

**Framer Motion Integration:**
```tsx
import { MotionConfig } from 'framer-motion';

<MotionConfig reducedMotion="user">
  {/* All animations respect user preference */}
</MotionConfig>
```

**Traceability:** R-022

---

### 3.4 Image Optimization Pipeline (R-031)

```
[Image Upload to CMS]
    ↓
[Validate: Type, Size]
    ↓
[Generate Sizes: thumbnail (400w), card (800w), large (1920w)]
    ↓
[Convert to WebP (quality: 85)]
    ↓
[Generate BlurHash Placeholder]
    ↓
[Upload All Variants to R2]
    ↓
[Store Metadata in D1]
    ↓
[Return URLs]

[Frontend Request]
    ↓
[Next.js Image Component]
    ↓
[Select Appropriate Size (srcset)]
    ↓
[Lazy Load (Intersection Observer)]
    ↓
[Serve from Cloudflare CDN]
    ↓
[Cache: max-age=31536000]
```

**Next.js Image Component:**
```tsx
<Image
  src={image.url}
  alt={image.alt}
  width={image.width}
  height={image.height}
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  quality={85}
  loading="lazy"
  placeholder="blur"
  blurDataURL={image.blurHash}
/>
```

**Traceability:** R-029

---

### 3.5 Code Splitting Strategy (R-032)

**Route-Based Splitting:**
```
/ (Home)           → home.chunk.js (30KB)
/work/[slug]       → work-slug.chunk.js (40KB)
/admin             → admin.chunk.js (150KB)
```

**Component-Level Splitting:**
```tsx
// Dynamic import for heavy components
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false,
});

const CaseStudyTakeover = dynamic(() => import('@/components/CaseStudyTakeover'), {
  loading: () => <LoadingSpinner />,
});
```

**Vendor Chunking:**
```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};
```

**Bundle Analysis:**
```bash
npm run build -- --analyze
```

**Target:**
- Initial JS bundle: <200KB (gzipped)
- Total page weight: <500KB (before images)

**Traceability:** R-030

---

### 3.6 Font Loading Strategy (R-033)

**Next.js Font Optimization:**
```typescript
// app/layout.tsx
import { Instrument_Sans, Geist_Mono } from 'next/font/google';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-family-body',
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-family-ui',
  display: 'swap',
  preload: true,
  fallback: ['SF Mono', 'Monaco', 'Courier New', 'monospace'],
});
```

**Font Loading Flow:**
```
[Page Load]
    ↓
[Render with Fallback Fonts] (FOUT: Flash of Unstyled Text)
    ↓
[Next.js Font Loader: Download Fonts (self-hosted)]
    ↓
[Fonts Load Complete (~200ms)]
    ↓
[CSS: font-display: swap → Switch to Custom Fonts]
    ↓
[No Layout Shift (font metrics matched)]
```

**Optimization:**
- Fonts self-hosted (no external request to Google)
- Subset: Latin only (reduces file size)
- Preload: Critical fonts loaded in `<head>`
- Display: `swap` (show fallback immediately)

**Traceability:** R-031

---

## 4. Deployment Architecture

### 4.1 Cloudflare Workers Deployment

**Entry Point:**
```typescript
// /src/server.ts (Cloudflare Worker)
import { createRequestHandler } from '@remix-run/cloudflare';
import * as build from '@remix-run/dev/server-build';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    
    // Route to Next.js or Payload
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
      return handlePayloadRequest(request, env);
    } else {
      return handleNextRequest(request, env);
    }
  },
};
```

**Environment Variables:**
```bash
# Cloudflare Worker Secrets
DATABASE_URL="cloudflare-d1://[database-id]"
R2_BUCKET_NAME="portfolio-media"
R2_ACCOUNT_ID="[account-id]"
R2_ACCESS_KEY_ID="[key]"
R2_SECRET_ACCESS_KEY="[secret]"
PAYLOAD_SECRET="[random-secret]"
GOOGLE_CLIENT_ID="[google-oauth-id]"
GOOGLE_CLIENT_SECRET="[google-oauth-secret]"
GITHUB_CLIENT_ID="[github-oauth-id]"
GITHUB_CLIENT_SECRET="[github-oauth-secret]"
NEXT_PUBLIC_SITE_URL="https://[domain]"
```

**Wrangler Config:**
```toml
# wrangler.toml
name = "portfolio-website"
main = "src/server.ts"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "[domain]/*", zone_name = "[domain]" }
]

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "[d1-id]"

[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "portfolio-media"
```

**Traceability:** PRD § 9.1 Constraints

---

### 4.2 GitHub Actions CI/CD Pipeline

**Workflow File:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]
  repository_dispatch:
    types: [content_published]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build Next.js
        run: pnpm build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
      
      - name: Run tests
        run: pnpm test:e2e
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --env production
      
      - name: Purge Cloudflare Cache
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
```

**Deployment Stages:**
1. Install dependencies
2. Build Next.js app
3. Run E2E tests (Playwright)
4. Deploy to Cloudflare Workers
5. Purge CDN cache
6. Notify (Slack/Discord webhook)

**Rollback:**
```bash
# Via Wrangler CLI
wrangler rollback --name portfolio-website
```

**Traceability:** PRD § 12.3 Rollback Strategy

---

## 5. SEO Implementation

### 5.1 Metadata Generation (R-027)

**Server-Side Rendering:**
```tsx
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Abhinav Pandey - Product Designer',
    template: '%s | Abhinav Pandey',
  },
  description: 'Portfolio showcasing product design work and case studies',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Abhinav Pandey Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@username',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '[verification-code]',
  },
};
```

**Traceability:** R-027

---

### 5.2 Structured Data (R-028)

**Implementation Location:** Each page component

```tsx
// app/page.tsx
export default async function HomePage() {
  const siteConfig = await getSiteConfig();
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: 'Product Designer',
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location,
    },
    sameAs: siteConfig.socialLinks.map(link => link.url),
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>{/* Content */}</main>
    </>
  );
}
```

**Validation:** Test with Google Rich Results Test

**Traceability:** R-028

---

### 5.3 Sitemap & Robots (R-029, R-030)

**Generated Files:**
- `/sitemap.xml` - Dynamic sitemap
- `/robots.txt` - Crawler instructions

**Sitemap Update Trigger:**
- On build (static generation)
- On content publish (via revalidation)

**Traceability:** R-029, R-030

---

## 6. Security Architecture

### 6.1 Authentication Flow (R-017)

```
[User: /admin]
    ↓
[Redirect to OAuth Provider (Google/GitHub)]
    ↓
[User Authorizes]
    ↓
[Redirect: /api/users/oauth/callback?code=xyz&state=abc]
    ↓
[Server: Exchange Code for Token]
    ↓
[Server: Fetch User Profile (email, name)]
    ↓
[Server: Create or Update User in D1]
    ↓
[Server: Generate JWT Session Token]
    ↓
[Server: Set HTTP-only Cookie]
    ↓
[Redirect: /admin (authenticated)]
```

**JWT Payload:**
```json
{
  "sub": "user_123",
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1697443200,
  "exp": 1698048000
}
```

**Session Security:**
- Cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`
- Expiry: 7 days
- Refresh: On CMS access (sliding window)

**Traceability:** R-017

---

### 6.2 Content Security Policy

**Headers:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // For Next.js
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://r2.cloudflare.com",
              "font-src 'self' data:",
              "connect-src 'self' https://r2.cloudflare.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

**Traceability:** PRD § 8.3 Security

---

## 7. Monitoring & Observability

### 7.1 Cloudflare Analytics

**Enabled Metrics:**
- Requests per second
- Bandwidth usage
- Cache hit rate
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)

**Dashboards:**
- Cloudflare Dashboard → Workers → Analytics
- Custom dashboards via GraphQL API (optional)

---

### 7.2 Error Tracking (Optional)

**Sentry Integration:**
```typescript
// app/layout.tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% sampling
  beforeSend(event, hint) {
    // Sanitize PII
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

**Captured Errors:**
- JavaScript errors
- Unhandled promise rejections
- API errors (500s)
- Image load failures

**Traceability:** PRD § 8.6 Observability

---

## 8. Capacity & Performance Budgets

### 8.1 Cloudflare Free Tier Limits

**Workers:**
- Requests: 100,000 / day
- CPU time: 10ms per request
- Memory: 128MB

**D1:**
- Storage: 5GB
- Reads: 5M / day
- Writes: 100K / day

**R2:**
- Storage: 10GB
- Reads: 10M / month
- Writes: 1M / month

**Estimated Usage (Personal Portfolio):**
- Daily visitors: ~500
- Daily requests: ~5,000 (well within 100K limit)
- Images: ~100 (500MB total) ✅
- Database: ~10MB ✅

**Monitoring:**
- Cloudflare dashboard alerts at 80% of limits
- Weekly usage review

**Traceability:** PRD § 9.1 Constraints

---

### 8.2 Performance Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| FCP | <1.2s | Web Vitals |
| LCP | <2.0s | Web Vitals |
| TTI | <2.0s | Web Vitals |
| CLS | <0.1 | Web Vitals |
| Total Blocking Time | <300ms | Lighthouse |
| Initial JS Bundle | <200KB (gzipped) | webpack-bundle-analyzer |
| Initial CSS | <50KB (gzipped) | build output |
| Lighthouse Score | >90 | Lighthouse CI |

**Enforcement:**
- Lighthouse CI fails build if score <90
- Bundle size check in GitHub Actions
- Performance regression tests

**Traceability:** PRD § 2 Success Metrics, R-031, R-032

---

## 9. Rollout & Feature Flags

### 9.1 Phased Rollout (Optional)

**Current:** Direct deploy (no phased rollout needed for personal site)

**Future Enhancement:**
```typescript
// Feature flag example
const ENABLE_CASE_STUDY_COMMENTS = process.env.NEXT_PUBLIC_FF_COMMENTS === 'true';

{ENABLE_CASE_STUDY_COMMENTS && <CommentsSection />}
```

---

### 9.2 Rollback Strategy

**Immediate Rollback (Critical Bug):**
```bash
# Via Wrangler CLI
wrangler rollback --name portfolio-website --version [previous-version]
```

**Time Target:** <5 minutes

**Rollback Scenarios:**
- Critical visual bug (broken layout)
- Performance regression (LCP >5s)
- CMS authentication failure
- Data corruption

**Testing Before Rollback:**
- Verify previous version in staging
- Check deployment logs
- Confirm D1 database state

**Traceability:** PRD § 12.3 Rollback Strategy

---

## 10. Sequence Diagrams

### 10.1 Content Publish Flow

```
┌──────┐       ┌─────────┐      ┌────────┐      ┌──────────┐      ┌──────────┐
│Admin │       │Payload  │      │   D1   │      │ GitHub   │      │Cloudflare│
│      │       │  CMS    │      │   DB   │      │ Actions  │      │ Workers  │
└──┬───┘       └────┬────┘      └───┬────┘      └────┬─────┘      └────┬─────┘
   │                │                │                │                 │
   │ 1. Edit Project│                │                │                 │
   │───────────────>│                │                │                 │
   │                │                │                │                 │
   │ 2. Save (status: published)    │                │                 │
   │───────────────>│                │                │                 │
   │                │ 3. Write to DB │                │                 │
   │                │───────────────>│                │                 │
   │                │                │                │                 │
   │                │ 4. Trigger Webhook (GitHub)    │                 │
   │                │────────────────────────────────>│                 │
   │                │                │                │                 │
   │                │                │ 5. Start Build │                 │
   │                │                │<───────────────│                 │
   │                │                │                │                 │
   │                │                │ 6. Deploy      │                 │
   │                │                │────────────────────────────────>│
   │                │                │                │                 │
   │ 7. Confirm     │                │                │ 8. Live         │
   │<───────────────────────────────────────────────────────────────────│
```

---

### 10.2 OAuth Login Flow

```
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────────┐    ┌─────┐
│User  │    │Payload  │    │Google  │    │Cloudflare│    │ D1  │
│      │    │  CMS    │    │ OAuth  │    │ Worker   │    │ DB  │
└──┬───┘    └────┬────┘    └───┬────┘    └────┬─────┘    └──┬──┘
   │             │               │              │             │
   │ 1. /admin   │               │              │             │
   │────────────>│               │              │             │
   │             │               │              │             │
   │ 2. Redirect to Google      │              │             │
   │─────────────────────────────>              │             │
   │             │               │              │             │
   │ 3. User Authorizes         │              │             │
   │<────────────────────────────│              │             │
   │             │               │              │             │
   │ 4. Callback with code      │              │             │
   │─────────────────────────────────────────────>            │
   │             │               │              │             │
   │             │ 5. Exchange code for token  │             │
   │             │<──────────────────────────────│             │
   │             │               │              │             │
   │             │ 6. Get user profile         │             │
   │             │<──────────────────────────────│             │
   │             │               │              │             │
   │             │ 7. Create/update user        │             │
   │             │──────────────────────────────────────────> │
   │             │               │              │             │
   │             │ 8. Generate JWT             │             │
   │             │<──────────────────────────────│             │
   │             │               │              │             │
   │ 9. Set Cookie + Redirect to /admin        │             │
   │<─────────────────────────────────────────────            │
```

**Traceability:** R-017

---

## 11. Failure Scenarios & Resilience

### 11.1 CMS API Down

**Scenario:** Payload CMS unavailable (D1 connection failure)

**Mitigation:**
- Frontend: Serve cached static pages (stale content)
- Display banner: "Content may be outdated"
- Admin: Show maintenance page

**Implementation:**
```typescript
try {
  const projects = await payload.find({ collection: 'projects' });
} catch (error) {
  // Fallback to cached data
  const cachedProjects = await getCachedProjects();
  return cachedProjects;
}
```

---

### 11.2 R2 Storage Down

**Scenario:** Image uploads or retrieval failing

**Mitigation:**
- Display fallback placeholder images
- Queue uploads for retry (store in D1 temporarily)
- Alert admin via email/Slack

**Fallback Image:**
```tsx
<img
  src={image.url}
  alt={image.alt}
  onError={(e) => {
    e.currentTarget.src = '/fallback-image-placeholder.svg';
  }}
/>
```

---

### 11.3 OAuth Provider Down

**Scenario:** Google/GitHub OAuth unavailable

**Mitigation:**
- Show error message: "Login temporarily unavailable. Try again in a few minutes."
- Provide alternative: Email link to request access
- Existing sessions: Continue working (JWT still valid)

---

## 12. Acceptance Criteria (System Level)

- [ ] Next.js builds successfully for Cloudflare Workers
- [ ] Cloudflare D1 database connected and queryable
- [ ] Cloudflare R2 uploads working (image and PDF)
- [ ] OAuth authentication functional (Google + GitHub)
- [ ] GitHub Actions deploy pipeline working end-to-end
- [ ] CDN caching configured (1 hour TTL for HTML, immutable for assets)
- [ ] Performance budgets enforced (Lighthouse CI)
- [ ] Error tracking capturing client errors
- [ ] Web Vitals reporting to analytics
- [ ] Rollback tested in staging (revert to previous deployment)

---

## 13. References

- **PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`
- **Cloudflare Workers Docs:** `https://developers.cloudflare.com/workers/`
- **Payload CMS Cloudflare:** `https://payloadcms.com/docs/production/deployment`
- **Next.js Edge Runtime:** `https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes`

---

**End of System Spec**
