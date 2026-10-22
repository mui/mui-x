import * as React from 'react';
import type { TemporalAdapter } from '@base-ui/react/internals/temporal';
import {
  addToAdapterDate,
  buildTemporalPlainDate,
  createAdapterDate,
  getStartOfWeek,
  toEpochMs,
} from '@mui/x-scheduler-internals/internals';
import type { PlainDate, PlainDateDuration } from '@mui/x-scheduler-internals/internals';
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
 * A day with no DST transition, used as the base of the hour labels. Cached per adapter:
 * the header re-renders on every horizontal scroll and builds one label per visible hour
 * cell, so parsing the date there would repeat the same work on every frame.
 */
const dstFreeTemplateDay = new WeakMap<TemporalAdapter, TemporalSupportedObject>();

function getDstFreeTemplateDay(adapter: TemporalAdapter) {
  let template = dstFreeTemplateDay.get(adapter);
  if (!template) {
    template = adapter.date('2020-01-01T00:00:00', 'default');
    dstFreeTemplateDay.set(adapter, template);
  }
  return template;
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
  return adapter.formatByString(adapter.setHours(getDstFreeTemplateDay(adapter), hour), pattern);
}

// The presets read and move their ranges on the plain dates of their timezone, resolved like
// `toEpochMs()`. The first week of `dayAndWeek` comes from `getStartOfWeek()`.

/**
 * The first instant of the day `getPlainDate()` returns for the day of `date`, `offsetMs` added.
 */
function createDateFromPlainDate(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  getPlainDate: (plainDate: PlainDate) => PlainDate,
  offsetMs = 0,
) {
  const timezone = adapter.getTimezone(date);
  const plainDate = getPlainDate(buildTemporalPlainDate(adapter, date));
  return createAdapterDate(adapter, toEpochMs(plainDate, 0, timezone) + offsetMs, timezone);
}

/**
 * The range and the navigation of a preset made of `unitCount` periods of a `unit`, like days or
 * months. The range starts on the first day of the period of the visible date, `getPeriodStart()`,
 * and ends on the last instant before the period that follows the last one.
 */
function createPlainDateRange(
  unit: keyof PlainDateDuration,
  getPeriodStart: (plainDate: PlainDate) => PlainDate = (plainDate) => plainDate,
): Pick<PresetDefinition, 'getStartDate' | 'getEndDate' | 'navigate'> {
  const toDuration = (amount: number) => ({ [unit]: amount }) as PlainDateDuration;
  return {
    getStartDate: (adapter, visibleDate) =>
      createDateFromPlainDate(adapter, visibleDate, getPeriodStart),
    // `start` is the start of the first period, as `getStartDate()` returns it.
    getEndDate: (adapter, start, unitCount) =>
      createDateFromPlainDate(
        adapter,
        start,
        (plainDate) => plainDate.add(toDuration(unitCount)),
        -1,
      ),
    navigate: (adapter, date, amount) => addToAdapterDate(adapter, date, toDuration(amount)),
  };
}

/**
 * The number of days from the day of `start` to the day of `end`, both included.
 */
function getDayCount(
  adapter: TemporalAdapter,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
) {
  return (
    buildTemporalPlainDate(adapter, end).dayNumber -
    buildTemporalPlainDate(adapter, start).dayNumber +
    1
  );
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
        renderCell: ({ adapter, date }) => (
          <span data-slot="dayCell">
            <span data-slot="weekday">{adapter.format(date, 'weekday1Letter')}</span>
            <span data-slot="dayOfMonth">{adapter.format(date, 'dayOfMonth')}</span>
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
        renderCell: ({ adapter, start, end }) =>
          `${formatWeekDayMonthAndDayOfMonth(adapter, start)} - ${formatWeekDayMonthAndDayOfMonth(adapter, adapter.addDays(end, -1))}`,
      },
      { unit: 'day', formatDate: formatWeekday1Letter },
    ],
    unitCount: 16, // 16 weeks
    ...createPlainDateRange('weeks'),
    getStartDate: (adapter, visibleDate, weekStartsOn) =>
      getStartOfWeek(adapter, visibleDate, weekStartsOn),
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
    ...createPlainDateRange('months', (plainDate) => plainDate.with({ day: 1 })),
    getCssUnitCount: getDayCount,
  },
  year: {
    timeResolution: 'year',
    tickWidth: 200,
    headers: [{ unit: 'year', formatDate: formatYear }],
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
