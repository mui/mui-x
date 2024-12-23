import * as React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarCloseButton(props: IconButtonProps) {
  const rootProps = useGridRootProps();
  const { slots, pivotParams } = rootProps;

  return (
    <slots.baseIconButton
      size="small"
      {...props}
      onClick={() => pivotParams?.onPivotSettingsOpenChange(false)}
    >
      {/* Replace with a new slots.closeButtonIcon or similar */}
      <slots.filterPanelDeleteIcon fontSize="small" />
    </slots.baseIconButton>
  );
}
