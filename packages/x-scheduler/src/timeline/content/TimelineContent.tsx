'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { Timeline as TimelinePrimitive } from '@mui/x-scheduler-headless/timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { timelineViewSelectors } from '@mui/x-scheduler-headless/timeline-selectors';
import { DaysHeader, MonthsHeader, TimeHeader, WeeksHeader, YearsHeader } from './view-header';
import { TimelineContentProps } from './TimelineContent.types';
import TimelineTitleCell from './timeline-title-cell/TimelineTitleCell';
import { TimelineEvent } from './timeline-event';
import {
  EventPopoverProvider,
  EventPopoverTrigger,
} from '../../internals/components/event-popover';

export const TimelineContent = React.forwardRef(function TimelineContent(
  props: TimelineContentProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const store = useTimelineStoreContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const view = useStore(store, timelineViewSelectors.view);

  // Feature hooks
  let header: React.ReactNode;
  switch (view) {
    case 'time':
      header = <TimeHeader />;
      break;
    case 'days':
      header = <DaysHeader />;
      break;
    case 'weeks':
      header = <WeeksHeader />;
      break;
    case 'months':
      header = <MonthsHeader />;
      break;
    case 'years':
      header = <YearsHeader />;
      break;
    default:
      header = null;
  }

  return (
    <section className={clsx(props.className, 'TimelineViewContent')} ref={handleRef} {...props}>
      <EventPopoverProvider containerRef={containerRef}>
        <TimelinePrimitive.Root
          className="TimelineRoot"
          style={{ '--unit-width': `var(--${view}-cell-width)` } as React.CSSProperties}
        >
          <div className="TitleSubGridContainer">
            <TimelinePrimitive.Row className="HeaderTitleRow">
              <TimelinePrimitive.Cell className={clsx('TimelineCell', 'HeaderTitleCell')}>
                Resource title
              </TimelinePrimitive.Cell>
            </TimelinePrimitive.Row>
            <TimelinePrimitive.SubGrid className="TitleSubGrid">
              {(resourceId) => <TimelineTitleCell key={resourceId} resourceId={resourceId} />}
            </TimelinePrimitive.SubGrid>
          </div>
          <div className="EventSubGridContainer">
            <TimelinePrimitive.Row className="HeaderRow">
              <TimelinePrimitive.Cell className={clsx('TimelineCell', 'HeaderCell')}>
                {header}
              </TimelinePrimitive.Cell>
            </TimelinePrimitive.Row>
            <TimelinePrimitive.SubGrid className="EventSubGrid">
              {(resourceId) => (
                <TimelinePrimitive.EventRow
                  key={resourceId}
                  className="TimelineEventRow"
                  resourceId={resourceId}
                >
                  {({ occurrences, placeholder }) => (
                    <React.Fragment>
                      {occurrences.map((occurrence) => (
                        <EventPopoverTrigger
                          key={occurrence.key}
                          occurrence={occurrence}
                          render={
                            <TimelineEvent
                              occurrence={occurrence}
                              ariaLabelledBy={`TimelineTitleCell-${occurrence.resource}`}
                              variant="regular"
                            />
                          }
                        />
                      ))}
                      {placeholder != null && (
                        <TimelineEvent
                          occurrence={placeholder}
                          ariaLabelledBy={`TimelineTitleCell-${placeholder.resource}`}
                          variant="placeholder"
                        />
                      )}
                    </React.Fragment>
                  )}
                </TimelinePrimitive.EventRow>
              )}
            </TimelinePrimitive.SubGrid>
          </div>
        </TimelinePrimitive.Root>
      </EventPopoverProvider>
    </section>
  );
});
