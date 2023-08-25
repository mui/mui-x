import useId from '@mui/utils/useId';
import { TreeViewPlugin } from '../../../models';
import { UseTreeViewContextDefaultizedProps } from './useTreeViewContext.types';
import type { UseTreeViewSelectionDefaultizedProps } from '../useTreeViewSelection';
import type { UseTreeViewNodesDefaultizedProps } from '../useTreeViewNodes';

function noopSelection() {
  return false;
}

export const useTreeViewContext: TreeViewPlugin<
  UseTreeViewContextDefaultizedProps &
    UseTreeViewSelectionDefaultizedProps<any> &
    UseTreeViewNodesDefaultizedProps
> = ({ instance, props }) => {
  const treeId = useId(props.id);

  return {
    getRootProps: () => ({
      id: props.id,
    }),
    contextValue: {
      treeId,
      focus: instance.focusNode,
      toggleExpansion: instance.toggleNodeExpansion,
      isExpanded: instance.isNodeExpanded,
      isExpandable: instance.isNodeExpandable,
      isFocused: instance.isNodeFocused,
      isSelected: instance.isNodeSelected,
      isDisabled: instance.isNodeDisabled,
      selectNode: props.disableSelection ? noopSelection : instance.selectNode,
      selectRange: props.disableSelection ? noopSelection : instance.selectRange,
      multiSelect: props.multiSelect,
      disabledItemsFocusable: props.disabledItemsFocusable,
      mapFirstChar: instance.mapFirstChar,
      unMapFirstChar: instance.unMapFirstChar,
      registerNode: instance.registerNode,
      unregisterNode: instance.unregisterNode,
      icons: {
        defaultCollapseIcon: props.defaultCollapseIcon,
        defaultEndIcon: props.defaultEndIcon,
        defaultExpandIcon: props.defaultExpandIcon,
        defaultParentIcon: props.defaultParentIcon,
      },
    },
  };
};
