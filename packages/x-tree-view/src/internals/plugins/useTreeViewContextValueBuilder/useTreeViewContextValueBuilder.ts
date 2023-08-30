import useId from '@mui/utils/useId';
import { TreeViewInstance, TreeViewPlugin } from '../../models';
import { UseTreeViewContextValueBuilderSignature } from './useTreeViewContextValueBuilder.types';

export const useTreeViewContextValueBuilder: TreeViewPlugin<
  UseTreeViewContextValueBuilderSignature
> = ({ instance, props }) => {
  const treeId = useId(props.id);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: {
      treeId,
      instance: instance as TreeViewInstance<any>,
      multiSelect: props.multiSelect,
      disabledItemsFocusable: props.disabledItemsFocusable,
      icons: {
        defaultCollapseIcon: props.defaultCollapseIcon,
        defaultEndIcon: props.defaultEndIcon,
        defaultExpandIcon: props.defaultExpandIcon,
        defaultParentIcon: props.defaultParentIcon,
      },
    },
  };
};
