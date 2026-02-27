<!--
  Sync Impact Report
  ==================
  Version change: (none) → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (7 principles: I–VII)
    - Performance Standards
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed
      (Constitution Check section already reads from this file)
    - .specify/templates/spec-template.md ✅ no changes needed
      (no constitution references)
    - .specify/templates/tasks-template.md ✅ no changes needed
      (no constitution references)
    - .claude/commands/*.md ✅ no changes needed
      (all reference .specify/memory/constitution.md correctly)
  Follow-up TODOs: None
-->

# Local Planner Constitution

## Core Principles

### I. Zero External Runtime Dependencies

- Application MUST run entirely locally with zero network requests
- No external services, APIs, or CDNs at runtime
- Build-time dependencies (Astro, TypeScript compiler, Vitest,
  Playwright) are permitted
- If a runtime dependency becomes unavoidable, it MUST be justified
  in the Complexity Tracking section of plan.md

### II. Markdown as Single Source of Truth

- All task data MUST be stored as markdown files with YAML frontmatter
- One file per task, stored in project folders on the local filesystem
- Files MUST be human-readable and editable with any text editor
- No database, no binary formats, no proprietary storage
- Application MUST never corrupt or lose existing data in markdown files

### III. Keyboard-First

- 90% or more of task management actions MUST be completable via
  keyboard shortcuts
- All primary navigation (views, search, task creation) MUST have
  keyboard bindings
- Mouse/pointer interactions are supported but MUST NOT be the only
  path to any action
- Keyboard shortcuts MUST be documented and consistent across views

### IV. Desktop-First, Responsive

- Primary target is desktop browsers via local dev server
- UI MUST be designed for desktop-width viewports first
- Responsive layouts SHOULD gracefully degrade on smaller viewports
  but desktop is the priority
- Touch interactions are secondary to keyboard and mouse

### V. Testable Core Logic

- Core logic (markdown parsing, state management, date calculations)
  MUST be implemented as pure TypeScript in `src/lib/`, independent
  of the UI framework
- Unit tests (Vitest) MUST cover parser and store logic
- E2E tests (Playwright) MUST cover critical user journeys
- UI framework changes MUST NOT require rewriting core logic

### VI. Single User, Zero Auth

- Application is designed for a single local user
- No authentication, authorization, or user management
- No session management or login flows
- Multi-user support is explicitly out of scope

### VII. Git-Friendly

- All data formats MUST produce clean, meaningful diffs in version
  control
- One file per task for independent change tracking
- No binary artifacts in the data layer
- File naming MUST be deterministic and slug-based

## Performance Standards

- A project with 200 tasks MUST load and render in under 3 seconds
- Switching between views (Backlog, Kanban, Gantt) MUST complete in
  under 1 second
- Task creation MUST appear in all applicable views in under 5 seconds
- Markdown files MUST remain readable and correctly formatted after
  50 consecutive create/edit/delete operations

## Development Workflow

- Spec-driven: every feature begins with a specification
  (`/speckit.specify`) before any code is written
- Plan before implementing: architecture decisions MUST be documented
  in plan.md and validated against this constitution
- Tasks MUST be organized by user story for independent implementation
  and testing
- Each user story MUST be independently deployable and testable
- Commit after each task or logical group of tasks
- Run `/speckit.analyze` before `/speckit.implement` to validate
  cross-artifact consistency

## Governance

- This constitution supersedes all other development practices for
  this project
- Amendments MUST be documented with a version bump, rationale, and
  migration plan
- All implementation plans MUST include a Constitution Check gate
  that validates each principle before proceeding
- Violations MUST be justified in the Complexity Tracking section of
  plan.md with a clear rationale and rejected alternatives
- Use CLAUDE.md for runtime development guidance and quick-reference
  conventions

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
