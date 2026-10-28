// Global company live updates
// Changes a calendar sync could push to the global company dataset.

import { SchedulerEvent, SchedulerEventRecurrenceRule } from '@mui/x-scheduler/models';
import {
  formatDateTime,
  formatDay,
  getDayOfWeek,
  getMonday,
  getNextWeekday,
  MEETINGS,
  parseDay,
  parseMinutes,
  PROJECTS,
  Random,
  Team,
  timed,
  WEEK_DAYS,
} from './globalCompanyDataset';

export interface LiveUpdateContext {
  random: Random;
  teams: Team[];
  /**
   * The first day the updates target.
   */
  firstDay: number;
  /**
   * The last day the updates target.
   */
  lastDay: number;
  createId: () => string;
}

export interface LiveUpdate {
  events: SchedulerEvent[];
  description: string;
}

type LiveUpdater = (events: SchedulerEvent[], context: LiveUpdateContext) => LiveUpdate | null;

interface WeeklyOccurrence {
  series: SchedulerEvent;
  rule: SchedulerEventRecurrenceRule;
  day: number;
}

function getDuration(event: SchedulerEvent) {
  return (
    (parseDay(event.end) - parseDay(event.start)) * 24 * 60 +
    parseMinutes(event.end) -
    parseMinutes(event.start)
  );
}

function shiftMinutes(minutes: number, random: Random) {
  return Math.min(Math.max(minutes + random.pick([-60, -30, 30, 60, 90]), 7 * 60), 19 * 60);
}

/**
 * Returns the days of a weekly series without COUNT between `firstDay` and `lastDay`.
 */
function getWeeklyOccurrenceDays(
  series: SchedulerEvent,
  rule: SchedulerEventRecurrenceRule,
  firstDay: number,
  lastDay: number,
) {
  const seriesStart = parseDay(series.start);
  const interval = rule.interval ?? 1;
  const weekDays: readonly string[] = rule.byDay ?? [WEEK_DAYS[getDayOfWeek(seriesStart)]];
  const excludedDays = new Set(series.exDates?.map(parseDay));
  const until = rule.until == null ? lastDay : Math.min(parseDay(rule.until), lastDay);
  const days: number[] = [];
  for (let day = Math.max(firstDay, seriesStart); day <= until; day += 1) {
    const weeks = (getMonday(day) - getMonday(seriesStart)) / 7;
    if (
      weeks % interval === 0 &&
      weekDays.includes(WEEK_DAYS[getDayOfWeek(day)]) &&
      !excludedDays.has(day)
    ) {
      days.push(day);
    }
  }
  return days;
}

/**
 * Picks an occurrence of a timed weekly series in the targeted days.
 * The other series need a full recurrence engine to find their occurrences.
 */
function pickWeeklyOccurrence(
  events: SchedulerEvent[],
  context: LiveUpdateContext,
): WeeklyOccurrence | null {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const series = context.random.pick(events);
    const rule = series.rrule;
    if (
      typeof rule === 'object' &&
      rule.freq === 'WEEKLY' &&
      rule.count == null &&
      !series.allDay
    ) {
      const days = getWeeklyOccurrenceDays(series, rule, context.firstDay, context.lastDay);
      if (days.length > 0) {
        return { series, rule, day: context.random.pick(days) };
      }
    }
  }
  return null;
}

function replaceEvent(events: SchedulerEvent[], event: SchedulerEvent) {
  return events.map((item) => (item.id === event.id ? event : item));
}

const cancelOccurrence: LiveUpdater = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, day } = occurrence;
  const exDate = formatDateTime(day, parseMinutes(series.start));
  return {
    events: replaceEvent(events, { ...series, exDates: [...(series.exDates ?? []), exDate] }),
    description: `Cancelled "${series.title}" on ${formatDay(day)}`,
  };
};

// Like undoing a cancellation.
const restoreOccurrence: LiveUpdater = (events, context) => {
  const candidates = events.flatMap((series) =>
    (series.exDates ?? [])
      .filter((exDate) => {
        const day = parseDay(exDate);
        return day >= context.firstDay && day <= context.lastDay;
      })
      .map((exDate) => ({ series, exDate })),
  );
  if (candidates.length === 0) {
    return null;
  }
  const { series, exDate } = context.random.pick(candidates);
  return {
    events: replaceEvent(events, {
      ...series,
      exDates: series.exDates?.filter((value) => value !== exDate),
    }),
    description: `Restored "${series.title}" on ${exDate.slice(0, 10)}`,
  };
};

