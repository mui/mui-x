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

export const useTreeViewBuildContext = <TSignatures extends readonly TreeViewAnyPluginSignature[]>({
  plugins,
  instance,
  publicAPI,
  rootRef,
}: {
  plugins: ConvertSignaturesIntoPlugins<readonly [...TreeViewCorePluginSignatures, ...TSignatures]>;
  instance: TreeViewInstance<TSignatures>;
  publicAPI: TreeViewPublicAPI<TSignatures>;
  rootRef: React.RefObject<HTMLUListElement>;
}): TreeViewContextValue<TSignatures> => {
  const runItemPlugins: TreeViewItemPluginsRunner = (itemPluginProps) => {
    let finalRootRef: React.RefCallback<HTMLLIElement> | null = null;
    let finalContentRef: React.RefCallback<HTMLElement> | null = null;
    const pluginPropEnhancers: TreeViewItemPluginSlotPropsEnhancers[] = [];
    const pluginPropEnhancersNames: { [key in keyof TreeViewItemPluginSlotPropsEnhancers]?: true } =
      {};

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
  };

  const wrapItem: TreeItemWrapper<TSignatures> = ({ itemId, children }) => {
    let finalChildren: React.ReactNode = children;
    // The wrappers are reversed to ensure that the first wrapper is the outermost one.
    for (let i = plugins.length - 1; i >= 0; i -= 1) {
      const plugin = plugins[i];
      if (plugin.wrapItem) {
        finalChildren = plugin.wrapItem({ itemId, children: finalChildren, instance });
      }
    }

    return finalChildren;
  };

  const wrapRoot: TreeRootWrapper<TSignatures> = ({ children }) => {
    let finalChildren: React.ReactNode = children;
    // The wrappers are reversed to ensure that the first wrapper is the outermost one.
    for (let i = plugins.length - 1; i >= 0; i -= 1) {
      const plugin = plugins[i];
      if (plugin.wrapRoot) {
        finalChildren = plugin.wrapRoot({ children: finalChildren, instance });
      }
    }

    return finalChildren;
  };

  return {
    runItemPlugins,
    wrapItem,
    wrapRoot,
    instance,
    rootRef,
    publicAPI,
  } as TreeViewContextValue<TSignatures>;
};
