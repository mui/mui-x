import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/utils/types';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPlugin,
  TreeViewPublicAPI,
  ConvertSignaturesIntoPlugins,
  TreeViewState,
} from '../models';
import {
  UseTreeViewBaseProps,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { useTreeViewModels } from './useTreeViewModels';
import { TREE_VIEW_CORE_PLUGINS, TreeViewCorePluginSignatures } from '../corePlugins';
import { extractPluginParamsFromProps } from './extractPluginParamsFromProps';
import { useTreeViewBuildContext } from './useTreeViewBuildContext';
import { TreeViewStore } from '../utils/TreeViewStore';

export function useTreeViewApiInitialization<T>(
  inputApiRef: React.RefObject<T | undefined> | undefined,
): T {
  const fallbackPublicApiRef = React.useRef({}) as React.RefObject<T>;

  if (inputApiRef) {
    if (inputApiRef.current == null) {
      inputApiRef.current = {} as T;
    }
    return inputApiRef.current;
  }

  return fallbackPublicApiRef.current;
}

let globalId: number = 0;
export const useTreeView = <
  TSignatures extends readonly TreeViewAnyPluginSignature[],
  TProps extends Partial<UseTreeViewBaseProps<TSignatures>>,
>({
  plugins: inPlugins,
  rootRef,
  props,
}: UseTreeViewParameters<TSignatures, TProps>): UseTreeViewReturnValue<TSignatures> => {
  type TSignaturesWithCorePluginSignatures = readonly [
    ...TreeViewCorePluginSignatures,
    ...TSignatures,
  ];
  const plugins = React.useMemo(
    () =>
      [
        ...TREE_VIEW_CORE_PLUGINS,
        ...inPlugins,
      ] as unknown as ConvertSignaturesIntoPlugins<TSignaturesWithCorePluginSignatures>,
    [inPlugins],
  );

  const { pluginParams, forwardedProps, apiRef, experimentalFeatures } =
    extractPluginParamsFromProps<TSignatures, typeof props>({
      plugins,
      props,
    });

  const models = useTreeViewModels<TSignatures>(plugins, pluginParams);
  const instanceRef = React.useRef({} as TreeViewInstance<TSignatures>);
  const instance = instanceRef.current as TreeViewInstance<TSignatures>;
  const publicAPI = useTreeViewApiInitialization<TreeViewPublicAPI<TSignatures>>(apiRef);
  const innerRootRef = React.useRef<HTMLUListElement>(null);
  const handleRootRef = useForkRef(innerRootRef, rootRef);

  const storeRef = React.useRef<TreeViewStore<TSignaturesWithCorePluginSignatures> | null>(null);
  if (storeRef.current == null) {
    globalId += 1;
    const initialState = {
      cacheKey: { id: globalId },
    } as TreeViewState<TSignaturesWithCorePluginSignatures>;

    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(initialState, plugin.getInitialState(pluginParams));
      }
    });

    storeRef.current = new TreeViewStore(initialState);
  }

  const contextValue = useTreeViewBuildContext<TSignatures>({
    plugins,
    instance,
    publicAPI,
    store: storeRef.current as TreeViewStore<any>,
    rootRef: innerRootRef,
  });

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];

  const runPlugin = (plugin: TreeViewPlugin<TreeViewAnyPluginSignature>) => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      experimentalFeatures,
      rootRef: innerRootRef,
      models,
      plugins,
      store: storeRef.current as TreeViewStore<any>,
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
  };

  plugins.forEach(runPlugin);

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ) => {
    const rootProps: UseTreeViewRootSlotProps = {
      role: 'tree',
      ...forwardedProps,
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
  };
};
