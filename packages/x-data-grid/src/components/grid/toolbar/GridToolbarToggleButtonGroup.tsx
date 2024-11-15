import * as React from 'react';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export type GridToolbarToggleButtonGroupProps = ToggleButtonGroupProps;

function GridToolbarToggleButtonGroup(props: GridToolbarToggleButtonGroupProps) {
  const rootProps = useGridRootProps();
  const { children, ...other } = props;

  return (
    <rootProps.slots.baseToggleButtonGroup color="primary" size="small" {...other}>
      {children}
    </rootProps.slots.baseToggleButtonGroup>
  );
}

export { GridToolbarToggleButtonGroup };