// Like an "only this" edit: the series excludes the occurrence, and a standalone event replaces it.
const moveOccurrence: LiveUpdater = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, day } = occurrence;
  const minutes = shiftMinutes(parseMinutes(series.start), context.random);
  const { rrule: unusedRRule, exDates: unusedExDates, ...model } = series;
  const standalone: SchedulerEvent = {
    ...model,
    id: context.createId(),
    ...timed(day, minutes, getDuration(series)),
    extractedFromId: series.id,
  };
  const exDate = formatDateTime(day, parseMinutes(series.start));
  return {
    events: [
      ...replaceEvent(events, { ...series, exDates: [...(series.exDates ?? []), exDate] }),
      standalone,
    ],
    description: `Moved "${series.title}" on ${formatDay(day)} to ${standalone.start.slice(11, 16)}`,
  };
};

// Like a "this and following" edit: the series ends the day before the occurrence,
// and a new series starts on it at another time.
const splitSeries: LiveUpdater = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, rule, day } = occurrence;
  const seriesStart = parseDay(series.start);
  const minutes = shiftMinutes(parseMinutes(series.start), context.random);
  const preceding = series.exDates?.filter((exDate) => parseDay(exDate) < day);
  const following = series.exDates?.filter((exDate) => parseDay(exDate) >= day);
  const followingSeries: SchedulerEvent = {
    ...series,
    ...timed(day, minutes, getDuration(series)),
    exDates: following,
  };
  const time = followingSeries.start.slice(11, 16);

  if (getWeeklyOccurrenceDays(series, rule, seriesStart, day - 1).length === 0) {
    return {
      events: replaceEvent(events, followingSeries),
      description: `Moved every "${series.title}" to ${time}`,
    };
  }

  return {
    events: [
      ...replaceEvent(events, {
        ...series,
        rrule: { ...rule, until: `${formatDay(day - 1)}T23:59:59` },
        exDates: preceding,
      }),
      { ...followingSeries, id: context.createId(), extractedFromId: series.id },
    ],
    description: `Moved "${series.title}" to ${time} from ${formatDay(day)}`,
  };
};

const createSeries: LiveUpdater = (events, context) => {
  const { random } = context;
  const team = random.pick(context.teams);
  const day = getNextWeekday(random.int(context.firstDay, context.lastDay));
  const count = random.pick([undefined, 4, 8, 12]);
  const series: SchedulerEvent = {
    id: context.createId(),
    title: `${random.pick(PROJECTS)} sync · ${team.title}`,
    timezone: team.office.timezone,
    resource: team.id,
    ...timed(day, random.int(18, 34) * 30, random.pick([30, 45, 60])),
    rrule: { freq: 'WEEKLY', byDay: [WEEK_DAYS[getDayOfWeek(day)]], count },
  };
  return {
    events: [...events, series],
    description: `Created the weekly "${series.title}" from ${formatDay(day)}`,
  };
};

const createEvent: LiveUpdater = (events, context) => {
  const { random } = context;
  const team = random.pick(context.teams);
  const day = getNextWeekday(random.int(context.firstDay, context.lastDay));
  const event: SchedulerEvent = {
    id: context.createId(),
    title: random.pick(MEETINGS),
    timezone: team.office.timezone,
    resource: team.id,
    ...timed(day, random.int(18, 34) * 30, random.pick([30, 60, 90])),
  };
  return {
    events: [...events, event],
    description: `Created "${event.title}" for ${team.title} on ${formatDay(day)}`,
  };
};

function renameEvent(events: SchedulerEvent[], context: LiveUpdateContext): LiveUpdate {
  const event = context.random.pick(events);
  const title = event.title.replace(/ · Room \d+$/, '');
  return {
    events: replaceEvent(events, {
      ...event,
      title: `${title} · Room ${context.random.int(1, 99)}`,
    }),
    description: `Renamed "${title}"`,
  };
}

const deleteEvent: LiveUpdater = (events, context) => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const event = context.random.pick(events);
    if (event.rrule == null) {
      return {
        events: events.filter((item) => item.id !== event.id),
        description: `Deleted "${event.title}"`,
      };
    }
  }
  return null;
};

// The standalone events created balance the ones deleted, and the restored occurrences balance the
// cancelled ones, so the calendar keeps roughly its size.
const LIVE_UPDATERS: [LiveUpdater, number][] = [
  [cancelOccurrence, 3],
  [restoreOccurrence, 3],
  [moveOccurrence, 3],
  [splitSeries, 1],
  [createSeries, 1],
  [createEvent, 2],
  [renameEvent, 2],
  [deleteEvent, 5],
];

const TOTAL_WEIGHT = LIVE_UPDATERS.reduce((total, [, weight]) => total + weight, 0);

export function applyLiveUpdate(events: SchedulerEvent[], context: LiveUpdateContext) {
  let target = context.random.int(0, TOTAL_WEIGHT - 1);
  const [updater] =
    LIVE_UPDATERS.find(([, weight]) => {
      target -= weight;
      return target < 0;
    }) ?? LIVE_UPDATERS[0];

  // Renaming always works, when no event matches the update.
  return updater(events, context) ?? renameEvent(events, context);
}
