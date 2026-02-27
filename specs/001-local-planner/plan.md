# Implementation Plan: Local Planner

**Branch**: `001-local-planner` | **Date**: 2026-02-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-local-planner/spec.md`

## Summary

A local-first task planner with three views (Backlog, Kanban, Gantt) that uses markdown files as storage. Built as a static web application with TypeScript and Astro, running entirely on the user's machine. Multi-project support via filesystem folders.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Astro 5.x (static site framework), vanilla CSS/JS for interactions
**Storage**: Markdown files on local filesystem (one file per task or consolidated per project)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Desktop browser (local dev server via `astro dev`)
**Project Type**: Web application (local, single-user)
**Performance Goals**: 200 tasks render in under 3 seconds, view switching under 1 second
**Constraints**: Zero network requests, zero external dependencies at runtime, keyboard-first
**Scale/Scope**: 1 user, 5-10 projects, up to 200 tasks per project

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| 1. Zero external runtime dependencies | ✅ PASS | Astro generates static output, all logic runs locally |
| 2. Markdown as single source of truth | ✅ PASS | All task data stored as .md files in project folders |
| 3. Keyboard-first | ✅ PASS | SC-007 requires 90% of actions via keyboard shortcuts |
| 4. Responsive, desktop-first | ✅ PASS | Desktop-first with responsive support |
| 5. Tests for parsing/state logic | ✅ PASS | Vitest for unit, Playwright for E2E |
| 6. Zero auth | ✅ PASS | Single user, no authentication |
| 7. Git-friendly | ✅ PASS | Markdown is diffable and mergeable |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-local-planner/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/          # Quality checklists
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/          # Astro/UI components
│   ├── views/
│   │   ├── BacklogView.astro
│   │   ├── KanbanView.astro
│   │   └── GanttView.astro
│   ├── task/
│   │   ├── TaskCard.astro
│   │   ├── TaskForm.astro
│   │   └── TaskDetail.astro
│   ├── layout/
│   │   ├── Sidebar.astro
│   │   ├── Header.astro
│   │   └── ViewSwitcher.astro
│   └── common/
│       ├── FilterBar.astro
│       ├── SearchBox.astro
│       └── EmptyState.astro
├── lib/
│   ├── parser/          # Markdown ↔ Task parsing
│   │   ├── reader.ts    # Read .md → Task objects
│   │   ├── writer.ts    # Task objects → .md files
│   │   └── schema.ts    # Markdown format definition
│   ├── store/           # In-memory state management
│   │   ├── tasks.ts     # Task CRUD operations
│   │   ├── projects.ts  # Project management
│   │   └── filters.ts   # Filter/sort state
│   ├── gantt/           # Gantt-specific logic
│   │   ├── timeline.ts  # Date calculations, zoom
│   │   └── layout.ts    # Bar positioning
│   └── types.ts         # Shared TypeScript types
├── pages/
│   └── index.astro      # Single page app entry
├── styles/
│   └── global.css       # CSS variables, base styles
└── scripts/
    └── keyboard.ts      # Global keyboard shortcuts

tests/
├── unit/
│   ├── parser.test.ts   # Markdown parsing tests
│   ├── store.test.ts    # State management tests
│   └── gantt.test.ts    # Timeline calculations
└── e2e/
    ├── backlog.test.ts  # Backlog view interactions
    ├── kanban.test.ts   # Drag & drop, status changes
    └── gantt.test.ts    # Timeline rendering
```

**Structure Decision**: Single web application. Astro handles the page shell and component rendering. Core logic (parsing, state, gantt calculations) lives in `lib/` as pure TypeScript — testable without browser, reusable if we ever change the UI framework. Client-side interactivity (drag & drop, inline editing) via vanilla JS in `<script>` tags or small island components.

## Markdown Task Format

Each task is stored in a frontmatter + body format:

```markdown
---
title: Fix login bug
status: in-progress
priority: p1
start: 2026-03-01
end: 2026-03-05
tags: [auth, urgent]
order: 3
---

Description of the task goes here.
Can be **multiple lines** of markdown.
```

### Storage Options

**Option A — One file per task**: Each task is a separate `.md` file in the project folder. Filename derived from title slug. Git-friendly (each task change is a separate diff).

**Option B — One file per project**: All tasks in a single `.md` file with `---` separators. Simpler filesystem but larger diffs.

**Decision**: Option A (one file per task). Better git diffs, easier to manage individually, aligns with constitution principle #7 (git-friendly).

### Project Structure on Filesystem

```text
~/planner-data/          # Configurable root
├── work/                # Project "work"
│   ├── fix-login-bug.md
│   ├── add-dashboard.md
│   └── refactor-api.md
├── personal/            # Project "personal"
│   ├── learn-rust.md
│   └── organize-photos.md
└── side-project/        # Project "side-project"
    └── mvp-landing.md
```

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Astro 5.x | Static output, island architecture for interactivity, TypeScript native |
| Storage | Markdown with frontmatter | Human-readable, git-friendly, editable with any editor |
| File strategy | One .md per task | Better git diffs, independent file management |
| State management | In-memory store from parsed files | Simple, no external DB, reload from disk on refresh |
| Drag & drop | HTML Drag and Drop API | No library needed, native browser support |
| Gantt rendering | Canvas or SVG | Lightweight, no chart library dependency |
| CSS | Vanilla CSS with custom properties | Aligns with constitution (simplicity, zero deps) |
| Testing | Vitest + Playwright | Industry standard, good Astro integration |

## Complexity Tracking

No constitution violations. No complexity justifications needed.
