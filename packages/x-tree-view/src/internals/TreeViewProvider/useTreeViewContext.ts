import * as React from 'react';
import { TreeViewAnyPluginSignature } from '../models';
import { TreeViewContext } from './TreeViewContext';
import { TreeViewContextValue } from './TreeViewProvider.types';

export const useTreeViewContext = <TPlugins extends readonly TreeViewAnyPluginSignature[]>() => {
    const context = React.useContext(TreeViewContext) as TreeViewContextValue<TPlugins>;
    if (context == null) {
        throw new Error(
            [
                'MUI: Could not find the tree view context.',
                'It looks like you rendered your component outside of a TreeView or SimpleTreeView parent component.',
                'This can also happen if you are bundling multiple versions of the tree view.',
            ].join('\n'),
        );
    }

    return context
};
