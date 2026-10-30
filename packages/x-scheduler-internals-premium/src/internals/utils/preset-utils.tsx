import * as React from 'react';
import {
  addToAdapterDate,
  formatDayOfMonth,
  formatMonthAndYear,
  formatMonthShort,
  formatTime,
  formatWeekdayNarrow,
  formatWeekdayShortMonthShortAndDayOfMonth,
  formatWeekdayShortMonthShortAndDayOfMonthRange,
  formatYear,
  getDayNumber,
  getPlainDateWeekStart,
} from '@mui/x-scheduler-internals/internals';
import type { BaseTemporal, PlainDateDuration } from '@mui/x-scheduler-internals/internals';
import type { EventTimelinePremiumPreset, PresetDefinition, PresetHeaderUnit } from '../../models';

const DAY_AND_HOUR_DAYS = 4;

/**
 * The range and the navigation of a preset made of `unitCount` periods of a `unit`, like days or
 * months. The range starts on the first day of the period of the visible date,
 * `getStartPlainDate()`, and ends before the period that follows the last one.
 */
function createPlainDateRange(
  unit: keyof PlainDateDuration,
  getStartPlainDate: PresetDefinition['getStartPlainDate'] = (plainDate) => plainDate,
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
export function getDayCount(
  startPlainDate: BaseTemporal.PlainDate,
  endPlainDate: BaseTemporal.PlainDate,
) {
  return getDayNumber(endPlainDate) - getDayNumber(startPlainDate);
}

export const EVENT_TIMELINE_PREMIUM_PRESET_DEFINITIONS: Readonly<
  Record<EventTimelinePremiumPreset, PresetDefinition>
> = {
  dayAndHour: {
    timeResolution: 'hour',
    tickWidth: 64,
    headers: [
      { unit: 'day', format: formatWeekdayShortMonthShortAndDayOfMonth },
      {
        unit: 'hour',
        // The hour row ticks in hours, so `iterate()` sets `wallClockHour` on all its cells.
        renderCell: ({ locale, wallClockHour, ampm }) =>
          formatTime(locale, wallClockHour! * 60, ampm),
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
      { unit: 'month', format: formatMonthAndYear },
      {
        unit: 'day',
        renderCell: ({ locale, plainDate }) => (
          <span data-slot="dayCell">
            <span data-slot="weekday">{formatWeekdayNarrow(locale, plainDate)}</span>
            <span data-slot="dayOfMonth">{formatDayOfMonth(locale, plainDate)}</span>
          </span>
        ),
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
        renderCell: ({ locale, firstPlainDate, lastPlainDate }) =>
          formatWeekdayShortMonthShortAndDayOfMonthRange(locale, firstPlainDate, lastPlainDate),
      },
      { unit: 'day', format: formatWeekdayNarrow },
    ],
    unitCount: 16, // 16 weeks
    ...createPlainDateRange('weeks', getPlainDateWeekStart),
    getCssUnitCount: getDayCount,
  },
  monthAndYear: {
    timeResolution: 'day',
    tickWidth: 6,
    headers: [
      { unit: 'year', format: formatYear },
      { unit: 'month', format: formatMonthShort },
    ],
    unitCount: 3 * 12, // 3 years
    ...createPlainDateRange('months', (plainDate) => plainDate.with({ day: 1 })),
    getCssUnitCount: getDayCount,
  },
  year: {
    timeResolution: 'year',
    tickWidth: 200,
    headers: [{ unit: 'year', format: formatYear }],
    unitCount: 30, // 30 years
    ...createPlainDateRange('years', (plainDate) => plainDate.with({ month: 1, day: 1 })),
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
