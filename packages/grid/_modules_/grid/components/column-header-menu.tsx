import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import * as React from 'react';
import { COLUMN_FILTER_BUTTON_CLICK } from '../constants';
import { columnsSelector } from '../hooks/features/columns/columnsSelector';
import { GridState } from '../hooks/features/core/gridState';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { useGridState } from '../hooks/features/core/useGridState';
import { sortModelSelector } from '../hooks/features/sorting/sortingSelector';
import { SortDirection } from '../models/sortModel';
import { findHeaderElementFromField } from '../utils/domUtils';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';
import { ColumnHeaderMenuIcon } from './column-header-menu-icon';

export interface ColumnMenuState {
  open: boolean;
  field?: string;
}

const openMenuColumnSelector = (state: GridState): ColDef | null => {
  const columnMenu = state.columnMenu;
  if(columnMenu.open && columnMenu.field) {
    const cols = columnsSelector(state);
    return cols.lookup[columnMenu.field];
  }
  return null;
}

export const ColumnHeaderMenu: React.FC<{}> = () => {
    const apiRef = React.useContext(ApiContext);
    const [gridState, setGridState, forceUpdate] = useGridState(apiRef!);
    const currentColumn = openMenuColumnSelector(gridState);
    const sortModel = useGridSelector(apiRef, sortModelSelector);
    const sortDirection = React.useMemo(()=> {
      if(!currentColumn) {
        return null;
      }
      const sortItem = sortModel.find(item=> item.field === currentColumn.field);
      return sortItem?.sort;
    }, [currentColumn, sortModel])
    const [target, setTarget] = React.useState<Element | null>(null);

    const hideTimeout = React.useRef<any>();
    const hideMenu = React.useCallback(()=> {
      setGridState(state=> ({...state, columnMenu: {open: false }}));
      forceUpdate();
    },[forceUpdate, setGridState])

    const hideMenuDelayed = React.useCallback(() => {
      hideTimeout.current = setTimeout(() => hideMenu(), 50);
    }, [hideMenu]);

    const updateColumnMenu = React.useCallback(
      ({open, field }: ColumnMenuState) => {
        if(field && open) {
          setImmediate(() => clearTimeout(hideTimeout.current));

          const headerCellEl = findHeaderElementFromField(apiRef!.current!.rootElementRef!.current!, field!);
          setTarget(headerCellEl);
        }
      },
      [apiRef],
    );

    const showFilter = React.useCallback(
      () => {
        hideMenu();

        apiRef!.current.publishEvent(COLUMN_FILTER_BUTTON_CLICK, {
          element: target,
          column: currentColumn,
        });
      },
      [apiRef, currentColumn, hideMenu, target],
    );

    const handleListKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        hideMenu();
      }
    }, [hideMenu]);

  const onSortMenuItemClick = React.useCallback((event: React.MouseEvent<HTMLElement>)=> {
    hideMenu();
    const direction =  event.currentTarget.getAttribute('data-value') || null;
    apiRef?.current.sortColumn(currentColumn!, direction as SortDirection);
  }, [apiRef, currentColumn, hideMenu]);


    React.useEffect(() => {
      updateColumnMenu(gridState.columnMenu)

    }, [gridState.columnMenu, updateColumnMenu])

    return (
      <Popper open={gridState.columnMenu.open} anchorEl={target} role={undefined} transition >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={hideMenuDelayed}>
                <MenuList autoFocusItem={gridState.columnMenu.open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={onSortMenuItemClick}  disabled={sortDirection == null}>Unsort</MenuItem>
                  <MenuItem onClick={onSortMenuItemClick} data-value = {'asc'} disabled={sortDirection === 'asc'}>Sort By Asc</MenuItem>
                  <MenuItem onClick={onSortMenuItemClick} data-value = {'desc'} disabled={sortDirection === 'desc'}>Sort By Desc</MenuItem>
                
                  <MenuItem onClick={showFilter}>Filter</MenuItem>
                  <MenuItem onClick={hideMenuDelayed} disabled >Auto size</MenuItem>
                  <MenuItem onClick={hideMenuDelayed} disabled >Hide</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };
ColumnHeaderMenuIcon.displayName = 'ColumnHeaderFilterIcon';
