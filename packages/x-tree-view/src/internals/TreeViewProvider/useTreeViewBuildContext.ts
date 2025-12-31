import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import {
  TreeViewContextValue,
  TreeViewItemPluginsRunner,
  TreeViewStoreInContext,
} from './TreeViewProvider.types';
import {
  TreeViewItemPluginSlotPropsEnhancers,
  TreeViewItemPluginSlotPropsEnhancerParams,
  TreeViewAnyStore,
  TreeViewPublicAPI,
  TreeItemWrapper,
  TreeViewItemPlugin,
} from '../models';

export const useTreeViewBuildContext = <TStore extends TreeViewAnyStore>(
  parameters: UseTreeViewBuildContextParameters<TStore>,
): TreeViewContextValue<TStore> => {
  const { store, apiRef, rootRef } = parameters;

  const publicAPI = useRefWithInit(() => store.buildPublicAPI())
    .current as TreeViewPublicAPI<TStore>;
  initializeInputApiRef(publicAPI, apiRef);

  const runItemPlugins = React.useCallback<TreeViewItemPluginsRunner>(
    (itemPluginProps) => {
      let finalRootRef: React.RefCallback<HTMLLIElement> | null = null;
      let finalContentRef: React.RefCallback<HTMLElement> | null = null;
      const pluginPropEnhancers: TreeViewItemPluginSlotPropsEnhancers[] = [];
      const pluginPropEnhancersNames: {
        [key in keyof TreeViewItemPluginSlotPropsEnhancers]?: true;
      } = {};

      store.itemPluginManager.listPlugins().forEach((itemPlugin: TreeViewItemPlugin) => {
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

  const wrapItem = React.useCallback<TreeItemWrapper<TStore>>(
    ({ itemId, children, idAttribute }) => {
      let finalChildren: React.ReactNode = children;
      const itemsWrapper = store.itemPluginManager.listWrappers();

      // The wrappers are reversed to ensure that the first wrapper is the outermost one.
      for (let i = itemsWrapper.length - 1; i >= 0; i -= 1) {
        const itemWrapper = itemsWrapper[i];
        finalChildren = itemWrapper({
          store: store as any,
          itemId,
          children: finalChildren,
          idAttribute,
        });
      }

      return finalChildren;
    },
    [store],
  );

  return React.useMemo(
    () => ({
      runItemPlugins,
      wrapItem,
      publicAPI,
      store,
      rootRef,
    }),
    [runItemPlugins, wrapItem, publicAPI, store, rootRef],
  );
};

function initializeInputApiRef<TStore extends TreeViewAnyStore>(
  publicAPI: TreeViewPublicAPI<TStore>,
  apiRef: React.RefObject<Partial<TreeViewPublicAPI<TStore>> | undefined> | undefined,
) {
  if (apiRef != null && apiRef.current == null) {
    apiRef.current = publicAPI;
  }
}

export interface UseTreeViewBuildContextParameters<TStore extends TreeViewAnyStore> {
  store: TStore;
  rootRef: React.RefObject<HTMLUListElement | null>;
  apiRef: React.RefObject<Partial<TreeViewPublicAPI<TStore>> | undefined> | undefined;
}

export interface UseTreeViewBuildContextReturnValue<TStore extends TreeViewAnyStore> {
  publicAPI: TreeViewPublicAPI<TStore>;
  store: TreeViewStoreInContext<TStore>;
  rootRef: React.RefObject<HTMLUListElement | null>;
  wrapItem: TreeItemWrapper<TStore>;
  runItemPlugins: TreeViewItemPluginsRunner;
}
