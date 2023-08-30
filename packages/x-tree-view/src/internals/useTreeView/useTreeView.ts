import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPlugin,
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
} from '../models';
import {
  UseTreeViewDefaultizedParameters,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { DEFAULT_TREE_VIEW_CONTEXT_VALUE } from '../TreeViewProvider/TreeViewContext';
import { useTreeViewModels } from './useTreeViewModels';
import { TreeViewContextValue } from '../TreeViewProvider';

export const useTreeView = <Plugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[]>(
  inParams: UseTreeViewParameters<Plugins>,
): UseTreeViewReturnValue<ConvertPluginsIntoSignatures<Plugins>> => {
  type Signatures = ConvertPluginsIntoSignatures<Plugins>;

  const params = inParams.plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams(acc);
    }

    return acc;
  }, inParams) as unknown as UseTreeViewDefaultizedParameters<Plugins>;

  const models = useTreeViewModels(
    params.plugins,
    params as MergePluginsProperty<Signatures, 'defaultizedParams'>,
  );
  const instanceRef = React.useRef<TreeViewInstance<Signatures>>(
    {} as TreeViewInstance<Signatures>,
  );
  const instance = instanceRef.current;
  const innerRootRef = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inParams.rootRef);

  const [state, setState] = React.useState(() => {
    const temp = {} as MergePluginsProperty<Signatures, 'state'>;
    params.plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(
          temp,
          plugin.getInitialState(params as UseTreeViewDefaultizedParameters<any>),
        );
      }
    });

    return temp;
  });

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  let contextValue: TreeViewContextValue<Signatures> = DEFAULT_TREE_VIEW_CONTEXT_VALUE;

  const runPlugin = (plugin: TreeViewPlugin<any>) => {
    const pluginResponse =
      plugin({ instance, props: params, state, setState, rootRef: innerRootRef, models }) || {};

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.contextValue) {
      contextValue = pluginResponse.contextValue;
    }
  };

  params.plugins.forEach(runPlugin);

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
