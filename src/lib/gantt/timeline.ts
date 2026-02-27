import type { GanttZoom } from '../types.ts';

/** Represents a time grid unit (column in the timeline) */
export interface TimeUnit {
  label: string;
  start: Date;
  end: Date;
  width: number;
}

/** Calculate the date range needed to display all tasks */
export function calculateDateRange(
  starts: string[],
  ends: string[],
  padding: number = 7
): { min: Date; max: Date } {
  const dates = [
    ...starts.filter(Boolean).map((d) => new Date(d)),
    ...ends.filter(Boolean).map((d) => new Date(d)),
  ];

  if (dates.length === 0) {
    const now = new Date();
    return {
      min: new Date(now.getTime() - padding * 86400000),
      max: new Date(now.getTime() + padding * 86400000),
    };
  }

  let min = dates[0];
  let max = dates[0];
  for (const d of dates) {
    if (d < min) min = d;
    if (d > max) max = d;
  }

  // Add padding
  return {
    min: new Date(min.getTime() - padding * 86400000),
    max: new Date(max.getTime() + padding * 86400000),
  };
}

/** Generate time units for the given zoom level */
export function generateTimeUnits(
  min: Date,
  max: Date,
  zoom: GanttZoom,
  unitWidth: number = 40
): TimeUnit[] {
  const units: TimeUnit[] = [];
  const current = new Date(min);

  switch (zoom) {
    case 'week':
      // Each unit is a day
      while (current <= max) {
        const start = new Date(current);
        const end = new Date(current);
        end.setDate(end.getDate() + 1);
        units.push({
          label: formatDayLabel(start),
          start,
          end,
          width: unitWidth,
        });
        current.setDate(current.getDate() + 1);
      }
      break;

    case 'month':
      // Each unit is a week
      // Snap to start of week (Monday)
      current.setDate(current.getDate() - ((current.getDay() + 6) % 7));
      while (current <= max) {
        const start = new Date(current);
        const end = new Date(current);
        end.setDate(end.getDate() + 7);
        units.push({
          label: formatWeekLabel(start),
          start,
          end,
          width: unitWidth,
        });
        current.setDate(current.getDate() + 7);
      }
      break;

    case 'quarter':
      // Each unit is a month
      current.setDate(1);
      while (current <= max) {
        const start = new Date(current);
        const end = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        units.push({
          label: formatMonthLabel(start),
          start,
          end,
          width: unitWidth * 2,
        });
        current.setMonth(current.getMonth() + 1);
      }
      break;
  }

  return units;
}

/** Calculate the total timeline width in pixels */
export function getTimelineWidth(units: TimeUnit[]): number {
  return units.reduce((sum, u) => sum + u.width, 0);
}

/** Calculate pixel position for a given date within the timeline */
export function dateToPixel(
  date: Date,
  min: Date,
  totalMs: number,
  totalWidth: number
): number {
  const ms = date.getTime() - min.getTime();
  return (ms / totalMs) * totalWidth;
}

function formatDayLabel(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatWeekLabel(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatMonthLabel(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
