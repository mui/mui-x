import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { TreeViewInstance, TreeViewPlugin } from '../models';
import { TreeViewState } from '../models/TreeViewState';
import { useTreeViewNodes } from './useTreeViewNodes';
import { useTreeViewSelection } from './useTreeViewSelection';
import { useTreeViewFocus } from './useTreeViewFocus';
import { useTreeViewExpansion } from './useTreeViewExpansion';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';

const plugins: TreeViewPlugin[] = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
];

export const useTreeView = (
  props: TreeViewDefaultizedProps,
  ref: React.Ref<HTMLUListElement> | undefined,
) => {
  const [state, setState] = React.useState<TreeViewState>(() =>
    plugins.reduce((prevState, plugin) => {
      if (plugin.getInitialState) {
        return { ...prevState, ...plugin.getInitialState(props) };
      }

      return prevState;
    }, {} as TreeViewState),
  );

  const instanceRef = React.useRef<TreeViewInstance>({ nodeMap: {} } as TreeViewInstance);
  const instance = instanceRef.current;
  const rootRef = React.useRef(null);
  const handleRootRef = useForkRef(rootRef, ref);

  const rootProps: React.HTMLAttributes<HTMLUListElement> & { ref: React.Ref<HTMLUListElement> } = {
    ref: handleRootRef,
  };

  const runPlugin = (plugin: TreeViewPlugin) => {
    const pluginResponse = plugin({ instance, props, state, setState, rootRef }) || {};

    if (pluginResponse.rootProps) {
      Object.assign(rootProps, pluginResponse.rootProps);
    }
  };

  plugins.forEach(runPlugin);

  runPlugin(useTreeViewNodes);
  runPlugin(useTreeViewExpansion);
  runPlugin(useTreeViewSelection);
  runPlugin(useTreeViewFocus);
  runPlugin(useTreeViewKeyboardNavigation);

  return { instance, state, rootProps, ref };
};
