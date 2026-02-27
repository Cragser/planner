import type { Project } from '../types.ts';

/** Default planner data root path */
const DEFAULT_ROOT = '~/planner-data';

let rootPath: string = '';
let projects: Project[] = [];
let activeProjectName: string = '';

// --- Root Path Configuration (U2) ---

/** Get the configured root path */
export function getRootPath(): string {
  if (!rootPath) {
    // Try localStorage first
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('planner-root-path') : null;
    rootPath = stored || DEFAULT_ROOT;
  }
  return rootPath;
}

/** Set and persist the root path */
export function setRootPath(path: string): void {
  rootPath = path;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('planner-root-path', path);
  }
}

// --- Project Management ---

/** Scan root directory for project folders */
export async function loadProjects(): Promise<{ projects: Project[]; errors: string[] }> {
  const root = getRootPath();
  const errors: string[] = [];

  try {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const expandedRoot = root.replace(/^~/, process.env.HOME || '/home/user');
    await fs.mkdir(expandedRoot, { recursive: true });

    const entries = await fs.readdir(expandedRoot, { withFileTypes: true });
    projects = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('.')) continue;

      const projectPath = path.join(expandedRoot, entry.name);
      const files = await fs.readdir(projectPath);
      const mdCount = files.filter((f: string) => f.endsWith('.md')).length;

      projects.push({
        name: entry.name,
        path: projectPath,
        taskCount: mdCount,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to scan projects: ${msg}`);
  }

  return { projects, errors };
}

/** Get all loaded projects */
export function getProjects(): Project[] {
  return [...projects];
}

/** Get active project name */
export function getActiveProject(): string {
  if (!activeProjectName && typeof localStorage !== 'undefined') {
    activeProjectName = localStorage.getItem('planner-active-project') || '';
  }
  return activeProjectName;
}

/** Set active project and persist selection */
export function setActiveProject(name: string): void {
  activeProjectName = name;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('planner-active-project', name);
  }
  notifyListeners();
}

/** Create a new project folder */
export async function createProject(name: string): Promise<Project> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const root = getRootPath().replace(/^~/, process.env.HOME || '/home/user');
  const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const projectPath = path.join(root, slug);

  await fs.mkdir(projectPath, { recursive: true });

  const project: Project = { name: slug, path: projectPath, taskCount: 0 };
  projects.push(project);
  notifyListeners();
  return project;
}

/** Get the filesystem path for the active project */
export function getActiveProjectPath(): string {
  const root = getRootPath().replace(/^~/, process.env.HOME || '/home/user');
  const active = getActiveProject();
  if (!active) return root;
  const project = projects.find((p) => p.name === active);
  return project?.path || `${root}/${active}`;
}

// --- Listener pattern ---
type Listener = (projects: Project[], active: string) => void;
const listeners: Listener[] = [];

export function onProjectsChange(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function notifyListeners(): void {
  for (const fn of listeners) fn([...projects], activeProjectName);
}
