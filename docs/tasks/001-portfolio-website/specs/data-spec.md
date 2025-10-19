# Data & Schema Specification

**Project:** Portfolio Website  
**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`

---

## 1. Overview

This specification defines the data model, Payload CMS collections, and database schema for the portfolio website. All data is stored in Cloudflare D1 (SQLite) via Payload CMS ORM.

### Technology Stack
- **Database:** Cloudflare D1 (SQLite-compatible)
- **ORM:** Payload CMS (Mongoose-style schema)
- **Storage:** Cloudflare R2 (media files)

---

## 2. Payload CMS Collections

### 2.1 Projects Collection (R-018, R-019)

**Purpose:** Store project/work portfolio items

**Schema:**
```typescript
// /src/payload/collections/Projects.ts
import { CollectionConfig } from 'payload/types';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => !!user, // Admin only
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      maxLength: 150,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && !data.slug) {
              data.slug = slugify(data.title);
            }
            return data.slug;
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      minLength: 200,
      maxLength: 500,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'team',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'timeline',
      type: 'text',
      required: true,
      maxLength: 50,
      admin: {
        placeholder: 'e.g., Q2 2022 - Q4 2022',
      },
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'outcomes',
      type: 'array',
      minRows: 0,
      maxRows: 5,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          maxLength: 100,
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgroundColor',
      type: 'text',
      required: true,
      defaultValue: '#090e03',
      admin: {
        description: 'Hex color for work section background',
        components: {
          Field: ColorPickerField, // Custom color picker
        },
      },
      validate: (value) => {
        return /^#[0-9A-F]{6}$/i.test(value) || 'Must be valid hex color';
      },
    },
    {
      name: 'carouselImages',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show as featured project on landing page (only one should be featured)',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Ensure only one featured project
        if (data.featured) {
          await payload.update({
            collection: 'projects',
            where: { featured: { equals: true } },
            data: { featured: false },
          });
        }
        return data;
      },
    ],
  },
  timestamps: true,
};
```

**Database Indices:**
```sql
CREATE INDEX idx_projects_status_order ON projects(status, "order");
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
```

**Traceability:** R-018, R-019, PRD § 7.1

---

### 2.2 Media Collection

**Purpose:** Manage uploaded images, files, and assets

**Schema:**
```typescript
// /src/payload/collections/Media.ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    formatOptions: {
      format: 'webp',
      quality: 85,
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      maxLength: 200,
      admin: {
        description: 'Accessibility: Describe the image for screen readers',
      },
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ operation, req, data }) => {
        // Upload to Cloudflare R2 instead of local storage
        if (operation === 'create' && data.file) {
          const r2Url = await uploadToR2(data.file);
          data.url = r2Url;
        }
        return data;
      },
    ],
  },
};
```

**Storage Configuration:**
```typescript
// Cloudflare R2 adapter
import { R2StorageAdapter } from '@payloadcms/cloudflare-r2';

