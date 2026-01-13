import * as React from 'react';
import { TreeViewPublicAPI } from '../internals/models';
import { SimpleTreeViewStore } from '../internals/SimpleTreeViewStore';

/**
 * Creates the ref to pass to the `apiRef` prop of the `SimpleTreeView` component.
 */
export function useSimpleTreeViewApiRef() {
  return React.useRef(undefined) as React.RefObject<
    TreeViewPublicAPI<SimpleTreeViewStore<boolean>> | undefined
  >;
}
