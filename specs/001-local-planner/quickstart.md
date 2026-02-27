# Quickstart: Local Planner

## Prerequisites

- Node.js 20+
- pnpm (preferred) or npm

## Setup

```bash
# Clone
git clone https://github.com/Cragser/planner.git
cd planner

# Install
pnpm install

# Dev server
pnpm dev
# → http://localhost:4321
```

## Create your first project

```bash
# Create a planner data directory (configurable)
mkdir -p ~/planner-data/my-project
```

## Create your first task

Create a file `~/planner-data/my-project/my-first-task.md`:

```markdown
---
title: My First Task
status: backlog
priority: p2
start: 2026-03-01
end: 2026-03-07
tags: [getting-started]
created: 2026-03-01T00:00:00Z
updated: 2026-03-01T00:00:00Z
---

This is the task description. Write anything here in markdown.
```

Open the app and select "my-project" — your task will appear.

## Key Shortcuts

| Key | Action |
|-----|--------|
| `n` | New task |
| `1` / `2` / `3` | Switch to Backlog / Kanban / Gantt |
| `/` | Focus search |
| `Esc` | Close modal / clear filters |

## Testing

```bash
pnpm test        # Unit tests (Vitest)
pnpm test:e2e    # E2E tests (Playwright)
```
