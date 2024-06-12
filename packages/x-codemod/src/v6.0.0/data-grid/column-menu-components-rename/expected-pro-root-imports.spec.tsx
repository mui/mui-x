import * as React from 'react';
import {
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
  GridColumnMenuColumnsItem,
  GridColumnMenuSortItem,
  GridColumnMenuPinningItem,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';

// prettier-ignore
function App({ column, hideMenu }: GridColumnMenuItemProps) {
  return (
    (<React.Fragment>
      <GridColumnMenuFilterItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuHideItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuColumnsItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuPinningItem colDef={column} onClick={hideMenu} />
    </React.Fragment>)
  );
}
