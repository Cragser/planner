# Tasks: Local Planner

**Input**: Design documents from `/specs/001-local-planner/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not explicitly requested in the feature specification. Test infrastructure is set up in Phase 1, but individual test tasks per story are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, Astro 5.x scaffolding, and dependency installation

- [x] T001 Initialize Astro 5.x project with TypeScript in repository root
- [x] T002 Install core dependencies: gray-matter, vitest, playwright, markdown-it in package.json
- [x] T003 [P] Create directory structure per plan.md: src/components/{views,task,layout,common}/, src/lib/{parser,store,gantt}/, src/pages/, src/styles/, src/scripts/, tests/unit/, tests/e2e/
- [x] T004 [P] Configure Vitest for unit testing in vitest.config.ts
- [x] T005 [P] Configure Playwright for E2E testing in playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type system, markdown parser, state management, and base layout that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define shared TypeScript types (Task, Project, Status enum, Priority enum, FilterState) in src/lib/types.ts
- [x] T007 [P] Define markdown frontmatter schema and validation rules (title non-empty max 200 chars, start ≤ end, priority defaults P3, status defaults Backlog) in src/lib/parser/schema.ts
- [x] T008 Implement markdown reader (gray-matter parse .md files to Task objects, handle malformed files gracefully per FR-012) in src/lib/parser/reader.ts
- [x] T009 Implement markdown writer (Task objects to .md files with frontmatter + body, filename slug generation, collision handling with -2/-3 suffix) in src/lib/parser/writer.ts
- [x] T010 Implement task store with CRUD operations (create, read, update, delete) backed by parser in src/lib/store/tasks.ts
- [x] T011 Implement state transition validation in src/lib/store/tasks.ts — enforce allowed transitions: Backlog→In Progress→Review→Done→Archived, Review→In Progress (back), any state→Archived, Archived→Backlog (restore); reject invalid transitions with error
- [x] T012 [P] Implement filter and sort state management (status filter, priority filter, tag filter, text search query, sort column, sort direction) in src/lib/store/filters.ts
- [x] T013 [P] Create global CSS variables, base styles, and overdue task CSS classes (past end date + not Done/Archived per FR-014) in src/styles/global.css
- [x] T014 Create base layout components: Header in src/components/layout/Header.astro, Sidebar in src/components/layout/Sidebar.astro, ViewSwitcher in src/components/layout/ViewSwitcher.astro
- [x] T015 [P] Create FilterBar component (status dropdown, priority dropdown, tags dropdown — UI only, wired to filter store) in src/components/common/FilterBar.astro
- [x] T016 [P] Create SearchBox component (text input that updates text search query in filter store per FR-009) in src/components/common/SearchBox.astro
- [x] T017 [P] Create EmptyState component (call-to-action for empty projects, shows "Create your first task" prompt) in src/components/common/EmptyState.astro
- [x] T018 Implement global keyboard shortcuts handler (n=new task, 1/2/3=switch views, /=focus search, Esc=close modals) in src/scripts/keyboard.ts
- [x] T019 Create main page entry point wiring layout, views, and state in src/pages/index.astro

**Checkpoint**: Foundation ready — type system, parser, store with transition validation, base layout, and keyboard shortcuts are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — Create and Manage Tasks (Priority: P1) MVP

**Goal**: Users can create tasks with title, description, priority, status, and date range. Tasks persist as markdown files. Users can edit and delete tasks. State transitions follow the defined rules.

**Independent Test**: Create a task with all fields, verify the markdown file is written correctly. Edit a field, verify persistence. Delete with confirmation, verify file is removed. Open a malformed .md file, verify no crash. Attempt invalid state transition (e.g., Backlog→Done), verify it is rejected.

### Implementation for User Story 1

- [x] T020 [P] [US1] Create TaskCard component (displays title, status badge, priority indicator, tags, overdue styling via CSS class) in src/components/task/TaskCard.astro
- [x] T021 [P] [US1] Create TaskForm component (modal with fields: title, description, status, priority, start date, end date, tags) in src/components/task/TaskForm.astro
- [x] T022 [US1] Create TaskDetail component (full markdown-rendered view of a task using markdown-it) in src/components/task/TaskDetail.astro
- [x] T023 [US1] Wire TaskForm to task store: create new task, generate slug filename, persist via writer in src/pages/index.astro
- [x] T024 [US1] Wire TaskForm for editing: load existing task into form, update and persist changes via writer in src/pages/index.astro
- [x] T025 [US1] Implement task deletion with confirmation dialog, remove markdown file via store in src/pages/index.astro
- [x] T026 [US1] Add inline status and priority editing on TaskCard (status dropdown enforces valid transitions per T011, priority dropdown persists on change) in src/components/task/TaskCard.astro

**Checkpoint**: Users can create, view, edit, and delete tasks. Each task is a markdown file with frontmatter. State transitions are validated. FR-001, FR-002, FR-003, FR-004, FR-011, FR-013 are satisfied.

---

## Phase 4: User Story 2 — Backlog View with Sorting and Filtering (Priority: P1)

**Goal**: Users see all tasks in a sortable, filterable table. They can sort by clicking column headers, filter by status/priority/tags, edit inline, and reorder via drag-and-drop.

**Independent Test**: Load 10+ tasks, sort by priority column, verify correct order. Filter by "In Progress", verify only matching tasks shown. Change status inline, verify persistence. Drag to reorder, verify order persists across refresh.

**Dependencies**: Requires US1 (tasks must exist to display)

### Implementation for User Story 2

- [x] T027 [US2] Create BacklogView component with sortable table (columns: title, status, priority, start, end, tags) in src/components/views/BacklogView.astro
- [x] T028 [US2] Implement column header click sorting (ascending/descending toggle for each column, reads/writes sort state from filter store) in src/components/views/BacklogView.astro
- [x] T029 [US2] Integrate FilterBar and SearchBox with BacklogView (wire filter store state to task list rendering) in src/components/views/BacklogView.astro
- [x] T030 [US2] Implement inline status and priority editing in backlog table rows (status enforces valid transitions) in src/components/views/BacklogView.astro
- [x] T031 [US2] Implement drag-and-drop row reordering using HTML Drag and Drop API in src/components/views/BacklogView.astro
- [x] T032 [US2] Persist manual sort order changes (update order field in markdown frontmatter) via store in src/components/views/BacklogView.astro

**Checkpoint**: Backlog view is fully functional with sorting, filtering, inline editing, and drag-and-drop reorder. FR-005, FR-008 (in backlog), FR-009 (in backlog) are satisfied.

---

## Phase 5: User Story 3 — Kanban View (Priority: P2)

**Goal**: Users see tasks organized in columns by status (Backlog, In Progress, Review, Done). They can drag tasks between columns to change status. Filtering works across all columns.

**Independent Test**: Load tasks in different statuses, verify correct column placement. Drag a task from Backlog to In Progress, verify status change persists in markdown file. Attempt invalid transition via drag (e.g., Backlog→Done), verify rejection. Apply priority filter, verify only matching tasks appear across all columns.

### Implementation for User Story 3

- [x] T033 [US3] Create KanbanView component with status columns (Backlog, In Progress, Review, Done) in src/components/views/KanbanView.astro
- [x] T034 [US3] Render TaskCard components in their correct status columns in src/components/views/KanbanView.astro
- [x] T035 [US3] Implement drag-and-drop between columns using HTML Drag and Drop API (validate state transition before accepting drop per T011) in src/components/views/KanbanView.astro
- [x] T036 [US3] Persist status changes from column drag-and-drop to markdown files via store in src/components/views/KanbanView.astro
- [x] T037 [US3] Integrate FilterBar with KanbanView (status, priority, and tag filtering across all columns) in src/components/views/KanbanView.astro

**Checkpoint**: Kanban view is fully functional with drag-and-drop status changes (with transition validation) and filtering. FR-006, FR-008 (in kanban) are satisfied.

---

## Phase 6: User Story 4 — Gantt Chart View (Priority: P2)

**Goal**: Users see tasks with date ranges on a timeline as horizontal bars. Supports zoom levels (week, month, quarter), tooltips, and filtering by status/priority/tags.

**Independent Test**: Load tasks with start/end dates, verify bars render at correct positions on timeline. Hover a bar, verify tooltip shows title, dates, priority, status. Switch zoom from week to month, verify scale adjusts. Verify tasks without end dates do not appear. Apply priority filter, verify only matching task bars remain on timeline.

### Implementation for User Story 4

- [x] T038 [P] [US4] Implement timeline date calculations (date range, scale units, grid positions for week/month/quarter) in src/lib/gantt/timeline.ts
- [x] T039 [P] [US4] Implement bar positioning and layout (x/y coordinates, width from date range, row stacking) in src/lib/gantt/layout.ts
- [x] T040 [US4] Create GanttView component with SVG rendering (timeline grid, task bars, date headers) in src/components/views/GanttView.astro
- [x] T041 [US4] Implement zoom level controls (week, month, quarter) with timeline rescaling in src/components/views/GanttView.astro
- [x] T042 [US4] Add hover tooltips on task bars showing title, dates, priority, and status in src/components/views/GanttView.astro
- [x] T043 [US4] Filter out tasks without end dates from Gantt rendering in src/components/views/GanttView.astro
- [x] T044 [US4] Integrate FilterBar with GanttView (status, priority, and tag filtering applied to timeline task bars) in src/components/views/GanttView.astro

**Checkpoint**: Gantt view is fully functional with SVG timeline, zoom controls, tooltips, date filtering, and FR-008 filtering. FR-007, FR-008 (in gantt) are satisfied.

---

## Phase 7: User Story 5 — Multi-Project Support (Priority: P2)

**Goal**: Users can manage multiple projects, each stored in its own folder under a configurable root (default ~/planner-data/). Users can switch between projects and create new ones.

**Independent Test**: Create two project folders with tasks. Open app, verify project selector shows both. Switch projects, verify only that project's tasks appear. Create a new project, verify folder is created and selectable. Change root path, verify new root is used.

### Implementation for User Story 5

- [x] T045 [US5] Implement project store (scan root folder for project subdirectories, track active project, define configurable root path defaulting to ~/planner-data/) in src/lib/store/projects.ts
- [x] T046 [US5] Add project selector dropdown in Sidebar component in src/components/layout/Sidebar.astro
- [x] T047 [US5] Implement create new project functionality (prompt for name, create folder on filesystem) in src/components/layout/Sidebar.astro
- [x] T048 [US5] Scope task store loading and all views to active project only in src/lib/store/tasks.ts
- [x] T049 [US5] Persist active project selection and root path in localStorage for session continuity in src/lib/store/projects.ts

**Checkpoint**: Multi-project support is fully functional. Users can switch between projects and create new ones. Root path is configurable. FR-010 is satisfied.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cross-view integrations, validation of success criteria, and final quality checks

- [x] T050 Wire text search across all views: connect SearchBox query from filter store to BacklogView, KanbanView, and GanttView task filtering (FR-009) in src/lib/store/filters.ts
- [x] T051 Preserve filter/sort state when switching between views (FR-015) — ensure filter store state persists across ViewSwitcher navigation in src/lib/store/filters.ts
- [x] T052 [P] Verify overdue task visual indicators render correctly across all three views (BacklogView rows, KanbanView cards, GanttView bars) per FR-014 in src/styles/global.css and view components
- [x] T053 Add error boundary UI for malformed markdown files (show file path and error message, skip gracefully, do not crash) per FR-012 in src/components/common/EmptyState.astro
- [x] T054 Validate SC-001: verify task creation appears in all applicable views within 5 seconds
- [x] T055 Validate SC-002/SC-003: verify view switching completes under 1 second, 200 tasks render under 3 seconds
- [x] T056 Validate SC-004: verify markdown files remain correctly formatted after 50 consecutive create/edit/delete operations
- [x] T057 Validate SC-006: verify all task modifications persist correctly after app restart (page reload)
- [x] T058 Run quickstart.md validation scenarios end-to-end
- [x] T059 Code cleanup: remove unused imports, verify all keyboard shortcuts work per SC-007 (90% of actions via keyboard)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — No dependencies on other stories
- **US2 (Phase 4)**: Depends on Foundational (Phase 2) — Integrates with US1 (tasks must exist) but testable with manually created .md files
- **US3 (Phase 5)**: Depends on Foundational (Phase 2) — Uses same TaskCard as US1, independent of US2
- **US4 (Phase 6)**: Depends on Foundational (Phase 2) — Independent gantt logic, no dependency on other views
- **US5 (Phase 7)**: Depends on Foundational (Phase 2) — Modifies task store loading, best done after US1/US2 are stable
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS ALL)
    ↓
    ├── Phase 3: US1 (P1) ← MVP, do first
    ├── Phase 4: US2 (P1) ← integrates with US1 TaskCard
    ├── Phase 5: US3 (P2) ← independent, can parallel with US2
    ├── Phase 6: US4 (P2) ← independent, can parallel with US3/US5
    └── Phase 7: US5 (P2) ← best after US1/US2 stable
    ↓
Phase 8: Polish
```

