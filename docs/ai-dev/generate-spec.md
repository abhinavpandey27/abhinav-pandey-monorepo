# Rule: Generating a Specification from a PRD

## Goal

Convert the PRD into an actionable specification detailing how each requirement will be realized — across UX/UI, data, API, instrumentation, and technical architecture — with clear traceability back to PRD requirement IDs.

## Inputs

- A PRD file path (must include numbered requirements with IDs like `R-###`).
- Designs (e.g., Figma links) referenced by the PRD.
- Codebase context (repo paths, existing components/services), if available.
- Context Pack (from `context-engineering.md`) for sources and constraints.

## Output

Two supported layouts.

1) **Task Bundle Mode (recommended)**
- **Root:** `/tasks/[n]-[feature-slug]/`
- **Files/Dirs:**
  - `context/` → Context Pack(s) from context-engineering
  - `prd/` → `[n]-prd-[feature-slug].md`
  - `specs/` → All specs for this task
    - `design-spec.md` (Frontend Visual Spec + wireframes)
    - `api-spec.md` (API Contract Spec)
    - `events-spec.md` (Instrumentation/Telemetry)
    - `data-spec.md` (Schema/Migrations)
    - `system-spec.md` (Architecture/Workflows)
    - `wireframes/` (ASCII wireframe files per component/state/breakpoint)
    - `spec-index.md` (Traceability map R-### → spec locations)

2) **Flat Mode (backwards compatible)**
- **Specs:** `/specs/spec-[prd-file-name].md`
- Use when Task Bundle Mode is unavailable.

## Process

1. **Ingest PRD**
   - Parse requirement IDs (`R-###`) and sections (flows, data, constraints, non-goals, success metrics).
   - Import designs and sources from the PRD/Context Pack.

2. **Traceability Setup**
   - Build a Spec Index mapping each `R-###` to the spec subsections that implement it. All spec items must trace to at least one PRD requirement.
   - In Task Bundle Mode, write this to `specs/spec-index.md`.

3. **Clarifications Policy**
   - Do not re-ask questions answered during context engineering or PRD creation.
   - Only ask to resolve contradictions or critical gaps blocking spec details (e.g., undefined design tokens, unknown API fields).

4. **Author the Spec**
   - Fill out the sections below: Frontend Visual Spec, API Contract Spec, Data/Schema, Instrumentation, System Design, Acceptance, Dependencies, Risks, Decision Log.
   - Include code skeletons and ASCII diagrams for structure and communication only — no implementation.
   - Produce ASCII wireframes per component/breakpoint/state as separate files under `specs/wireframes/` and reference them from `design-spec.md`.

5. **Guardrail Pass**
   - Run the checklists under “What Might Go Wrong” and fix issues before saving.

6. **Save and Handoff**
   - In Task Bundle Mode, create the directory layout and write individual spec files.
   - In Flat Mode, save combined spec to `/specs/spec-[prd-file-name].md`.
   - Ask the user: “Ready to generate tasks from this spec? Reply ‘Go’ to proceed.”

---

## Spec Structure

1. **Feature Overview (from PRD)**
   - Goal summary, primary users, primary flows, success metrics.
   - Direct citations to PRD sections and sources.

2. **Spec Index & Traceability**
   - Table mapping PRD `R-###` → spec subsections and acceptance notes.

3. **Frontend Visual Spec**
   - **Design Tokens & Theming**
     - Token set required: color, typography, spacing, radius, shadow, z-index, breakpoints, motion.
     - Mapping to existing design system tokens (name → value). If a token is missing, add a “Token Gap” callout and proposed name/value.
     - Accessibility defaults: color contrast ≥ 4.5:1 for normal text (cite where applicable).
   - **Components & States**
     - For each page/feature component: purpose, props/inputs, states (default/loading/error/empty), interactions, keyboard support, ARIA roles/labels, focus order, i18n considerations.
     - Reuse policy: list candidate library/design-system components; define customization boundaries.
   - **Layout & Responsiveness**
     - Breakpoints and layout rules (grid/flex), content reflow behavior, min target sizes (44x44), safe areas, scroll/overflow.
   - **Styling Conventions**
     - How styles are applied (e.g., CSS Modules, Tailwind, CSS variables). Reference the project convention; do not invent new patterns.
     - Variables and class naming rules; theming switch behavior if applicable.
   - **Assets**
     - Icons/images/sprites: source of truth, optimization, responsive sizes, file types.
   - **Error & Edge States**
     - Visual treatments for validation, inline errors, banners, empty states, retries.
   - **ASCII Wireframes (Files, not code)**
     - Create simple, monospaced wireframes to communicate layout, hierarchy, states, and annotations — without HTML/CSS.
     - One file per component per breakpoint per state: `specs/wireframes/[component].[breakpoint].[state].wire`.
       - `component`: `Page`, `Form`, `Panel`, etc. (use PascalCase)
       - `breakpoint`: `sm|md|lg|xl`
       - `state`: `default|loading|error|empty|success`
     - Header metadata at the top of each file:
       ```
       # Wireframe: FeaturePage (md, default)
       # Traceability: R-012, R-017
       # Tokens: color.bg.surface, spacing.200, radius.100
       # Notes: Focus order → Header → Form → Submit; Esc closes Dialog
       ```
     - Example wireframe content (80 cols suggested):
       ```
       +--------------------------------------------------------------------------------+
       |  Header: AppTitle                               [Search ][? Help ] [ Avatar ] |
       +--------------------------------------------------------------------------------+
       |  Breadcrumbs: Home › Billing                                                        |
       +----------------------+---------------------------------------------------------+
       |  SideNav             |  BillingPlanPanel                                       |
       |  - Overview          |  ┌──────────────────────────────────────────────────┐   |
       |  - Plans   [active]  |  │ Plan: Pro                                          │   |
       |  - Invoices          |  │ Price: $29/mo                                      │   |
       |                      |  │ [ Change Plan ]   [ Cancel ]                       │   |
       |                      |  └──────────────────────────────────────────────────┘   |
       +----------------------+---------------------------------------------------------+
       |  Footer: © ACME 2025                                                           |
       +--------------------------------------------------------------------------------+
       ```
     - Annotate inline using brackets `[Note]` or footnotes below the frame.
     - Each wireframe file must list tokens used; if a token is missing, add a `Token Gap:` line.
     - Reference all wireframes from `specs/design-spec.md`.

