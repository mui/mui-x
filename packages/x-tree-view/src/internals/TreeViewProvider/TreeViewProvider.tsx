import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewStyleContext } from './TreeViewStyleContext';

const EMPTY_OBJECT = {};

/**
 * Sets up the contexts for the underlying Tree Item components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TSignatures>,
) {
  const { contextValue, classes = EMPTY_OBJECT, children } = props;

  // TODO: Add the icons to this context and drop useTreeViewIcons
  const styleContextValue = React.useMemo(() => ({ classes }), [classes]);

  return (
    <TreeViewContext.Provider value={contextValue}>
      <TreeViewStyleContext.Provider value={styleContextValue}>
        {contextValue.wrapRoot({ children })}
      </TreeViewStyleContext.Provider>
    </TreeViewContext.Provider>
  );
}
