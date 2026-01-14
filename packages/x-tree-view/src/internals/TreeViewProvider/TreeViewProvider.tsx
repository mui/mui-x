import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewSlotProps, TreeViewSlots, TreeViewStyleContext } from './TreeViewStyleContext';
import { useTreeViewBuildContext } from './useTreeViewBuildContext';
import { TreeViewAnyStore } from '../models';

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
    slots = EMPTY_OBJECT as TreeViewSlots,
    slotProps = EMPTY_OBJECT as TreeViewSlotProps,
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
      },
      slotProps: {
        collapseIcon: slotProps.collapseIcon,
        expandIcon: slotProps.expandIcon,
        endIcon: slotProps.endIcon,
      },
    }),
    [
      classes,
      slots.collapseIcon,
      slots.expandIcon,
      slots.endIcon,
      slotProps.collapseIcon,
      slotProps.expandIcon,
      slotProps.endIcon,
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
