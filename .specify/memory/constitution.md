<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - 7 Core Principles (derived from plan.md Constitution Check)
    - Technical Constraints (technology stack, storage, platform)
    - Development Workflow (testing gates, commit practices, quality)
    - Governance (amendment procedure, versioning, compliance)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check table is feature-specific)
    - .specify/templates/spec-template.md ✅ no changes needed (spec is technology-agnostic)
    - .specify/templates/tasks-template.md ✅ no changes needed (task format is principle-neutral)
  Follow-up TODOs: None
-->

# Local Planner Constitution

## Core Principles

### I. Zero External Runtime Dependencies

Astro MUST compile to static HTML, CSS, and JS with no external
runtime dependencies. All application logic MUST run locally in the
browser without network requests, CDN loads, or remote API calls.
Third-party libraries are permitted at build time only (e.g.,
`gray-matter` for parsing). Any runtime dependency addition requires
a constitution amendment.

**Rationale**: A local-first tool MUST work offline and without
infrastructure. Build-time dependencies are acceptable because they
produce self-contained output.

### II. Markdown as Single Source of Truth

All task data MUST be persisted as human-readable Markdown files with
YAML frontmatter. One `.md` file per task, stored in project folders.
The application MUST NOT maintain a separate database, cache, or index
that could diverge from the Markdown files. On every load, the
application MUST read directly from the filesystem.

**Rationale**: Users MUST be able to read, edit, and version-control
their data with any text editor or git workflow, independent of this
application.

### III. Keyboard-First Interaction

At least 90% of task management actions (create, edit, change status,
change priority, filter, search, switch views) MUST be completable
via keyboard shortcuts. Every interactive element MUST be reachable
via keyboard navigation. Mouse/pointer interaction is supported but
MUST NOT be the only path to any action.

**Rationale**: Power users expect keyboard-driven workflows.
Keyboard-first design enforces consistent focus management and
accessibility.

### IV. Desktop-First Responsive Design

The primary target is desktop browsers (viewport >= 1024px). Layout
and interactions MUST be optimized for desktop-sized screens first.
Responsive adaptations for smaller viewports are permitted but MUST
NOT degrade the desktop experience. Mobile-specific features are
out of scope.

**Rationale**: This is a local development tool running on a dev
server. The primary use case is a developer at a desktop workstation.

### V. Test Coverage for Core Logic

All parsing logic (Markdown reader/writer, frontmatter schema
validation) and state management logic (task CRUD, filter/sort,
project switching) MUST have unit tests via Vitest. View interactions
(drag-and-drop, inline editing, view switching) MUST have E2E tests
via Playwright. Tests MUST pass before any feature is considered
complete.

**Rationale**: Core logic (parsing, state) is the data integrity
layer. Bugs here cause silent data corruption. View interactions
are the primary user-facing surface and MUST be regression-tested.

### VI. Zero Authentication

The application MUST NOT implement any authentication, authorization,
or user management. It is designed for a single user operating on
their local filesystem. No login screens, tokens, sessions, or
access control mechanisms are permitted.

**Rationale**: Authentication adds complexity with zero value for a
single-user local tool. Filesystem permissions are the only access
control needed.

### VII. Git-Friendly Output

All persisted data (Markdown files) MUST produce clean, readable
diffs when tracked in git. One file per task ensures each change is
an isolated diff. Frontmatter fields MUST use stable ordering.
Generated timestamps MUST NOT cause unnecessary diff noise (update
`updated` only when user-visible fields change). File naming MUST
use deterministic slugs derived from task titles.

**Rationale**: Many developers track their task data in git
repositories. The storage format MUST not fight version control.

## Technical Constraints

- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Astro 5.x with island architecture
- **Storage**: Local filesystem Markdown files (no database)
- **Styling**: Vanilla CSS with custom properties (no CSS frameworks)
- **Client interactivity**: Vanilla JS or Astro island components
  (no React, Vue, or Svelte unless justified by amendment)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Platform**: Desktop browsers via `astro dev` local server
- **Scale**: Single user, up to 10 projects, up to 200 tasks per
  project

## Development Workflow

- **Commit granularity**: One commit per task or logical unit of work.
  Commits MUST have descriptive messages referencing the task ID.
- **Testing gates**: Unit tests MUST pass before merging any PR that
  modifies `src/lib/`. E2E tests MUST pass before merging any PR
  that modifies `src/components/` or `src/pages/`.
- **Code style**: Follow TypeScript standard conventions. Run
  `npm run lint` before committing.
- **Quality checklist**: Use `/speckit.checklist` before marking a
  user story as complete.
- **Branch strategy**: Feature branches per user story
  (e.g., `001-local-planner/us1-task-crud`). Merge to main via PR.

## Governance

This constitution is the authoritative source for project principles
and constraints. All implementation decisions, code reviews, and
architecture choices MUST comply with the principles defined above.

- **Amendments**: Any change to a Core Principle requires updating
  this document, incrementing the version, and documenting the
  rationale in the Sync Impact Report comment block at the top of
  this file.
- **Versioning**: This constitution follows semantic versioning.
  MAJOR for principle removals or redefinitions, MINOR for new
  principles or expanded guidance, PATCH for clarifications.
- **Compliance review**: The plan.md Constitution Check table MUST
  reference these principles by number (I through VII). Any
  principle violation MUST be documented in the Complexity Tracking
  section of plan.md with justification.
- **Guidance file**: CLAUDE.md serves as the runtime development
  guidance file and is auto-generated from specifications.

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
