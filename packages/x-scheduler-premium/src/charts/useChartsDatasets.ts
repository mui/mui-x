'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { Dataset } from '@mui/x-internals/types';
import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDay,
} from '@mui/x-scheduler-internals/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { useEventOccurrencesGroupedByDay } from '@mui/x-scheduler-internals/use-event-occurrences-grouped-by-day';
import {
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  getEndOfDayMs,
  getEventResourceIds,
  toLocalMs,
} from '@mui/x-scheduler-internals/internals';
import { eventColorTokens } from '@mui/x-scheduler/internals';
import type { ChartsMetric } from './chartsFeature';

const EMPTY_DAYS: SchedulerProcessedDay[] = [];
export const NO_RESOURCE = '__no-resource__';
const MS_PER_HOUR = 3_600_000;

/**
 * The resource an occurrence is attributed to: its first visible resource, or `NO_RESOURCE`.
 */
function occurrenceResourceId(
  occurrence: SchedulerEventOccurrence,
  visibleResourceIds: Set<string>,
): string {
  const ids = getEventResourceIds(occurrence.resource);
  if (ids.length === 0) {
    return NO_RESOURCE;
  }
  return ids.find((id) => visibleResourceIds.has(id)) ?? ids[0];
}

/**
 * Whether an occurrence has any duration inside `[dayStart, dayEnd)`.
 * An occurrence ending exactly at midnight is listed on the next day too.
 */
function isInDay(occurrence: SchedulerEventOccurrence, dayStart: number, dayEnd: number): boolean {
  return (
    occurrence.allDay ||
    (occurrence.displayTimezone.end.timestamp > dayStart &&
      occurrence.displayTimezone.start.timestamp < dayEnd)
  );
}

/**
 * Hours of an occurrence that fall inside `[dayStart, dayEnd)`.
 */
function hoursInDay(
  occurrence: SchedulerEventOccurrence,
  dayStart: number,
  dayEnd: number,
): number {
  if (occurrence.allDay) {
    return 0;
  }
  const start = Math.max(occurrence.displayTimezone.start.timestamp, dayStart);
  const end = Math.min(occurrence.displayTimezone.end.timestamp, dayEnd);
  return Math.max(0, end - start) / MS_PER_HOUR;
}

export interface ChartsResourceInfo {
  id: string;
  label: string;
  color: string;
}

/**
 * Aggregates the occurrences of the visible days into chart datasets.
 */
