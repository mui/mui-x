import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewSlotProps, TreeViewSlots, TreeViewStyleContext } from './TreeViewStyleContext';
import { TreeViewValidItem } from '../../models';
import { useTreeViewBuildContext } from './useTreeViewBuildContext';
import { TreeViewStore } from '../models';

/**
 * Sets up the contexts for the underlying Tree Item components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  TStore extends TreeViewStore<R, Multiple, any>,
>(props: TreeViewProviderProps<TStore>) {
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
        {contextValue.wrapRoot({ children })}
      </TreeViewStyleContext.Provider>
    </TreeViewContext.Provider>
  );
}
