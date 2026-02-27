import type { FilterState, Status, Priority, SortColumn, SortDirection, Task } from '../types.ts';
import { PRIORITY_WEIGHT } from '../types.ts';

/** Create default filter state (no filters active, sorted by order asc) */
export function createDefaultFilterState(): FilterState {
  return {
    statusFilter: [],
    priorityFilter: [],
    tagFilter: [],
    searchQuery: '',
    sortColumn: 'order',
    sortDirection: 'asc',
  };
}

let currentState: FilterState = createDefaultFilterState();

/** Get current filter state */
export function getFilterState(): FilterState {
  return { ...currentState };
}

/** Update filter state (partial update) */
export function setFilterState(updates: Partial<FilterState>): FilterState {
  currentState = { ...currentState, ...updates };
  notifyListeners();
  return { ...currentState };
}

/** Reset all filters to default */
export function resetFilters(): FilterState {
  currentState = createDefaultFilterState();
  notifyListeners();
  return { ...currentState };
}

/** Toggle a status in the filter */
export function toggleStatusFilter(status: Status): void {
  const idx = currentState.statusFilter.indexOf(status);
  if (idx >= 0) {
    currentState.statusFilter = currentState.statusFilter.filter((s) => s !== status);
  } else {
    currentState.statusFilter = [...currentState.statusFilter, status];
  }
  notifyListeners();
}

/** Toggle a priority in the filter */
export function togglePriorityFilter(priority: Priority): void {
  const idx = currentState.priorityFilter.indexOf(priority);
  if (idx >= 0) {
    currentState.priorityFilter = currentState.priorityFilter.filter((p) => p !== priority);
  } else {
    currentState.priorityFilter = [...currentState.priorityFilter, priority];
  }
  notifyListeners();
}

/** Toggle a tag in the filter */
export function toggleTagFilter(tag: string): void {
  const idx = currentState.tagFilter.indexOf(tag);
  if (idx >= 0) {
    currentState.tagFilter = currentState.tagFilter.filter((t) => t !== tag);
  } else {
    currentState.tagFilter = [...currentState.tagFilter, tag];
  }
  notifyListeners();
}

/** Set search query */
export function setSearchQuery(query: string): void {
  currentState.searchQuery = query;
  notifyListeners();
}

/** Set sort column and direction */
export function setSort(column: SortColumn, direction: SortDirection): void {
  currentState.sortColumn = column;
  currentState.sortDirection = direction;
  notifyListeners();
}

/** Toggle sort: if same column, flip direction; if new column, set asc */
export function toggleSort(column: SortColumn): void {
  if (currentState.sortColumn === column) {
    currentState.sortDirection = currentState.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentState.sortColumn = column;
    currentState.sortDirection = 'asc';
  }
  notifyListeners();
}

/** Apply current filters to a list of tasks */
export function applyFilters(tasks: Task[]): Task[] {
  const { statusFilter, priorityFilter, tagFilter, searchQuery } = currentState;

  return tasks.filter((task) => {
    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(task.status)) return false;

    // Priority filter
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) return false;

    // Tag filter (task must have ALL selected tags)
    if (tagFilter.length > 0 && !tagFilter.every((t) => task.tags.includes(t))) return false;

    // Text search (title + description)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = task.title.toLowerCase().includes(q);
      const inDesc = task.description.toLowerCase().includes(q);
      if (!inTitle && !inDesc) return false;
    }

    return true;
  });
}

/** Apply current sort to a list of tasks */
export function applySort(tasks: Task[]): Task[] {
  const { sortColumn, sortDirection } = currentState;
  const mult = sortDirection === 'asc' ? 1 : -1;

  return [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (sortColumn) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'priority':
        cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        break;
      case 'start':
        cmp = a.start.localeCompare(b.start);
        break;
      case 'end':
        cmp = (a.end || '9999').localeCompare(b.end || '9999');
        break;
      case 'order':
        cmp = a.order - b.order;
        break;
    }
    // Tiebreaker: created date
    if (cmp === 0) cmp = a.created.localeCompare(b.created);
    return cmp * mult;
  });
}

/** Apply filters then sort */
export function filterAndSort(tasks: Task[]): Task[] {
  return applySort(applyFilters(tasks));
}

// --- Simple listener pattern for reactivity ---
type Listener = (state: FilterState) => void;
const listeners: Listener[] = [];

export function onFilterChange(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function notifyListeners(): void {
  const snapshot = { ...currentState };
  for (const fn of listeners) fn(snapshot);
}
