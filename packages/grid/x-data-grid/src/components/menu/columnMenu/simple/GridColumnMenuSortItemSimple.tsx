import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../../models/gridSortModel';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';

function GridColumnMenuSortItemSimple(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);

  const sortDirection = React.useMemo(() => {
    if (!colDef) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === colDef.field);
    return sortItem?.sort;
  }, [colDef, sortModel]);

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(
        colDef!,
        (direction === sortDirection ? null : direction) as GridSortDirection,
      );
    },
    [apiRef, colDef, onClick, sortDirection],
  );

  if (!colDef || !colDef.sortable) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuItem onClick={onSortMenuItemClick} disabled={sortDirection == null}>
        {apiRef.current.getLocaleText('columnMenuUnsort')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="asc" disabled={sortDirection === 'asc'}>
        {apiRef.current.getLocaleText('columnMenuSortAsc')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="desc" disabled={sortDirection === 'desc'}>
        {apiRef.current.getLocaleText('columnMenuSortDesc')}
      </MenuItem>
    </React.Fragment>
  );
}

GridColumnMenuSortItemSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuSortItemSimple };
