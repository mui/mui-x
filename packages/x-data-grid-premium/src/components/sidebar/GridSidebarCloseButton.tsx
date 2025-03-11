import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarCloseButton(props: GridSlotProps['baseIconButton']) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <rootProps.slots.baseIconButton
      {...props}
      onClick={() => apiRef.current.setPivotPanelOpen(false)}
    >
      {/* Replace with a new slots.closeButtonIcon or similar */}
      <rootProps.slots.filterPanelDeleteIcon fontSize="small" />
    </rootProps.slots.baseIconButton>
  );
}
