'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import {
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { useEventOccurrencesGroupedByResource } from '@mui/x-scheduler-headless/use-event-occurrences-grouped-by-resource';
import { useAdapter, Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { TemporalSupportedObject, TimelineView } from '@mui/x-scheduler-headless/models';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearHeader } from './view-header';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineEventRow from './timeline-event-row/TimelineEventRow';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';
import { EventPopoverProvider } from '../../internals/components/event-popover';
import {
  DAYS_UNIT_COUNT,
  MONTHS_UNIT_COUNT,
  TIME_UNIT_COUNT,
  WEEKS_UNIT_COUNT,
  YEARS_UNIT_COUNT,
} from '../constants';

const getViewConfig = (adapter: Adapter, view: TimelineView, start: TemporalSupportedObject) => {
  switch (view) {
    case 'time': {
      return {
        end: adapter.addDays(start, TIME_UNIT_COUNT),
        unitCount: TIME_UNIT_COUNT,
        header: <TimeHeader />,
      };
    }

    case 'days': {
      return {
        end: adapter.addDays(start, DAYS_UNIT_COUNT),
        unitCount: DAYS_UNIT_COUNT,
        header: <DaysHeader />,
      };
    }

    case 'weeks': {
      return {
        end: adapter.addWeeks(start, WEEKS_UNIT_COUNT),
        unitCount: WEEKS_UNIT_COUNT,
        header: <WeeksHeader />,
      };
    }

    case 'months': {
      return {
        end: adapter.addMonths(start, MONTHS_UNIT_COUNT),
        unitCount: MONTHS_UNIT_COUNT,
        header: <MonthsHeader />,
      };
    }

    case 'years': {
      return {
        end: adapter.addYears(start, YEARS_UNIT_COUNT),
        unitCount: YEARS_UNIT_COUNT,
        header: <YearHeader />,
      };
    }

    default: {
      return {
        end: start,
        unitCount: 0,
        header: null,
      };
    }
  }
};

const getStartDate = (adapter: Adapter, view: TimelineView, start: TemporalSupportedObject) => {
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
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const view = useStore(store, timelineViewSelectors.view);

  const start = React.useMemo(
    () => getStartDate(adapter, view, visibleDate),
    [adapter, view, visibleDate],
  );

  const { end, unitCount, header } = React.useMemo(
    () => getViewConfig(adapter, view, start),
    [adapter, view, start],
  );

  const resourcesWithOccurrences = useEventOccurrencesGroupedByResource({
    start,
    end,
  });

  return (
    <section className="TimelineViewContent" ref={handleRef} {...other}>
      <EventPopoverProvider containerRef={containerRef}>
        <TimelinePrimitive.Root
          items={resourcesWithOccurrences}
          className="TimelineRoot"
          style={
            {
              '--unit-count': unitCount,
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
                  resourceId={resource.id}
                />
              )}
            </TimelinePrimitive.SubGrid>
          </div>
        </TimelinePrimitive.Root>
      </EventPopoverProvider>
    </section>
  );
});
