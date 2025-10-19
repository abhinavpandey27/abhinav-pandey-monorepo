# API Contract Specification

**Project:** Portfolio Website  
**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`

---

## 1. Overview

This specification defines the API contracts for the portfolio website, including Payload CMS REST API, authentication endpoints, and Next.js API routes for SEO/metadata.

### API Architecture
- **CMS API:** Payload REST API (auto-generated from collections)
- **Frontend API:** Next.js App Router Server Actions + Route Handlers
- **Auth:** OAuth 2.0 (Google, GitHub)
- **Base URL:** `https://[domain]/api`

---

## 2. Payload CMS REST API

### 2.1 Authentication (R-017)

#### POST `/api/users/login`

**Purpose:** Initiate OAuth login flow

**Auth:** None (public endpoint)

**Request:**
```http
POST /api/users/login
Content-Type: application/json

{
  "provider": "google" | "github",
  "redirectUri": "https://[domain]/admin"
}
```

**Response:**
```http
HTTP/1.1 302 Found
Location: https://accounts.google.com/o/oauth2/v2/auth?client_id=...

Set-Cookie: oauth_state=xyz; HttpOnly; Secure; SameSite=Lax
```

**Errors:**
- `400`: Invalid provider
- `500`: OAuth configuration error

**Traceability:** R-017

---

#### GET `/api/users/oauth/callback`

**Purpose:** OAuth callback handler

**Auth:** None

**Query Params:**
- `code` (string, required): Authorization code from provider
- `state` (string, required): CSRF token

**Response (Success):**
```http
HTTP/1.1 302 Found
Location: /admin

Set-Cookie: payload-token=jwt_token; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Response (Error):**
```http
HTTP/1.1 302 Found
Location: /admin/login?error=auth_failed
```

**Session Management:**
- Token: JWT stored in HTTP-only cookie
- Expiry: 7 days
- Refresh: Automatic on CMS access

**Traceability:** R-017

---

### 2.2 Projects API (R-018, R-019)

#### GET `/api/projects`

**Purpose:** List all projects

**Auth:** None (public endpoint, filters by status)

**Query Params:**
- `status` (string, optional): Filter by status (`published` | `draft`)
- `limit` (number, optional): Default 50, max 100
- `page` (number, optional): Page number (1-indexed)
- `sort` (string, optional): Sort field (default: `order`)

**Request:**
```http
GET /api/projects?status=published&sort=order&limit=10
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "docs": [
    {
      "id": "proj_123",
      "title": "Striker",
      "subtitle": "NFT-based Cricket Fantasy Game",
      "slug": "striker",
      "description": "Did 0→1 for a new player-card-based fantasy system...",
      "role": "Product Designer II",
      "team": "2 Designers, 2 PMs...",
      "timeline": "Q2 2022 - Q4 2022",
      "categories": [
        { "name": "Real Money Gaming" },
        { "name": "Fantasy Sports" }
      ],
      "outcomes": [
        { "text": "25K Daily Active Users" },
        { "text": "1 Million USD Traded Volume" }
      ],
      "heroImage": {
        "id": "media_456",
        "url": "https://r2.cloudflare.com/bucket/striker-hero.webp",
        "alt": "Striker app interface",
        "width": 1920,
        "height": 1080
      },
      "backgroundColor": "#090e03",
      "carouselImages": [
        {
          "image": {
            "id": "media_457",
            "url": "https://r2.cloudflare.com/bucket/striker-1.webp",
            "width": 800,
            "height": 600
          }
        }
      ],
      "featured": true,
      "order": 0,
      "status": "published",
      "createdAt": "2025-10-15T10:00:00.000Z",
      "updatedAt": "2025-10-15T12:00:00.000Z"
    }
  ],
  "totalDocs": 5,
  "limit": 10,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

**Errors:**
- `400`: Invalid query parameters
- `500`: Database error

**Traceability:** R-018

---

#### POST `/api/projects`

**Purpose:** Create new project (Admin only)

**Auth:** Required (JWT token in cookie)

