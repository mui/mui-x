import * as React from 'react';
import type { TemporalAdapter } from '@base-ui/react/internals/temporal';
import {
  addToAdapterDate,
  createLabelDate,
  formatWallClockHour,
  getPlainDateWeekStart,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate, PlainDateDuration } from '@mui/x-scheduler-internals/internals';
import type { EventTimelinePremiumPreset, PresetDefinition, PresetHeaderUnit } from '../../models';

type FormatDate = (adapter: TemporalAdapter, plainDate: PlainDate) => string;

const DAY_AND_HOUR_DAYS = 4;

const formatYear: FormatDate = (_adapter, plainDate) => String(plainDate.year);

const formatMonth3Letters: FormatDate = (adapter, plainDate) =>
  adapter.format(createLabelDate(adapter, plainDate), 'month3Letters');

const formatWeekDayMonthAndDayOfMonth: FormatDate = (adapter, plainDate) => {
  const f = adapter.formats;
  return adapter.formatByString(
    createLabelDate(adapter, plainDate),
    `${f.weekday3Letters}, ${f.month3Letters} ${f.dayOfMonth}`,
  );
};

const formatMonthAndYear: FormatDate = (adapter, plainDate) => {
  const f = adapter.formats;
  return adapter.formatByString(
    createLabelDate(adapter, plainDate),
    `${f.monthFullLetter} ${f.yearPadded}`,
  );
};

/**
 * The range and the navigation of a preset made of `unitCount` periods of a `unit`, like days or
 * months. The range starts on the first day of the period of the visible date,
 * `getStartPlainDate()`, and ends before the period that follows the last one.
 */
function createPlainDateRange(
  unit: keyof PlainDateDuration,
  getStartPlainDate: PresetDefinition['getStartPlainDate'] = (_adapter, plainDate) => plainDate,
): Pick<PresetDefinition, 'getStartPlainDate' | 'getEndPlainDate' | 'navigate'> {
  const toDuration = (amount: number) => ({ [unit]: amount }) as PlainDateDuration;
  return {
    getStartPlainDate,
    getEndPlainDate: (startPlainDate, unitCount) => startPlainDate.add(toDuration(unitCount)),
    navigate: (adapter, date, amount) => addToAdapterDate(adapter, date, toDuration(amount)),
  };
}

/**
 * The number of days of the range, `endPlainDate` being the date after it.
 */
function getDayCount(startPlainDate: PlainDate, endPlainDate: PlainDate) {
  return endPlainDate.dayNumber - startPlainDate.dayNumber;
}

export const EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS: Readonly<
  Record<EventTimelinePremiumPreset, PresetDefinition>
> = {
  dayAndHour: {
    timeResolution: 'hour',
    tickWidth: 64,
    headers: [
      { unit: 'day', formatDate: formatWeekDayMonthAndDayOfMonth },
      {
        unit: 'hour',
        // The hour row ticks in hours, so `iterate()` sets `wallClockHour` on all its cells.
        renderCell: ({ adapter, wallClockHour, ampm }) =>
          formatWallClockHour(adapter, wallClockHour!, ampm),
      },
    ],
    unitCount: DAY_AND_HOUR_DAYS,
    ...createPlainDateRange('days'),
    // `unitCount` is in days (the navigation step), but the grid ticks in hours. Pin
    // the CSS tick count to `days × 24`: the hour row is a wall-clock grid, so it emits
    // the same cell count on every day, DST transitions included.
    getCssUnitCount: () => DAY_AND_HOUR_DAYS * 24,
  },
  dayAndMonth: {
    timeResolution: 'day',
    tickWidth: 120,
    headers: [
      { unit: 'month', formatDate: formatMonthAndYear },
      {
        unit: 'day',
        renderCell: ({ adapter, plainDate }) => {
          const date = createLabelDate(adapter, plainDate);
          return (
            <span data-slot="dayCell">
              <span data-slot="weekday">{adapter.format(date, 'weekday1Letter')}</span>
              <span data-slot="dayOfMonth">{adapter.format(date, 'dayOfMonth')}</span>
            </span>
          );
        },
      },
    ],
    unitCount: 8 * 7, // 8 weeks
    ...createPlainDateRange('days'),
  },
  dayAndWeek: {
    timeResolution: 'day',
    tickWidth: 64,
    headers: [
      {
        unit: 'week',
        renderCell: ({ adapter, firstPlainDate, lastPlainDate }) =>
          `${formatWeekDayMonthAndDayOfMonth(adapter, firstPlainDate)} - ${formatWeekDayMonthAndDayOfMonth(adapter, lastPlainDate)}`,
      },
      {
        unit: 'day',
        formatDate: (adapter, plainDate) =>
          adapter.format(createLabelDate(adapter, plainDate), 'weekday1Letter'),
      },
    ],
    unitCount: 16, // 16 weeks
    ...createPlainDateRange('weeks', getPlainDateWeekStart),
    getCssUnitCount: getDayCount,
  },
  monthAndYear: {
    timeResolution: 'day',
    tickWidth: 6,
    headers: [
      { unit: 'year', formatDate: formatYear },
      { unit: 'month', formatDate: formatMonth3Letters },
    ],
    unitCount: 3 * 12, // 3 years
    ...createPlainDateRange('months', (_adapter, plainDate) => plainDate.with({ day: 1 })),
    getCssUnitCount: getDayCount,
  },
  year: {
    timeResolution: 'year',
    tickWidth: 200,
    headers: [{ unit: 'year', formatDate: formatYear }],
    unitCount: 30, // 30 years
    ...createPlainDateRange('years', (_adapter, plainDate) => plainDate.with({ month: 1, day: 1 })),
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
