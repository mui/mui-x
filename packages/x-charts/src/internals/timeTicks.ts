export type TimeTicksDefinition = {
  getTickNumber: (from: Date, to: Date) => number;
  isTick: (prev: Date, value: Date) => boolean;
  format: (d: Date) => string;
};

export type TimeTickKeys = 'years' | '3-months' | 'months' | '2-weeks' | 'weeks' | 'days' | 'hours';

export type TimeOrdinalTicks = (TimeTicksDefinition | TimeTickKeys)[];

function yearNumber(from: Date, to: Date) {
  return Math.abs(to.getFullYear() - from.getFullYear());
}
function monthNumber(from: Date, to: Date) {
  return Math.abs(
    to.getFullYear() * 12 + to.getMonth() - 12 * from.getFullYear() - from.getMonth(),
  );
}
function dayNumber(from: Date, to: Date) {
  return Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
}
function hourNumber(from: Date, to: Date) {
  return Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60);
}

export const tickMapper: Record<TimeTickKeys, TimeTicksDefinition> = {
  years: {
    getTickNumber: yearNumber,
    isTick: (prev: Date, value: Date) => value.getFullYear() !== prev.getFullYear(),
    format: (d: Date) => d.getFullYear().toString(),
  },
  '3-months': {
    getTickNumber: (from: Date, to: Date) => Math.floor(monthNumber(from, to) / 3),
    isTick: (prev: Date, value: Date) =>
      value.getMonth() !== prev.getMonth() && value.getMonth() % 3 === 0,
    format: (d: Date) => d.toLocaleString('default', { month: 'short' }),
  },
  months: {
    getTickNumber: monthNumber,
    isTick: (prev: Date, value: Date) => value.getMonth() !== prev.getMonth(),
    format: (d: Date) => d.toLocaleString('default', { month: 'short' }),
  },
  '2-weeks': {
    getTickNumber: (from: Date, to: Date) => dayNumber(from, to) / 14,
    isTick: (prev: Date, value: Date) =>
      (value.getDay() < prev.getDay() || dayNumber(value, prev) > 7) &&
      Math.floor(value.getDate() / 7) % 2 === 1,
    format: (d: Date) => d.toLocaleString('default', { day: 'numeric' }),
  },
  weeks: {
    getTickNumber: (from: Date, to: Date) => dayNumber(from, to) / 7,
    isTick: (prev: Date, value: Date) =>
      value.getDay() < prev.getDay() || dayNumber(value, prev) > 7,
    format: (d: Date) => d.toLocaleString('default', { day: 'numeric' }),
  },
  days: {
    getTickNumber: dayNumber,
    isTick: (prev: Date, value: Date) => value.getDate() !== prev.getDate(),
    format: (d: Date) => d.toLocaleString('default', { day: 'numeric' }),
  },
  hours: {
    getTickNumber: hourNumber,
    isTick: (prev: Date, value: Date) => value.getHours() !== prev.getHours(),
    format: (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
};
