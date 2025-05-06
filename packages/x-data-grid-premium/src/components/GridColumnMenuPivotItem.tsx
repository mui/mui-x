import * as React from 'react';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import { gridPivotPanelOpenSelector } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

export function GridColumnMenuPivotItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const isPivotPanelOpen = useGridSelector(apiRef, gridPivotPanelOpenSelector);

  const openPivotSettings = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.setPivotPanelOpen(true);
  };

  return (
    <rootProps.slots.baseMenuItem
      onClick={openPivotSettings}
      iconStart={<rootProps.slots.pivotIcon fontSize="small" />}
      disabled={isPivotPanelOpen}
    >
      {apiRef.current.getLocaleText('columnMenuManagePivot')}
    </rootProps.slots.baseMenuItem>
  );
}