export const r2Adapter = new R2StorageAdapter({
  bucket: process.env.R2_BUCKET_NAME,
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
});
```

**Traceability:** PRD § 7.1, R-019, R-029

---

### 2.3 AboutSection Collection (R-020)

**Purpose:** Manage About section content (singleton)

**Schema:**
```typescript
// /src/payload/globals/AboutSection.ts
export const AboutSection: GlobalConfig = {
  slug: 'about-section',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'bio',
      type: 'richText',
      required: true,
      admin: {
        description: 'About section bio (2-3 paragraphs)',
      },
    },
    {
      name: 'imageCarousel',
      type: 'array',
      required: true,
      minRows: 4,
      maxRows: 12,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
};
```

**Note:** Using Payload Globals (singleton) instead of collection.

**Traceability:** R-020, PRD § 7.1

---

### 2.4 SiteConfig Global (R-021)

**Purpose:** Site-wide configuration (singleton)

**Schema:**
```typescript
// /src/payload/globals/SiteConfig.ts
export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Abhinav Pandey',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      defaultValue: 'Mumbai, India',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Public contact email',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Dribbble', value: 'dribbble' },
            { label: 'Behance', value: 'behance' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value) => {
            return /^https?:\/\/.+/.test(value) || 'Must be valid URL';
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional custom label (for "Custom" platform)',
            condition: (data, siblingData) => siblingData?.platform === 'custom',
          },
        },
      ],
    },
    {
      name: 'cvFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { equals: 'application/pdf' },
      },
    },
  ],
};
```

**Traceability:** R-021, PRD § 7.1

---

### 2.5 Users Collection (Authentication)

**Purpose:** Admin users for CMS access (R-017)

**Schema:**
```typescript
// /src/payload/collections/Users.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    strategies: [
      {
        name: 'google',
        Strategy: GoogleOAuth,
      },
      {
        name: 'github',
        Strategy: GitHubOAuth,
      },
    ],
    tokenExpiration: 7200, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      hasMany: false,
      options: [
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
};
```

**PII Handling:**
- Email: Stored encrypted in D1
- OAuth tokens: Stored in secure HTTP-only cookies
- No sensitive data logged

**Traceability:** R-017

---

## 3. Database Schema (D1)

### 3.1 Tables Generated by Payload

Payload automatically generates tables based on collections:

```sql
-- Projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  role TEXT NOT NULL,
  team TEXT,
  timeline TEXT NOT NULL,
  categories JSON NOT NULL, -- Array stored as JSON
  outcomes JSON, -- Array stored as JSON
  hero_image_id TEXT NOT NULL REFERENCES media(id),
  background_color TEXT NOT NULL DEFAULT '#090e03',
  carousel_images JSON NOT NULL, -- Array of media IDs as JSON
  featured INTEGER DEFAULT 0, -- Boolean as integer
  "order" INTEGER DEFAULT 0,
  status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url TEXT NOT NULL,
  alt TEXT,
  sizes JSON, -- Generated image sizes
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  roles TEXT DEFAULT 'admin',
  oauth_provider TEXT, -- 'google' or 'github'
  oauth_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Globals table (for AboutSection, SiteConfig)
CREATE TABLE globals (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  data JSON NOT NULL, -- All fields as JSON
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Indices (See § 2.1):**
```sql
CREATE INDEX idx_projects_status_order ON projects(status, "order");
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = 1;
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_users_email ON users(email);
```

---

## 4. Migrations & Backfill

### 4.1 Initial Setup Migration

**Migration File:** `migrations/001-initial-schema.ts`

```typescript
export async function up(payload: Payload) {
  // Payload automatically creates tables from collections
  // This migration seeds initial data
  
  // Create admin user (manual OAuth first login)
  console.log('Please log in via OAuth to create first admin user');
  
  // Seed sample Striker project
  const strikerProject = await payload.create({
    collection: 'projects',
    data: {
      title: 'Striker',
      subtitle: 'NFT-based Cricket Fantasy Game',
      slug: 'striker',
      description: 'Did 0→1 for a new player-card-based fantasy system...',
      role: 'Product Designer II',
      team: '2 Designers, 2 PMs, 1 Program Manager, 1 Engineering Manager, 5 SDEs and 2 SDETs',
      timeline: 'Q2 2022 - Q4 2022',
      categories: [
        { name: 'Real Money Gaming' },
        { name: 'Fantasy Sports' },
        { name: 'Web3' },
        { name: 'NFT' },
      ],
      outcomes: [
        { text: '25K Daily Active Users' },
        { text: '1 Million USD Traded Volume' },
      ],
      heroImage: '[uploaded-manually]',
      backgroundColor: '#090e03',
      carouselImages: '[uploaded-manually]',
      featured: true,
      order: 0,
      status: 'published',
    },
  });
  
  console.log('Sample project created:', strikerProject.id);
}

export async function down(payload: Payload) {
  // Rollback: Delete sample project
  await payload.delete({
    collection: 'projects',
    where: { slug: { equals: 'striker' } },
  });
}
```

**Backfill Plan:**
- Initial launch: Manual upload of Striker project images via CMS
- Content: Designer adds remaining projects via CMS

**Traceability:** Context Pack Decision B5

---

### 4.2 Future Migrations

**Versioning:**
- Migration files: `migrations/XXX-description.ts`
- Tracked in: `payload_migrations` table (Payload built-in)

**Rollback Strategy:**
- Each migration has `up()` and `down()` functions
- Test rollback in staging before production
- Backup D1 database before migration (Cloudflare dashboard)

---

## 5. Data Validation & Constraints

### 5.1 Field Validation

**Slug Validation:**
```typescript
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Hook
hooks: {
  beforeValidate: [
    ({ data }) => {
      if (data.title && !data.slug) {
        data.slug = slugify(data.title);
      }
    },
  ],
}
```

**Color Validation:**
```typescript
validate: (value) => {
  const hexRegex = /^#([0-9A-F]{6}|[0-9A-F]{3})$/i;
  return hexRegex.test(value) || 'Invalid hex color';
}
```

**File Size Limits:**
- Images: Max 10MB
- PDF: Max 5MB

```typescript
upload: {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}
```

---

### 5.2 Business Rules

**Featured Project Constraint:**
- Only one project can have `featured: true` at a time
- Implemented via `beforeChange` hook (see § 2.1)

**Status Rules:**
- `draft` projects: Not visible on frontend
- `published` projects: Visible if `status === 'published'`

---

## 6. Data Privacy & PII

### 6.1 PII Inventory

| Field | Location | Sensitivity | Retention | Public |
|-------|----------|-------------|-----------|--------|
| `users.email` | Users table | Medium | Indefinite | No |
| `site_config.email` | Globals table | Low | Indefinite | Yes (public contact) |

**GDPR Considerations:**
- Email: Used for authentication and public contact (legitimate interest)
- No marketing or tracking without consent
- User can request deletion (GDPR right to erasure)

---

### 6.2 Data Retention

- **Projects:** Retained indefinitely (soft delete via `status: draft`)
- **Media:** Retained as long as referenced by projects (orphan cleanup job monthly)
- **Audit Logs:** 90 days (Payload built-in audit trail)
- **User Sessions:** 7 days (cookie expiry)

---

## 7. Query Patterns & Optimization

### 7.1 Frontend Data Fetching

**Home Page Query:**
```typescript
// app/page.tsx
// Get all published projects
const projects = await payload.find({
  collection: 'projects',
  where: { status: { equals: 'published' } },
  sort: 'order',
  limit: 100,
});

// Get featured project
const featuredProject = await payload.find({
  collection: 'projects',
  where: {
    featured: { equals: true },
    status: { equals: 'published' },
  },
  limit: 1,
});
```

**Performance:**
- Use Next.js Static Generation (`generateStaticParams`)
- Revalidate on CMS publish (webhook trigger)
- Cache TTL: 1 hour (CDN cache)

---

### 7.2 Index Usage

**Query:** Get published projects in order
```sql
SELECT * FROM projects 
WHERE status = 'published' 
ORDER BY "order" ASC;

-- Uses: idx_projects_status_order
```

**Query:** Get featured project
```sql
SELECT * FROM projects 
WHERE featured = 1 AND status = 'published' 
LIMIT 1;

-- Uses: idx_projects_featured
```

---

## 8. Acceptance Criteria (Data Level)

- [ ] All Payload collections match PRD data model
- [ ] Database indices created for query performance
- [ ] OAuth authentication working (Google + GitHub)
- [ ] Media uploads to Cloudflare R2 successfully
- [ ] Slug auto-generation working correctly
- [ ] Featured project constraint enforced (only one at a time)
- [ ] File upload size limits enforced
- [ ] Sample Striker project data seeded

---

## 9. References

- **PRD Data Model:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md` § 7
- **Payload CMS Docs:** `https://payloadcms.com/docs/configuration/collections`
- **Cloudflare D1 Docs:** `https://developers.cloudflare.com/d1/`
- **Cloudflare R2 Docs:** `https://developers.cloudflare.com/r2/`

---

**End of Data & Schema Spec**
