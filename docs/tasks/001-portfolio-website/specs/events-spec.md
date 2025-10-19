# Instrumentation & Events Specification

**Project:** Portfolio Website  
**Version:** 1.0  
**Date:** 2025-10-15  
**PRD:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md`

---

## 1. Overview

This specification defines analytics events, performance monitoring, error tracking, and audit logging for the portfolio website.

### Instrumentation Stack
- **Analytics:** Vercel Analytics or Cloudflare Web Analytics
- **Error Tracking:** Sentry (optional, future enhancement)
- **Performance:** Web Vitals API
- **Audit Logs:** Payload CMS built-in

---

## 2. Analytics Events

### 2.1 Page View Events

#### Event: `page_view`
**When:** User navigates to any page or section  
**Properties:**
```typescript
{
  event: 'page_view',
  properties: {
    page_path: string;        // e.g., '/', '/work/striker'
    page_title: string;        // Document title
    referrer: string;          // Previous page
    user_agent: string;        // Browser info
    viewport_width: number;    // Window width
    viewport_height: number;   // Window height
    timestamp: string;         // ISO 8601
  }
}
```

**Trigger Points:**
- Home page load
- Case study navigation
- Section scroll (Work, About)

**PII:** No

**Traceability:** PRD § 11.1

---

### 2.2 Interaction Events

#### Event: `carousel_interaction`
**When:** User interacts with carousel  
**Properties:**
```typescript
{
  event: 'carousel_interaction',
  properties: {
    action: 'auto-scroll' | 'hover-pause' | 'click' | 'swipe';
    carousel_type: 'hero' | 'work' | 'about';
    item_index: number;        // Current slide index
    total_items: number;
    project_slug: string;      // If work carousel
    timestamp: string;
  }
}
```

**Trigger Points:**
- Auto-scroll advance
- User hover (pause)
- Click on carousel item
- Swipe gesture (mobile)

**PII:** No

**Traceability:** PRD § 11.1, R-003, R-009

---

#### Event: `project_card_click`
**When:** User clicks on project card  
**Properties:**
```typescript
{
  event: 'project_card_click',
  properties: {
    project_slug: string;
    project_title: string;
    location: 'hero' | 'work-section';
    card_index: number;        // If in list
    timestamp: string;
  }
}
```

**Traceability:** PRD § 11.1, R-004

---

#### Event: `nav_link_click`
**When:** User clicks navigation link  
**Properties:**
```typescript
{
  event: 'nav_link_click',
  properties: {
    target: 'work' | 'about' | 'twitter' | 'linkedin' | 'email' | 'cv-download';
    link_text: string;
    location: 'header' | 'footer';
    timestamp: string;
  }
}
```

**Traceability:** PRD § 11.1, R-002

---

#### Event: `cv_download`
**When:** User downloads CV  
**Properties:**
```typescript
{
  event: 'cv_download',
  properties: {
    file_name: string;
    file_size_kb: number;
    source: 'nav-header' | 'about-section';
    timestamp: string;
  }
}
```

**Traceability:** PRD § 11.1, R-002, R-014

---

### 2.3 Performance Events

#### Event: `web_vitals`
**When:** Core Web Vitals measured  
**Properties:**
```typescript
{
  event: 'web_vitals',
  properties: {
    metric_name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';
    value: number;              // Metric value (ms or score)
    rating: 'good' | 'needs-improvement' | 'poor';
    page_path: string;
    connection_type: string;    // '4g', 'wifi', etc.
    timestamp: string;
  }
}
```

**Implementation:**
```typescript
// app/layout.tsx
import { sendToAnalytics } from '@/lib/analytics';
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

export function WebVitalsReporter() {
  useEffect(() => {
    onCLS(metric => sendToAnalytics({ event: 'web_vitals', properties: metric }));
    onFCP(metric => sendToAnalytics({ event: 'web_vitals', properties: metric }));
    onFID(metric => sendToAnalytics({ event: 'web_vitals', properties: metric }));
    onLCP(metric => sendToAnalytics({ event: 'web_vitals', properties: metric }));
    onTTFB(metric => sendToAnalytics({ event: 'web_vitals', properties: metric }));
  }, []);
  
  return null;
}
```

**Traceability:** PRD § 2 Success Metrics, § 11.1

---

### 2.4 Error Events

#### Event: `error`
**When:** Client-side error occurs  
**Properties:**
```typescript
{
  event: 'error',
  properties: {
    error_type: 'javascript' | 'network' | 'resource' | 'promise-rejection';
    error_message: string;
    stack_trace: string;       // First 500 chars
    page_path: string;
    user_agent: string;
    timestamp: string;
  }
}
```

**Implementation:**
```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    sendToAnalytics({
      event: 'error',
      properties: {
        error_type: 'javascript',
        error_message: error.message,
        stack_trace: error.stack?.slice(0, 500),
        page_path: window.location.pathname,
      },
    });
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Privacy:** Sanitize stack traces to remove PII

**Traceability:** PRD § 11.1

---

## 3. CMS Audit Logs

### 3.1 Payload Built-in Audit Trail

Payload CMS automatically logs:
- `project_created`
- `project_updated`
- `project_deleted`
- `case_study_created`
- `media_uploaded`

**Storage:** D1 database table `payload_audit_log`

**Schema:**
```sql
CREATE TABLE payload_audit_log (
  id TEXT PRIMARY KEY,
  collection TEXT NOT NULL,
  document_id TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'create' | 'update' | 'delete'
  user_id TEXT REFERENCES users(id),
  changes JSON,              -- Changed fields
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_collection_doc ON payload_audit_log(collection, document_id);
CREATE INDEX idx_audit_timestamp ON payload_audit_log(timestamp);
```

