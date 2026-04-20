'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { useAdapterContext } from '@mui/x-scheduler-headless/use-adapter-context';
import { useEventCreation, useKeyboardEventCreation } from '@mui/x-scheduler-headless/internals';
import { EVENT_CREATION_PRECISION_MINUTE } from '@mui/x-scheduler-headless/constants';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';
import { usePlaceholderInRow } from './usePlaceholderInRow';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridEventRowDataAttributes } from './TimelineGridEventRowDataAttributes';
import { useTimelineGridRowKeyboard } from '../../internals/utils/useTimelineGridRowKeyboard';

const stateAttributesMapping = {
  resourceId: (value: SchedulerResourceId) => ({
    [TimelineGridEventRowDataAttributes.resourceId]: String(value),
  }),
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

  // Keyboard navigation + focus sync
  const { rowRef, listItemRef, index, hasFocus, handleKeyDown, handleFocus } =
    useTimelineGridRowKeyboard({ columnType: 'events' });

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);
  const occurrences = useStore(
    store,
    schedulerOccurrenceSelectors.resourceOccurrences,
    viewConfig.start,
    viewConfig.end,
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
    const anchor = adapter.addMilliseconds(viewConfig.start, offsetMs);
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
    start: viewConfig.start,
    end: adapter.addMinutes(viewConfig.start, creationConfig.duration),
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

  const state: TimelineGridEventRow.State = { resourceId };

  const keyboardProps = {
    tabIndex: 0,
    onKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, rowRef],
    state,
    stateAttributesMapping,
    props: [
      elementProps,
      { role: 'row', 'aria-rowindex': index + 1, children },
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
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>, useEventRowDropTarget.Parameters {
    children: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    placeholder: usePlaceholderInRow.ReturnValue;
  }
}
