'use client';
import * as React from 'react';
import type { TreeViewDefaultItemModelProperties, TreeViewValidItem } from '../models';
import type { TreeViewPublicAPI } from '../internals/models';
import type { RichTreeViewStore } from '../internals/RichTreeViewStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `RichTreeView` component.
 */
export function useRichTreeViewApiRef<
  R extends TreeViewValidItem<R> = TreeViewDefaultItemModelProperties,
>() {
  return React.useRef(undefined) as React.RefObject<
    TreeViewPublicAPI<RichTreeViewStore<R, boolean>> | undefined
  >;
}
