'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { getColorClassName } from '../../internals/utils/color-utils';
import { DEFAULT_EVENT_COLOR } from '../../../primitives/utils/SchedulerStore';
import { Timeline as TimelinePrimitive } from '../../../primitives/timeline';
import { TimelineEvent } from './timeline-event';
import { selectors } from '../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../primitives/utils/useTimelineStoreContext';
import { useEventOccurrencesWithTimelinePositionForMap } from '../../../primitives/use-event-occurrences-with-timeline-position';
import {
  DaysHeader,
  MonthsHeader,
  TimeHeader,
  WeeksHeader,
  YearHeader,
} from './header-toolbar/view-header';
import { useEventOccurrencesGroupedByResource } from '../../../primitives/use-event-occurrences-grouped-by-resource';
import { getAdapter } from '../../../primitives/utils/adapter/getAdapter';
import { diffIn } from '../../..//primitives/utils/date-utils';
import { SchedulerValidDate } from '../../../primitives';
import { TimelineContentProps } from './TimelineContent.types';
import { TimelineView } from '../Timeline.types';

const adapter = getAdapter();

const getEndBoundaries = (view: TimelineView, start: SchedulerValidDate) => {
  const endBoundaries = {
    time: adapter.addHours(start, 72),
    days: adapter.addDays(start, 21),
    weeks: adapter.addWeeks(start, 8),
    months: adapter.addMonths(start, 12),
    years: adapter.addYears(start, 4),
  };

  return endBoundaries[view];
};

type UnitType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

const UNIT: { [key: string]: UnitType } = {
  time: 'hours',
  days: 'days',
  weeks: 'weeks',
  months: 'months',
  years: 'years',
};

export const TimelineContent = React.forwardRef(function TimelineContent(
  props: TimelineContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { view = 'days', className, ...other } = props;
  const store = useTimelineStoreContext();
  const resources = useStore(store, selectors.resources);
  const visibleDate = useStore(store, selectors.visibleDate);

  const start = visibleDate;
  const end = React.useMemo(() => getEndBoundaries(view, start), [view, start]);

  const occurrencesMap = useEventOccurrencesGroupedByResource({
    start,
    end,
  });
  const resourcesWithOccurrences = useEventOccurrencesWithTimelinePositionForMap({
    occurrences: occurrencesMap,
    maxColumnSpan: Infinity,
  });

  const diff = diffIn(adapter, end, start, UNIT[view]);

  const header = React.useMemo(() => {
    switch (view) {
      case 'days':
        return <DaysHeader />;
      case 'time':
        return <TimeHeader />;
      case 'weeks':
        return <WeeksHeader />;
      case 'months':
        return <MonthsHeader />;
      case 'years':
        return <YearHeader />;
      default:
        return null;
    }
  }, [view]);
  return (
    <div className="TimelineViewContent" ref={forwardedRef} {...other}>
      <TimelinePrimitive.Root
        items={resources}
        className="TimelineRoot"
        style={
          {
            '--unit-count': diff,
            '--unit-width': `var(--${view}-cell-width)`,
            '--row-count': resources.length,
          } as React.CSSProperties
        }
      >
        <div className="TitleSubGridContainer">
          <TimelinePrimitive.Row className="HeaderTitleRow">
            <TimelinePrimitive.Cell className={clsx('TimelineCell', 'HeaderTitleCell')}>
              Resource title
            </TimelinePrimitive.Cell>
          </TimelinePrimitive.Row>
          <TimelinePrimitive.SubGrid className="TitleSubGrid">
            {(resource) => (
              <TimelinePrimitive.Row key={resource.name} className="TimelineRow">
                <TimelinePrimitive.Cell className={clsx('TimelineCell', 'TimelineTitleCell')}>
                  <span
                    className={clsx(
                      'ResourceLegendColor',
                      getColorClassName(resource.eventColor ?? DEFAULT_EVENT_COLOR),
                    )}
                  />

                  {resource.name}
                </TimelinePrimitive.Cell>
              </TimelinePrimitive.Row>
            )}
          </TimelinePrimitive.SubGrid>
        </div>
        <div className="EventSubGridContainer">
          <TimelinePrimitive.Row className="HeaderRow">
            <TimelinePrimitive.Cell className={clsx('TimelineCell', 'HeaderCell')}>
              {header}
            </TimelinePrimitive.Cell>
          </TimelinePrimitive.Row>
          <TimelinePrimitive.SubGrid className="EventSubGrid">
            {(resource) => (
              <TimelinePrimitive.EventRow
                key={resource.id}
                className="TimelineEventRow"
                start={start}
                end={getEndBoundaries(view, start)}
                style={{} as React.CSSProperties}
              >
                {resourcesWithOccurrences.get(resource.id)?.map((occurrence) => (
                  <TimelineEvent
                    key={occurrence.key}
                    occurrence={occurrence}
                    ariaLabelledBy=""
                    variant="regular"
                  />
                ))}
              </TimelinePrimitive.EventRow>
            )}
          </TimelinePrimitive.SubGrid>
        </div>
      </TimelinePrimitive.Root>
    </div>
  );
});
