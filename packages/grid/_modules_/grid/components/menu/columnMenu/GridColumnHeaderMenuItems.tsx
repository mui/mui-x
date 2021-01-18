import MenuList from '@material-ui/core/MenuList';
import * as React from 'react';
import { ColDef } from '../../../models/colDef/colDef';
import { ColumnsMenuItem } from './ColumnsMenuItem';
import { FilterMenuItem } from './FilterMenuItem';
import { HideColMenuItem } from './HideColMenuItem';
import { SortMenuItems } from './SortMenuItems';

export interface GridColumnHeaderMenuItemProps {
  hideMenu: () => void;
  currentColumn: ColDef;
  open: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
}

export function GridColumnHeaderMenuItems({
  hideMenu,
  currentColumn,
  open,
  onKeyDown
}: GridColumnHeaderMenuItemProps) {
  const menuListRef = React.useRef<HTMLUListElement | null>(null);
  const focusTimeout = React.useRef<any>();

  React.useEffect(() => {
    focusTimeout.current = setTimeout(() => {
      if (open && menuListRef.current) {
        const firstItem = menuListRef.current.querySelector('li:first-child');
        if (firstItem) {
          (firstItem as HTMLLIElement).focus();
        } else {
          menuListRef.current.focus();
        }
      }
    }, 10);
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(focusTimeout.current);
    };
  }, []);

    return (
    <MenuList ref={menuListRef} id="menu-list-grow" onKeyDown={onKeyDown}>
      <SortMenuItems onClick={hideMenu} column={currentColumn!} />
      <FilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideColMenuItem onClick={hideMenu} column={currentColumn!} />
      <ColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </MenuList>
  );
}
