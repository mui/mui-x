'use client';
import * as React from 'react';
import type { TreeViewPublicAPI } from '@mui/x-tree-view/internals';
import type {
  TreeViewDefaultItemModelProperties,
  TreeViewValidItem,
} from '@mui/x-tree-view/models';
import type { RichTreeViewProStore } from '../internals/RichTreeViewProStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `RichTreeViewPro` component.
 */
export function useRichTreeViewProApiRef<
  R extends TreeViewValidItem<R> = TreeViewDefaultItemModelProperties,
>() {
  return React.useRef(undefined) as React.RefObject<
    TreeViewPublicAPI<RichTreeViewProStore<R, boolean>> | undefined
  >;
}
