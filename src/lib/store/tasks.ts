import type { Task, Status, Priority } from '../types.ts';
import { VALID_TRANSITIONS } from '../types.ts';
import { parseTaskMarkdown, readTasksFromDirectory } from '../parser/reader.ts';
import { serializeTask, writeTaskFile, deleteTaskFile, generateFilename } from '../parser/writer.ts';

// In-memory task store
let tasks: Task[] = [];
let projectDir: string = '';

// --- State Transition Validation (T011) ---

/** Check if a state transition is allowed */
export function isValidTransition(from: Status, to: Status): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from].includes(to);
}

/** Get allowed target states from current status */
export function getAllowedTransitions(from: Status): Status[] {
  return VALID_TRANSITIONS[from];
}

// --- CRUD Operations (T010) ---

/** Load all tasks from a project directory */
export async function loadTasks(dirPath: string): Promise<{ errors: string[] }> {
  projectDir = dirPath;
  const result = await readTasksFromDirectory(dirPath);
  tasks = result.tasks;
  notifyListeners();
  return { errors: result.errors };
}

/** Get all tasks */
export function getTasks(): Task[] {
  return [...tasks];
}

/** Get a single task by ID */
export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

/** Create a new task */
export async function createTask(input: {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  start: string;
  end?: string;
  tags?: string[];
}): Promise<Task> {
  const id = await generateFilename(input.title, projectDir);
  const now = new Date().toISOString();

  const task: Task = {
    id,
    title: input.title,
    description: input.description || '',
    status: input.status || 'backlog',
    priority: input.priority || 'p3',
    start: input.start,
    end: input.end || '',
    tags: input.tags || [],
    order: tasks.length,
    created: now,
    updated: now,
  };

  await writeTaskFile(task, projectDir);
  tasks.push(task);
  notifyListeners();
  return task;
}

/** Update an existing task */
export async function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'created'>>): Promise<Task> {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error(`Task not found: ${id}`);

  const existing = tasks[idx];

  // Validate state transition if status is changing
  if (updates.status && updates.status !== existing.status) {
    if (!isValidTransition(existing.status, updates.status)) {
      throw new Error(
        `Invalid state transition: ${existing.status} → ${updates.status}. Allowed: ${getAllowedTransitions(existing.status).join(', ')}`
      );
    }
  }

  const updated: Task = {
    ...existing,
    ...updates,
    id: existing.id,
    created: existing.created,
    updated: new Date().toISOString(),
  };

  // If title changed, we may need to rename the file
  if (updates.title && updates.title !== existing.title) {
    const newId = await generateFilename(updates.title, projectDir);
    await deleteTaskFile(existing.id, projectDir);
    updated.id = newId;
    await writeTaskFile(updated, projectDir);
  } else {
    await writeTaskFile(updated, projectDir);
  }

  tasks[idx] = updated;
  notifyListeners();
  return updated;
}

/** Delete a task */
export async function deleteTask(id: string): Promise<void> {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error(`Task not found: ${id}`);

  await deleteTaskFile(id, projectDir);
  tasks.splice(idx, 1);
  notifyListeners();
}

/** Update the order field for a task (used in drag-and-drop reorder) */
export async function reorderTask(id: string, newOrder: number): Promise<void> {
  await updateTask(id, { order: newOrder });
}

/** Collect all unique tags across tasks */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const task of tasks) {
    for (const tag of task.tags) tagSet.add(tag);
  }
  return [...tagSet].sort();
}

/** Check if a task is overdue (past end date, not Done/Archived) */
export function isOverdue(task: Task): boolean {
  if (!task.end) return false;
  if (task.status === 'done' || task.status === 'archived') return false;
  const today = new Date().toISOString().split('T')[0];
  return task.end < today;
}

// --- Simple listener pattern ---
type Listener = (tasks: Task[]) => void;
const listeners: Listener[] = [];

export function onTasksChange(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function notifyListeners(): void {
  const snapshot = [...tasks];
  for (const fn of listeners) fn(snapshot);
}