**Request:**
```http
POST /api/projects
Content-Type: application/json
Cookie: payload-token=jwt_token

{
  "title": "New Project",
  "subtitle": "Project subtitle",
  "description": "Project description (200-500 chars)",
  "role": "Product Designer",
  "team": "Team composition",
  "timeline": "Q1 2023 - Q3 2023",
  "categories": [
    { "name": "Category 1" },
    { "name": "Category 2" }
  ],
  "outcomes": [
    { "text": "Outcome 1" },
    { "text": "Outcome 2" }
  ],
  "heroImage": "media_id_here",
  "backgroundColor": "#1a2b3c",
  "carouselImages": [
    { "image": "media_id_1" },
    { "image": "media_id_2" }
  ],
  "featured": false,
  "order": 1,
  "status": "draft"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Project created successfully",
  "doc": {
    "id": "proj_789",
    "slug": "new-project",
    /* ...full project object... */
  }
}
```

**Validation Errors:**
```http
HTTP/1.1 400 Bad Request

{
  "errors": [
    {
      "field": "description",
      "message": "Description must be between 200-500 characters"
    },
    {
      "field": "backgroundColor",
      "message": "Must be valid hex color"
    }
  ]
}
```

**Errors:**
- `400`: Validation error
- `401`: Unauthorized (no token or expired)
- `403`: Forbidden (not admin role)
- `409`: Conflict (slug already exists)
- `500`: Server error

**Traceability:** R-019

---

#### PATCH `/api/projects/:id`

**Purpose:** Update existing project

**Auth:** Required (Admin)

**Path Params:**
- `id` (string, required): Project ID

**Request:**
```http
PATCH /api/projects/proj_123
Content-Type: application/json
Cookie: payload-token=jwt_token

{
  "status": "published",
  "featured": true
}
```

**Response:**
```http
HTTP/1.1 200 OK

{
  "message": "Project updated successfully",
  "doc": { /* updated project */ }
}
```

**Partial Updates:** Supported (only send changed fields)

**Traceability:** R-018, R-019

---

### 2.3 Globals API (AboutSection, SiteConfig)

#### GET `/api/globals/about-section` (R-020)

**Purpose:** Fetch About section content

**Auth:** None (public)

**Response:**
```http
HTTP/1.1 200 OK

{
  "id": "about",
  "bio": "<p>7+ years of experience...</p>",
  "imageCarousel": [
    {
      "image": {
        "url": "https://r2.cloudflare.com/bucket/about-1.webp",
        "alt": "Personal photo 1",
        "width": 800,
        "height": 600
      }
    }
  ],
  "updatedAt": "2025-10-15T10:00:00.000Z"
}
```

**Traceability:** R-020

---

#### GET `/api/globals/site-config` (R-021)

**Purpose:** Fetch site configuration

**Auth:** None (public, except internal fields)

**Response:**
```http
HTTP/1.1 200 OK

{
  "id": "siteConfig",
  "name": "Abhinav Pandey",
  "location": "Mumbai, India",
  "email": "hello@example.com",
  "socialLinks": [
    { "platform": "twitter", "url": "https://twitter.com/username", "label": null },
    { "platform": "linkedin", "url": "https://linkedin.com/in/username", "label": null },
    { "platform": "custom", "url": "https://dribbble.com/username", "label": "Dribbble" }
  ],
  "cvFile": {
    "url": "https://r2.cloudflare.com/bucket/cv-abhinav-pandey.pdf",
    "filename": "abhinav-pandey-cv.pdf",
    "filesize": 1024000
  },
  "updatedAt": "2025-10-15T10:00:00.000Z"
}
```

**Traceability:** R-021

---

#### PATCH `/api/globals/site-config`

**Purpose:** Update site configuration

**Auth:** Required (Admin)

**Request:**
```http
PATCH /api/globals/site-config
Content-Type: application/json

{
  "email": "new-email@example.com",
  "socialLinks": [
    { "platform": "twitter", "url": "https://twitter.com/new" }
  ]
}
```

**Response:**
```http
HTTP/1.1 200 OK

{
  "message": "Site config updated",
  "doc": { /* updated config */ }
}
```

**Traceability:** R-021

---

### 2.4 Media Upload API

#### POST `/api/media`

**Purpose:** Upload image or PDF file

**Auth:** Required (Admin)

**Request:**
```http
POST /api/media
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="image.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary
Content-Disposition: form-data; name="alt"

Screenshot of mobile interface
------WebKitFormBoundary--
```

