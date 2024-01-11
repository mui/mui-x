import { TreeViewInstance, TreeViewPlugin } from '../../models';
import { UseTreeViewContextValueBuilderSignature } from './useTreeViewContextValueBuilder.types';

export const useTreeViewContextValueBuilder: TreeViewPlugin<
  UseTreeViewContextValueBuilderSignature
> = ({ instance, params }) => {
  return {
    contextValue: {
      instance: instance as TreeViewInstance<any>,
      multiSelect: params.multiSelect,
      runItemPlugins: ({ props, ref }) => ({ props, ref, wrapItem: (children) => children }),
      disabledItemsFocusable: params.disabledItemsFocusable,
      icons: {
        defaultCollapseIcon: params.defaultCollapseIcon,
        defaultEndIcon: params.defaultEndIcon,
        defaultExpandIcon: params.defaultExpandIcon,
        defaultParentIcon: params.defaultParentIcon,
      },
    },
  };
};

useTreeViewContextValueBuilder.params = {
  defaultCollapseIcon: true,
  defaultEndIcon: true,
  defaultExpandIcon: true,
  defaultParentIcon: true,
};
