import * as React from 'react';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export function GridToolbarPivotButton() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  // @ts-ignore
  const pivotParams = rootProps.pivotParams;

  return (
    <rootProps.slots.baseButton
      size="small"
      startIcon={
        <rootProps.slots.baseBadge
          badgeContent={pivotParams.pivotMode ? 1 : 0}
          color="primary"
          variant="dot"
          {...rootProps.slotProps?.baseBadge}
        >
          <PivotTableChartIcon fontSize="small" />
        </rootProps.slots.baseBadge>
      }
      {...rootProps.slotProps?.baseButton}
      onClick={() => {
        pivotParams.onPivotSettingsOpenChange(!pivotParams.pivotSettingsOpen);
      }}
    >
      {apiRef.current.getLocaleText('toolbarPivot')}
    </rootProps.slots.baseButton>
  );
}
