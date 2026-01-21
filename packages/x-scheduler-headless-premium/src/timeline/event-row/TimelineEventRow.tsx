'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { TimelineEventRowContext } from './TimelineEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';
import { usePlaceholderInRow } from './usePlaceholderInRow';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { timelineViewSelectors } from '../../timeline-selectors';

export const TimelineEventRow = React.forwardRef(function TimelineEventRow(
  componentProps: TimelineEventRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    resourceId,
    addPropertiesToDroppedEvent,
    children: childrenProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);
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

  const contextValue: TimelineEventRowContext = React.useMemo(
    () => ({ getCursorPositionInElementMs }),
    [getCursorPositionInElementMs],
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

  // TODO: Add aria-rowindex using Composite.
  const props = { role: 'row', children };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef],
    props: [props, elementProps],
  });

  return (
    <TimelineEventRowContext.Provider value={contextValue}>
      {element}
    </TimelineEventRowContext.Provider>
  );
});

export namespace TimelineEventRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>, useEventRowDropTarget.Parameters {
    children: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    placeholder: usePlaceholderInRow.ReturnValue;
  }
}
