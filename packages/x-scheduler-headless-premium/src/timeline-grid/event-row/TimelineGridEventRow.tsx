'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventCreation, useKeyboardEventCreation } from '@mui/x-scheduler-headless/internals';
import { EVENT_CREATION_PRECISION_MINUTE } from '@mui/x-scheduler-headless/constants';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';
import { usePlaceholderInRow } from './usePlaceholderInRow';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import {
  eventTimelineOccurrencePositionSelectors,
  eventTimelinePremiumPresetSelectors,
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
    children,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const adapter = useAdapterContext();
  const store = useEventTimelinePremiumStoreContext();

  const { rowRef, listItemRef, index, hasFocus, handleKeyDown, handleFocus } =
    useTimelineGridRowKeyboard({ columnType: 'events' });

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const maxLane = useStore(
    store,
    eventTimelineOccurrencePositionSelectors.maxLaneForResource,
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
    const anchor = adapter.addMilliseconds(presetConfig.start, offsetMs);
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

  const triggerKeyboardCreation = useKeyboardEventCreation(({ creationConfig }) => ({
    surfaceType: 'timeline' as const,
    start: presetConfig.start,
    end: adapter.addMinutes(presetConfig.start, creationConfig.duration),
    resourceId,
    lockSurfaceType: true,
  }));

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (handleKeyDown(event)) {
      return;
    }
    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const placeholder = usePlaceholderInRow(resourceId);

  const contextValue: TimelineGridEventRowContext = React.useMemo(
    () => ({ resourceId, hasFocus, getCursorPositionInElementMs, placeholder }),
    [resourceId, hasFocus, getCursorPositionInElementMs, placeholder],
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

  const inlineStyle = {
    ...style,
    '--lane-count': maxLane,
  } as React.CSSProperties;

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, rowRef],
    state,
    stateAttributesMapping,
    props: [
      elementProps,
      // Reserve aria-rowindex=1 for the grid header row.
      { role: 'row', 'aria-rowindex': index + 2, style: inlineStyle, children },
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
    extends BaseUIComponentProps<'div', State>,
      useEventRowDropTarget.Parameters {}
}
