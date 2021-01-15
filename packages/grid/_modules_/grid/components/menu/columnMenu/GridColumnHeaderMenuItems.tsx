import * as React from 'react';
import { ColumnsMenuItem } from './ColumnsMenuItem';
import { FilterMenuItem } from './FilterMenuItem';
import { GridColumnHeaderMenuItemProps } from './GridColumnHeaderMenu';
import { HideColMenuItem } from './HideColMenuItem';
import { SortMenuItems } from './SortMenuItems';

export function GridColumnHeaderMenuItems({
  hideMenu,
  currentColumn,
}: GridColumnHeaderMenuItemProps) {
  return (
    <React.Fragment>
      <SortMenuItems onClick={hideMenu} column={currentColumn!} />
      <FilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideColMenuItem onClick={hideMenu} column={currentColumn!} />
      <ColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </React.Fragment>
  );
}
