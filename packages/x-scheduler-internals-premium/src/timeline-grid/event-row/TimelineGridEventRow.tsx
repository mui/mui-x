'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  useEventCreation,
  useKeyboardEventCreation,
  timelineAxisOffsetToDate,
} from '@mui/x-scheduler-internals/internals';
import { EVENT_CREATION_PRECISION_MINUTE } from '@mui/x-scheduler-internals/constants';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';
import { usePlaceholderInRow } from './usePlaceholderInRow';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  eventTimelinePremiumPresetSelectors,
  eventTimelinePremiumOccurrenceSelectors,
} from '../../event-timeline-premium-selectors';
import { TimelineGridEventRowDataAttributes } from './TimelineGridEventRowDataAttributes';
import { useTimelineGridRowKeyboard } from '../../internals/utils/useTimelineGridRowKeyboard';

const stateAttributesMapping = {
  resourceId: (value: SchedulerResourceId) => ({
    [TimelineGridEventRowDataAttributes.resourceId]: String(value),
  }),
  creationDisabled: (value: boolean) =>
    value ? { [TimelineGridEventRowDataAttributes.creationDisabled]: '' } : null,
};

export const TimelineGridEventRow = React.forwardRef(function TimelineGridEventRow(
  componentProps: TimelineGridEventRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    resourceId,
    addPropertiesToDroppedEvent,
    children: childrenProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  const { rowRef, hasFocus, handleKeyDown, handleFocus } = useTimelineGridRowKeyboard({
    columnType: 'events',
  });

  // Selector hooks
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);
  // Occurrences fully inside the hidden hours would render as zero-width slivers and
  // inflate the lane count, so the selector excludes them before positioning.
  const occurrences = useStore(
    store,
    eventTimelinePremiumOccurrenceSelectors.visibleResourceOccurrences,
    resourceId,
  );

  // Feature hooks
  const { getCursorPositionInElementMs, ref: dropTargetRef } = useEventRowDropTarget({
    resourceId,
    addPropertiesToDroppedEvent,
  });

  const eventCreationProps = useEventCreation(({ event, creationConfig }) => {
    const offsetMs = getCursorPositionInElementMs({
      input: { clientX: event.clientX },
      elementRef: dropTargetRef,
    });
    // The new event starts at the cursor: cap the offset to the last slot of the axis
    // so a click on the exact right edge does not create the event on the day after
    // the collection, where it would not be rendered at all.
    const lastStartOffsetMs = config.durationMs - EVENT_CREATION_PRECISION_MINUTE * 60_000;
    const anchor = timelineAxisOffsetToDate(adapter, config, Math.min(offsetMs, lastStartOffsetMs));
    const startDate = adapter.addMinutes(
      anchor,
      -(adapter.getMinutes(anchor) % EVENT_CREATION_PRECISION_MINUTE),
    );
    return {
      surfaceType: 'timeline' as const,
      start: startDate,
      end: adapter.addMinutes(startDate, creationConfig.duration),
      resourceId,
      lockSurfaceType: true,
    };
  });

  const triggerKeyboardCreation = useKeyboardEventCreation(({ creationConfig }) => {
    // Start at the first visible hour: with a trimmed window an event created at
    // midnight would be hidden. Offset 0 resolves it as a wall-clock hour, which
    // `addMinutes` from midnight would miss on a DST day.
    const creationStart = timelineAxisOffsetToDate(adapter, config, 0);
    return {
      surfaceType: 'timeline' as const,
      start: creationStart,
      end: adapter.addMinutes(creationStart, creationConfig.duration),
      resourceId,
      lockSurfaceType: true,
    };
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (handleKeyDown(event)) {
      return;
    }
    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const contextValue: TimelineGridEventRowContext = React.useMemo(
    () => ({ hasFocus, getCursorPositionInElementMs }),
    [hasFocus, getCursorPositionInElementMs],
  );

  const occurrencesWithPosition = useEventOccurrencesWithTimelinePosition({
    occurrences,
    maxSpan: 1,
  });

  const placeholder = usePlaceholderInRow({
    resourceId,
    occurrences: occurrencesWithPosition.occurrences,
    maxIndex: occurrencesWithPosition.maxIndex,
  });

  const children = React.useMemo(
    () => childrenProp({ placeholder, ...occurrencesWithPosition }),
    [childrenProp, placeholder, occurrencesWithPosition],
  );

  const state: TimelineGridEventRow.State = {
    resourceId,
    creationDisabled: !triggerKeyboardCreation,
  };

  const keyboardProps = {
    tabIndex: 0,
    onKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, rowRef],
    state,
    stateAttributesMapping,
    props: [
      elementProps,
      {
        children,
        style: {
          '--lane-count': occurrencesWithPosition.maxIndex,
        } as React.CSSProperties,
      },
      keyboardProps,
      eventCreationProps,
    ],
  });

  return (
    <TimelineGridEventRowContext.Provider value={contextValue}>
      {element}
    </TimelineGridEventRowContext.Provider>
  );
});

export namespace TimelineGridEventRow {
  export interface State {
    /**
     * The ID of the resource for this event row.
     */
    resourceId: SchedulerResourceId;
    /**
     * Whether event creation is disabled.
     */
    creationDisabled: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>, useEventRowDropTarget.Parameters {
    children: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    placeholder: usePlaceholderInRow.ReturnValue;
  }
}
