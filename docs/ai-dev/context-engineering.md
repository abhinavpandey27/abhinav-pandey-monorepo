# Rule: Context Engineering for PRD Readiness

## Goal

Equip an AI assistant to deeply understand and structure the problem space before execution — clarifying inputs, resolving ambiguity, and capturing all relevant context into a concise, reusable "Context Pack" that can be handed off to PRD creation.

## Inputs (What the user may provide)

- A high‑level feature prompt or problem statement
- Links to designs (e.g., Figma), docs, issues/PRs, tickets
- A repository link or local codebase context
- Existing metrics, KPIs, constraints, SLAs, or compliance requirements
- Known dependencies or integration points (internal services, 3rd‑party APIs)

## Process

1. **Collect and Inventory Sources**
   - List every input and where it came from (prompt, design link, repo path, issue link).
   - For each source, note what it covers and what it does not.

2. **Relevance Check (Gate)**
   - For each source, state why it is relevant to the goal. If uncertain, mark as "unclear relevance" and add a clarifying question.
   - Do not infer functionality not present in the sources.

3. **Extract Facts and Constraints**
   - Capture only verifiable facts (users, flows, states, data, rules, constraints). Cite the source for each key fact when possible (e.g., "from README.md:42" or "from Figma page ‘Checkout’").

4. **Surface Unknowns vs Assumptions**
   - List unknowns as questions. Keep assumptions minimal and explicitly labeled with rationale and impact.

5. **Ask Clarifying Questions**
   - Before moving on, ask targeted questions to resolve ambiguity. Provide lettered/numbered answer options so the user can respond quickly.

6. **Context Breakdown (Normalize)**
   - Organize findings into a consistent schema: Problem → Objectives → Users → Flows → Data → Constraints → Dependencies → Assumptions → Open Questions → Non‑Goals.
   - For Flows and design related context, break down into user journeys and specific flows. 

7. **Readiness Check (Gate)**
   - Confirm the minimum context is present to start PRD (see checklist below). If not, stop and request answers.

8. **Produce the Context Pack**
   - Output both a human‑readable summary and a structured block (YAML) for easy handoff to PRD creation.

9. **Pause for Confirmation**
   - Share the Context Pack and ask: "Ready for me to generate the PRD based on this context? Reply 'Go' to proceed or answer the open questions."

## Clarifying Questions (Examples)

Adapt to the inputs provided. Always include options (A/B/C/…) where helpful.

- **Problem & Value**: What outcome are we optimizing for? A) Conversion B) Retention C) Operational efficiency D) Compliance E) Other: ____
- **Primary User**: Who is the main user? A) End user B) Admin C) Internal ops D) API client E) Other: ____
- **Scope Boundaries**: Which user journeys are in scope for v1? Pick 1–3. Provide links/screens if available.
- **Non‑Goals**: What is explicitly out of scope for v1?
- **Success Criteria**: What metrics/KPIs define success? Provide baseline if known.
- **Designs** (if a design link exists): Which pages/frames are authoritative? Any components/layouts we must reuse? Accessibility standards to follow?
- **Repository** (if a repo link exists): Which service/app is the integration point? Language/framework? Testing setup? Any existing modules to reuse? Where should the feature live (paths/namespaces)?
- **Data**: What data do we read/write? Where does it come from? Any PII/PHI considerations?

## Context Breakdown (Dimensions)

Capture each dimension succinctly, referencing sources where applicable. Use the most concise and clear language possible.

- **Problem Statement** — The user pain/opportunity in one sentence
- **Objectives** — Measurable goals (what success looks like)
- **Target Users** — Primary/secondary personas and access levels
- **Primary Flows** — Core steps and states (happy path + key alternates)
- **Interfaces & Artifacts** — Designs, APIs, events, pages, entry points
- **Data** — Entities, fields, sources, retention, privacy
- **Assumptions** — Minimal, explicit, with rationale
- **Open Questions** — Unknowns that block PRD or implementation
- **Non‑Goals** — What we will not do in this iteration

## Edge Cases / What Might Go Wrong

- Missing or conflicting inputs (e.g., design says X, code says Y)
- Vague goals without measurable success criteria
- Over‑reliance on assumptions or invented context
- Ignoring legacy behavior revealed by the repo/tests/issues

## Readiness Check (Minimum to Proceed to PRD)

Proceed only if all are true:

1. Goal and target user are clearly stated.
2. Primary flow(s) or user stories are identified.
3. Key constraints and dependencies are captured or explicitly unknown.
4. Success criteria are defined or a plan to define them exists.
5. Non‑goals are listed to bound scope.
6. Open questions are enumerated and do not block a basic PRD skeleton.
7. All facts have traceable sources (or are clearly labeled assumptions).

If any item fails, ask clarifying questions and wait.

## Output

Preferred: Task Bundle Mode
- **Root:** `/tasks/[n]-[feature-slug]/`
- **Location:** `context/`
- **Filename:** `context-pack.md`

Fallback (legacy):
- **Location:** `/contexts/`
- **Filename:** `0001-context-[feature-slug].md`

### Context Pack Template (Human‑Readable)

```markdown
# Context Pack — [Feature Name]

## Goal Summary
One line restatement of the user’s goal.

## Sources
- Prompt: …
- Designs: …
- Repo/Files: …
- Issues/Docs: …

## Context Breakdown
- Problem Statement: …
- Objectives: …
- Target Users: …
- Primary Flows: …
- Interfaces & Artifacts: …
- Data: …
- Constraints: …
- Dependencies: …
- Assumptions: …
- Open Questions: …
- Non‑Goals: …

## Risks & Edge Cases
- …

## Readiness
- Ready for PRD: Yes/No (why)
```

### Ready‑to‑Pass Context Schema (Structured)

Provide this YAML block for direct consumption by PRD generation.

```yaml
feature: ""
goal: ""
sources:
  - type: prompt|design|repo|issue|doc
    ref: ""   # link or path (e.g., src/app/page.tsx:42)
    notes: ""
problem: ""
objectives: [ ]
users:
  primary: ""
  secondary: [ ]
flows:
  - name: ""
    steps: [ ]
data:
  entities:
    - name: ""
      fields: [ ]
      pii: false
assumptions: [ ]
open_questions: [ ]
non_goals: [ ]
success_metrics: [ ]
risks: [ ]
ready_for_prd: false
```

## AI Instructions

1. Do not invent features or requirements not grounded in provided sources.
2. Prefer facts with citations; when citing code, use `path:line` where possible.
3. Ask clarifying questions with lettered/numbered options; wait for answers.
4. Keep assumptions minimal and clearly labeled.
5. Save to Task Bundle Mode (`/tasks/[n]-[feature-slug]/context/context-pack.md`) when possible; otherwise use the fallback path.
6. Stop after producing the Context Pack and wait for the user to say "Go" before generating the PRD.
