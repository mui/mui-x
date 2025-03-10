import * as React from 'react';
import { GridColumnMenuItemProps } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

export function GridColumnMenuPivotItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const openPivotSettings = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.setPivotPanelOpen(true);
  };

  return (
    <rootProps.slots.baseMenuItem
      onClick={openPivotSettings}
      iconStart={<rootProps.slots.pivotIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('pivotSettings')}
    </rootProps.slots.baseMenuItem>
  );
}
