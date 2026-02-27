/** Task status values matching frontmatter format */
export type Status = 'backlog' | 'in-progress' | 'review' | 'done' | 'archived';

/** Priority levels */
export type Priority = 'p0' | 'p1' | 'p2' | 'p3';

/** Display labels for statuses */
export const STATUS_LABELS: Record<Status, string> = {
  'backlog': 'Backlog',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done',
  'archived': 'Archived',
};

/** Display labels for priorities */
export const PRIORITY_LABELS: Record<Priority, string> = {
  'p0': 'P0 Critical',
  'p1': 'P1 High',
  'p2': 'P2 Medium',
  'p3': 'P3 Low',
};

/** Sort weight for priorities (lower = higher priority) */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  'p0': 0,
  'p1': 1,
  'p2': 2,
  'p3': 3,
};

/** Allowed state transitions per data-model.md */
export const VALID_TRANSITIONS: Record<Status, Status[]> = {
  'backlog': ['in-progress', 'archived'],
  'in-progress': ['review', 'archived'],
  'review': ['done', 'in-progress', 'archived'],
  'done': ['archived'],
  'archived': ['backlog'],
};

/** Kanban-visible statuses (excludes Archived) */
export const KANBAN_STATUSES: Status[] = ['backlog', 'in-progress', 'review', 'done'];

/** All statuses in workflow order */
export const ALL_STATUSES: Status[] = ['backlog', 'in-progress', 'review', 'done', 'archived'];

/** All priorities in order */
export const ALL_PRIORITIES: Priority[] = ['p0', 'p1', 'p2', 'p3'];

/** Core task entity */
export interface Task {
  /** Unique filename slug (without .md extension) */
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  start: string;
  end: string;
  tags: string[];
  order: number;
  created: string;
  updated: string;
}

/** Project entity — maps to a filesystem folder */
export interface Project {
  name: string;
  path: string;
  taskCount: number;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sortable columns in backlog view */
export type SortColumn = 'title' | 'status' | 'priority' | 'start' | 'end' | 'order';

/** Filter and sort state used across all views */
export interface FilterState {
  statusFilter: Status[];
  priorityFilter: Priority[];
  tagFilter: string[];
  searchQuery: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

/** Gantt zoom levels */
export type GanttZoom = 'week' | 'month' | 'quarter';
