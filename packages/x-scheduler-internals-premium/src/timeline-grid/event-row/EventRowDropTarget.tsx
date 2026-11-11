'use client';
import {
  schedulerExternalEventKind,
  SchedulerDropTarget,
  isStartMinuteOutsideAxisWindow,
  timelineAxisOffsetToTimestamp,
  timestampToTimelineAxisOffsetMs,
  toMsInDay,
  getLinearEventDropDates,
} from '@mui/x-scheduler-internals/internals';
import type { LinearDropSurface } from '@mui/x-scheduler-internals/internals';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useDirection } from '@base-ui/react/direction-provider';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { useTimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import {
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
} from '../../internals/utils/schedulerTimelineDrag';

const acceptedKinds = [
  schedulerTimelineEventMoveKind,
  schedulerTimelineEventResizeKind,
  schedulerExternalEventKind,
];

export function EventRowDropTarget(props: EventRowDropTarget.Props) {
  const { addPropertiesToDroppedEvent, render } = props;
  const { resourceId } = useTimelineGridEventRowContext();

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();
  const isRtl = useDirection() === 'rtl';

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Offsets are measured in axis milliseconds: with a trimmed hour window the hidden hours
  // take no space, so px↔date conversions go through the axis helpers.
  const surface: LinearDropSurface = {
    axis: 'x',
    // The time axis starts at the inline-start edge, which is the right edge in RTL.
    reversed: isRtl,
    durationMs: config.durationMs,
    offsetToDate: (offsetMs) => timelineAxisOffsetToTimestamp(config, offsetMs),
    dateToOffset: (date) => timestampToTimelineAxisOffsetMs(config, date),
    // A visible start has no remainder, even in the second occurrence of an hour repeated by a
    // fall-back transition, which the axis reads as the first one.
    getHiddenStartRemainderMs: (start) => {
      const startMsInDay = toMsInDay(start, config.timezone);
      if (!isStartMinuteOutsideAxisWindow(config, Math.floor(startMsInDay / 60_000))) {
        return 0;
      }
      return (
        start -
        timelineAxisOffsetToTimestamp(
          config,
          timestampToTimelineAxisOffsetMs(config, start, startMsInDay),
        )
      );
    },
  };

  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, target }) =>
    getLinearEventDropDates({
      source,
      target,
      surface,
      moveKind: schedulerTimelineEventMoveKind,
      resizeKind: schedulerTimelineEventResizeKind,
    });

  return (
    <SchedulerDropTarget
      resourceId={resourceId}
      surfaceType="timeline"
      getEventDropDates={getEventDropDates}
      accept={acceptedKinds}
      addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
      render={render}
    />
  );
}

export namespace EventRowDropTarget {
  export interface Props {
    render: React.ReactElement;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
