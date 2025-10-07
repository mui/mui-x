'use client';
import * as React from 'react';
import { useRenderElement } from '../base-ui-copy/utils/useRenderElement';

/**
 * Returns the drag preview to render when the dragged event is not over a valid drop target.
 */
export function useDragPreview(parameters: useDragPreview.Parameters) {
  const { elementProps, componentProps, showPreviewOnDragStart } = parameters;

  const [state, setState] = React.useState<useDragPreview.State>({
    isDragging: false,
    dragPosition: null,
  });

  const element = useRenderElement('div', componentProps, {
    state,
    props: [elementProps],
  });

  const preview =
    state.dragPosition == null ? null : (
      <div
        style={{
          position: 'fixed',
          top: state.dragPosition.clientY,
          left: state.dragPosition.clientX,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        {element}
      </div>
    );

  const actions = React.useMemo(
    () => ({
      onDragStart: (location: useDragPreview.DragLocationHistory) => {
        setState({
          isDragging: true,
          dragPosition: showPreviewOnDragStart ? location.current.input : null,
        });
      },
      onDrag: (location: useDragPreview.DragLocationHistory) => {
        if (location.current.dropTargets.some((el) => el.data.isSchedulerDropTarget)) {
          setState({ isDragging: true, dragPosition: null });
        } else {
          setState({ isDragging: true, dragPosition: location.current.input });
        }
      },
      onDrop: () => {
        setState({ isDragging: false, dragPosition: null });
      },
    }),
    [showPreviewOnDragStart],
  );

  return {
    preview,
    previewState: state,
    previewActions: actions,
  };
}

export namespace useDragPreview {
  export interface Parameters {
    elementProps: any;
    componentProps: any;
    showPreviewOnDragStart: boolean;
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
