import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../../models/gridSortModel';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

function GridColumnMenuSortItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const rootProps = useGridRootProps();

  const sortDirection = React.useMemo(() => {
    if (!colDef) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === colDef.field);
    return sortItem?.sort;
  }, [colDef, sortModel]);

  const sortingOrder: readonly GridSortDirection[] = colDef.sortingOrder ?? rootProps.sortingOrder;

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(
        colDef!.field,
        (direction === sortDirection ? null : direction) as GridSortDirection,
      );
    },
    [apiRef, colDef, onClick, sortDirection],
  );

  if (
    rootProps.disableColumnSorting ||
    !colDef ||
    !colDef.sortable ||
    !sortingOrder.some((item) => !!item)
  ) {
    return null;
  }

  const getLabel = (key: 'columnMenuSortAsc' | 'columnMenuSortDesc') => {
    const label = apiRef.current.getLocaleText(key);
    return typeof label === 'function' ? label(colDef) : label;
  };

  return (
    <React.Fragment>
      {sortingOrder.includes('asc') && sortDirection !== 'asc' ? (
        <MenuItem onClick={onSortMenuItemClick} data-value="asc">
          <ListItemIcon>
            <rootProps.slots.columnMenuSortAscendingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{getLabel('columnMenuSortAsc')}</ListItemText>
        </MenuItem>
      ) : null}
      {sortingOrder.includes('desc') && sortDirection !== 'desc' ? (
        <MenuItem onClick={onSortMenuItemClick} data-value="desc">
          <ListItemIcon>
            <rootProps.slots.columnMenuSortDescendingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{getLabel('columnMenuSortDesc')}</ListItemText>
        </MenuItem>
      ) : null}
      {sortingOrder.includes(null) && sortDirection != null ? (
        <MenuItem onClick={onSortMenuItemClick}>
          <ListItemIcon />
          <ListItemText>{apiRef.current.getLocaleText('columnMenuUnsort')}</ListItemText>
        </MenuItem>
      ) : null}
    </React.Fragment>
  );
}

GridColumnMenuSortItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuSortItem };
