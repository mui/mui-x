import { MenuItem } from '@material-ui/core';
import * as React from 'react';
import { columnsSelector } from '../../../hooks/features/columns/columnsSelector';
import { GridState } from '../../../hooks/features/core/gridState';
import { useGridState } from '../../../hooks/features/core/useGridState';
import { ColDef } from '../../../models/colDef/colDef';
import { findHeaderElementFromField } from '../../../utils/domUtils';
import { ApiContext } from '../../api-context';
import { ColumnHeaderMenuIcon } from '../../column-header-menu-icon';
import { GridMenu } from '../GridMenu';
import { FilterMenuItem } from './FilterMenuItem';
import { SortMenuItems } from './SortMenuItems';

export interface ColumnMenuState {
  open: boolean;
  field?: string;
}

const openMenuColumnSelector = (state: GridState): ColDef | null => {
  const columnMenu = state.columnMenu;
  if (columnMenu.open && columnMenu.field) {
    const cols = columnsSelector(state);
    return cols.lookup[columnMenu.field];
  }
  return null;
};

export const GridColumnHeaderMenu: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef!);
  const currentColumn = openMenuColumnSelector(gridState);
  const [target, setTarget] = React.useState<Element | null>(null);

  // TODO: Fix issue with portal in V5
  const hideTimeout = React.useRef<any>();
  const hideMenu = React.useCallback(() => {
    setGridState((state) => ({ ...state, columnMenu: { open: false } }));
    forceUpdate();
  }, [forceUpdate, setGridState]);

  const hideMenuDelayed = React.useCallback(() => {
    hideTimeout.current = setTimeout(() => hideMenu(), 50);
  }, [hideMenu]);

  const updateColumnMenu = React.useCallback(
    ({ open, field }: ColumnMenuState) => {
      if (field && open) {
        setImmediate(() => clearTimeout(hideTimeout.current));

        const headerCellEl = findHeaderElementFromField(
          apiRef!.current!.rootElementRef!.current!,
          field!,
        );
        const menuIconElement = headerCellEl!.querySelector('.MuiDataGrid-menuIconButton');
        setTarget(menuIconElement);
      }
    },
    [apiRef],
  );

  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        hideMenu();
      }
    },
    [hideMenu],
  );

  React.useEffect(() => {
    updateColumnMenu(gridState.columnMenu);
  }, [gridState.columnMenu, updateColumnMenu]);

  if (!target) {
    return null;
  }
  return (
    <GridMenu
      open={gridState.columnMenu.open}
      target={target}
      onKeyDown={handleListKeyDown}
      onClickAway={hideMenuDelayed}
    >
      <SortMenuItems onClick={hideMenu} column={currentColumn!} />
      <FilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <MenuItem onClick={hideMenuDelayed} disabled>
        Auto size
      </MenuItem>
      <MenuItem onClick={hideMenuDelayed} disabled>
        Hide
      </MenuItem>
    </GridMenu>
  );
};
ColumnHeaderMenuIcon.displayName = 'ColumnHeaderMenuIcon';
