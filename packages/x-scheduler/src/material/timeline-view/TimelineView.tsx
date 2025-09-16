'use client';

import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { TimelineView as TimelineViewType, TimelineViewProps } from './TimelineView.types';
import { Timeline } from '../../primitives/timeline';
import { DEFAULT_EVENT_COLOR, selectors } from '../../primitives/use-event-calendar';
import './TimelineView.css';
import { useEventCalendarStoreContext } from '../../primitives/utils/useEventCalendarStoreContext';
import { useEventOccurrencesGroupedByResource } from '../../primitives/use-event-occurrences-grouped-by-resource';
import { useEventOccurrencesWithTimelinePositionForMap } from '../../primitives/use-event-occurrences-with-timeline-position';
import { getColorClassName } from '../internals/utils/color-utils';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { diffIn } from '../../primitives/utils/date-utils';
import {
  DaysHeader,
  MonthsHeader,
  TimeHeader,
  WeeksHeader,
  YearHeader,
} from './header-toolbar/view-header';
import { TimelineEvent } from './timeline-event';
import { ViewSwitcher } from '../internals/components/header-toolbar/view-switcher';
import { EventPopoverProvider, EventPopoverTrigger } from '../internals/components/event-popover';

const adapter = getAdapter();

const getEndBoundaries = (view, start) => {
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

export const TimelineView = React.forwardRef(function TimelineView(
  props: TimelineViewProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const store = useEventCalendarStoreContext();
  const resources = useStore(store, selectors.resources);
  const visibleDate = useStore(store, selectors.visibleDate);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // TODO replace with a view state from the store
  const [view, setView] = React.useState<TimelineViewType>('days');
  const views: TimelineViewType[] = ['time', 'days', 'weeks', 'months', 'years'];

  const handleViewChange = (newView: TimelineViewType, _e: React.MouseEvent<HTMLElement>) => {
    setView(newView);
  };

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
    <div
      ref={handleRef}
      className={clsx('TimelineViewContainer', 'mui-x-scheduler', className)}
      {...other}
    >
      <div className="TimelineHeaderToolbar">
        <ViewSwitcher views={views} currentView={view} onViewChange={handleViewChange} />
      </div>
      <EventPopoverProvider containerRef={containerRef}>
        <div className="TimelineViewContent">
          <Timeline.Root
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
              <Timeline.Row className="HeaderTitleRow">
                <Timeline.Cell className={clsx('TimelineCell', 'HeaderTitleCell')}>
                  Resource title
                </Timeline.Cell>
              </Timeline.Row>
              <Timeline.SubGrid className="TitleSubGrid">
                {(resource) => (
                  <Timeline.Row key={resource.name} className="TimelineRow">
                    <Timeline.Cell className={clsx('TimelineCell', 'TimelineTitleCell')}>
                      <span
                        className={clsx(
                          'ResourceLegendColor',
                          getColorClassName(resource.eventColor ?? DEFAULT_EVENT_COLOR),
                        )}
                      />

                      {resource.name}
                    </Timeline.Cell>
                  </Timeline.Row>
                )}
              </Timeline.SubGrid>
            </div>
            <div className="EventSubGridContainer">
              <Timeline.Row className="HeaderRow">
                <Timeline.Cell className={clsx('TimelineCell', 'HeaderCell')}>
                  {header}
                </Timeline.Cell>
              </Timeline.Row>
              <Timeline.SubGrid className="EventSubGrid">
                {(resource) => (
                  <Timeline.EventRow
                    key={resource.id}
                    className="TimelineEventRow"
                    start={start}
                    end={getEndBoundaries(view, start)}
                    style={{} as React.CSSProperties}
                  >
                    {resourcesWithOccurrences.get(resource.id)?.map((occurrence, index) => (
                      <EventPopoverTrigger
                        key={occurrence.id}
                        occurrence={occurrence}
                        render={
                          <TimelineEvent event={occurrence} ariaLabelledBy="" variant="regular" />
                        }
                      />
                    ))}
                  </Timeline.EventRow>
                )}
              </Timeline.SubGrid>
            </div>
          </Timeline.Root>
        </div>
      </EventPopoverProvider>
    </div>
  );
});
