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
        },
        slotProps: {
          collapseIcon: slotProps.collapseIcon,
          expandIcon: slotProps.expandIcon,
          endIcon: slotProps.endIcon,
        },
      },
    },
  };
};

useTreeViewIcons.params = {};
