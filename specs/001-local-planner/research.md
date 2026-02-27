# Research: Local Planner

## Astro for Local-First Apps

**Decision**: Use Astro 5.x with island architecture
**Rationale**: Astro generates static HTML by default, ships zero JS unless you opt-in with `client:*` directives. Perfect for a local tool — fast load, no build server needed in production. Island architecture lets us add interactivity (drag & drop, inline editing) only where needed.
**Alternatives considered**:
- **Next.js**: Overkill for local-only, SSR not needed, heavier runtime
- **Vanilla HTML/JS**: No component model, harder to maintain 3 views
- **SvelteKit**: Good alternative but less mature static generation story

## Markdown Parsing

**Decision**: Use `gray-matter` for frontmatter + `marked` or `markdown-it` for body
**Rationale**: `gray-matter` is the de-facto standard for YAML frontmatter parsing in the JS ecosystem. Lightweight, zero dependencies besides js-yaml. Body parsing only needed for task detail view.
**Alternatives considered**:
- **Custom regex parser**: Fragile, edge cases with YAML
- **remark/unified**: More powerful but heavier for simple frontmatter extraction
- **MDX**: Overkill, we don't need components in markdown

## Drag & Drop

**Decision**: HTML Drag and Drop API (native)
**Rationale**: Constitution principle #1 (zero external deps). Native API covers both Kanban (column moves) and Backlog (reorder). Well-supported across modern browsers.
**Alternatives considered**:
- **@dnd-kit**: Better DX, touch support, but adds dependency
- **SortableJS**: Popular but external dependency
- **Note**: If native DnD proves insufficient (especially for touch), reconsider @dnd-kit as minimal exception

## Gantt Chart Rendering

**Decision**: SVG-based rendering with custom TypeScript logic
**Rationale**: SVG gives us DOM-based elements (hoverable, clickable) without canvas complexity. Timeline calculations are straightforward date math. No library needed for our scope (single user, <200 tasks).
**Alternatives considered**:
- **Canvas**: Better performance for thousands of items, worse for interactivity
- **D3.js**: Powerful but massive dependency for simple bar rendering
- **Frappe Gantt**: Purpose-built but external dependency, less customizable

## File Watching / Live Reload

**Decision**: Reload from disk on app refresh or explicit reload button
**Rationale**: Astro dev server provides HMR for code changes. For data changes (external markdown edits), a manual refresh is acceptable for v1. File watching (fs.watch/chokidar) can be added later.
**Alternatives considered**:
- **chokidar**: Real-time file watching, adds complexity and dependency
- **Polling**: Simple but wasteful
- **Decision**: Defer to v2. Manual refresh is sufficient for single-user local app.

## Keyboard Shortcuts

**Decision**: Custom keyboard handler using native `keydown` events
**Rationale**: Simple mapping of key combos to actions. No library needed for our scope.
**Alternatives considered**:
- **hotkeys-js**: Cleaner API but external dependency
- **tinykeys**: Minimal (400B) — acceptable exception if native approach gets messy
