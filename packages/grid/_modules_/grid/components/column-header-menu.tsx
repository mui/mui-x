import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import * as React from 'react';
import { COLUMN_FILTER_BUTTON_CLICK, COLUMN_MENU_BUTTON_CLICK } from '../constants';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';
import { ColumnHeaderMenuIcon } from './column-header-menu-icon';

export interface ColumnHeaderMenuProps {
  columns: ColDef[];
}

export const ColumnHeaderMenu: React.FC<ColumnHeaderMenuProps> = React.memo(
  ({  columns }) => {
    const apiRef = React.useContext(ApiContext);
    const [isOpen, setIsOpen] = React.useState(false);
    const [target, setTarget] = React.useState<HTMLElement | null>(null);
    const [colDef, setColDef] = React.useState<ColDef | null>(null);

    const hideTimeout = React.useRef<any>();
    const hidePopper = React.useCallback(() => {
      hideTimeout.current = setTimeout(() => setIsOpen(() => false), 50);
    }, []);

    const onColumnFilterClick = React.useCallback(
      ({ element, column }) => {
        setImmediate(() => clearTimeout(hideTimeout.current));
        setIsOpen((p) => {
          if (colDef == null || column.field !== colDef?.field) {
            return true;
          }
          return !p;
        });
        setTarget(element);
        setColDef(column);
      },
      [colDef],
    );
    const showFilter = React.useCallback(
      () => {
        setIsOpen(false);
        apiRef!.current.publishEvent(COLUMN_FILTER_BUTTON_CLICK, {
          element: target,
          column: colDef,
        });
      },
      [apiRef, colDef, target],
    );

    const handleListKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setIsOpen(false);
      }
    }, []);

    React.useEffect(() => {
      return apiRef?.current.subscribeEvent(COLUMN_MENU_BUTTON_CLICK, onColumnFilterClick);
    }, [apiRef, onColumnFilterClick]);

    React.useEffect(() => {
      // If columns changed we want to use the latest version of our column
      setColDef((prevCol) => {
        if (prevCol != null) {
          const newCol = columns.find((col) => col.field === prevCol.field);
          return newCol || null;
        }
        return prevCol;
      });
    }, [columns]);

    return (
      <Popper open={isOpen} anchorEl={target} role={undefined} transition >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={hidePopper}>
                <MenuList autoFocusItem={isOpen} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={hidePopper} className={'menu-item'}>Sort By Asc</MenuItem>
                  <MenuItem onClick={hidePopper}>Sort By Desc</MenuItem>
                  <MenuItem onClick={showFilter}>Filter</MenuItem>
                  <MenuItem onClick={hidePopper}>Auto size</MenuItem>
                  <MenuItem onClick={hidePopper}>Hide</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  },
);
ColumnHeaderMenuIcon.displayName = 'ColumnHeaderFilterIcon';
