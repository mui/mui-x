// Global company live updates
// Changes a calendar sync could push to the global company dataset.

import {
  createProjectSeries,
  createRandom,
  createTeamMeeting,
  formatDateTime,
  formatDay,
  formatEndOfDay,
  getMonday,
  getNextWeekday,
  getWeekDay,
  parseDay,
  parseMinutes,
  timed,
} from './globalCompanyDataset';

function getDuration(event) {
  return (
    (parseDay(event.end) - parseDay(event.start)) * 24 * 60 +
    parseMinutes(event.end) -
    parseMinutes(event.start)
  );
}

function shiftMinutes(minutes, random) {
  return Math.min(
    Math.max(minutes + random.pick([-60, -30, 30, 60, 90]), 7 * 60),
    19 * 60,
  );
}

/**
 * Returns the days of a weekly series without COUNT between `firstDay` and `lastDay`.
 */
function getWeeklyOccurrenceDays(series, rule, firstDay, lastDay) {
  const seriesStart = parseDay(series.start);
  const interval = rule.interval ?? 1;
  const weekDays = rule.byDay ?? [getWeekDay(seriesStart)];
  const excludedDays = new Set(series.exDates?.map(parseDay));
  const until =
    rule.until == null ? lastDay : Math.min(parseDay(rule.until), lastDay);
  const days = [];
  for (let day = Math.max(firstDay, seriesStart); day <= until; day += 1) {
    const weeks = (getMonday(day) - getMonday(seriesStart)) / 7;
    if (
      weeks % interval === 0 &&
      weekDays.includes(getWeekDay(day)) &&
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
function pickWeeklyOccurrence(events, context) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const series = context.random.pick(events);
    const rule = series.rrule;
    if (
      typeof rule === 'object' &&
      rule.freq === 'WEEKLY' &&
      rule.count == null &&
      !series.allDay
    ) {
      const days = getWeeklyOccurrenceDays(
        series,
        rule,
        context.firstDay,
        context.lastDay,
      );
      if (days.length > 0) {
        return { series, rule, day: context.random.pick(days) };
      }
    }
  }
  return null;
}

function pickTeamDay(context) {
  const { random } = context;
  return {
    team: random.pick(context.teams),
    day: getNextWeekday(random.int(context.firstDay, context.lastDay)),
  };
}

function replaceEvent(events, event) {
  return events.map((item) => (item.id === event.id ? event : item));
}

function excludeOccurrence(events, series, day) {
  const exDate = formatDateTime(day, parseMinutes(series.start));
  return replaceEvent(events, {
    ...series,
    exDates: [...(series.exDates ?? []), exDate],
  });
}

const cancelOccurrence = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, day } = occurrence;
  return {
    events: excludeOccurrence(events, series, day),
    description: `Cancelled "${series.title}" on ${formatDay(day)}`,
  };
};

// Like undoing a cancellation or a move.
const restoreOccurrence = (events, context) => {
  // The dates start with the day, so comparing the strings compares the days.
  const firstKey = formatDay(context.firstDay);
  const endKey = formatDay(context.lastDay + 1);
  const candidates = [];
  events.forEach((series) => {
    series.exDates?.forEach((exDate) => {
      if (exDate >= firstKey && exDate < endKey) {
        candidates.push({ series, exDate });
      }
    });
  });
  if (candidates.length === 0) {
    return null;
  }

  const { series, exDate } = context.random.pick(candidates);
  const day = exDate.slice(0, 10);
  const isMovedOccurrence = (event) =>
    event.extractedFromId === series.id &&
    event.rrule == null &&
    event.start.startsWith(day);
  return {
    events: replaceEvent(events, {
      ...series,
      exDates: series.exDates?.filter((value) => value !== exDate),
    }).filter((event) => !isMovedOccurrence(event)),
    description: `Restored "${series.title}" on ${day}`,
  };
};

// Like an "only this" edit: the series excludes the occurrence, and a standalone event replaces it.
const moveOccurrence = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, day } = occurrence;
  const minutes = shiftMinutes(parseMinutes(series.start), context.random);
  const { rrule: unusedRRule, exDates: unusedExDates, ...model } = series;
  const standalone = {
    ...model,
    id: context.createId(),
    ...timed(day, minutes, getDuration(series)),
    extractedFromId: series.id,
  };
  return {
    events: [...excludeOccurrence(events, series, day), standalone],
    description: `Moved "${series.title}" on ${formatDay(day)} to ${standalone.start.slice(11, 16)}`,
  };
};

