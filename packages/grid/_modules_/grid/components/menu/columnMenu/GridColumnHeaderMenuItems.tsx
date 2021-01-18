import MenuList from '@material-ui/core/MenuList';
import * as React from 'react';
import { ColDef } from '../../../models/colDef/colDef';
import { ColumnsMenuItem } from './ColumnsMenuItem';
import { FilterMenuItem } from './FilterMenuItem';
import { HideColMenuItem } from './HideColMenuItem';
import { SortMenuItems } from './SortMenuItems';

export interface GridColumnHeaderMenuItemsProps {
  hideMenu: () => void;
  currentColumn: ColDef;
}

export function GridColumnHeaderMenuItems(props: GridColumnHeaderMenuItemsProps) {
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
      <SortMenuItems onClick={hideMenu} column={currentColumn!} />
      <FilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideColMenuItem onClick={hideMenu} column={currentColumn!} />
      <ColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </MenuList>
  );
}
