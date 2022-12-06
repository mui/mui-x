import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../models/gridSortModel';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

function SortGridMenuItems(props: GridFilterItemProps) {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);
  const rootProps = useGridRootProps();

  const sortDirection = React.useMemo(() => {
    if (!column) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === column.field);
    return sortItem?.sort;
  }, [column, sortModel]);

  const sortingOrder = React.useMemo<GridSortDirection[]>(
    () => column.sortingOrder ?? rootProps.sortingOrder,
    [column, rootProps],
  );

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      const direction = event.currentTarget.getAttribute('data-value');
      apiRef.current.sortColumn(column!, direction as GridSortDirection);
    },
    [apiRef, column, onClick],
  );

  const getSortKey = React.useCallback((direction: GridSortDirection) => {
    if (direction === 'asc') {
      return 'columnMenuSortAsc';
    }
    if (direction === 'desc') {
      return 'columnMenuSortDesc';
    }
    return 'columnMenuUnsort';
  }, []);

  if (!column || !column.sortable) {
    return null;
  }

  return (
    <React.Fragment>
      {sortingOrder.map((direction) => (
        <MenuItem
          onClick={onSortMenuItemClick}
          data-value={direction}
          disabled={sortDirection === direction}
        >
          {apiRef.current.getLocaleText(getSortKey(direction))}
        </MenuItem>
      ))}
    </React.Fragment>
  );
}

SortGridMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { SortGridMenuItems };
