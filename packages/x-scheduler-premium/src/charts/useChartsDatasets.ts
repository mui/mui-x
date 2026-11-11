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
  schedulerOccurrenceSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-internals/event-calendar-selectors';
import { getEndOfDayMs, getPlainDateWeekStart } from '@mui/x-scheduler-internals/internals';
import { eventColorTokens } from '@mui/x-scheduler/internals';
import type { EventCalendarPremiumChartsMetric } from '../event-calendar-premium/charts/EventCalendarPremiumChartsContext';

const EMPTY_DAYS: SchedulerProcessedDay[] = [];
export const NO_RESOURCE = '__no-resource__';
const MS_PER_HOUR = 3_600_000;

/**
 * The CSS variable holding the chart color of an event palette, defined on the charts panel
 * for the light and the dark mode.
 */
function chartColorVar(colorName: string) {
  return Object.prototype.hasOwnProperty.call(eventColorTokens, colorName)
    ? `var(--scheduler-charts-${colorName})`
    : '#888';
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
 * A column of the "by day" card: one day, or one week in the month view.
 */
export interface ChartsPeriod {
  key: string;
  /**
   * The day of month of the first day.
   */
  label: string;
  /**
   * Half-open range `[start, end)` of the period, as timestamps.
   */
  start: number;
  end: number;
}

/**
 * Aggregates the occurrences of the visible days into chart datasets.
 */
export function useChartsDatasets(metric: EventCalendarPremiumChartsMetric) {
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
  const weekStartsOn = useStore(store, eventCalendarPreferenceSelectors.weekStartsOn);
  // the month grid has too many days for one column each, so it gets one column per week
  const isByWeek = useStore(store, eventCalendarViewSelectors.view) === 'month';

  return React.useMemo(() => {
    // the flat list is in tree order (parents before their children), which the rings rely on
    const resources: ChartsResourceInfo[] = resourceList
      .filter((resource) => visibleResources[resource.id] !== false)
      .map((resource) => ({
        id: String(resource.id),
        label: resource.title,
        color: chartColorVar(
          schedulerResourceSelectors.defaultEventColor(store.state, resource.id),
        ),
      }));

    // the periods of the "by day" card, with the exclusive end of each one in the display
    // timezone (DST days are not 24 h long)
    const periods: ChartsPeriod[] = [];
    const periodIndexOfDay: number[] = [];
    days.forEach((day) => {
      const key = isByWeek
        ? getPlainDateWeekStart(day.plainDate, weekStartsOn).toString()
        : day.key;
      const end = getEndOfDayMs(day.timestamp, displayTimezone) + 1;
      const last = periods[periods.length - 1];
      if (last?.key === key) {
        last.end = end;
      } else {
        periods.push({ key, label: String(day.plainDate.day), start: day.timestamp, end });
      }
      periodIndexOfDay.push(periods.length - 1);
    });

    // per period and per resource, and per resource over the visible days
    // (in count mode, a multi-day occurrence counts once in the share)
    const amountsByPeriod: Record<string, number>[] = periods.map(() => ({}));
    const totals: Record<string, number> = {};
    const countedKeys = new Set<string>();
    let hasNoResource = false;
    days.forEach((day, dayIndex) => {
      const dayEnd = getEndOfDayMs(day.timestamp, displayTimezone) + 1;
      const amounts = amountsByPeriod[periodIndexOfDay[dayIndex]];
      for (const occurrence of occurrencesByDay.get(day.key) ?? []) {
        if (!isInDay(occurrence, day.timestamp, dayEnd)) {
          continue;
        }
        const resourceId =
          schedulerOccurrenceSelectors.attributedResourceId(store.state, occurrence) ?? NO_RESOURCE;
        hasNoResource ||= resourceId === NO_RESOURCE;
        const amount = metric === 'count' ? 1 : hoursInDay(occurrence, day.timestamp, dayEnd);
        amounts[resourceId] = (amounts[resourceId] ?? 0) + amount;
        if (metric === 'count') {
          if (countedKeys.has(occurrence.key)) {
            continue;
          }
          countedKeys.add(occurrence.key);
        }
        totals[resourceId] = (totals[resourceId] ?? 0) + amount;
      }
    });

    const series = hasNoResource
      ? [
          ...resources,
          { id: NO_RESOURCE, label: 'No resource', color: chartColorVar(defaultColor) },
        ]
      : resources;

    // the period keys are unique across months (the band scale drops duplicate categories),
    // the day of month is shown through the axis formatter
    const byDay: { dimensions: Dataset<string>; values: Dataset<number> } = {
      dimensions: [{ id: 'period', label: '', data: periods.map((period) => period.key) }],
      values: series.map((resource) => ({
        id: resource.id,
        label: resource.label,
        color: resource.color,
        data: amountsByPeriod.map((amounts) => round(amounts[resource.id] ?? 0)),
      })),
    };

    // nested resources: the renderer draws one ring per dimension (root inside, resource outside)
    const rootById = new Map<string, string>();
    resourceList.forEach((resource) => {
      const id = String(resource.id);
      const parentId = parentLookup.get(id);
      rootById.set(id, parentId == null ? id : (rootById.get(String(parentId)) ?? id));
    });
    const rootIdOf = (resource: ChartsResourceInfo) => rootById.get(resource.id) ?? resource.id;
    const hasNestedResources = series.some((resource) => rootIdOf(resource) !== resource.id);
    // a hidden root hides its descendants too, so every root of the series is in the series
    const roots = series.filter((resource) => rootIdOf(resource) === resource.id);
    const resourceDimension = {
      id: 'resource',
      label: 'Resource',
      data: series.map((resource) => resource.id),
    };
    const byResource: { dimensions: Dataset<string>; values: Dataset<number> } = {
      dimensions: hasNestedResources
        ? [{ id: 'root', label: 'Root', data: series.map(rootIdOf) }, resourceDimension]
        : [resourceDimension],
      values: [
        {
          id: 'total',
          label: 'Total',
          data: series.map((resource) => round(totals[resource.id] ?? 0)),
        },
      ],
    };

    return {
      periods,
      isByWeek,
      resources: series,
      byDay,
      byResource,
      roots,
      hasNestedResources,
    };
  }, [
    days,
    displayTimezone,
    occurrencesByDay,
    resourceList,
    visibleResources,
    defaultColor,
    parentLookup,
    weekStartsOn,
    isByWeek,
    store,
    metric,
  ]);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
