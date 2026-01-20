import * as React from 'react';
import { GridColumnMenuItemProps, useGridSelector } from '@mui/x-data-grid-pro';
import { gridChartsPanelOpenSelector } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

export function GridColumnMenuChartsItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const { slots, experimentalFeatures, chartsIntegration } = useGridRootProps();
  const apiRef = useGridApiContext();
  const isChartsPanelOpen = useGridSelector(apiRef, gridChartsPanelOpenSelector);

  const openChartsSettings = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.setChartsPanelOpen(true);
  };

  if (!experimentalFeatures?.charts || !chartsIntegration) {
    return null;
  }

  return (
    <slots.baseMenuItem
      onClick={openChartsSettings}
      iconStart={<slots.chartsIcon fontSize="small" />}
      disabled={isChartsPanelOpen}
    >
      {apiRef.current.getLocaleText('columnMenuManageCharts')}
    </slots.baseMenuItem>
  );
}
