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
      [
        'MUI X: Could not find the Tree View context.',
        'It looks like you rendered your component outside of a SimpleTreeView or RichTreeView parent component.',
        'This can also happen if you are bundling multiple versions of the Tree View.',
      ].join('\n'),
    );
  }

  return context;
};
