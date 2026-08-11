import * as React from 'react';
import type { TemporalAdapter } from '@base-ui/react/internals/temporal';
import { getEndOfWeek, getStartOfWeek } from '@mui/x-scheduler-internals/internals';
import type {
  TemporalSupportedObject,
  EventTimelinePremiumPreset,
  PresetDefinition,
  PresetHeaderUnit,
} from '../../models';

type FormatDate = (adapter: TemporalAdapter, date: TemporalSupportedObject) => string;

const DAY_AND_HOUR_DAYS = 4;

const formatYear: FormatDate = (adapter, date) => String(adapter.getYear(date));

const formatMonth3Letters: FormatDate = (adapter, date) => adapter.format(date, 'month3Letters');

const formatWeekday1Letter: FormatDate = (adapter, date) => adapter.format(date, 'weekday1Letter');

function formatWeekDayMonthAndDayOfMonth(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  const f = adapter.formats;
  return adapter.formatByString(date, `${f.weekday3Letters}, ${f.month3Letters} ${f.dayOfMonth}`);
}

function formatMonthAndYear(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  const f = adapter.formats;
  return adapter.formatByString(date, `${f.monthFullLetter} ${f.yearPadded}`);
}

/**
 * Formats a wall-clock hour, not an instant: the hour skipped by a spring-forward
 * transition has no instant on that day, so the label is built on a DST-free template
 * day. Same approach as the Event Calendar's time axis.
 */
function formatHourLabel(adapter: TemporalAdapter, hour: number, ampm: boolean) {
  const f = adapter.formats;
  const pattern = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;
  const template = adapter.date('2020-01-01T00:00:00', 'default');
  return adapter.formatByString(adapter.setHours(template, hour), pattern);
}

export const EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS: Readonly<
  Record<EventTimelinePremiumPreset, PresetDefinition>
> = {
  dayAndHour: {
    timeResolution: 'hour',
    tickWidth: 64,
    headers: [
      {
        unit: 'day',
        renderCell: ({ adapter, start }) => formatWeekDayMonthAndDayOfMonth(adapter, start),
      },
      {
        unit: 'hour',
        renderCell: ({ adapter, date, wallClockHour, ampm }) =>
          formatHourLabel(adapter, wallClockHour ?? adapter.getHours(date), ampm),
      },
    ],
    unitCount: DAY_AND_HOUR_DAYS,
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
    // `unitCount` is in days (the navigation step), but the grid ticks in hours. Pin
    // the CSS tick count to `days × 24`: the hour row is a wall-clock grid, so it emits
    // the same cell count on every day, DST transitions included.
    getCssUnitCount: () => DAY_AND_HOUR_DAYS * 24,
    navigate: (adapter, date, amount) => adapter.addDays(date, amount),
  },
  dayAndMonth: {
    timeResolution: 'day',
    tickWidth: 120,
    headers: [
      { unit: 'month', formatDate: formatMonthAndYear },
      {
        unit: 'day',
        renderCell: ({ adapter, date }) => (
          <span data-slot="dayCell">
            <span data-slot="weekday">{adapter.format(date, 'weekday1Letter')}</span>
            <span data-slot="dayOfMonth">{adapter.format(date, 'dayOfMonth')}</span>
          </span>
        ),
      },
    ],
    unitCount: 8 * 7, // 8 weeks
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
    navigate: (adapter, date, amount) => adapter.addDays(date, amount),
  },
  dayAndWeek: {
    timeResolution: 'day',
    tickWidth: 64,
    headers: [
      {
        unit: 'week',
        renderCell: ({ adapter, start, end }) =>
          `${formatWeekDayMonthAndDayOfMonth(adapter, start)} - ${formatWeekDayMonthAndDayOfMonth(adapter, adapter.addDays(end, -1))}`,
      },
      { unit: 'day', formatDate: formatWeekday1Letter },
    ],
    unitCount: 16, // 16 weeks
    getStartDate: (adapter, visibleDate, weekStartsOn) =>
      getStartOfWeek(adapter, visibleDate, weekStartsOn),
    getEndDate: (adapter, start, unitCount, weekStartsOn) =>
      getEndOfWeek(adapter, adapter.addWeeks(start, unitCount - 1), weekStartsOn),
    getCssUnitCount: (adapter, start, end) => adapter.differenceInDays(end, start) + 1,
    navigate: (adapter, date, amount) => adapter.addWeeks(date, amount),
  },
  monthAndYear: {
    timeResolution: 'day',
    tickWidth: 6,
    headers: [
      { unit: 'year', formatDate: formatYear },
      { unit: 'month', formatDate: formatMonth3Letters },
    ],
    unitCount: 3 * 12, // 3 years
    getStartDate: (adapter, visibleDate) => adapter.startOfMonth(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfMonth(adapter.addMonths(start, unitCount - 1)),
    getCssUnitCount: (adapter, start, end) => adapter.differenceInDays(end, start) + 1,
    navigate: (adapter, date, amount) => adapter.addMonths(date, amount),
  },
  year: {
    timeResolution: 'year',
    tickWidth: 200,
    headers: [{ unit: 'year', formatDate: formatYear }],
    unitCount: 30, // 30 years
    getStartDate: (adapter, visibleDate) => adapter.startOfYear(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfYear(adapter.addYears(start, unitCount - 1)),
    navigate: (adapter, date, amount) => adapter.addYears(date, amount),
  },
};

// Approximate number of ticks per day for each supported header unit; used to normalize
// `tickWidth` (px per tick) into a single "px per day" number that represents zoom level.
const TICKS_PER_DAY: Record<PresetHeaderUnit, number> = {
  hour: 24,
  day: 1,
  week: 1 / 7,
  month: 1 / 30,
  year: 1 / 365,
};

/**
 * Returns how many CSS pixels the preset spends representing one calendar day.
 * Higher = more zoomed in. Used to derive the canonical zoom ordering of presets.
 */
export function getPresetPxPerDay(preset: EventTimelinePremiumPreset): number {
  const { timeResolution, tickWidth } = EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS[preset];
  return tickWidth * TICKS_PER_DAY[timeResolution];
}