### Within Each User Story

- Models/logic before UI components
- Components before wiring/integration
- Core implementation before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 can run in parallel
- **Phase 2**: T007, T012, T013, T015, T016, T017 can run in parallel (after T006 types are defined)
- **Phase 3**: T020, T021 can run in parallel
- **Phase 5**: Independent from US2/US4 — can run in parallel with other P2 stories
- **Phase 6**: T038, T039 can run in parallel (pure logic, no UI)
- **Phase 8**: T052 can run in parallel with other polish tasks

---

## Parallel Example: User Story 4 (Gantt)

```bash
# Launch gantt logic modules in parallel (no dependencies between them):
Task: "Implement timeline date calculations in src/lib/gantt/timeline.ts"
Task: "Implement bar positioning and layout in src/lib/gantt/layout.ts"

# Then build the view (depends on both logic modules):
Task: "Create GanttView component with SVG rendering in src/components/views/GanttView.astro"

# Then add features sequentially:
Task: "Implement zoom level controls in src/components/views/GanttView.astro"
Task: "Add hover tooltips in src/components/views/GanttView.astro"
Task: "Filter out tasks without end dates in src/components/views/GanttView.astro"
Task: "Integrate FilterBar with GanttView in src/components/views/GanttView.astro"  # NEW
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (create/edit/delete tasks with state transition validation)
4. Complete Phase 4: User Story 2 (backlog view)
5. **STOP and VALIDATE**: Test task CRUD and backlog independently
6. Deploy/demo if ready — this is a usable planner with backlog view

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Task CRUD) → Test independently → Minimal working app
3. Add US2 (Backlog) → Test independently → **MVP! Usable planner**
4. Add US3 (Kanban) → Test independently → Visual workflow view
5. Add US4 (Gantt) → Test independently → Timeline visualization with filtering
6. Add US5 (Multi-project) → Test independently → Full feature set
7. Polish → Performance, search, validation, edge cases → Production ready

---

## Functional Requirement Traceability

| FR | Description | Covered By |
|----|-------------|------------|
| FR-001 | Create tasks with all fields | T021, T023 (US1) |
| FR-002 | Persist as markdown files | T008, T009 (Foundational) |
| FR-003 | Five task states | T006 (Foundational), T011 (transitions) |
| FR-004 | Four priority levels | T006 (Foundational) |
| FR-005 | Backlog view, sortable, inline edit | T027-T032 (US2) |
| FR-006 | Kanban view, drag-and-drop | T033-T037 (US3) |
| FR-007 | Gantt chart, zoom levels | T038-T043 (US4) |
| FR-008 | Filtering in ALL views | T012 (state), T029 (backlog), T037 (kanban), **T044 (gantt)** |
| FR-009 | Text search | T016 (component), T050 (wiring across all views) |
| FR-010 | Multiple projects via folders | T045-T049 (US5) |
| FR-011 | Human-readable markdown | T009 (Foundational) |
| FR-012 | Malformed markdown handling | T008 (Foundational), T053 (Polish) |
| FR-013 | Free-form tags | T006, T021 (Foundational + US1) |
| FR-014 | Overdue visual indicator | T013 (CSS), T052 (cross-view verification) |
| FR-015 | View switch preserves state | T051 (Polish) |

## Success Criteria Traceability

| SC | Description | Covered By |
|----|-------------|------------|
| SC-001 | Task appears in all views in <5s | T054 (Polish) |
| SC-002 | View switching under 1s | T055 (Polish) |
| SC-003 | 200 tasks render under 3s | T055 (Polish) |
| SC-004 | Markdown stays correct after 50 ops | T056 (Polish) |
| SC-005 | 5 projects without cross-contamination | T048 (US5) |
| SC-006 | Modifications persist after restart | T057 (Polish) |
| SC-007 | 90% actions via keyboard | T018 (Foundational), T059 (Polish) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks generated (not explicitly requested in spec)
- gray-matter handles YAML frontmatter parsing (research.md decision)
- SVG for Gantt rendering, HTML DnD API for drag-and-drop (research.md decisions)
- State transitions validated per data-model.md rules (T011)

## Changes from Previous Version

| Gap | Description | Resolution |
|-----|-------------|------------|
| I1 | FR-008 filtering missing for Gantt view | Added T044 [US4] — Integrate FilterBar with GanttView |
| U1 | State transition rules from data-model.md not implemented | Added T011 — State transition validation in task store |
| D1 | FR-014 overdue styling duplicated in T012/T050 | Split: T013 defines CSS, T052 verifies across all views |
| G1 | SC-001, SC-004, SC-006 had no validation tasks | Added T054, T056, T057 in Polish phase |
| D2 | Search unclear between filter state/component/wiring | Clarified: T012 (state), T016 (component), T050 (cross-view wiring) |
| U2 | Root path ~/planner-data/ not configurable | Incorporated into T045 (project store defines configurable root) |
