import * as React from 'react';
import { TreeViewDefaultItemModelProperties, TreeViewValidItem } from '../models';
import { TreeViewPublicAPI } from '../internals/models';
import { SimpleTreeViewPluginSignatures } from '../SimpleTreeView/SimpleTreeView.plugins';

/**
 * Creates the ref to pass to the `apiRef` prop of the `SimpleTreeView` component.
 */
export function useSimpleTreeViewApiRef<
  R extends TreeViewValidItem<R> = TreeViewDefaultItemModelProperties,
>() {
  return React.useRef(undefined) as React.RefObject<
    TreeViewPublicAPI<SimpleTreeViewPluginSignatures> | undefined
  >;
}
