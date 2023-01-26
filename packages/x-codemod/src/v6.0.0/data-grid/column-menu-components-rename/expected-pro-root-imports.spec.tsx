import * as React from 'react';
import {
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
  GridColumnMenuColumnsItem,
  GridColumnMenuSortItem,
  GridColumnMenuPinningItem,
} from '@mui/x-data-grid-pro';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <GridColumnMenuFilterItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuHideItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuColumnsItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
      <GridColumnMenuPinningItem colDef={column} onClick={hideMenu} />
    </React.Fragment>
  );
}
