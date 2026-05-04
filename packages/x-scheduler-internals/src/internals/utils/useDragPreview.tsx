'use client';
import * as React from 'react';
import { RenderDragPreviewParameters } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';

/**
 * Returns the drag preview to render when the dragged event is not over a valid drop target.
 */
export function useDragPreview(parameters: useDragPreview.Parameters): useDragPreview.ReturnValue {
  const { renderDragPreview, showPreviewOnDragStart, data, type } = parameters;
  const store = useSchedulerStoreContext(true);

  const [state, setState] = React.useState<useDragPreview.State>({
    isDragging: false,
    dragPosition: null,
  });

  const element = React.useMemo(() => {
    if (state.dragPosition == null) {
      return null;
    }

    return (
      <div
        style={{
          position: 'fixed',
          top: state.dragPosition.clientY,
          left: state.dragPosition.clientX,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        {renderDragPreview({ data, type } as RenderDragPreviewParameters)}
      </div>
    );
  }, [state.dragPosition, renderDragPreview, data, type]);

  const actions = React.useMemo(
    () => ({
      onDragStart: (location: useDragPreview.DragLocationHistory) => {
        setState({
          isDragging: true,
          dragPosition: showPreviewOnDragStart ? location.current.input : null,
        });
      },
      onDrag: (location: useDragPreview.DragLocationHistory) => {
        let shouldShowPreview = true;
        if (
          store &&
          type === 'internal-event' &&
          !schedulerEventSelectors.canDropEventsToTheOutside(store.state)
        ) {
          shouldShowPreview = false;
        } else if (location.current.dropTargets.some((el) => el.data.isSchedulerDropTarget)) {
          shouldShowPreview = false;
        }

        setState({
          isDragging: true,
          dragPosition: shouldShowPreview ? location.current.input : null,
        });
      },
      onDrop: () => {
        setState({ isDragging: false, dragPosition: null });
      },
    }),
    [store, showPreviewOnDragStart, type],
  );

  return {
    element,
    state,
    actions,
  };
}

export namespace useDragPreview {
  export type Parameters = RenderDragPreviewParameters & {
    showPreviewOnDragStart: boolean;
    /**
     * Returns the drag preview element.
     */
    renderDragPreview: (parameters: RenderDragPreviewParameters) => React.ReactNode;
  };

  export interface ReturnValue {
    element: React.ReactNode;
    actions: {
      onDragStart: (location: DragLocationHistory) => void;
      onDrag: (location: DragLocationHistory) => void;
      onDrop: () => void;
    };
    state: useDragPreview.State;
  }

  export interface State {
    isDragging: boolean;
    dragPosition: { clientX: number; clientY: number } | null;
  }

  /**
   * Copy pasted from Pragmatic Dnd internal types
   */
  export interface DragLocationHistory {
    current: {
      input: {
        clientX: number;
        clientY: number;
      };
      dropTargets: {
        data: Record<string | symbol, unknown>;
      }[];
    };
  }
}
