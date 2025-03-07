import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TSignatures>,
) {
  const { value, children } = props;

  return (
    <TreeViewContext.Provider value={value}>
      {value.wrapRoot({ children })}
    </TreeViewContext.Provider>
  );
}
