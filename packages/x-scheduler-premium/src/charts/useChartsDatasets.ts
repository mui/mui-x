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
import { getEndOfDayMs, getEventResourceIds } from '@mui/x-scheduler-internals/internals';
import { eventColorTokens } from '@mui/x-scheduler/internals';
import type { ChartsMetric } from './chartsFeature';

const EMPTY_DAYS: SchedulerProcessedDay[] = [];
export const NO_RESOURCE = '__no-resource__';
const MS_PER_HOUR = 3_600_000;

/**
 * The CSS variable holding the chart color of an event palette, defined on the charts panel
 * for the light and the dark mode.
 */
export function chartColorVar(colorName: string) {
  return colorName in eventColorTokens ? `var(--scheduler-charts-${colorName})` : '#888';
}

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
    const allResources: ChartsResourceInfo[] = resourceList.map((resource) => ({
      id: String(resource.id),
      label: resource.title,
      color: chartColorVar(schedulerResourceSelectors.defaultEventColor(store.state, resource.id)),
    }));
    const resources = allResources.filter((resource) => visibleResources[resource.id] !== false);
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
            color: chartColorVar(defaultColor),
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
    // nested resources: the renderer draws one ring per dimension (root inside, resource outside)
    // and groups the rows by root, so the rows are sorted by root to keep the item order predictable
    const rootOf = (resourceId: string): string => {
      let current = resourceId;
      let parent = parentLookup.get(current);
      while (parent != null) {
        current = String(parent);
        parent = parentLookup.get(current);
      }
      return current;
    };
    const rootIdOf = (resource: ChartsResourceInfo) =>
      resource.id === NO_RESOURCE ? NO_RESOURCE : rootOf(resource.id);
    const hasNestedResources = series.some((resource) => rootIdOf(resource) !== resource.id);
    const rootOrder = new Map<string, number>();
    series.forEach((resource) => {
      const rootId = rootIdOf(resource);
      if (!rootOrder.has(rootId)) {
        rootOrder.set(rootId, rootOrder.size);
      }
    });
    const shareItems = hasNestedResources
      ? [...series].sort((a, b) => rootOrder.get(rootIdOf(a))! - rootOrder.get(rootIdOf(b))!)
      : series;
    const totals = shareItems.map((resource) => round(totalsByResource[resource.id] ?? 0));
    const resourceDimension = {
      id: 'resource',
      label: 'Resource',
      data: shareItems.map((resource) => resource.id),
    };
    const shareByResource: { dimensions: Dataset<string>; values: Dataset<number> } = {
      dimensions: hasNestedResources
        ? [{ id: 'root', label: 'Root', data: shareItems.map(rootIdOf) }, resourceDimension]
        : [resourceDimension],
      values: [{ id: 'hours', label: 'Hours', data: totals }],
    };
    // a hidden root still gets an inner slice when some of its descendants are visible
    const roots = Array.from(rootOrder.keys()).map(
      (rootId) =>
        series.find((resource) => resource.id === rootId) ??
        allResources.find((resource) => resource.id === rootId) ?? {
          id: rootId,
          label: rootId,
          color: '#888',
        },
    );

    return {
      days,
      dayEnds,
      dayLabelLookup,
      resources: series,
      hoursPerDay,
      shareByResource,
      shareItems,
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
    store,
    metric,
  ]);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
