# Feature Specification: Local Planner

**Feature Branch**: `001-local-planner`
**Created**: 2026-02-26
**Status**: Draft
**Input**: User description: "Local planner with backlog, kanban, and gantt views. Markdown files as storage. Multi-project support via folders."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and manage tasks (Priority: P1)

As a developer, I want to create tasks with a title, description, priority, status, and date range so I can track my work across projects.

**Why this priority**: Without tasks, nothing else works. This is the core data model and the minimum viable interaction.

**Independent Test**: Can be fully tested by creating a task, editing its fields, and verifying it persists as a markdown file in the project folder.

**Acceptance Scenarios**:

1. **Given** I have a project open, **When** I create a new task with title "Fix login bug", priority P1, status Backlog, start 2026-03-01, end 2026-03-05, **Then** the task appears in the backlog view and a markdown file is created in the project folder.
2. **Given** a task exists, **When** I edit its priority from P2 to P0, **Then** the change is reflected in the view and persisted to the markdown file.
3. **Given** a task exists, **When** I delete it with confirmation, **Then** it is removed from all views and the markdown file is updated accordingly.

---

### User Story 2 - Backlog view with sorting and filtering (Priority: P1)

As a developer, I want to see all my tasks in a sortable, filterable table so I can prioritize and organize my work.

**Why this priority**: The backlog is the primary view for managing tasks. It's the most used view for day-to-day work.

**Independent Test**: Can be tested by loading tasks and verifying sort/filter operations produce correct ordering and subsets.

**Acceptance Scenarios**:

1. **Given** I have 10 tasks with mixed priorities, **When** I click the "Priority" column header, **Then** tasks are sorted by priority (P0 first, P3 last).
2. **Given** I have tasks in multiple states, **When** I filter by "In Progress", **Then** only In Progress tasks are shown.
3. **Given** I am viewing the backlog, **When** I click a task's status dropdown and change it to "Done", **Then** the status updates inline and persists to the markdown file.
4. **Given** I have tasks, **When** I drag a task to a new position, **Then** the manual order is preserved across sessions.

---

### User Story 3 - Kanban view (Priority: P2)

As a developer, I want to see my tasks organized in columns by status so I can visualize my workflow at a glance.

**Why this priority**: Kanban provides the visual workflow overview. Important but depends on the core task model (P1).

**Independent Test**: Can be tested by verifying tasks appear in correct status columns and that dragging between columns updates their status.

**Acceptance Scenarios**:

1. **Given** I have tasks in different states, **When** I open the Kanban view, **Then** I see columns for Backlog, In Progress, Review, and Done with tasks in their respective columns.
2. **Given** a task is in "Backlog" column, **When** I drag it to "In Progress", **Then** its status changes to In Progress and the markdown file is updated.
3. **Given** the Kanban view is open, **When** I apply a priority filter for P0, **Then** only P0 tasks appear across all columns.

---

### User Story 4 - Gantt chart view (Priority: P2)

As a developer, I want to see my tasks on a timeline so I can visualize scheduling, overlaps, and deadlines.

**Why this priority**: Gantt adds temporal visualization. Valuable but requires tasks to have dates (P1 dependency).

**Independent Test**: Can be tested by verifying tasks with date ranges render as bars on a timeline with correct positioning.

**Acceptance Scenarios**:

1. **Given** I have tasks with start and end dates, **When** I open the Gantt view, **Then** each task is displayed as a horizontal bar spanning its date range.
2. **Given** the Gantt view is open, **When** I hover over a task bar, **Then** I see a tooltip with the task title, dates, priority, and status.
3. **Given** the Gantt view is open, **When** I switch zoom level from "week" to "month", **Then** the timeline scale adjusts accordingly.
4. **Given** a task has no end date, **When** I open the Gantt view, **Then** that task does not appear in the Gantt (but remains in Backlog and Kanban).

---

### User Story 5 - Multi-project support (Priority: P2)

As a developer, I want to manage multiple projects, each stored in its own folder, so I can keep work contexts separated.

**Why this priority**: Multi-project is essential for real usage but the core task management (P1) works within a single project.

**Independent Test**: Can be tested by creating two project folders, adding tasks to each, and switching between them to verify isolation.

**Acceptance Scenarios**:

1. **Given** I have two project folders ("work" and "personal"), **When** I open the app, **Then** I see a project selector showing both projects.
2. **Given** I am viewing "work" project, **When** I switch to "personal", **Then** only personal tasks are shown in all views.
3. **Given** I want a new project, **When** I create one called "side-project", **Then** a new folder is created and I can start adding tasks to it.

---

### Edge Cases

- What happens when a markdown file is malformed or unparseable? → Show error with file path, skip the file, do not crash or lose other data.
- What happens when a task has a start date but no end date? → Show in Backlog and Kanban, hide from Gantt.
- What happens when dates are in the past? → Display with visual indicator (overdue styling).
- What happens when a project folder is empty? → Show empty state with a call-to-action to create the first task.
- What happens when the user edits the markdown file externally? → Reflect changes on next load/refresh without data loss.
- What happens when two tasks have the same manual order? → Use creation date as tiebreaker.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating tasks with title, description, status, priority, start date, and end date.
- **FR-002**: System MUST persist all task data as markdown files in the project folder.
- **FR-003**: System MUST support five task states: Backlog, In Progress, Review, Done, Archived.
- **FR-004**: System MUST support four priority levels: P0 (critical), P1 (high), P2 (medium), P3 (low).
- **FR-005**: System MUST provide a backlog view with sortable columns and inline editing of status and priority.
- **FR-006**: System MUST provide a kanban view with drag-and-drop between status columns.
- **FR-007**: System MUST provide a gantt chart view with zoom levels (week, month, quarter).
- **FR-008**: System MUST support filtering by status, priority, project, and tags in all views.
- **FR-009**: System MUST support text search across task titles and descriptions.
- **FR-010**: System MUST support multiple projects, each mapped to a filesystem folder.
- **FR-011**: System MUST produce markdown files that are human-readable and editable with any text editor.
- **FR-012**: System MUST handle malformed markdown gracefully without data loss.
- **FR-013**: System MUST support free-form tags on tasks.
- **FR-014**: System MUST visually distinguish overdue tasks (past end date, not Done/Archived).
- **FR-015**: System MUST allow switching between views without losing filter/sort state.

### Key Entities

- **Task**: The core unit of work. Has title, description (markdown), status, priority, start date, end date, tags, and manual sort order.
- **Project**: A logical grouping of tasks. Maps to a folder on the filesystem containing markdown files.
- **View**: A presentation mode for tasks (Backlog list, Kanban board, Gantt timeline). All views operate on the same underlying data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a task and see it appear in all applicable views in under 5 seconds.
- **SC-002**: Switching between views (Backlog, Kanban, Gantt) completes in under 1 second.
- **SC-003**: A project with 200 tasks loads and renders in under 3 seconds.
- **SC-004**: Markdown files remain readable and correctly formatted after 50 consecutive create/edit/delete operations.
- **SC-005**: Users can manage 5 projects simultaneously without cross-contamination of task data.
- **SC-006**: All task modifications persist correctly after app restart (verified via markdown file content).
- **SC-007**: 90% of task management actions (create, edit status, change priority, filter) are completable via keyboard shortcuts.

## Assumptions

- Single user, no authentication required.
- Application runs entirely local, no network requests.
- User has filesystem access to create and manage project folders.
- Markdown format follows a consistent schema defined by the application.
- Git compatibility is desirable but not enforced by the application itself.
