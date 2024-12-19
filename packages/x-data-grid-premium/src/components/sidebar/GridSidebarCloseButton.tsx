import * as React from 'react';
import { useGridRootProps } from '@mui/x-data-grid';
import { IconButtonProps } from '@mui/material/IconButton';

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarCloseButton(props: IconButtonProps) {
  const rootProps = useGridRootProps();
  const { slots } = rootProps;

  return (
    <slots.baseIconButton
      size="small"
      {...props}
      onClick={() => rootProps.pivotParams?.onPivotSettingsOpenChange(false)}
    >
      {/* Replace with a new slots.closeButtonIcon or similar */}
      <slots.filterPanelDeleteIcon fontSize="small" />
    </slots.baseIconButton>
  );
}
