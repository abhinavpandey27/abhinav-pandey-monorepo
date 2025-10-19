# 🚀 AI Dev Tasks 🤖

Welcome to **AI Dev Tasks**! This repository provides a collection of markdown files designed to supercharge your feature development workflow with AI-powered IDEs and CLIs. Originally built for [Cursor](https://cursor.sh/), these tools work with any AI coding assistant including Claude Code, Windsurf, and others. By leveraging these structured prompts, you can systematically approach building features, from ideation to implementation, with built-in checkpoints for verification.

Stop wrestling with monolithic AI requests and start guiding your AI collaborator step-by-step!

## ✨ The Core Idea

Building complex features with AI can sometimes feel like a black box. This workflow brings structure and control using five focused artifacts:

1. **Context Pack:** Capture facts, unknowns, constraints, and sources before doing anything.
2. **PRD:** Define what will be built and why, grounded in the Context Pack.
3. **Spec:** Detail how requirements will work across UX, API, data, and system design.
4. **Tasks:** Break the spec into step-by-step work with testing baked in.
5. **Process:** Execute tasks one at a time with checkpoints and commits.

This structured approach helps ensure the AI stays on track, makes it easier to debug issues, and gives you confidence in the generated code.

## Workflow: From Idea to Implemented Feature 💡➡️💻

Here's the step-by-step process using the `.md` files in this repository:

### 0️⃣ Context Engineering (required)
- Use `@context-engineering.md` to collect sources, resolve ambiguities, and produce a Context Pack.
- Saves to Task Bundle Mode by default: `/tasks/[n]-[feature]/context/context-pack.md`.

### 1️⃣ Create the PRD
- Use `@create-prd.md` to generate a PRD using the Context Pack (no re-asking answered questions).
- ARS/EARS-style requirements with IDs `R-###`, plus PRD Alpha mode when unknowns remain.
- Saves to `/tasks/[n]-[feature]/prd/[n]-prd-[feature].md`.

### 2️⃣ Generate the Spec
- Use `@generate-spec.md` to convert the PRD into implementation-ready specs.
- Includes ASCII wireframes, API contracts, data/schema, instrumentation, and system design.
- Maintains R-### traceability via `specs/spec-index.md` and wireframes in `specs/wireframes/`.

### 3️⃣ Generate the Task List
- Use `@generate-tasks.md` to create parent tasks and sub-tasks that cover every `R-###`.
- Each sub-task includes testing: unit, integration, visual, E2E (Playwright), accessibility.
- Saves to `/tasks/[n]-[feature]/tasks/tasks-[prd-file].md`.

### 4️⃣ Process the Task List
- Use `@process-task-list.md` to implement tasks one at a time, following the commit protocol.
- Do not start the next sub-task until the current one is reviewed and approved.

### Video Demonstration 🎥

If you'd like to see this in action, I demonstrated it on [Claire Vo's "How I AI" podcast](https://www.youtube.com/watch?v=fD4ktSkNCw4).

[![Demonstration of AI Dev Tasks on How I AI Podcast](https://img.youtube.com/vi/fD4ktSkNCw4/maxresdefault.jpg)](https://www.youtube.com/watch?v=fD4ktSkNCw4).

## 🗂️ Files in this Repository

- `context-engineering.md` — Build the Context Pack with sources, constraints, and questions.
- `create-prd.md` — Generate PRD (Alpha or Full) with ARS/EARS `R-###` requirements.
- `generate-spec.md` — Produce design/API/data/system specs with ASCII wireframes and traceability.
- `generate-tasks.md` — Create tasks with per-sub-task testing and R-### mapping.
- `process-task-list.md` — Execute tasks sequentially with commit protocol.

## 📦 Task Bundle Mode (default)

Each feature lives in its own folder so everything stays organized and traceable.

```
/tasks/
  0001-checkout-flow/
    context/
      context-pack.md
    prd/
      0001-prd-checkout-flow.md
    specs/
      design-spec.md
      api-spec.md
      data-spec.md
      events-spec.md
      system-spec.md
      spec-index.md
      wireframes/
        CheckoutPage.md.default.wire
        CheckoutPage.md.error.wire
    tasks/
      tasks-0001-prd-checkout-flow.md
```

## 🌟 Benefits

* **Structured Development:** Enforces a clear process from idea to code.
* **Step-by-Step Verification:** Allows you to review and approve AI-generated code at each small step, ensuring quality and control.
* **Manages Complexity:** Breaks down large features into smaller, digestible tasks for the AI, reducing the chance of it getting lost or generating overly complex, incorrect code.
* **Improved Reliability:** Offers a more dependable approach to leveraging AI for significant development work compared to single, large prompts.
* **Clear Progress Tracking:** Provides a visual representation of completed tasks, making it easy to see how much has been done and what's next.

## 🛠️ How to Use

1. **Clone or Download:** Get these `.md` files into your project or a central location where your AI tool can access them.
   ```bash
   git clone https://github.com/snarktank/ai-dev-tasks.git
   ```
2. **Follow the Workflow:** Systematically use the `.md` files in your AI assistant as described in the workflow above.
3. **Adapt and Iterate:**
    * Feel free to modify the prompts within the `.md` files to better suit your specific needs or coding style.
    * If the AI struggles with a task, try rephrasing your initial feature description or breaking down tasks even further.

## Tool-Specific Instructions

### Cursor

Cursor users can follow the workflow described above, using the `.md` files directly in the Agent chat:

1. Ensure you have the files from this repository accessible
2. In Cursor's Agent chat, reference files with `@` (e.g., `@context-engineering.md`, `@create-prd.md`, `@generate-spec.md`, `@generate-tasks.md`, `@process-task-list.md`)
3. Follow the 4-step workflow (0–4) outlined above
4. **MAX Mode for PRDs:** Using MAX mode in Cursor for PRD creation can yield more thorough results if your budget supports it

### Claude Code

To use these tools with Claude Code:

1. **Copy files to your repo**: Copy these `.md` files to a subdirectory in your project (e.g., `/ai-dev-tasks`)
   - `/ai-dev-tasks/context-engineering.md`
   - `/ai-dev-tasks/create-prd.md`
   - `/ai-dev-tasks/generate-spec.md`
   - `/ai-dev-tasks/generate-tasks.md`
   - `/ai-dev-tasks/process-task-list.md`

2. **Reference in CLAUDE.md**: Add these lines to your project's `./CLAUDE.md` file:
   ```
   # AI Dev Tasks
   Use these files for structured feature development:
   /ai-dev-tasks/context-engineering.md
   /ai-dev-tasks/create-prd.md
   /ai-dev-tasks/generate-spec.md
   /ai-dev-tasks/generate-tasks.md
   /ai-dev-tasks/process-task-list.md
   ```

3. **Create custom commands** (optional): For easier access, create these files in `.claude/commands/`:
   - `.claude/commands/context-engineering.md` → "Please use /ai-dev-tasks/context-engineering.md to assemble a Context Pack."
   - `.claude/commands/create-prd.md` → "Please use /ai-dev-tasks/create-prd.md to create a PRD from the Context Pack."
   - `.claude/commands/generate-spec.md` → "Please use /ai-dev-tasks/generate-spec.md to generate specs from the PRD."
   - `.claude/commands/generate-tasks.md` → "Please use /ai-dev-tasks/generate-tasks.md to create tasks from the spec/PRD."
   - `.claude/commands/process-task-list.md` → "Please use /ai-dev-tasks/process-task-list.md to execute the tasks."

   Make sure to restart Claude Code after adding these files (`/exit`).
   Then use commands like `/create-prd` to quickly start the workflow.
   Note: This setup can also be adopted for a global level across all your projects, please refer to the Claude Code documentation [here](https://docs.anthropic.com/en/docs/claude-code/memory) and [here](https://docs.anthropic.com/en/docs/claude-code/common-workflows#create-personal-slash-commands).

### Other Tools

For other AI-powered IDEs or CLIs:

1. Copy the `.md` files to your project
2. Reference them according to your tool's documentation
3. Follow the same workflow principles

## 💡 Tips for Success

- Prefer Task Bundle Mode so context, PRD, specs, tasks, and wireframes live together.
- Use `R-###` requirement IDs throughout PRD → Spec → Tasks for traceability.
- Produce ASCII wireframes before coding UI; map tokens and call out gaps.
- Bake tests into every sub‑task: unit, integration, visual, E2E (Playwright), accessibility.
- Use MAX/advanced modes for complex PRDs and specs if budget allows.

## 🤝 Contributing

Got ideas to improve these `.md` files or have new ones that fit this workflow? Contributions are welcome!

Please feel free to:

* Open an issue to discuss changes or suggest new features.
* Submit a pull request with your enhancements.

---

Happy AI-assisted developing!
