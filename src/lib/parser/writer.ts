import matter from 'gray-matter';
import type { Task } from '../types.ts';
import { titleToSlug } from './schema.ts';

/** Serialize a Task into markdown string with frontmatter */
export function serializeTask(task: Task): string {
  const frontmatter: Record<string, unknown> = {
    title: task.title,
    status: task.status,
    priority: task.priority,
    start: task.start,
    tags: task.tags,
    order: task.order,
    created: task.created,
    updated: task.updated,
  };

  // Only include end if present
  if (task.end) {
    frontmatter.end = task.end;
  }

  return matter.stringify(task.description ? `\n${task.description}\n` : '\n', frontmatter);
}

/** Generate a unique filename slug, handling collisions */
export async function generateFilename(title: string, dirPath: string): Promise<string> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const base = titleToSlug(title);
  if (!base) return 'untitled';

  let candidate = base;
  let suffix = 2;

  while (true) {
    const filePath = path.join(dirPath, `${candidate}.md`);
    try {
      await fs.access(filePath);
      // File exists, try next suffix
      candidate = `${base}-${suffix}`;
      suffix++;
    } catch {
      // File doesn't exist, we can use this name
      return candidate;
    }
  }
}

/** Write a task to a markdown file */
export async function writeTaskFile(task: Task, dirPath: string): Promise<string> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const content = serializeTask(task);
  const filePath = path.join(dirPath, `${task.id}.md`);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');

  return filePath;
}

/** Delete a task markdown file */
export async function deleteTaskFile(taskId: string, dirPath: string): Promise<void> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const filePath = path.join(dirPath, `${taskId}.md`);
  await fs.unlink(filePath);
}
