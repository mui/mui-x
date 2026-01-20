import * as React from 'react';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import { gridPivotPanelOpenSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridSidebarValue } from '../../../hooks/features/sidebar';

export function GridColumnMenuPivotItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const { slots, disablePivoting } = useGridRootProps();
  const apiRef = useGridApiContext();
  const isPivotPanelOpen = useGridSelector(apiRef, gridPivotPanelOpenSelector);

  const openPivotSettings = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.showSidebar(GridSidebarValue.Pivot);
  };

  if (disablePivoting) {
    return null;
  }

  return (
    <slots.baseMenuItem
      onClick={openPivotSettings}
      iconStart={<slots.pivotIcon fontSize="small" />}
      disabled={isPivotPanelOpen}
    >
      {apiRef.current.getLocaleText('columnMenuManagePivot')}
    </slots.baseMenuItem>
  );
}
