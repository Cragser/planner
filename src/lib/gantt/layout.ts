import type { Task } from '../types.ts';

/** Bar dimensions for a Gantt task */
export interface GanttBar {
  taskId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  task: Task;
}

const BAR_HEIGHT = 28;
const BAR_GAP = 6;
const ROW_HEIGHT = BAR_HEIGHT + BAR_GAP;
const LABEL_COLUMN_WIDTH = 200;

/** Calculate bar positions for all tasks */
export function calculateBars(
  tasks: Task[],
  minDate: Date,
  totalMs: number,
  totalWidth: number
): GanttBar[] {
  const bars: GanttBar[] = [];

  // Sort by start date, then by order
  const sorted = [...tasks].sort((a, b) => {
    const cmp = a.start.localeCompare(b.start);
    return cmp !== 0 ? cmp : a.order - b.order;
  });

  for (let i = 0; i < sorted.length; i++) {
    const task = sorted[i];
    const startDate = new Date(task.start);
    const endDate = task.end ? new Date(task.end) : new Date(startDate.getTime() + 86400000); // default 1 day

    const startMs = startDate.getTime() - minDate.getTime();
    const durationMs = endDate.getTime() - startDate.getTime();

    const x = (startMs / totalMs) * totalWidth;
    const width = Math.max((durationMs / totalMs) * totalWidth, 20); // min 20px
    const y = i * ROW_HEIGHT;

    bars.push({
      taskId: task.id,
      x,
      y,
      width,
      height: BAR_HEIGHT,
      task,
    });
  }

  return bars;
}

/** Get total SVG height needed for all bars */
export function getTotalHeight(barCount: number): number {
  return barCount * ROW_HEIGHT + BAR_GAP;
}

/** Get the label column width */
export function getLabelColumnWidth(): number {
  return LABEL_COLUMN_WIDTH;
}

/** Get the row height */
export function getRowHeight(): number {
  return ROW_HEIGHT;
}
