import type { DayHours, DayKey, Truck } from "./types";

const DAY_ORDER: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABEL: Record<DayKey, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

/** Minutes since midnight for a "HH:MM" string. */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "20:00" -> "8:00 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function dayKeyFor(date: Date): DayKey {
  return DAY_ORDER[date.getDay()];
}

export function todayHours(truck: Truck, now: Date = new Date()): DayHours | null {
  return truck.hours[dayKeyFor(now)];
}

export interface TruckStatus {
  open: boolean;
  /** Short human label, e.g. "Open until 8 PM" or "Closed · Opens Mon 11 AM". */
  label: string;
}

/** Find the next day (including none) the truck is open, starting after `fromIndex`. */
function nextOpening(truck: Truck, fromDayIndex: number): { day: DayKey; hours: DayHours } | null {
  for (let i = 1; i <= 7; i++) {
    const idx = (fromDayIndex + i) % 7;
    const day = DAY_ORDER[idx];
    const hours = truck.hours[day];
    if (hours) return { day, hours };
  }
  return null;
}

export function getStatus(truck: Truck, now: Date = new Date()): TruckStatus {
  const dayIdx = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = truck.hours[DAY_ORDER[dayIdx]];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (nowMin >= open && nowMin < close) {
      return { open: true, label: `Open until ${formatTime(today.close)}` };
    }
    if (nowMin < open) {
      return { open: false, label: `Closed · Opens ${formatTime(today.open)}` };
    }
  }

  const next = nextOpening(truck, dayIdx);
  if (!next) return { open: false, label: "Closed" };
  return {
    open: false,
    label: `Closed · Opens ${DAY_LABEL[next.day]} ${formatTime(next.hours.open)}`,
  };
}

export function isOpenNow(truck: Truck, now: Date = new Date()): boolean {
  return getStatus(truck, now).open;
}

/** Ordered Mon–Sun rows for a schedule table. */
export function weekRows(truck: Truck): { label: string; text: string; isToday: boolean }[] {
  const todayKey = dayKeyFor(new Date());
  const order: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return order.map((day) => {
    const h = truck.hours[day];
    return {
      label: DAY_LABEL[day],
      text: h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : "Closed",
      isToday: day === todayKey,
    };
  });
}
