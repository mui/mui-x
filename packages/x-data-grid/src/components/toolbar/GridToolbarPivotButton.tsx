import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';

// TODO: use selector
const getPivotEnabled = (apiRef: any): boolean => apiRef.current.state.pivoting?.enabled;

export function GridToolbarPivotButton() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const pivotEnabled = useGridSelector(apiRef, getPivotEnabled);

  return (
    <rootProps.slots.baseButton
      size="small"
      startIcon={
        <rootProps.slots.baseBadge
          badgeContent={pivotEnabled ? 1 : 0}
          color="primary"
          variant="dot"
          {...rootProps.slotProps?.baseBadge}
        >
          <rootProps.slots.pivotIcon fontSize="small" />
        </rootProps.slots.baseBadge>
      }
      {...rootProps.slotProps?.baseButton}
      onClick={() => {
        // @ts-ignore
        apiRef.current.setPivotPanelOpen((prev) => !prev);
      }}
    >
      {apiRef.current.getLocaleText('toolbarPivot')}
    </rootProps.slots.baseButton>
  );
}
