import type { TickFrequency, TickFrequencyDefinition } from '../models/timeTicks';

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

export const tickFrequencies: Record<TickFrequency, TickFrequencyDefinition> = {
  years: {
    getTickNumber: yearNumber,
    isTick: (prev: Date, value: Date) => value.getFullYear() !== prev.getFullYear(),
    format: (d: Date) => d.getFullYear().toString(),
  },
  quarterly: {
    getTickNumber: (from: Date, to: Date) => Math.floor(monthNumber(from, to) / 3),
    isTick: (prev: Date, value: Date) =>
      value.getMonth() !== prev.getMonth() && value.getMonth() % 3 === 0,
    format: new Intl.DateTimeFormat('default', { month: 'short' }).format,
  },
  months: {
    getTickNumber: monthNumber,
    isTick: (prev: Date, value: Date) => value.getMonth() !== prev.getMonth(),
    format: new Intl.DateTimeFormat('default', { month: 'short' }).format,
  },
  biweekly: {
    getTickNumber: (from: Date, to: Date) => dayNumber(from, to) / 14,
    isTick: (prev: Date, value: Date) =>
      (value.getDay() < prev.getDay() || dayNumber(value, prev) > 7) &&
      Math.floor(value.getDate() / 7) % 2 === 1,
    format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
  },
  weeks: {
    getTickNumber: (from: Date, to: Date) => dayNumber(from, to) / 7,
    isTick: (prev: Date, value: Date) =>
      value.getDay() < prev.getDay() || dayNumber(value, prev) >= 7,
    format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
  },
  days: {
    getTickNumber: dayNumber,
    isTick: (prev: Date, value: Date) => value.getDate() !== prev.getDate(),
    format: new Intl.DateTimeFormat('default', { day: 'numeric' }).format,
  },
  hours: {
    getTickNumber: hourNumber,
    isTick: (prev: Date, value: Date) => value.getHours() !== prev.getHours(),
    format: new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' }).format,
  },
};
