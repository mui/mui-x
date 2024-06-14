import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPlugin,
  MergeSignaturesProperty,
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewPublicAPI,
  ConvertSignaturesIntoPlugins,
} from '../models';
import {
  UseTreeViewDefaultizedParameters,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { useTreeViewModels } from './useTreeViewModels';
import { TreeViewContextValue, TreeViewItemPluginsRunner } from '../TreeViewProvider';
import { TREE_VIEW_CORE_PLUGINS, TreeViewCorePluginSignatures } from '../corePlugins';

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

export const useTreeView = <TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  inParams: UseTreeViewParameters<TSignatures>,
): UseTreeViewReturnValue<TSignatures> => {
  type TSignaturesWithCorePluginSignatures = readonly [
    ...TreeViewCorePluginSignatures,
    ...TSignatures,
  ];
  const plugins = [
    ...TREE_VIEW_CORE_PLUGINS,
    ...inParams.plugins,
  ] as unknown as ConvertSignaturesIntoPlugins<TSignaturesWithCorePluginSignatures>;

  const params = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams(acc) as typeof acc;
    }

    return acc;
  }, inParams) as unknown as UseTreeViewDefaultizedParameters<TSignatures>;

  const models = useTreeViewModels<TSignaturesWithCorePluginSignatures>(plugins, params);
  const instanceRef = React.useRef({} as TreeViewInstance<TSignatures>);
  const instance = instanceRef.current as TreeViewInstance<TSignatures>;

  const publicAPI = useTreeViewApiInitialization<TreeViewPublicAPI<TSignatures>>(inParams.apiRef);

  const innerRootRef: React.RefObject<HTMLUListElement> = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inParams.rootRef);

  const [state, setState] = React.useState(() => {
    const temp = {} as MergeSignaturesProperty<TSignaturesWithCorePluginSignatures, 'state'>;
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

  const itemWrappers = plugins
    .map((plugin) => plugin.wrapItem)
    .filter((wrapItem): wrapItem is TreeItemWrapper<any> => !!wrapItem);
  const wrapItem: TreeItemWrapper<TSignatures> = ({ itemId, children }) => {
    let finalChildren: React.ReactNode = children;
    itemWrappers.forEach((itemWrapper) => {
      finalChildren = itemWrapper({ itemId, children: finalChildren, instance });
    });

    return finalChildren;
  };

  const rootWrappers = plugins
    .map((plugin) => plugin.wrapRoot)
    .filter((wrapRoot): wrapRoot is TreeRootWrapper<any> => !!wrapRoot)
    // The wrappers are reversed to ensure that the first wrapper is the outermost one.
    .reverse();
  const wrapRoot: TreeRootWrapper<TSignatures> = ({ children }) => {
    let finalChildren: React.ReactNode = children;
    rootWrappers.forEach((rootWrapper) => {
      finalChildren = rootWrapper({ children: finalChildren, instance });
    });

    return finalChildren;
  };

  const runItemPlugins: TreeViewItemPluginsRunner = (itemPluginProps) => {
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

  const contextValue = {
    publicAPI,
    wrapItem,
    wrapRoot,
    runItemPlugins,
    instance: instance as TreeViewInstance<any>,
    rootRef: innerRootRef,
  } as TreeViewContextValue<TSignatures>;

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  const runPlugin = (plugin: TreeViewPlugin<TreeViewAnyPluginSignature>) => {
    const pluginResponse = plugin({
      instance,
      params,
      slots: params.slots,
      slotProps: params.slotProps,
      experimentalFeatures: params.experimentalFeatures,
      state,
      setState,
      rootRef: innerRootRef,
      models,
    });

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI, pluginResponse.publicAPI);
    }

    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }

    if (pluginResponse.contextValue) {
      Object.assign(contextValue, pluginResponse.contextValue);
    }
  };

  plugins.forEach(runPlugin);

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ) => {
    const rootProps: UseTreeViewRootSlotProps = {
      role: 'tree',
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
    contextValue,
    instance,
  };
};
