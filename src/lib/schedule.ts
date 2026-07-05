/** Deterministic date & slot generation for the scheduler (no real Date deps in render). */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface DayOption {
  iso: string;
  weekday: string;
  day: number;
  month: string;
  label: string; // "Today" / "Tomorrow" / weekday
}

// Anchored to the app's "today" (2026-07-05) so the demo is stable.
const BASE = new Date(2026, 6, 5);

// Build a local YYYY-MM-DD string (avoids the UTC shift from toISOString).
function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function upcomingDays(count = 10): DayOption[] {
  const days: DayOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(BASE);
    d.setDate(BASE.getDate() + i);
    const iso = toLocalISO(d);
    const weekday = WEEKDAYS[d.getDay()];
    days.push({
      iso,
      weekday,
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekday,
    });
  }
  return days;
}

export interface SlotGroup {
  period: string;
  icon: string;
  slots: { time: string; available: boolean }[];
}

// Some slots marked unavailable to mimic real-time availability from the diagram.
const UNAVAILABLE = new Set(['09:00 AM', '12:30 PM', '03:00 PM', '05:30 PM']);

export function slotGroups(): SlotGroup[] {
  const make = (times: string[]) =>
    times.map((t) => ({ time: t, available: !UNAVAILABLE.has(t) }));
  return [
    { period: 'Morning', icon: 'sunny', slots: make(['08:00 AM', '09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM']) },
    { period: 'Afternoon', icon: 'partly-sunny', slots: make(['12:00 PM', '12:30 PM', '01:30 PM', '02:00 PM', '03:00 PM']) },
    { period: 'Evening', icon: 'moon', slots: make(['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM']) },
  ];
}

export function prettyDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
