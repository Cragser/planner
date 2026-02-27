# Data Model: Local Planner

## Entities

### Task

The core unit of work.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Task name, also used to generate filename slug |
| description | string (markdown) | ❌ | Free-form markdown body |
| status | enum | ✅ | Backlog, In Progress, Review, Done, Archived |
| priority | enum | ✅ | P0 (critical), P1 (high), P2 (medium), P3 (low) |
| start | date (YYYY-MM-DD) | ✅ | When work begins |
| end | date (YYYY-MM-DD) | ❌ | When work should finish |
| tags | string[] | ❌ | Free-form labels |
| order | number | ❌ | Manual sort position (backlog view) |
| created | datetime (ISO) | ✅ | Auto-generated on creation |
| updated | datetime (ISO) | ✅ | Auto-updated on any change |

**State transitions**:
```
Backlog → In Progress → Review → Done → Archived
                ↑          |
                └──────────┘  (back to In Progress from Review)
```
- Any state can go directly to Archived
- Archived tasks can be restored to Backlog

**Validation rules**:
- title: non-empty, max 200 characters
- start ≤ end (when end is provided)
- priority defaults to P3 if omitted
- status defaults to Backlog if omitted
- order defaults to 0 (appended at end)

### Project

A logical grouping of tasks.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Folder name on filesystem |
| path | string | Absolute path to project folder |
| taskCount | number | Derived: count of .md files in folder |

**Notes**:
- Project has no dedicated config file — its existence is defined by the folder
- Project metadata (name) is derived from folder name
- No nesting: projects are always top-level folders under the planner root

## Relationships

```
Project (folder)
  └── has many → Task (markdown file)

Views (Backlog, Kanban, Gantt)
  └── present → Tasks (filtered/sorted/grouped)
```

## Markdown Schema

### Frontmatter (YAML)

```yaml
---
title: "Task title here"
status: backlog           # backlog | in-progress | review | done | archived
priority: p2              # p0 | p1 | p2 | p3
start: 2026-03-01         # YYYY-MM-DD
end: 2026-03-15           # YYYY-MM-DD (optional)
tags: [frontend, urgent]  # array of strings (optional)
order: 5                  # integer (optional)
created: 2026-02-26T22:00:00Z
updated: 2026-02-26T22:00:00Z
---
```

### Body (Markdown)

Everything after the frontmatter closing `---` is the task description. Supports full markdown (headers, lists, code blocks, links, images).

### Filename Convention

- Derived from title: lowercase, spaces → hyphens, remove special chars
- Example: "Fix Login Bug" → `fix-login-bug.md`
- Collision handling: append `-2`, `-3` etc.
