'use client';
import * as React from 'react';
import { TreeViewDefaultItemModelProperties, TreeViewValidItem } from '../models';
import { TreeViewPublicAPI } from '../internals/models';
import { RichTreeViewStore } from '../internals/RichTreeViewStore';

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
