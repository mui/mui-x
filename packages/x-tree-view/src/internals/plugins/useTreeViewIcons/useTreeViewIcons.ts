import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewIconsSignature } from './useTreeViewIcons.types';

export const useTreeViewIcons: TreeViewPlugin<UseTreeViewIconsSignature> = ({
  slots,
  slotProps,
}) => {
  const pluginContextValue = React.useMemo(
    () => ({
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
    }),
    [
      slots.collapseIcon,
      slots.expandIcon,
      slots.endIcon,
      slotProps.collapseIcon,
      slotProps.expandIcon,
      slotProps.endIcon,
    ],
  );

  return {
    contextValue: pluginContextValue,
  };
};

useTreeViewIcons.params = {};
