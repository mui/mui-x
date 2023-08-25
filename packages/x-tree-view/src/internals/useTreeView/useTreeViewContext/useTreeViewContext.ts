import useId from '@mui/utils/useId';
import { TreeViewPlugin } from '../../../models';
import { UseTreeViewContextDefaultizedProps } from './useTreeViewContext.types';
import type { UseTreeViewSelectionDefaultizedProps } from '../useTreeViewSelection';
import type { UseTreeViewNodesDefaultizedProps } from '../useTreeViewNodes';

export const useTreeViewContext: TreeViewPlugin<
  UseTreeViewContextDefaultizedProps &
    UseTreeViewSelectionDefaultizedProps<any> &
    UseTreeViewNodesDefaultizedProps
> = ({ instance, props }) => {
  const treeId = useId(props.id);

  return {
    getRootProps: () => ({
      id: treeId,
    }),
    contextValue: {
      treeId,
      instance,
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
