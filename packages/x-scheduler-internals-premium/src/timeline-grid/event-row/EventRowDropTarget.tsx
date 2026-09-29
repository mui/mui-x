'use client';
import {
  schedulerExternalEventKind,
  SchedulerDropTarget,
  dateToTimelineAxisOffsetMs,
  timelineAxisOffsetToDate,
  getLinearEventDropDates,
} from '@mui/x-scheduler-internals/internals';
import type { LinearDropSurface } from '@mui/x-scheduler-internals/internals';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
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
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

  // Offsets are measured in axis milliseconds: with a trimmed hour window the hidden hours
  // take no space, so px↔date conversions go through the axis helpers.
  const surface: LinearDropSurface = {
    axis: 'x',
    durationMs: config.durationMs,
    offsetToDate: (offsetMs) => timelineAxisOffsetToDate(adapter, config, offsetMs),
    dateToOffset: (date) => dateToTimelineAxisOffsetMs(adapter, config, date),
  };

  const getEventDropDates: SchedulerDropTarget.GetEventDropDates = ({ source, target }) =>
    getLinearEventDropDates({
      adapter,
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
