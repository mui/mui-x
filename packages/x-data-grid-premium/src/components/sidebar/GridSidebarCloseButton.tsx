import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarCloseButton(props: GridSlotProps['baseIconButton']) {
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
