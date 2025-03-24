import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewSlotProps, TreeViewSlots, TreeViewStyleContext } from './TreeViewStyleContext';

const EMPTY_OBJECT = {};

/**
 * Sets up the contexts for the underlying Tree Item components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TSignatures>,
) {
  const {
    contextValue,
    classes = EMPTY_OBJECT,
    slots = EMPTY_OBJECT as TreeViewSlots,
    slotProps = EMPTY_OBJECT as TreeViewSlotProps,
    children,
  } = props;

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
