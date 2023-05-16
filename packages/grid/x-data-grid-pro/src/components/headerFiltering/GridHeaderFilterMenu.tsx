import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { unstable_capitalize as capitalize } from '@mui/utils';
import {
  useGridApiContext,
  GridMenu,
  GridFilterOperator,
  GridFilterItem,
  GridColDef,
} from '@mui/x-data-grid';
import { OPERATOR_SYMBOL_MAPPING } from './constants';

interface GridHeaderFilterMenuProps {
  field: GridColDef['field'];
  applyFilterChanges: (item: GridFilterItem) => void;
  operators: GridFilterOperator<any, any, any>[];
  item: GridFilterItem;
  open: boolean;
  id: string;
  labelledBy: string;
  targetRef: React.MutableRefObject<HTMLElement | null>;
}

function GridHeaderFilterMenu({
  open,
  field,
  targetRef,
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

  if (!targetRef.current) {
    return null;
  }

  return (
    <GridMenu
      placement="bottom-start"
      open={open}
      target={targetRef.current}
      onClickAway={hideMenu}
      onExited={hideMenu}
    >
      <MenuList aria-labelledby={labelledBy} id={id} onKeyDown={handleListKeyDown}>
        {operators.map((op, i) => {
          const label =
            op?.headerLabel ??
            apiRef.current.getLocaleText(
              `headerFilterOperator${capitalize(op.value)}` as 'headerFilterOperatorContains',
            );

          return (
            <MenuItem
              onClick={() => {
                applyFilterChanges({ ...item, operator: op.value });
                hideMenu();
              }}
              autoFocus={i === 0 ? open : false}
              selected={op.value === item.operator}
              key={`${field}-${op.value}`}
            >
              <ListItemIcon>{OPERATOR_SYMBOL_MAPPING[op.value]}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </GridMenu>
  );
}

export { GridHeaderFilterMenu };
