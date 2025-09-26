'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '../../../primitives/timeline';
import { selectors } from '../../../primitives/use-timeline';
import { useTimelineStoreContext } from '../../../primitives/utils/useTimelineStoreContext';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearHeader } from './view-header';
import { useEventOccurrencesGroupedByResource } from '../../../primitives/use-event-occurrences-grouped-by-resource';
import { useAdapter } from '../../../primitives/utils/adapter/useAdapter';
import { Adapter } from '../../../primitives/utils/adapter/types';
import { diffIn } from '../../../primitives/utils/date-utils';
import { SchedulerValidDate, TimelineView } from '../../../primitives';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineEventRow from './timeline-event-row/TimelineEventRow';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';

const getEndBoundaries = (adapter: Adapter, view: TimelineView, start: SchedulerValidDate) => {
  const endBoundaries = {
    time: adapter.addHours(start, 72),
    days: adapter.addDays(start, 21),
    weeks: adapter.addWeeks(start, 8),
    months: adapter.addMonths(start, 12),
    years: adapter.addYears(start, 4),
  };

  return endBoundaries[view];
};
const getStartDate = (adapter: Adapter, view: TimelineView, start: SchedulerValidDate) => {
  if (view === 'weeks') {
    return adapter.startOfWeek(start);
  }
  return start;
};

type UnitType = 'hours' | 'days' | 'weeks' | 'months' | 'years';

const UNIT: Record<TimelineView, UnitType> = {
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
  const { className, ...other } = props;

  const adapter = useAdapter();
  const store = useTimelineStoreContext();
  const resources = useStore(store, selectors.resources);
  const visibleDate = useStore(store, selectors.visibleDate);
  const view = useStore(store, selectors.view);

  const start = React.useMemo(
    () => getStartDate(adapter, view, visibleDate),
    [adapter, view, visibleDate],
  );
  const end = React.useMemo(() => getEndBoundaries(adapter, view, start), [adapter, view, start]);

  const resourcesWithOccurrences = useEventOccurrencesGroupedByResource({
    start,
    end,
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
    <section className="TimelineViewContent" ref={forwardedRef} {...other}>
      <TimelinePrimitive.Root
        items={resourcesWithOccurrences}
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
            {({ resource }) => <TimelineTitleCell key={resource.id} resource={resource} />}
          </TimelinePrimitive.SubGrid>
        </div>
        <div className="EventSubGridContainer">
          <TimelinePrimitive.Row className="HeaderRow">
            <TimelinePrimitive.Cell className={clsx('TimelineCell', 'HeaderCell')}>
              {header}
            </TimelinePrimitive.Cell>
          </TimelinePrimitive.Row>
          <TimelinePrimitive.SubGrid className="EventSubGrid">
            {({ resource, occurrences }) => (
              <TimelineEventRow
                key={resource.id}
                start={start}
                end={end}
                occurrences={occurrences}
              />
            )}
          </TimelinePrimitive.SubGrid>
        </div>
      </TimelinePrimitive.Root>
    </div>
  );
});