// Like a "this and following" edit: the series ends the day before the occurrence,
// and a new series starts on it at another time.
const splitSeries = (events, context) => {
  const occurrence = pickWeeklyOccurrence(events, context);
  if (occurrence == null) {
    return null;
  }
  const { series, rule, day } = occurrence;
  const seriesStart = parseDay(series.start);
  const minutes = shiftMinutes(parseMinutes(series.start), context.random);
  const preceding = series.exDates?.filter((exDate) => parseDay(exDate) < day);
  const following = series.exDates?.filter((exDate) => parseDay(exDate) >= day);
  const followingSeries = {
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

  const followingId = context.createId();
  // The occurrences moved from the following days now belong to the new series.
  const isFollowingMovedOccurrence = (event) =>
    event.extractedFromId === series.id &&
    event.rrule == null &&
    parseDay(event.start) >= day;
  return {
    events: [
      ...events.map((event) => {
        if (event.id === series.id) {
          return {
            ...series,
            rrule: { ...rule, until: formatEndOfDay(day - 1) },
            exDates: preceding,
          };
        }
        return isFollowingMovedOccurrence(event)
          ? { ...event, extractedFromId: followingId }
          : event;
      }),
      { ...followingSeries, id: followingId, extractedFromId: series.id },
    ],
    description: `Moved "${series.title}" to ${time} from ${formatDay(day)}`,
  };
};

const createSeries = (events, context) => {
  const { team, day } = pickTeamDay(context);
  const count = context.random.pick([undefined, 4, 8, 12]);
  const series = createProjectSeries(team, day, context.createId(), context.random, {
    count,
  });
  return {
    events: [...events, series],
    description: `Created the weekly "${series.title}" from ${formatDay(day)}`,
  };
};

// Deletes a series created by `createSeries` and never split, with the occurrences moved from it.
const deleteSeries = (events, context) => {
  const candidates = events.filter(
    (event) =>
      String(event.id).startsWith('live-') &&
      typeof event.rrule === 'object' &&
      event.rrule.until == null &&
      event.extractedFromId == null,
  );
  if (candidates.length === 0) {
    return null;
  }
  const series = context.random.pick(candidates);
  const isMovedOccurrence = (event) =>
    event.extractedFromId === series.id && event.rrule == null;
  return {
    events: events.filter(
      (event) => event.id !== series.id && !isMovedOccurrence(event),
    ),
    description: `Deleted the weekly "${series.title}"`,
  };
};

const createEvent = (events, context) => {
  const { team, day } = pickTeamDay(context);
  const event = createTeamMeeting(team, day, context.createId(), context.random);
  return {
    events: [...events, event],
    description: `Created "${event.title}" for ${team.title} on ${formatDay(day)}`,
  };
};

function renameEvent(events, context) {
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

const deleteEvent = (events, context) => {
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

// The events created balance the ones deleted, and the restored occurrences balance the
// cancelled and moved ones, so the calendar keeps roughly its size.
// The splits add series, but they don't add occurrences.
const LIVE_UPDATERS = [
  [cancelOccurrence, 3],
  [restoreOccurrence, 3],
  [moveOccurrence, 3],
  [splitSeries, 1],
  [createSeries, 1],
  [deleteSeries, 1],
  [createEvent, 2],
  [renameEvent, 2],
  [deleteEvent, 4],
];

const UPDATERS = LIVE_UPDATERS.map(([updater]) => updater);
const WEIGHTS = LIVE_UPDATERS.map(([, weight]) => weight);

/**
 * Returns a function that applies a random change to the events between `firstDay` and `lastDay`.
 * A seed always gives the same sequence of changes.
 */
export function createLiveUpdates(teams, seed) {
  const random = createRandom(seed);
  let idCounter = 0;
  const createId = () => {
    idCounter += 1;
    return `live-${idCounter}`;
  };

  return (events, firstDay, lastDay) => {
    const context = { random, teams, firstDay, lastDay, createId };
    // Renaming always works, when no event matches the update.
    return (
      random.weighted(UPDATERS, WEIGHTS)(events, context) ??
      renameEvent(events, context)
    );
  };
}
