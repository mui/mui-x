'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { HTMLProps } from '@base-ui/react/internals/types';

function DraggableElementWithPreview(props: {
  element: React.ReactElement;
  rootProps: HTMLProps;
  preview: React.ReactNode;
}) {
  const { element, rootProps, preview } = props;
  // A disabled Scheduler draggable only can't be dragged: the element itself stays enabled, so it
  // doesn't take the root's `data-disabled`.
  const {
    ref,
    'data-disabled': disabledAttribute,
    ...otherRootProps
  } = rootProps as HTMLProps & {
    'data-disabled'?: string;
  };
  // Merges the root's props and ref into `element` the way `Draggable.Root` does for a `render`
  // element: the props of `element` win.
  const renderedElement = useRenderElement(
    'div',
    { render: element },
    {
      ref,
      props: [otherRootProps],
    },
  );
  return (
    <React.Fragment>
      {renderedElement}
      {preview}
    </React.Fragment>
  );
}

/**
 * Returns the `render` function of a `Draggable.Root` that renders `element` with the root's props
 * and `preview`, a `Draggable.Preview`, beside it.
 * The preview renders nothing in place, it only has to be inside the root. Keeping it out of the
 * children of `element` leaves a `render` element that wraps or ignores its children working.
 */
export function withDragPreview(element: React.ReactElement, preview: React.ReactNode) {
  return function renderWithDragPreview(rootProps: HTMLProps) {
    return (
      <DraggableElementWithPreview element={element} rootProps={rootProps} preview={preview} />
    );
  };
}
