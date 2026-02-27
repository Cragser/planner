import matter from 'gray-matter';
import type { Task } from '../types.ts';
import { validateFrontmatter } from './schema.ts';

export interface ParseResult {
  task: Task | null;
  errors: string[];
}

/** Parse a single markdown file content into a Task */
export function parseTaskMarkdown(content: string, filename: string): ParseResult {
  try {
    const { data, content: body } = matter(content);
    const validation = validateFrontmatter(data as Record<string, unknown>, filename);

    if (!validation.valid) {
      return { task: null, errors: validation.errors };
    }

    const id = filename.replace(/\.md$/, '');
    const task: Task = {
      id,
      title: validation.task.title!,
      description: body.trim(),
      status: validation.task.status!,
      priority: validation.task.priority!,
      start: validation.task.start!,
      end: validation.task.end || '',
      tags: validation.task.tags || [],
      order: validation.task.order || 0,
      created: validation.task.created!,
      updated: validation.task.updated!,
    };

    return { task, errors: [] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { task: null, errors: [`${filename}: failed to parse markdown — ${msg}`] };
  }
}

/** Read all task files from a project directory */
export async function readTasksFromDirectory(dirPath: string): Promise<{ tasks: Task[]; errors: string[] }> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const tasks: Task[] = [];
  const errors: string[] = [];

  let entries: string[];
  try {
    entries = await fs.readdir(dirPath);
  } catch {
    return { tasks: [], errors: [`Could not read directory: ${dirPath}`] };
  }

  const mdFiles = entries.filter((f) => f.endsWith('.md'));

  for (const file of mdFiles) {
    const filePath = path.join(dirPath, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const result = parseTaskMarkdown(content, file);
      if (result.task) {
        tasks.push(result.task);
      }
      if (result.errors.length > 0) {
        errors.push(...result.errors);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${file}: could not read file — ${msg}`);
    }
  }

  return { tasks, errors };
}
