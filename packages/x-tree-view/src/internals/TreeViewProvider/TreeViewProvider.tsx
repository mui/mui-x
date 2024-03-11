import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';
import { useTreeViewContext } from './useTreeViewContext';

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TPlugins extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TPlugins>,
) {
  const { value, children } = props;
  const { wrapRoot } = useTreeViewContext<[]>();
  const wrappedRoot = wrapRoot({ children });

  return <TreeViewContext.Provider value={value}>{wrappedRoot}</TreeViewContext.Provider>;
}