**Retention:** 90 days (automated cleanup job)

**Traceability:** PRD § 11.2

---

### 3.2 Custom Audit Events

#### Event: `project_published`
**When:** Project status changed to 'published'  
**Log:**
```typescript
{
  event: 'project_published',
  user: user.email,
  project_slug: project.slug,
  timestamp: new Date().toISOString(),
}
```

**Implementation:**
```typescript
// In Projects collection hooks
hooks: {
  afterChange: [
    async ({ doc, previousDoc, req }) => {
      if (doc.status === 'published' && previousDoc?.status === 'draft') {
        await payload.create({
          collection: 'audit-log',
          data: {
            event: 'project_published',
            user: req.user.email,
            project_slug: doc.slug,
          },
        });
      }
    },
  ],
}
```

**Traceability:** PRD § 11.2

---

## 4. Performance Monitoring

### 4.1 Server-Side Timing

**Cloudflare Workers:**
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const startTime = Date.now();
    
    const response = await handleRequest(request, env);
    
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn('Slow request', {
        url: request.url,
        duration,
        method: request.method,
      });
    }
    
    response.headers.set('Server-Timing', `total;dur=${duration}`);
    
    return response;
  },
};
```

---

### 4.2 Client-Side Performance Budget

**Lighthouse CI:**
```yaml
# lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1200 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**Automated Testing:**
- Run Lighthouse CI on every deploy
- Fail build if performance < 90

**Traceability:** PRD § 2 Success Metrics

---

## 5. Funnels & Dashboards

### 5.1 User Journey Funnel

**Funnel:** Landing → Work Section → CV Download

```
Step 1: page_view (/)                    [100%]
  ↓
Step 2: nav_link_click (work)            [~70%]
  ↓
Step 3: carousel_interaction             [~50%]
  ↓
Step 4: nav_link_click (about)           [~40%]
  ↓
Step 5: cv_download                      [~15%]
```

**Dashboard Query:**
```sql
-- Conversion rate: Landing → CV Download
SELECT 
  COUNT(DISTINCT user_id) FILTER (WHERE event = 'page_view') as total_visitors,
  COUNT(DISTINCT user_id) FILTER (WHERE event = 'cv_download') as cv_downloads,
  (cv_downloads * 100.0 / total_visitors) as conversion_rate
FROM analytics_events
WHERE timestamp > NOW() - INTERVAL '30 days';
```

---

### 5.2 Performance Dashboard

**Metrics to Track:**
- Web Vitals trends (FCP, LCP, CLS over time)
- Lighthouse scores per page
- API response times (p50, p95, p99)
- Error rate by page/component

**Tools:**
- Cloudflare Analytics (free)
- Vercel Analytics (if using Vercel)
- Custom dashboard (optional)

---

### 5.3 Content Dashboard

**Metrics:**
- Projects published per month
- Case studies created per month
- Media uploads per week
- CMS login frequency
- Most viewed projects (from analytics)

**Implementation:** Payload CMS admin dashboard widgets

---

## 6. Privacy & Compliance

### 6.1 Data Collection Policy

**No PII Collected in Analytics:**
- No user emails or names
- No IP addresses stored (only hashed for rate limiting)
- No cookies for tracking (analytics via server-side)

**User Consent:**
- No cookie banner needed (no tracking cookies)
- Analytics is essential (performance monitoring)

---

### 6.2 Event Sampling

**Full Sampling (100%):**
- Page views
- Errors
- CV downloads

**Sampled (10%):**
- Carousel auto-scrolls (reduce noise)
- Hover events (reduce noise)

**Implementation:**
```typescript
function shouldSampleEvent(eventName: string): boolean {
  if (['error', 'cv_download', 'page_view'].includes(eventName)) {
    return true; // Always send
  }
  
  if (['carousel_interaction'].includes(eventName)) {
    return Math.random() < 0.1; // 10% sampling
  }
  
  return true; // Default: send all
}
```

---

## 7. Implementation Example

### 7.1 Analytics Client

```typescript
// /src/lib/analytics.ts
interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
}

export async function trackEvent({ event, properties }: AnalyticsEvent) {
  // Check sampling
  if (!shouldSampleEvent(event)) return;
  
  // Send to analytics
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
      },
    }),
  });
}

// Usage
trackEvent({
  event: 'project_card_click',
  properties: {
    project_slug: 'striker',
    location: 'hero',
  },
});
```

---

### 7.2 Web Vitals Reporter

```typescript
// /src/components/WebVitalsReporter.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackEvent({
      event: 'web_vitals',
      properties: {
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
        page_path: window.location.pathname,
      },
    });
  });
  
  return null;
}
```

---

## 8. Acceptance Criteria (Events Level)

- [ ] All defined events fire at correct trigger points
- [ ] Event properties match schema
- [ ] No PII collected in analytics events
- [ ] Web Vitals reported to analytics
- [ ] Error events captured and logged
- [ ] CMS audit logs track content changes
- [ ] Sampling logic reduces noise (10% for hover/auto-scroll)
- [ ] Analytics dashboard shows key metrics

---

## 9. References

- **PRD Instrumentation:** `/tasks/001-portfolio-website/prd/001-prd-portfolio-website.md` § 11
- **Web Vitals Library:** `https://github.com/GoogleChrome/web-vitals`
- **Cloudflare Analytics:** `https://developers.cloudflare.com/analytics/`

---

**End of Events Spec**
