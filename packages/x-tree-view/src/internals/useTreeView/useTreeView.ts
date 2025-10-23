import * as React from 'react';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { Store } from '@mui/x-internals/store';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  MinimalTreeViewPublicAPI,
  ConvertSignaturesIntoPlugins,
  TreeViewState,
} from '../models';
import {
  UseTreeViewBaseProps,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
} from './useTreeView.types';
import { TREE_VIEW_CORE_PLUGINS, TreeViewCorePluginSignatures } from '../corePlugins';
import { useExtractPluginParamsFromProps } from './useExtractPluginParamsFromProps';
import { useTreeViewBuildContext } from '../TreeViewProvider/useTreeViewBuildContext';

function initializeInputApiRef<T>(inputApiRef: React.RefObject<Partial<T> | undefined>) {
  if (inputApiRef.current == null) {
    inputApiRef.current = {} as T;
  }
  return inputApiRef as React.RefObject<T>;
}

export function useTreeViewApiInitialization<T>(
  inputApiRef: React.RefObject<Partial<T> | undefined> | undefined,
): React.RefObject<T> {
  const fallbackPublicApiRef = React.useRef({}) as React.RefObject<T>;

  if (inputApiRef) {
    return initializeInputApiRef(inputApiRef);
  }

  return fallbackPublicApiRef;
}

/**
 * This is the main hook that sets the plugin system up for the tree-view.
 *
 * It manages the data used to create the tree-view.
 *
 * @param plugins All the plugins that will be used in the tree-view.
 * @param props The props passed to the tree-view.
 * @param rootRef The ref of the root element.
 */
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

  const { pluginParams, forwardedProps, apiRef } = useExtractPluginParamsFromProps<
    TSignatures,
    typeof props
  >({
    plugins,
    props,
  });

  const instance = useRefWithInit(() => ({}) as TreeViewInstance<TSignatures>).current;
  const publicAPI = useTreeViewApiInitialization<MinimalTreeViewPublicAPI<TSignatures>>(apiRef);
  const innerRootRef = React.useRef<HTMLUListElement>(null);
  const handleRootRef = useMergedRefs(innerRootRef, rootRef);

  const store = useRefWithInit(() => {
    const initialState = {} as TreeViewState<TSignaturesWithCorePluginSignatures>;
    for (const plugin of plugins) {
      if (plugin.getInitialState) {
        Object.assign(initialState, plugin.getInitialState(pluginParams));
      }
    }
    return new Store<TreeViewState<TSignaturesWithCorePluginSignatures>>(initialState);
  }).current;

  const contextValue = useTreeViewBuildContext<TSignatures>({
    plugins,
    instance,
    publicAPI: publicAPI.current,
    store,
    rootRef: innerRootRef,
  });

  return {
    rootRef: handleRootRef,
    contextValue,
  };
};
