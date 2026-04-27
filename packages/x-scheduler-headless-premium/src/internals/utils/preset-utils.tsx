import * as React from 'react';
import { TemporalAdapter } from '@mui/x-scheduler-headless/base-ui-copy';
import {
  TemporalSupportedObject,
  EventTimelinePremiumPreset,
  PresetConfig,
  PresetHeaderLevelConfig,
  PresetHeaderUnit,
} from '../../models';

const DAY_AND_HOUR_DAYS = 4;

const formatYear: PresetHeaderLevelConfig['formatDate'] = (adapter, date) =>
  String(adapter.getYear(date));

const formatMonth3Letters: PresetHeaderLevelConfig['formatDate'] = (adapter, date) =>
  adapter.format(date, 'month3Letters');

const formatWeekday1Letter: PresetHeaderLevelConfig['formatDate'] = (adapter, date) =>
  adapter.format(date, 'weekday1Letter');

function formatWeekDayMonthAndDayOfMonth(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  const f = adapter.formats;
  return adapter.formatByString(date, `${f.weekday3Letters}, ${f.month3Letters} ${f.dayOfMonth}`);
}

function formatMonthAndYear(adapter: TemporalAdapter, date: TemporalSupportedObject) {
  const f = adapter.formats;
  return adapter.formatByString(date, `${f.monthFullLetter} ${f.yearPadded}`);
}

function formatHourLabel(adapter: TemporalAdapter, date: TemporalSupportedObject, ampm: boolean) {
  const f = adapter.formats;
  const pattern = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;
  return adapter.formatByString(date, pattern);
}

// TODO(#21359): Expose as a prop for user-defined preset customization (step sizes,
// headers, tick widths) and custom preset registration.
export const EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS: Record<
  EventTimelinePremiumPreset,
  PresetConfig
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
        renderCell: ({ adapter, date, ampm }) => formatHourLabel(adapter, date, ampm),
      },
    ],
    unitCount: DAY_AND_HOUR_DAYS,
    getStartDate: (adapter, visibleDate) => adapter.startOfDay(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfDay(adapter.addDays(start, unitCount - 1)),
    // Use a fixed 24 instead of `differenceInHours` to keep the grid stable across DST days
    // (which have 23 or 25 real hours but still render 24 hour cells).
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
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
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
    getStartDate: (adapter, visibleDate) => adapter.startOfWeek(visibleDate),
    getEndDate: (adapter, start, unitCount) =>
      adapter.endOfWeek(adapter.addWeeks(start, unitCount - 1)),
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
 * Higher = more zoomed in. Used to derive the canonical zoom ordering of presets
 * and as the reference value for a future pinch-zoom implementation (multiply by
 * `zoomFactor` to get the current effective px/day, then snap to the nearest preset).
 */
export function getPresetPxPerDay(preset: EventTimelinePremiumPreset): number {
  const { timeResolution, tickWidth } = EVENT_TIMELINE_PREMIUM_PRESET_CONFIGS[preset];
  return tickWidth * TICKS_PER_DAY[timeResolution];
}