4. **API Contract Spec**
   - For each endpoint:
     - `Method` `PATH`
     - Auth: scheme and scopes
     - Request: headers, query params, path params, body schema (JSON), examples
     - Response: status codes, body schema, examples
     - Errors: typed error codes/messages with localization guidance
     - Idempotency, pagination, sorting/filtering, rate limits, versioning policy
   - Include a canonical JSON schema (or OpenAPI snippet) for shared models.

5. **Data & Schema Changes**
   - Entities, fields (types, nullability, constraints), indices, relationships, migrations, data retention, backfill plan, PII flags.

6. **Instrumentation & Logging**
   - Analytics events with names and properties, trigger points, sampling, dashboards.
   - Logging levels, correlation/trace IDs, privacy budget and redaction rules.

7. **System Design & Workflows**
   - Architecture overview (services, queues, caches, feature flags).
   - Sequence diagrams (ASCII) for key flows, including failure and retry paths.
   - Performance budgets (e.g., web p95 TTI, API p95 latency), capacity assumptions.
   - Rollout plan: flag names, experiment design, fallback and rollback strategy.

8. **Acceptance Criteria (Spec Level)**
   - Concrete, testable criteria per major capability that validate spec completeness against PRD `R-###`.

9. **Implementation Dependencies & Order**
   - Cross‑team dependencies, migrations, feature flags, external approvals.
   - Suggested implementation sequence with rationale.

10. **Risks, Assumptions, and Mitigations**
    - Known risks, explicit assumptions with impact analysis, mitigation steps.

11. **Open Questions & Decision Log**
    - Items to confirm; ADR‑style entries capturing decisions, owners, dates.

12. **References**
    - PRD file path, design links, repo files (use `path:line` where applicable), external docs.

---

## Spec Templates

### 1) Frontend Component Template
```
Component: [Name]
Purpose: [What it does and why]
Props/Inputs: [name: type – description]
States: [default, loading, error, empty, success]
Interactions: [click, hover, keyboard]
Accessibility: [role, labels, focus order, shortcuts]
Tokens Used: [color.background.surface, spacing.200, ...]
Error Handling: [message text, inline/tooltip/banner]
Traceability: [R-###, R-###]
```

### 2) API Endpoint Template
```
Endpoint: [METHOD] /path/{id}
Auth: [type & scopes]
Request:
  Params: [name(type) – required – description]
  Body Schema: { … }
Response:
  200: { … }
  4xx/5xx: { code, message, details }
Errors: [code – when – client guidance]
Idempotency: [key]
Pagination: [scheme]
Traceability: [R-###, R-###]
```

### 3) Event/Telemetry Template
```
Event: app.feature.action_performed
When: [trigger]
Properties: [name – type – description]
PII: [yes/no – handling]
Traceability: [R-###]
```

### 4) Migration Template
```
Change: [table/collection] – [add/modify/remove]
Fields: [name – type – nullability – default]
Indices: [name – columns – type]
Backfill: [plan]
Rollback: [plan]
Traceability: [R-###]
```

### 5) ASCII Wireframe File Template
```
# Wireframe: [Component] ([breakpoint], [state])
# Traceability: [R-###, R-###]
# Tokens: [token.name.100, ...]
# Notes: [short notes on focus, keyboard, etc.]

[ASCII box layout 80 cols]

Footnotes:
1) Token Gap: [token.name] – propose [value]; rationale: [why]
2) Edge State: [condition] – [visual treatment]
```
```
Change: [table/collection] – [add/modify/remove]
Fields: [name – type – nullability – default]
Indices: [name – columns – type]
Backfill: [plan]
Rollback: [plan]
Traceability: [R-###]
```

---

## What Might Go Wrong

- Using undefined or ad‑hoc style variables breaking design-system consistency
- Spec deviates from PRD or lacks `R-###` traceability
- API examples not aligned with schema or missing error contracts
- No accessibility or responsive behavior defined for key flows
- Missing performance budgets or rollout/rollback strategy
- Over‑specifying code implementation details rather than behavior and contracts

### Checklists

**Visual Design**
- Tokens mapped or flagged as gaps
- States and interactions documented (incl. error/empty)
- Accessibility and i18n covered

**API**
- Request/response schemas + examples
- Error codes documented with guidance
- Pagination/sorting/versioning addressed

**Data**
- Migrations, indices, backfill/rollback
- PII flags and retention

**System**
- Sequence diagrams for critical paths
- Performance budgets + flag/rollout plan

**Traceability**
- Every spec item references at least one `R-###`

---

## AI Instructions

1. Read the PRD and import requirement IDs (`R-###`).
2. Do not re‑ask questions answered in context‑engineering or PRD; only resolve blockers.
3. Maintain strict traceability: every spec subsection ties to one or more `R-###`.
4. Prefer existing components, tokens, and patterns; call out gaps explicitly.
5. Include ASCII code skeletons and diagrams for clarity; do not implement code.
6. Prefer Task Bundle Mode; otherwise save to `/specs/spec-[prd-file-name].md`. Then ask whether to generate tasks.
