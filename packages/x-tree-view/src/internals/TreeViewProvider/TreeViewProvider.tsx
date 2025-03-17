import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewClassesContext } from './TreeViewClassesContext';

const EMPTY_OBJECT = {};

/**
 * Sets up the contexts for the underlying TreeItem components.
 *
 * @ignore - do not document.
 */
export function TreeViewProvider<TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  props: TreeViewProviderProps<TSignatures>,
) {
  const { value, classes = EMPTY_OBJECT, children } = props;

  return (
    <TreeViewContext.Provider value={value}>
      <TreeViewClassesContext.Provider value={classes}>
        {value.wrapRoot({ children })}
      </TreeViewClassesContext.Provider>
    </TreeViewContext.Provider>
  );
}
