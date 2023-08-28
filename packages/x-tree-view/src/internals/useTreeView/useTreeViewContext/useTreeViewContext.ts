import useId from '@mui/utils/useId';
import { TreeViewPlugin } from '../../../models';
import { UseTreeViewContextDefaultizedParameters } from './useTreeViewContext.types';
import type { UseTreeViewSelectionDefaultizedParameters } from '../useTreeViewSelection';
import type { UseTreeViewNodesDefaultizedParameters } from '../useTreeViewNodes';

export const useTreeViewContext: TreeViewPlugin<
  UseTreeViewContextDefaultizedParameters &
    UseTreeViewSelectionDefaultizedParameters<any> &
    UseTreeViewNodesDefaultizedParameters
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
