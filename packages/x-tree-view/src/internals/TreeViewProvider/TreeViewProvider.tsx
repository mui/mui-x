import * as React from 'react';
import { TreeViewProviderProps } from './TreeViewProvider.types';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewClassesContext } from './TreeViewClassesContext';

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

  return (
    <TreeViewContext.Provider value={contextValue}>
      <TreeViewClassesContext.Provider value={classes}>
        {contextValue.wrapRoot({ children })}
      </TreeViewClassesContext.Provider>
    </TreeViewContext.Provider>
  );
}
