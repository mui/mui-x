import { TreeViewInstance, TreeViewPlugin } from '../../models';
import { UseTreeViewContextValueBuilderSignature } from './useTreeViewContextValueBuilder.types';

export const useTreeViewContextValueBuilder: TreeViewPlugin<
  UseTreeViewContextValueBuilderSignature
> = ({ instance, params }) => {
  return {
    contextValue: {
      instance: instance as TreeViewInstance<any>,
      multiSelect: params.multiSelect,
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
