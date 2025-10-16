'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { useEventOccurrencesGroupedByResource } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-resource';
import { useAdapter, diffIn, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerValidDate, TimelineView } from '@mui/x-scheduler-headless/models';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearHeader } from './view-header';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineEventRow from './timeline-event-row/TimelineEventRow';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';
import { EventPopoverProvider } from '../../internals/components/event-popover';
import {
  DAYS_UNIT_COUNT,
  MONTHS_UNIT_COUNT,
  TIME_UNITS_COUNT,
  UNIT,
  WEEKS_UNIT_COUNT,
  YEARS_UNIT_COUNT,
} from '../constants';

const getEndBoundaries = (adapter: Adapter, view: TimelineView, start: SchedulerValidDate) => {
  const endBoundaries = {
    time: adapter.addHours(start, 24 * TIME_UNITS_COUNT),
    days: adapter.addDays(start, DAYS_UNIT_COUNT),
    weeks: adapter.addWeeks(start, WEEKS_UNIT_COUNT),
    months: adapter.addMonths(start, MONTHS_UNIT_COUNT),
    years: adapter.addYears(start, YEARS_UNIT_COUNT),
  };

  return endBoundaries[view];
};
const getStartDate = (adapter: Adapter, view: TimelineView, start: SchedulerValidDate) => {
  if (view === 'weeks') {
    return adapter.startOfWeek(start);
  }
  return start;
};

export const TimelineContent = React.forwardRef(function TimelineContent(
  props: TimelineContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

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
    <section className="TimelineViewContent" ref={handleRef} {...other}>
      <EventPopoverProvider containerRef={containerRef}>
        <TimelinePrimitive.Root
          items={resourcesWithOccurrences}
          className="TimelineRoot"
          style={
            {
              '--unit-count': diff,
              '--unit-width': `var(--${view}-cell-width)`,
              '--row-count': resources.length - 1,
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
      </EventPopoverProvider>
    </section>
  );
});
