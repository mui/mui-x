import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { HeaderToolbar } from './header-toolbar';
import { TimelineView as TimelineViewType, TimelineViewProps } from './TimelineView.types';
import { Timeline } from '../../primitives/timeline';
import { DEFAULT_EVENT_COLOR, selectors } from '../../primitives/use-event-calendar';
import './TimelineView.css';
import { useEventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { getColorClassName } from '../internals/utils/color-utils';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { diffIn } from '../../primitives/utils/date-utils';
import { DaysHeader, TimeHeader, WeeksHeader } from './header-toolbar/view-header';
import { TimelineEvent } from './timeline-event';

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

export function TimelineView(props: TimelineViewProps) {
  const { className, ...other } = props;
  const { store } = useEventCalendarContext();
  const resources = useStore(store, selectors.resources);
  const visibleDate = useStore(store, selectors.visibleDate);

  // TODO replace with a view state from the store
  const [view, setView] = React.useState<TimelineViewType>('days');
  const views: TimelineViewType[] = ['time', 'days', 'weeks', 'months', 'years'];

  const handleViewChange = (view: TimelineViewType, _e: React.MouseEvent<HTMLElement>) => {
    setView(view);
  };

  const start = adapter.startOfDay(visibleDate);
  const end = React.useMemo(() => getEndBoundaries(view, start), [view, start]);

  const eventsGroupedByResource = useStore(store, selectors.eventsToRenderGroupedByResource, {
    start,
    end,
  });

  const diff = diffIn(adapter, end, start, UNIT[view]);

  const header = React.useMemo(() => {
    switch (view) {
      case 'days':
        return <DaysHeader start={start} end={end} />;
      case 'time':
        return <TimeHeader start={start} end={end} />;
      case 'weeks':
        return <WeeksHeader start={start} end={end} />;
      default:
        return null;
    }
  }, [view, start, end]);

  return (
    <div className={clsx('TimelineViewContainer', 'mui-x-scheduler', className)} {...other}>
      <HeaderToolbar views={views} currentView={view} onViewChange={handleViewChange} />

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
              <Timeline.Cell className={clsx('TimelineCell', 'HeaderCell')}>{header}</Timeline.Cell>
            </Timeline.Row>
            <Timeline.SubGrid className="EventSubGrid">
              {(resource) => (
                <Timeline.EventRow
                  key={resource.id}
                  className="TimelineEventRow"
                  start={start}
                  end={getEndBoundaries(view, start)}
                  style={
                    {
                      '--lane-count': eventsGroupedByResource[resource.id]?.length,
                    } as React.CSSProperties
                  }
                >
                  {eventsGroupedByResource[resource.id]?.map((row, index) =>
                    row.map((event) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        gridRow={index + 1}
                        ariaLabelledBy=""
                        variant="regular"
                      />
                    )),
                  )}
                </Timeline.EventRow>
              )}
            </Timeline.SubGrid>
          </div>
        </Timeline.Root>
      </div>
    </div>
  );
}
