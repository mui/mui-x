import * as React from 'react';
// @ts-ignore TODO: remove once the module is fixed
import { unstable_useId as useId } from '@material-ui/core/utils';
import MenuList from '@material-ui/core/MenuList';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

export interface GridColumnMenuProps {
  hideMenu: () => void;
  currentColumn: GridColDef;
  open: boolean;
}

export function GridColumnMenu(props: GridColumnMenuProps) {
  const { hideMenu, currentColumn, open } = props;
  const columnMenuButtonId = useId('column-menu-button');
  const columnMenuId = useId('column-menu');
  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Escape') {
        hideMenu();
      }
    },
    [hideMenu],
  );
  return (
    <MenuList
      id={columnMenuId}
      className="MuiDataGrid-gridMenuList"
      aria-labelledby={columnMenuButtonId}
      onKeyDown={handleListKeyDown}
      autoFocus={open}
    >
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </MenuList>
  );
}
