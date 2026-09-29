import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import type { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import type {
  TreeViewStyleContextSlotProps,
  TreeViewStyleContextSlots,
} from './TreeViewStyleContext';
import { TreeViewStyleContext } from './TreeViewStyleContext';
import { useTreeViewBuildContext } from './useTreeViewBuildContext';
import type { TreeViewAnyStore } from '../models';

/**
 * Sets up the contexts for the underlying Tree Item components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TStore extends TreeViewAnyStore>(
  props: TreeViewProviderProps<TStore>,
) {
  const {
    store,
    apiRef,
    rootRef,
    classes = EMPTY_OBJECT,
    slots = EMPTY_OBJECT as TreeViewStyleContextSlots,
    slotProps = EMPTY_OBJECT as TreeViewStyleContextSlotProps,
    children,
  } = props;

  const contextValue = useTreeViewBuildContext({ store, apiRef, rootRef });

  const styleContextValue = React.useMemo(
    () => ({
      classes,
      slots: {
        collapseIcon: slots.collapseIcon,
        expandIcon: slots.expandIcon,
        endIcon: slots.endIcon,
        loading: slots.loading,
        itemLoader: slots.itemLoader,
      },
      slotProps: {
        collapseIcon: slotProps.collapseIcon,
        expandIcon: slotProps.expandIcon,
        endIcon: slotProps.endIcon,
        loading: slotProps.loading,
        itemLoader: slotProps.itemLoader,
      },
    }),
    [
      classes,
      slots.collapseIcon,
      slots.expandIcon,
      slots.endIcon,
      slots.loading,
      slots.itemLoader,
      slotProps.collapseIcon,
      slotProps.expandIcon,
      slotProps.endIcon,
      slotProps.loading,
      slotProps.itemLoader,
    ],
  );

  return (
    <TreeViewContext.Provider value={contextValue}>
      <TreeViewStyleContext.Provider value={styleContextValue}>
        {children}
      </TreeViewStyleContext.Provider>
    </TreeViewContext.Provider>
  );
}
