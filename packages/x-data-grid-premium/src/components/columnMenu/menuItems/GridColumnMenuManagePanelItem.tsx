import * as React from 'react';
import { GridColumnMenuItemProps } from '@mui/x-data-grid-pro';
import { GridColumnMenuPivotItem } from './GridColumnMenuPivotItem';
import { GridColumnMenuChartsItem } from './GridColumnMenuChartsItem';

function GridColumnMenuManagePanelItem(props: GridColumnMenuItemProps) {
  return (
    <React.Fragment>
      <GridColumnMenuPivotItem {...props} />
      <GridColumnMenuChartsItem {...props} />
    </React.Fragment>
  );
}

export { GridColumnMenuManagePanelItem };
