import type { Status, Priority, Task } from '../types.ts';

const ALL_STATUSES: Status[] = ['backlog', 'in-progress', 'review', 'done', 'archived'];
const ALL_PRIORITIES: Priority[] = ['p0', 'p1', 'p2', 'p3'];

const MAX_TITLE_LENGTH = 200;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  task: Partial<Task>;
}

/** Parse and validate frontmatter data into a partial Task with defaults */
export function validateFrontmatter(data: Record<string, unknown>, filename: string): ValidationResult {
  const errors: string[] = [];

  // Title: required, non-empty, max 200
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title) {
    errors.push(`${filename}: title is required and must be non-empty`);
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.push(`${filename}: title exceeds ${MAX_TITLE_LENGTH} characters`);
  }

  // Status: default to backlog
  let status: Status = 'backlog';
  if (data.status !== undefined) {
    const s = String(data.status).toLowerCase();
    if (ALL_STATUSES.includes(s as Status)) {
      status = s as Status;
    } else {
      errors.push(`${filename}: invalid status "${data.status}", defaulting to backlog`);
    }
  }

  // Priority: default to p3
  let priority: Priority = 'p3';
  if (data.priority !== undefined) {
    const p = String(data.priority).toLowerCase();
    if (ALL_PRIORITIES.includes(p as Priority)) {
      priority = p as Priority;
    } else {
      errors.push(`${filename}: invalid priority "${data.priority}", defaulting to p3`);
    }
  }

  // Start date: required
  const start = typeof data.start === 'string' ? data.start : data.start instanceof Date ? data.start.toISOString().split('T')[0] : '';
  if (!start) {
    errors.push(`${filename}: start date is required`);
  }

  // End date: optional
  const end = typeof data.end === 'string' ? data.end : data.end instanceof Date ? data.end.toISOString().split('T')[0] : '';

  // Validate start <= end when both present
  if (start && end && start > end) {
    errors.push(`${filename}: start date (${start}) must be <= end date (${end})`);
  }

  // Tags: optional array of strings
  let tags: string[] = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.map(String);
  }

  // Order: default to 0
  const order = typeof data.order === 'number' ? data.order : 0;

  // Created/updated timestamps
  const now = new Date().toISOString();
  const created = typeof data.created === 'string' ? data.created : data.created instanceof Date ? data.created.toISOString() : now;
  const updated = typeof data.updated === 'string' ? data.updated : data.updated instanceof Date ? data.updated.toISOString() : now;

  return {
    valid: errors.length === 0,
    errors,
    task: { title, status, priority, start, end, tags, order, created, updated },
  };
}

/** Generate a filename slug from a title */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
