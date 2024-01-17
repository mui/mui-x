import { TreeViewPlugin } from '../../models';
import { UseTreeViewIconsSignature } from './useTreeViewIcons.types';

export const useTreeViewIcons: TreeViewPlugin<UseTreeViewIconsSignature> = ({
  params,
  slots,
  slotProps,
}) => {
  return {
    contextValue: {
      icons: {
        slots: {
          collapseIcon: slots.collapseIcon,
          expandIcon: slots.expandIcon,
        },
        slotProps: {
          collapseIcon: slotProps.collapseIcon,
          expandIcon: slotProps.expandIcon,
        },
        defaultEndIcon: params.defaultEndIcon,
        defaultParentIcon: params.defaultParentIcon,
      },
    },
  };
};

useTreeViewIcons.params = {
  defaultEndIcon: true,
  defaultParentIcon: true,
};
