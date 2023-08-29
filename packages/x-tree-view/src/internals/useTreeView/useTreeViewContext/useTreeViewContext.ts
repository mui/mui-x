import useId from '@mui/utils/useId';
import { TreeViewInstance, TreeViewPlugin } from '../../../models';
import { UseTreeViewContextSignature } from './useTreeViewContext.types';
import type { DefaultPlugins } from '../useTreeView';

export const useTreeViewContext: TreeViewPlugin<UseTreeViewContextSignature> = ({
  instance,
  props,
}) => {
  const treeId = useId(props.id);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: {
      treeId,
      instance: instance as TreeViewInstance<DefaultPlugins>,
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
