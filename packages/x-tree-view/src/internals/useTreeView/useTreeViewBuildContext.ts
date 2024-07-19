import * as React from 'react';
import { TreeViewContextValue, TreeViewItemPluginsRunner } from '../TreeViewProvider';
import {
  ConvertSignaturesIntoPlugins,
  TreeItemWrapper,
  TreeRootWrapper,
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewPublicAPI,
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
