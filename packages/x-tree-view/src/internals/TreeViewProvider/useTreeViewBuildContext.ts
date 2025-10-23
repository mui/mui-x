import * as React from 'react';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { TreeViewContextValue, TreeViewItemPluginsRunner } from '.';
import {
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewItemPluginSlotPropsEnhancers,
  TreeViewItemPluginSlotPropsEnhancerParams,
  TreeViewStore,
  TreeViewPublicAPI,
} from '../models';

export const useTreeViewBuildContext = <TStore extends TreeViewStore<any, any, any>>(
  parameters: UseTreeViewBuildContextParameters<TStore>,
): TreeViewContextValue<TStore> => {
  const { store, apiRef } = parameters;

  const publicAPI = useRefWithInit(() => store.buildPublicAPI()).current;
  initializeInputApiRef(publicAPI, apiRef);

  const runItemPlugins = React.useCallback<TreeViewItemPluginsRunner>(
    (itemPluginProps) => {
      let finalRootRef: React.RefCallback<HTMLLIElement> | null = null;
      let finalContentRef: React.RefCallback<HTMLElement> | null = null;
      const pluginPropEnhancers: TreeViewItemPluginSlotPropsEnhancers[] = [];
      const pluginPropEnhancersNames: {
        [key in keyof TreeViewItemPluginSlotPropsEnhancers]?: true;
      } = {};

      store.itemPluginManager.list().forEach((itemPlugin) => {
        const itemPluginResponse = itemPlugin({
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
        if (itemPluginResponse?.propsEnhancers) {
          pluginPropEnhancers.push(itemPluginResponse.propsEnhancers);

          // Prepare a list of all the slots which are enhanced by at least one plugin
          Object.keys(itemPluginResponse.propsEnhancers).forEach((propsEnhancerName) => {
            pluginPropEnhancersNames[
              propsEnhancerName as keyof TreeViewItemPluginSlotPropsEnhancers
            ] = true;
          });
        }
      });

      const resolvePropsEnhancer =
        (currentSlotName: keyof TreeViewItemPluginSlotPropsEnhancers) =>
        (currentSlotParams: TreeViewItemPluginSlotPropsEnhancerParams) => {
          const enhancedProps = {};
          pluginPropEnhancers.forEach((propsEnhancersForCurrentPlugin) => {
            const propsEnhancerForCurrentPluginAndSlot =
              propsEnhancersForCurrentPlugin[currentSlotName];
            if (propsEnhancerForCurrentPluginAndSlot != null) {
              Object.assign(enhancedProps, propsEnhancerForCurrentPluginAndSlot(currentSlotParams));
            }
          });

          return enhancedProps;
        };

      const propsEnhancers = Object.fromEntries(
        Object.keys(pluginPropEnhancersNames).map(
          (propEnhancerName) =>
            [
              propEnhancerName,
              resolvePropsEnhancer(propEnhancerName as keyof TreeViewItemPluginSlotPropsEnhancers),
            ] as const,
        ),
      );

      return {
        contentRef: finalContentRef,
        rootRef: finalRootRef,
        propsEnhancers,
      };
    },
    [store],
  );

  const wrapItem = React.useCallback<TreeItemWrapper<TSignatures>>(
    ({ itemId, children, idAttribute }) => {
      let finalChildren: React.ReactNode = children;
      // The wrappers are reversed to ensure that the first wrapper is the outermost one.
      for (let i = plugins.length - 1; i >= 0; i -= 1) {
        const plugin = plugins[i];
        if (plugin.wrapItem) {
          finalChildren = plugin.wrapItem({
            instance,
            itemId,
            children: finalChildren,
            idAttribute,
          });
        }
      }

      return finalChildren;
    },
    [plugins, instance],
  );

  const wrapRoot = React.useCallback<TreeRootWrapper>(
    ({ children }) => {
      let finalChildren: React.ReactNode = children;
      // The wrappers are reversed to ensure that the first wrapper is the outermost one.
      for (let i = plugins.length - 1; i >= 0; i -= 1) {
        const plugin = plugins[i];
        if (plugin.wrapRoot) {
          finalChildren = plugin.wrapRoot({
            children: finalChildren,
          });
        }
      }

      return finalChildren;
    },
    [plugins],
  );

  return React.useMemo(
    () => ({
      runItemPlugins,
      wrapItem,
      wrapRoot,
      instance,
      publicAPI,
      store,
      rootRef,
    }),
    [runItemPlugins, wrapItem, wrapRoot, instance, publicAPI, store, rootRef],
  );
};

function initializeInputApiRef<TStore extends TreeViewStore<any, any, any>>(
  publicAPI: TreeViewPublicAPI<TStore>,
  apiRef: React.RefObject<TreeViewPublicAPI<TStore> | undefined> | undefined,
) {
  if (apiRef != null && apiRef.current == null) {
    apiRef.current = publicAPI;
  }
}

export interface UseTreeViewBuildContextParameters<TStore extends TreeViewStore<any, any, any>> {
  store: TStore;
  rootRef: React.RefObject<HTMLUListElement | null>;
  apiRef: React.RefObject<TreeViewPublicAPI<TStore> | undefined> | undefined;
}

export interface UseTreeViewBuildContextReturnValue<TStore extends TreeViewStore<any, any, any>> {
  publicAPI: TreeViewPublicAPI<TStore>;
  // TODO: Use ReadonlyStore
  store: TStore;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TSignatures>;
  wrapRoot: TreeRootWrapper;
  runItemPlugins: TreeViewItemPluginsRunner;
}
