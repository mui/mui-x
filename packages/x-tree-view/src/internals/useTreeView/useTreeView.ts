import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPlugin,
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
  TreeItemWrapper,
  TreeViewPublicAPI,
} from '../models';
import {
  UseTreeViewDefaultizedParameters,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { useTreeViewModels } from './useTreeViewModels';
import { TreeViewContextValue } from '../TreeViewProvider';
import { TREE_VIEW_CORE_PLUGINS } from '../corePlugins';

export function useTreeViewApiInitialization<T>(
  inputApiRef: React.MutableRefObject<T> | undefined,
): T {
  const fallbackPublicApiRef = React.useRef({}) as React.MutableRefObject<T>;

  if (inputApiRef) {
    if (inputApiRef.current == null) {
      inputApiRef.current = {} as T;
    }
    return inputApiRef.current;
  }

  return fallbackPublicApiRef.current;
}

export const useTreeView = <Plugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[]>(
  inParams: UseTreeViewParameters<Plugins>,
): UseTreeViewReturnValue<ConvertPluginsIntoSignatures<Plugins>> => {
  const plugins = [...TREE_VIEW_CORE_PLUGINS, ...inParams.plugins];
  type Signatures = ConvertPluginsIntoSignatures<typeof plugins>;

  const params = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams(acc);
    }

    return acc;
  }, inParams) as unknown as UseTreeViewDefaultizedParameters<Plugins>;

  const models = useTreeViewModels(
    plugins,
    params as MergePluginsProperty<Signatures, 'defaultizedParams'>,
  );
  const instanceRef = React.useRef<TreeViewInstance<Signatures>>(
    {} as TreeViewInstance<Signatures>,
  );
  const instance = instanceRef.current as TreeViewInstance<Signatures>;

  const publicAPI = useTreeViewApiInitialization<TreeViewPublicAPI<Signatures>>(inParams.apiRef);

  const innerRootRef = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inParams.rootRef);

  const [state, setState] = React.useState(() => {
    const temp = {} as MergePluginsProperty<Signatures, 'state'>;
    plugins.forEach((plugin) => {
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
  const contextValue = {
    publicAPI,
    instance: instance as TreeViewInstance<any>,
  } as TreeViewContextValue<Signatures>;

  const runPlugin = (plugin: TreeViewPlugin<TreeViewAnyPluginSignature>) => {
    const pluginResponse =
      plugin({
        instance,
        publicAPI,
        params,
        slots: params.slots,
        slotProps: params.slotProps,
        state,
        setState,
        rootRef: innerRootRef,
        models,
      }) || {};

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.contextValue) {
      Object.assign(contextValue, pluginResponse.contextValue);
    }
  };

  plugins.forEach(runPlugin);

  contextValue.runItemPlugins = (itemPluginProps) => {
    let finalRootRef: React.RefCallback<HTMLLIElement> | null = null;
    let finalContentRef: React.RefCallback<HTMLElement> | null = null;

    plugins.forEach((plugin) => {
      if (!plugin.itemPlugin) {
        return;
      }

      const itemPluginResponse = plugin.itemPlugin({
        props: itemPluginProps,
        rootRef: finalRootRef,
        contentRef: finalContentRef,
      });
      if (itemPluginResponse?.rootRef) {
        finalRootRef = itemPluginResponse.rootRef;
      }
      if (itemPluginResponse?.contentRef) {
        finalContentRef = itemPluginResponse.contentRef;
      }
    });

    return {
      contentRef: finalContentRef,
      rootRef: finalRootRef,
    };
  };

  const itemWrappers = plugins
    .map((plugin) => plugin.wrapItem)
    .filter((wrapItem): wrapItem is TreeItemWrapper => !!wrapItem);
  contextValue.wrapItem = ({ itemId, children }) => {
    let finalChildren: React.ReactNode = children;
    itemWrappers.forEach((itemWrapper) => {
      finalChildren = itemWrapper({ itemId, children: finalChildren });
    });

    return finalChildren;
  };

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

  return {
    getRootProps,
    rootRef: handleRootRef,
    contextValue: contextValue as any,
    instance: instance as any,
  };
};
