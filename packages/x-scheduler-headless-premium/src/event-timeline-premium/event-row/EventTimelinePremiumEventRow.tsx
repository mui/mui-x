'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCreation } from '@mui/x-scheduler-headless/internals';
import { EVENT_CREATION_PRECISION_MINUTE } from '@mui/x-scheduler-headless/constants';
import { EventTimelinePremiumEventRowContext } from './EventTimelinePremiumEventRowContext';
import { useEventRowDropTarget } from './useEventRowDropTarget';
import { usePlaceholderInRow } from './usePlaceholderInRow';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';

export const EventTimelinePremiumEventRow = React.forwardRef(function EventTimelinePremiumEventRow(
  componentProps: EventTimelinePremiumEventRow.Props,
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
  const adapter = useAdapter();
  const store = useEventTimelinePremiumStoreContext();

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

  const contextValue: EventTimelinePremiumEventRowContext = React.useMemo(
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
    props: [props, eventCreationProps, elementProps],
  });

  return (
    <EventTimelinePremiumEventRowContext.Provider value={contextValue}>
      {element}
    </EventTimelinePremiumEventRowContext.Provider>
  );
});

export namespace EventTimelinePremiumEventRow {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>, useEventRowDropTarget.Parameters {
    children: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters extends useEventOccurrencesWithTimelinePosition.ReturnValue {
    placeholder: usePlaceholderInRow.ReturnValue;
  }
}
