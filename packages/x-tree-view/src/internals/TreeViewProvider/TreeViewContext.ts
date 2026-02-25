'use client';
import * as React from 'react';
import { TreeViewAnyStore } from '../models';
import { TreeViewContextValue } from './TreeViewProvider.types';

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext<TreeViewContextValue<any> | null>(null);

export const useTreeViewContext = <TStore extends TreeViewAnyStore>() => {
  const context = React.useContext(TreeViewContext) as TreeViewContextValue<TStore> | null;
  if (context == null) {
    throw new Error(
      'MUI X Tree View: Could not find the Tree View context. ' +
        'This happens when a component is rendered outside of a SimpleTreeView or RichTreeView parent component. ' +
        'Ensure your component is a child of a Tree View component. ' +
        'This can also happen if you are bundling multiple versions of the Tree View.',
    );
  }

  return context;
};
