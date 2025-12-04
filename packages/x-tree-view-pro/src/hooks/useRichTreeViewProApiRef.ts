import * as React from 'react';
import { TreeViewPublicAPI } from '@mui/x-tree-view/internals';
import { TreeViewDefaultItemModelProperties, TreeViewValidItem } from '@mui/x-tree-view/models';
import { RichTreeViewProPluginSignatures } from '../RichTreeViewPro';

/**
 * Creates the ref to pass to the `apiRef` prop of the `RichTreeViewPro` component.
 */
export function useRichTreeViewProApiRef<
  R extends TreeViewValidItem<R> = TreeViewDefaultItemModelProperties,
>() {
  return React.useRef(undefined) as React.RefObject<
    TreeViewPublicAPI<RichTreeViewProPluginSignatures> | undefined
  >;
}
