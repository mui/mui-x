import MenuList from '@material-ui/core/MenuList';
import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

export interface GridColumnMenuProps {
  hideMenu: () => void;
  currentColumn: GridColDef;
}

export function GridColumnMenu(props: GridColumnMenuProps) {
  const { hideMenu, currentColumn } = props;
  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        hideMenu();
      }
    },
    [hideMenu],
  );
  return (
    <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </MenuList>
  );
}
