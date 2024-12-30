import * as React from 'react';
import { TreeViewContextValue, TreeViewItemPluginsRunner } from '../TreeViewProvider';
import {
  ConvertSignaturesIntoPlugins,
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPublicAPI,
  TreeViewItemPluginSlotPropsEnhancers,
  TreeViewItemPluginSlotPropsEnhancerParams,
} from '../models';
import { TreeViewCorePluginSignatures } from '../corePlugins';
import { TreeViewStore } from '../utils/TreeViewStore';

export const useTreeViewBuildContext = <TSignatures extends readonly TreeViewAnyPluginSignature[]>({
  plugins,
  instance,
  publicAPI,
  store,
  rootRef,
}: {
  plugins: ConvertSignaturesIntoPlugins<readonly [...TreeViewCorePluginSignatures, ...TSignatures]>;
  instance: TreeViewInstance<TSignatures>;
  publicAPI: TreeViewPublicAPI<TSignatures>;
  store: TreeViewStore<TSignatures>;
  rootRef: React.RefObject<HTMLUListElement | null>;
}): TreeViewContextValue<TSignatures> => {
  const runItemPlugins = React.useCallback<TreeViewItemPluginsRunner>(
    (itemPluginProps) => {
      let finalRootRef: React.RefCallback<HTMLLIElement> | null = null;
      let finalContentRef: React.RefCallback<HTMLElement> | null = null;
      const pluginPropEnhancers: TreeViewItemPluginSlotPropsEnhancers[] = [];
      const pluginPropEnhancersNames: {
        [key in keyof TreeViewItemPluginSlotPropsEnhancers]?: true;
      } = {};

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
    [plugins],
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

  return React.useMemo(() => {
    return {
      runItemPlugins,
      wrapItem,
      wrapRoot,
      instance,
      publicAPI,
      store,
      rootRef,
    } as TreeViewContextValue<TSignatures>;
  }, [runItemPlugins, wrapItem, wrapRoot, instance, publicAPI, store, rootRef]);
};
