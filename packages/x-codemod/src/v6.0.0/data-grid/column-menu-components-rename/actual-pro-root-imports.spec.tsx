import * as React from 'react';
import {
  GridFilterMenuItem,
  HideGridColMenuItem,
  GridColumnsMenuItem,
  SortGridMenuItems,
  GridColumnPinningMenuItems,
  GridFilterItemProps,
} from '@mui/x-data-grid-pro';

// prettier-ignore
function App({ column, hideMenu }: GridFilterItemProps) {
  return (
    <React.Fragment>
      <GridFilterMenuItem column={column} onClick={hideMenu} />
      <HideGridColMenuItem column={column} onClick={hideMenu} />
      <GridColumnsMenuItem column={column} onClick={hideMenu} />
      <SortGridMenuItems column={column} onClick={hideMenu} />
      <GridColumnPinningMenuItems column={column} onClick={hideMenu} />
    </React.Fragment>
  );
}