**Response:**
```http
HTTP/1.1 201 Created

{
  "message": "Upload successful",
  "doc": {
    "id": "media_123",
    "filename": "image.jpg",
    "mimeType": "image/jpeg",
    "filesize": 2048000,
    "width": 1920,
    "height": 1080,
    "url": "https://r2.cloudflare.com/bucket/abc123-image.webp",
    "alt": "Screenshot of mobile interface",
    "sizes": {
      "thumbnail": {
        "url": "https://r2.cloudflare.com/bucket/abc123-image-thumbnail.webp",
        "width": 400,
        "height": 300
      },
      "card": {
        "url": "https://r2.cloudflare.com/bucket/abc123-image-card.webp",
        "width": 800,
        "height": 600
      },
      "large": {
        "url": "https://r2.cloudflare.com/bucket/abc123-image-large.webp",
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

**File Processing:**
1. Validate file type (JPEG, PNG, WebP, PDF)
2. Validate file size (<10MB for images, <5MB for PDFs)
3. Generate image variants (thumbnail, card, large)
4. Convert to WebP format
5. Upload to Cloudflare R2
6. Store metadata in D1

**Errors:**
- `400`: Invalid file type or size exceeded
- `401`: Unauthorized
- `413`: Payload too large (>10MB)
- `500`: Upload failed

**Rate Limiting:** 10 uploads per minute per user

**Traceability:** R-019, R-029

---

## 3. Next.js API Routes (SEO & Metadata)

### 3.1 Metadata API (R-025)

**Purpose:** Generate dynamic metadata for pages

**Implementation:** Next.js Metadata API (not REST endpoint)

```typescript
// app/page.tsx
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await payload.findGlobal({ slug: 'site-config' });
  
  return {
    title: `${siteConfig.name} - Product Designer`,
    description: `Portfolio of ${siteConfig.name}, product designer based in ${siteConfig.location}`,
    openGraph: {
      title: `${siteConfig.name} - Product Designer`,
      description: `Portfolio showcasing design work and case studies`,
      url: 'https://[domain]',
      siteName: siteConfig.name,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} Portfolio`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} - Product Designer`,
      description: `Portfolio showcasing design work and case studies`,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

**Traceability:** R-025

**Notes:** Case study page metadata deferred to future iteration.

---

### 3.2 Structured Data API (R-026)

**Purpose:** JSON-LD structured data for SEO

**Implementation:**
```typescript
// app/page.tsx
export default async function HomePage() {
  const siteConfig = await getSiteConfig();
  
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: 'Product Designer',
    email: siteConfig.email,
    url: 'https://[domain]',
    sameAs: siteConfig.socialLinks.map(link => link.url),
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* Page content */}
    </>
  );
}
```

**Traceability:** R-026

**Notes:** Case study CreativeWork schema deferred to future iteration.

---

### 3.3 Sitemap Generation (R-027)

**Purpose:** Dynamic sitemap for SEO

**Implementation:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'published' } },
    limit: 100,
  });
  
  const baseUrl = 'https://[domain]';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
```

**Output Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[domain]</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://[domain]#about</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Traceability:** R-027

**Notes:** Case study page URLs deferred to future iteration.

---

### 3.4 Robots.txt (R-028)

**Implementation:**
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: 'https://[domain]/sitemap.xml',
  };
}
```

**Output:**
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://[domain]/sitemap.xml
```

**Traceability:** R-028

---

## 4. GraphQL API (Optional Enhancement)

Payload CMS provides auto-generated GraphQL API alongside REST.

**Endpoint:** `/api/graphql`

**Example Query:**
```graphql
query GetPublishedProjects {
  Projects(where: { status: { equals: published } }, sort: "order") {
    docs {
      id
      title
      slug
      description
      heroImage {
        url
        alt
      }
      categories {
        name
      }
    }
  }
}
```

**Usage:** Optional for frontend data fetching (REST preferred for simplicity)

---

## 5. Webhook API (CI/CD Integration)

### 5.1 Build Trigger Webhook

**Purpose:** Trigger GitHub Actions on content publish

**Implementation:**
```typescript
// /src/payload/hooks/afterChange.ts
export const triggerBuildWebhook = async ({ doc, operation }) => {
  if (operation === 'update' && doc.status === 'published') {
    await fetch('https://api.github.com/repos/[user]/[repo]/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'content_published',
        client_payload: {
          collection: 'projects',
          id: doc.id,
          slug: doc.slug,
        },
      }),
    });
  }
};
```

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy on Content Publish
on:
  repository_dispatch:
    types: [content_published]
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npx wrangler publish
```

