import * as React from 'react';

/**
 * Renders `preview`, a `Draggable.Preview`, after the children of `element`.
 * `Draggable.Root` merges the props of its `render` element over its own, so a preview passed as
 * children of the root would lose to the element's children.
 */
export function withDragPreview(
  element: React.ReactElement,
  preview: React.ReactNode,
): React.ReactElement;
export function withDragPreview(
  element: React.ReactElement | null,
  preview: React.ReactNode,
): React.ReactElement | null;
export function withDragPreview(element: React.ReactElement | null, preview: React.ReactNode) {
  if (!React.isValidElement<{ children?: React.ReactNode }>(element)) {
    return element;
  }
  return React.cloneElement(element, {
    children: (
      <React.Fragment>
        {element.props.children}
        {preview}
      </React.Fragment>
    ),
  });
}
