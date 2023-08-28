import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewInstance, TreeViewPlugin, TreeViewState } from '../../models';
import { useTreeViewNodes } from './useTreeViewNodes';
import { useTreeViewSelection } from './useTreeViewSelection';
import { useTreeViewFocus } from './useTreeViewFocus';
import { useTreeViewExpansion } from './useTreeViewExpansion';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { useTreeViewContext } from './useTreeViewContext';
import {
  UseTreeViewDefaultizedParameters,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { DEFAULT_TREE_VIEW_CONTEXT_VALUE } from '../TreeViewProvider/TreeViewContext';
import { useTreeViewModels } from './useTreeViewModels';

const plugins: TreeViewPlugin<UseTreeViewDefaultizedParameters<any>>[] = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewContext,
];

const defaultDefaultExpanded: string[] = [];
const defaultDefaultSelected: string[] = [];

export const useTreeView = <Multiple extends boolean | undefined>(
  inProps: UseTreeViewParameters<Multiple>,
): UseTreeViewReturnValue => {
  type DefaultProps = UseTreeViewDefaultizedParameters<Multiple extends true ? true : false>;

  const props = {
    ...inProps,
    disabledItemsFocusable: inProps.disabledItemsFocusable ?? false,
    disableSelection: inProps.disableSelection ?? false,
    multiSelect: inProps.multiSelect ?? false,
    defaultExpanded: inProps.defaultExpanded ?? defaultDefaultExpanded,
    defaultSelected:
      inProps.defaultSelected ?? (inProps.multiSelect ? defaultDefaultSelected : null),
  } as DefaultProps;

  const models = useTreeViewModels(plugins, props);
  const instanceRef = React.useRef<TreeViewInstance>({} as TreeViewInstance);
  const instance = instanceRef.current;
  const innerRootRef = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inProps.rootRef);

  const [state, setState] = React.useState<TreeViewState>(() => {
    const temp = {} as TreeViewState;
    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(temp, plugin.getInitialState(props as UseTreeViewDefaultizedParameters<any>));
      }
    });

    return temp;
  });

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  let contextValue = DEFAULT_TREE_VIEW_CONTEXT_VALUE;

  const runPlugin = (plugin: TreeViewPlugin<any>) => {
    const pluginResponse =
      plugin({ instance, props, state, setState, rootRef: innerRootRef, models }) || {};

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.contextValue) {
      contextValue = pluginResponse.contextValue;
    }
  };

  plugins.forEach(runPlugin);

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ) => {
    const rootProps: UseTreeViewRootSlotProps = {
      role: 'tree',
      tabIndex: 0,
      ...otherHandlers,
      ref: handleRootRef,
    };

    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });

    return rootProps;
  };

  return { getRootProps, rootRef: handleRootRef, contextValue };
};
