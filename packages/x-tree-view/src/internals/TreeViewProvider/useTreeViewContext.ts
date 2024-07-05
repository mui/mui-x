import * as React from 'react';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewContextValue } from './TreeViewProvider.types';

export const useTreeViewContext = <
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TOptionalSignatures extends readonly TreeViewAnyPluginSignature[] = [],
>() => {
  const context = React.useContext(TreeViewContext) as TreeViewContextValue<
    TSignatures,
    TOptionalSignatures
  >;
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
