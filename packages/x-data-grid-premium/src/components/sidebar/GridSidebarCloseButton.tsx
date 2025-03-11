import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

function GridSidebarCloseButton(props: GridSlotProps['baseIconButton']) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <rootProps.slots.baseIconButton
      {...props}
      onClick={() => apiRef.current.setPivotPanelOpen(false)}
    >
      {/* TODO: Replace with a new slots.closeButtonIcon or similar */}
      <rootProps.slots.filterPanelDeleteIcon fontSize="small" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridSidebarCloseButton };
