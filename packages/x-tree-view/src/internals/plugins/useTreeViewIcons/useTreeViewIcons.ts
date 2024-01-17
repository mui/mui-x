import { TreeViewPlugin } from '../../models';
import { UseTreeViewIconsSignature } from './useTreeViewIcons.types';

export const useTreeViewIcons: TreeViewPlugin<UseTreeViewIconsSignature> = ({
  slots,
  slotProps,
}) => {
  return {
    contextValue: {
      icons: {
        slots: {
          collapseIcon: slots.collapseIcon,
          expandIcon: slots.expandIcon,
          endIcon: slots.endIcon,
          parentIcon: slots.parentIcon,
        },
        slotProps: {
          collapseIcon: slotProps.collapseIcon,
          expandIcon: slotProps.expandIcon,
          endIcon: slotProps.endIcon,
          parentIcon: slotProps.parentIcon,
        },
      },
    },
  };
};

useTreeViewIcons.params = {};