export function useChartsDatasets(metric: ChartsMetric) {
  const store = useEventCalendarStoreContext();
  const days = useStore(
    store,
    (state) => state.viewDefinition?.visibleDaysSelector(state) ?? EMPTY_DAYS,
  );
  const occurrencesByDay = useEventOccurrencesGroupedByDay({ days });
  const resourceList = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const defaultColor = useStore(store, (state) => state.eventColor);
  const parentLookup = useStore(store, schedulerResourceSelectors.resourceParentIdLookup);

  return React.useMemo(() => {
    const resources: ChartsResourceInfo[] = resourceList
      .filter((resource) => visibleResources[resource.id] !== false)
      .map((resource) => {
        const colorName = schedulerResourceSelectors.defaultEventColor(store.state, resource.id);
        return {
          id: String(resource.id),
          label: resource.title,
          color: eventColorTokens[colorName as keyof typeof eventColorTokens]?.light.main ?? '#888',
        };
      });
    const resourceIds = new Set(resources.map((resource) => resource.id));
    const hasNoResource = days.some((day) =>
      (occurrencesByDay.get(day.key) ?? []).some(
        (occurrence) => occurrenceResourceId(occurrence, resourceIds) === NO_RESOURCE,
      ),
    );

    // exclusive end of each day in the display timezone (DST days are not 24 h long)
    const dayEnds = days.map((day) => getEndOfDayMs(day.timestamp, displayTimezone) + 1);

    // hours per day, per resource
    const hoursByDayAndResource = days.map((day, dayIndex) => {
      const perResource: Record<string, number> = {};
      for (const occurrence of occurrencesByDay.get(day.key) ?? []) {
        const resourceId = occurrenceResourceId(occurrence, resourceIds);
        if (
          (resourceId !== NO_RESOURCE && !resourceIds.has(resourceId)) ||
          !isInDay(occurrence, day.timestamp, dayEnds[dayIndex])
        ) {
          continue;
        }
        perResource[resourceId] =
          (perResource[resourceId] ?? 0) +
          (metric === 'count' ? 1 : hoursInDay(occurrence, day.timestamp, dayEnds[dayIndex]));
      }
      return perResource;
    });
    const series = hasNoResource
      ? [
          ...resources,
          {
            id: NO_RESOURCE,
            label: 'No resource',
            color:
              eventColorTokens[defaultColor as keyof typeof eventColorTokens]?.light.main ?? '#888',
          },
        ]
      : resources;

    // day keys are unique across months (the band scale drops duplicate categories),
    // the day of month is shown through the axis formatter
    const dayLabelLookup = new Map(days.map((day) => [day.key, String(day.plainDate.day)]));
    const hoursPerDay: { dimensions: Dataset<string>; values: Dataset<number> } = {
      dimensions: [{ id: 'day', label: '', data: days.map((day) => day.key) }],
      values: series.map((resource) => ({
        id: resource.id,
        label: resource.label,
        data: hoursByDayAndResource.map((perResource) => round(perResource[resource.id] ?? 0)),
      })),
    };

    // share by resource (in count mode, a multi-day occurrence counts once)
    const seenKeys = new Set<string>();
    const totalsByResource: Record<string, number> = {};
    days.forEach((day, dayIndex) => {
      for (const occurrence of occurrencesByDay.get(day.key) ?? []) {
        const resourceId = occurrenceResourceId(occurrence, resourceIds);
        if (
          (resourceId !== NO_RESOURCE && !resourceIds.has(resourceId)) ||
          !isInDay(occurrence, day.timestamp, dayEnds[dayIndex])
        ) {
          continue;
        }
        if (metric === 'count') {
          if (seenKeys.has(occurrence.key)) {
            continue;
          }
          seenKeys.add(occurrence.key);
          totalsByResource[resourceId] = (totalsByResource[resourceId] ?? 0) + 1;
        } else {
          totalsByResource[resourceId] =
            (totalsByResource[resourceId] ?? 0) +
            hoursInDay(occurrence, day.timestamp, dayEnds[dayIndex]);
        }
      }
    });
    const totals = series.map((resource) => round(totalsByResource[resource.id] ?? 0));
    const shareByResource: { dimensions: Dataset<string>; values: Dataset<number> } = {
      dimensions: [
        { id: 'resource', label: 'Resource', data: series.map((resource) => resource.label) },
      ],
      values: [{ id: 'hours', label: 'Hours', data: totals }],
    };

    // nested resources: hours of each root = own hours + hours of all its descendants
    const rootOf = (resourceId: string): string => {
      let current = resourceId;
      let parent = parentLookup.get(current);
      while (parent != null) {
        current = String(parent);
        parent = parentLookup.get(current);
      }
      return current;
    };
    const rootTotals = new Map<string, number>();
    series.forEach((resource, index) => {
      const root = resource.id === NO_RESOURCE ? NO_RESOURCE : rootOf(resource.id);
      rootTotals.set(root, (rootTotals.get(root) ?? 0) + totals[index]);
    });
    const roots = series
      .filter((resource) => resource.id === NO_RESOURCE || rootOf(resource.id) === resource.id)
      .map((resource) => ({ ...resource, value: round(rootTotals.get(resource.id) ?? 0) }));
    const hasNestedResources = series.some(
      (resource) => resource.id !== NO_RESOURCE && rootOf(resource.id) !== resource.id,
    );

    // busy hours: events per weekday x hour of day
    const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = new Map<string, number>();
    let minHour = 24;
    let maxHour = 0;
    days.forEach((day, dayIndex) => {
      // weekday and hours in the display timezone, 0 = Monday
      const weekday = day.plainDate.dayOfWeek - 1;
      const localDayStart = toLocalMs(day.timestamp, displayTimezone);
      const hourOf = (timestamp: number) =>
        (toLocalMs(timestamp, displayTimezone) - localDayStart) / MS_PER_HOUR;
      for (const occurrence of occurrencesByDay.get(day.key) ?? []) {
        if (occurrence.allDay) {
          continue;
        }
        const startHour = hourOf(
          Math.max(occurrence.displayTimezone.start.timestamp, day.timestamp),
        );
        const endHour = hourOf(
          Math.min(occurrence.displayTimezone.end.timestamp, dayEnds[dayIndex]),
        );
        for (let hour = Math.floor(startHour); hour < Math.min(24, Math.ceil(endHour)); hour += 1) {
          minHour = Math.min(minHour, hour);
          maxHour = Math.max(maxHour, hour);
          const key = `${weekday}-${hour}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
    });
    if (minHour > maxHour) {
      minHour = 8;
      maxHour = 18;
    }
    const hours = Array.from({ length: maxHour - minHour + 1 }, (_, index) => minHour + index);
    const busyHours = {
      xLabels: weekdayLabels,
      yLabels: hours.map((hour) => `${hour}h`),
      data: weekdayLabels.flatMap((_, weekday) =>
        hours.map((hour, hourIndex): [number, number, number] => [
          weekday,
          hourIndex,
          counts.get(`${weekday}-${hour}`) ?? 0,
        ]),
      ),
      max: Math.max(1, ...counts.values()),
    };

    return {
      days,
      dayEnds,
      dayLabelLookup,
      resources: series,
      hoursPerDay,
      shareByResource,
      roots,
      hasNestedResources,
      busyHours,
    };
  }, [
    days,
    displayTimezone,
    occurrencesByDay,
    resourceList,
    visibleResources,
    defaultColor,
    parentLookup,
    store,
    metric,
  ]);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
