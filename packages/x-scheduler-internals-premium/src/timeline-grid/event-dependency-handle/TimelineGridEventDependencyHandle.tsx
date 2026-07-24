'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';
import { useTimelineGridEventContext } from '../event/TimelineGridEventContext';
import type { TimelineGridEvent } from '../event/TimelineGridEvent';

/**
 * The terminal on the end edge of an event: dragging it onto another event creates a
 * `FinishToStart` dependency. The drag lifecycle is handled by a monitor on the grid
 * root (not here) so the gesture survives this element being unmounted by
 * virtualization mid-drag.
 */
export const TimelineGridEventDependencyHandle = React.forwardRef(
  function TimelineGridEventDependencyHandle(
    componentProps: TimelineGridEventDependencyHandle.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      style,
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    // Context hooks
    const store = useEventTimelinePremiumStoreContext();
    const contextValue = useTimelineGridEventContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Selector hooks
    const dependenciesEnabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);

    // The gesture starts from the end edge (the `FinishToStart` origin), which must be
    // inside the collection to anchor the provisional arrow — same rule as the end
    // resize handle.
    const enabled = dependenciesEnabled && !contextValue.doesEventEndAfterCollectionEnd;

    // Feature hooks
    const getDragData = useStableCallback((input: { clientX: number }) => ({
      ...contextValue.getSharedDragData(input),
      source: 'TimelineGridEventDependencyHandle' as const,
    }));

    React.useEffect(() => {
      if (!ref.current || !enabled) {
        return undefined;
      }

      return draggable({
        element: ref.current,
        getInitialData: ({ input }) => getDragData(input),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });
        },
      });
    }, [enabled, getDragData]);

    return useRenderElement('div', componentProps, {
      enabled,
      ref: [forwardedRef, ref],
      props: [elementProps, { 'data-dependency-handle': '' } as Record<string, string>],
    });
  },
);

export namespace TimelineGridEventDependencyHandle {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}

  export interface DragData extends TimelineGridEvent.SharedDragData {
    source: 'TimelineGridEventDependencyHandle';
  }
}
