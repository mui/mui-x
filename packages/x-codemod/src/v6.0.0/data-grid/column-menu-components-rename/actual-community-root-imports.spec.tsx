import * as React from 'react';
import {
  GridFilterMenuItem,
  HideGridColMenuItem,
  GridColumnsMenuItem,
  SortGridMenuItems,
  GridFilterItemProps,
} from '@mui/x-data-grid';

// prettier-ignore
function App({ column, hideMenu }: GridFilterItemProps) {
  return (
    <React.Fragment>
      <GridFilterMenuItem column={column} onClick={hideMenu} />
      <HideGridColMenuItem column={column} onClick={hideMenu} />
      <GridColumnsMenuItem column={column} onClick={hideMenu} />
      <SortGridMenuItems column={column} onClick={hideMenu} />
    </React.Fragment>
  );
}
