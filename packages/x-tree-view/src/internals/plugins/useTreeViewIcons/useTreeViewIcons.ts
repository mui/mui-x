import { TreeViewPlugin } from '../../models';
import { UseTreeViewIconsSignature } from './useTreeViewIcons.types';

export const useTreeViewIcons: TreeViewPlugin<UseTreeViewIconsSignature> = ({ params }) => {
  return {
    contextValue: {
      icons: {
        defaultCollapseIcon: params.defaultCollapseIcon,
        defaultEndIcon: params.defaultEndIcon,
        defaultExpandIcon: params.defaultExpandIcon,
        defaultParentIcon: params.defaultParentIcon,
      },
    },
  };
};

useTreeViewIcons.params = {
  defaultCollapseIcon: true,
  defaultEndIcon: true,
  defaultExpandIcon: true,
  defaultParentIcon: true,
};
