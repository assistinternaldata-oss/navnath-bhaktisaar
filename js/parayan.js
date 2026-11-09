// Parayan scheduling: spread the 40 adhyays evenly over N days.
export const PLAN_DAYS = [1, 3, 7, 11, 21, 40];
const TOTAL = 40;

/** [[1,2,3,4,5,6], [7,…], …] — earlier days take the extra adhyay when it doesn't divide evenly. */
export function schedule(days) {
  const base = Math.floor(TOTAL / days);
  const extra = TOTAL % days;
  const out = [];
  let next = 1;
  for (let d = 0; d < days; d++) {
    const count = base + (d < extra ? 1 : 0);
    out.push(Array.from({ length: count }, (_, k) => next + k));
    next += count;
  }
  return out;
}

export function perDayRange(days) {
  const sizes = schedule(days).map((d) => d.length);
  return [Math.min(...sizes), Math.max(...sizes)];
}

export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso, k) {
  const [y, m, d] = iso.split('-').map(Number);
  return todayISO(new Date(y, m - 1, d + k));
}

function daysBetween(fromISO, toISO) {
  const [y1, m1, d1] = fromISO.split('-').map(Number);
  const [y2, m2, d2] = toISO.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

/** Where a parayan stands today. */
export function status(p, today = todayISO()) {
  const plan = schedule(p.days);
  const elapsed = daysBetween(p.start, today); // 0 on the first day
  const notStarted = elapsed < 0;
  const day = Math.min(Math.max(elapsed + 1, 1), p.days);
  const doneCount = Object.keys(p.done).length;
  const todays = plan[day - 1];
  // anything left over from earlier days is carried into today's list
  const overdue = notStarted ? [] : plan.slice(0, day - 1).flat().filter((c) => !p.done[c]);
  return {
    plan,
    day,
    notStarted,
    todays,
    overdue,
    doneCount,
    behind: overdue.length,
    complete: doneCount >= TOTAL,
    todayDone: todays.every((c) => p.done[c]) && overdue.length === 0,
  };
}
