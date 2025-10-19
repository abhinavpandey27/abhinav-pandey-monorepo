# Rule: Generating a Task List from a PRD

## Goal

Create a detailed, step-by-step task list from a PRD (and associated spec) with strict traceability to requirement IDs (`R-###`) and embedded testing for every task.

## Output

- **Format:** Markdown (`.md`)
- **Preferred (Task Bundle Mode):** `/tasks/[n]-[feature-slug]/tasks/tasks-[prd-file-name].md`
- **Fallback (legacy):** `/tasks/tasks-[prd-file-name].md`

## Process

1.  **Receive PRD/Spec Reference:** The user points to the PRD and, if present, the spec bundle.
2.  **Analyze PRD & Spec:** Read functional requirements (`R-###`), flows, non‑functional constraints, and spec sections (design, API, data, system). Do not re‑ask earlier clarifications.
3.  **Assess Current State:** Review the codebase for conventions and reusable components/services. Identify existing files impacted.
4.  **Phase 1: Generate Parent Tasks:** Create high‑level tasks that together satisfy all `R-###`. Each parent task lists the `Traceability: [R-###,…]` it covers. Present parent tasks only and pause. Inform: "Generated high‑level tasks with R‑### mapping. Reply 'Go' to expand into sub‑tasks."
5.  **Wait for Confirmation.**
6.  **Phase 2: Generate Sub‑Tasks:** Break each parent task into actionable sub‑tasks including development and testing steps. Every sub‑task must include an embedded testing plan and acceptance check.
7.  **Identify Relevant Files:** List files to create/modify including corresponding test files (unit/integration/visual/e2e/a11y) under `Relevant Files`.
8.  **Generate Final Output:** Combine parent tasks, sub‑tasks, traceability, and files into the final structure below.
9.  **Save Task List:** Use Task Bundle Mode path when available; otherwise use legacy path.

## Output Format

The generated task list _must_ follow this structure:

```markdown
## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Parent Task Title — Traceability: [R-012, R-017]
  - [ ] 1.1 Build component/page/module (brief description)
        Acceptance: aligns with spec wireframes, handles states (default/loading/error/empty)
        Tests:
          - [ ] Unit (functions/components)
          - [ ] Integration (module/route/service interaction)
          - [ ] Visual (storybook snapshot or screenshot diff)
          - [ ] E2E (Playwright critical path)
          - [ ] Accessibility (axe/pa11y checks)
  - [ ] 1.2 API integration (hook/route/client) — happy + error paths
        Tests: unit + integration + e2e
  - [ ] 1.3 Telemetry/events implemented per spec
        Tests: assert events, properties, and sampling
- [ ] 2.0 Parent Task Title — Traceability: [R-020]
  - [ ] 2.1 …
```
```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature with awareness of the existing codebase context.

## Testing Guidance

- Prefer existing tools in the repo; otherwise suggest common defaults:
  - Unit/Integration: Jest/Vitest
  - E2E: Playwright (smoke and critical path)
  - Visual: Storybook snapshots or screenshot diffing (e.g., Playwright screenshot)
  - Accessibility: axe/pa11y checks on key pages/states
  - Type Safety: TypeScript `tsc --noEmit`, runtime schema validation for boundaries (e.g., zod or OpenAPI validators)
- Each sub‑task must specify which tests are added and their file paths.
