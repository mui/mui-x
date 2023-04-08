import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  useGridApiContext,
  GridMenu,
  GridFilterOperator,
  GridFilterItem,
  GridColDef,
} from '@mui/x-data-grid';
import { OPERATOR_SYMBOL_MAPPING, OPERATOR_LABEL_MAPPING } from './constants';

export interface GridHeaderFilterMenuProps {
  field: GridColDef['field'];
  applyFilterChanges: (item: GridFilterItem) => void;
  operators: GridFilterOperator<any, any, any>[];
  item: GridFilterItem;
  open: boolean;
  id: string;
  labelledBy: string;
  target: HTMLElement | null;
}

function GridHeaderFilterMenu({
  open,
  field,
  target,
  applyFilterChanges,
  operators,
  item,
  id,
  labelledBy,
}: GridHeaderFilterMenuProps) {
  const apiRef = useGridApiContext();

  const hideMenu = React.useCallback(() => {
    apiRef.current.hideHeaderFilterMenu();
  }, [apiRef]);

  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
      }
      if (event.key === 'Escape' || event.key === 'Tab') {
        hideMenu();
      }
    },
    [hideMenu],
  );

  if (!target) {
    return null;
  }

  return (
    <GridMenu
      placement="bottom-start"
      open={open}
      target={target}
      onClickAway={hideMenu}
      onExited={hideMenu}
    >
      <MenuList aria-labelledby={labelledBy} id={id} onKeyDown={handleListKeyDown} autoFocus={open}>
        {operators.map((op) => (
          <MenuItem
            onClick={() => {
              applyFilterChanges({ ...item, operator: op.value });
              hideMenu();
            }}
            selected={op.value === item.operator}
            key={`${field}-${op.value}`}
          >
            <ListItemIcon>{OPERATOR_SYMBOL_MAPPING[op.value]}</ListItemIcon>
            <ListItemText>{OPERATOR_LABEL_MAPPING[op.value]}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </GridMenu>
  );
}

export { GridHeaderFilterMenu };
