'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import {
  useRenderElement,
  BaseUIComponentProps,
  useCompositeListItem,
  useCompositeListContext,
} from '@mui/x-scheduler-headless/base-ui-copy';
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
import { useTimelineGridRootContext } from '../root/TimelineGridRootContext';

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
  const { focusedCell, setFocusedCell, columnTypes } = useTimelineGridRootContext();

  // Composite list hooks
  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();

  // Selector hooks
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);
  const occurrences = useStore(
    store,
    schedulerOccurrenceSelectors.resourceOccurrences,
    viewConfig.start,
    viewConfig.end,
    resourceId,
  );

  // Focus state
  const rowRef = React.useRef<HTMLDivElement>(null);
  const hasFocus = focusedCell?.columnType === 'events' && focusedCell?.rowIndex === index;

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

  // Apply DOM focus when this row becomes the focused row
  React.useEffect(() => {
    if (hasFocus && rowRef.current && !rowRef.current.contains(document.activeElement)) {
      rowRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const totalRows = elementsRef.current.length;
    if (event.key === 'ArrowUp' && index > 0) {
      event.preventDefault();
      setFocusedCell({ columnType: 'events', rowIndex: index - 1 });
      return;
    }
    if (event.key === 'ArrowDown' && index < totalRows - 1) {
      event.preventDefault();
      setFocusedCell({ columnType: 'events', rowIndex: index + 1 });
      return;
    }
    if (event.key === 'ArrowLeft') {
      const typeIndex = columnTypes.indexOf('events');
      if (typeIndex > 0) {
        event.preventDefault();
        setFocusedCell({ columnType: columnTypes[typeIndex - 1], rowIndex: index });
      }
      return;
    }
    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell({ columnType: 'events', rowIndex: index });
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
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, rowRef],
    state,
    stateAttributesMapping,
    props: [elementProps, { role: 'row', children }, keyboardProps, eventCreationProps],
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
