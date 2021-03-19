import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';
import { classnames } from '../../../utils/classnames';
import { useStrippedProps } from '../../../hooks/utils/useStrippedProps';

export interface GridColumnMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  hideMenu: () => void;
  currentColumn: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
}

export const GridColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenu(props: GridColumnMenuProps, ref) {
    const { hideMenu, currentColumn, open, id, labelledby, className, ...other } = props;
    const strippedProps = useStrippedProps(other);
    const handleListKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
          event.preventDefault();
        }
        if (event.key === 'Tab' || event.key === 'Escape') {
          hideMenu();
        }
      },
      [hideMenu],
    );
    return (
      <MenuList
        id={id}
        ref={ref}
        className={classnames('MuiDataGrid-gridMenuList', className)}
        aria-labelledby={labelledby}
        onKeyDown={handleListKeyDown}
        autoFocus={open}
        {...strippedProps}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
        <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
        <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
      </MenuList>
    );
  },
);