**Traceability:** PRD § 12.1 Rollout, R-019

---

## 6. API Error Handling

### 6.1 Standard Error Response

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string; // For validation errors
  };
}
```

**Example:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### 6.2 Error Codes

| Code | HTTP Status | Description | Client Action |
|------|-------------|-------------|---------------|
| `UNAUTHORIZED` | 401 | No valid auth token | Redirect to login |
| `FORBIDDEN` | 403 | Insufficient permissions | Show access denied message |
| `NOT_FOUND` | 404 | Resource not found | Show 404 page |
| `VALIDATION_ERROR` | 400 | Invalid request data | Display field errors |
| `CONFLICT` | 409 | Unique constraint violation | Suggest alternative |
| `PAYLOAD_TOO_LARGE` | 413 | File too large | Compress and retry |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | 500 | Server error | Show generic error + retry |

---

## 7. Rate Limiting & Quotas

### 7.1 API Rate Limits

| Endpoint Pattern | Limit | Window | Scope |
|-----------------|-------|--------|-------|
| `/api/projects` (GET) | 100 req | 1 min | IP address |
| `/api/projects` (POST/PATCH) | 10 req | 1 min | User |
| `/api/media` (POST) | 10 uploads | 1 min | User |
| `/api/users/login` | 5 attempts | 5 min | IP address |

**Implementation:**
```typescript
// Cloudflare Workers rate limiting
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: cloudflareKV,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

export async function middleware(request: Request) {
  const { success } = await ratelimit.limit(request.headers.get('cf-connecting-ip'));
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
}
```

---

## 8. Caching Strategy

### 8.1 Cloudflare CDN Cache

**Static Assets:**
- Images: Cache-Control: `public, max-age=31536000, immutable`
- Fonts: Cache-Control: `public, max-age=31536000, immutable`

**API Responses:**
- `/api/projects` (GET): Cache-Control: `public, s-maxage=3600, stale-while-revalidate=86400`
- `/api/globals/*`: Cache-Control: `public, s-maxage=3600`

**Cache Invalidation:**
- On content publish: Purge cache via Cloudflare API
- Webhook triggers build + cache purge

---

### 8.2 Next.js ISR (Incremental Static Regeneration)

```typescript
// app/page.tsx
export const revalidate = 3600; // Revalidate every hour

// Or on-demand revalidation
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  revalidatePath('/');
  revalidatePath('/work/[slug]', 'page');
  
  return new Response('Revalidated', { status: 200 });
}
```

**Traceability:** PRD § 8.1 Performance, R-032

---

## 9. API Versioning

**Strategy:** URL path versioning (if needed in future)

**Current:** No versioning (v1 implicit)

**Future:**
- `/api/v2/projects` (when breaking changes needed)
- Maintain `/api/projects` (v1) for 6 months deprecation period

---

## 10. Acceptance Criteria (API Level)

- [ ] All Payload collections accessible via REST API
- [ ] OAuth authentication working (Google + GitHub)
- [ ] Admin endpoints return 401 for unauthenticated requests
- [ ] Validation errors return 400 with field-specific messages
- [ ] File uploads to Cloudflare R2 successful
- [ ] Image variants generated (thumbnail, card, large)
- [ ] Rate limiting enforced (429 responses)
- [ ] Sitemap generated dynamically
- [ ] Metadata API returns proper OpenGraph tags
- [ ] Structured data valid per schema.org

---

## 11. References

- **PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`
- **Data Spec:** `/tasks/001-portfolio-website/specs/data-spec.md`
- **Payload REST API Docs:** `https://payloadcms.com/docs/rest-api/overview`
- **Next.js Metadata API:** `https://nextjs.org/docs/app/building-your-application/optimizing/metadata`

---

**End of API Contract Spec**
