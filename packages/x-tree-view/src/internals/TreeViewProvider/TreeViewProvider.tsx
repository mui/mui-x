import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { DescendantProvider } from './DescendantProvider';

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider(props: TreeViewProviderProps) {
  const { value, children } = props;

  return (
    <TreeViewContext.Provider value={value}>
      <DescendantProvider>{children}</DescendantProvider>
    </TreeViewContext.Provider>
  );
}
