import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { gridSortModelSelector } from '../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../models/gridSortModel';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';

const SortGridMenuItems = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);

  const sortDirection = React.useMemo(() => {
    if (!column) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === column.field);
    return sortItem?.sort;
  }, [column, sortModel]);

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(column!, direction as GridSortDirection);
    },
    [apiRef, column, onClick],
  );

  if (!column || !column.sortable) {
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
};

SortGridMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.shape({
    align: PropTypes.oneOf(['center', 'left', 'right']),
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    description: PropTypes.string,
    disableColumnMenu: PropTypes.bool,
    disableExport: PropTypes.bool,
    disableReorder: PropTypes.bool,
    editable: PropTypes.bool,
    field: PropTypes.string.isRequired,
    filterable: PropTypes.bool,
    filterOperators: PropTypes.arrayOf(
      PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.object,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    flex: PropTypes.number,
    headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
    headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    headerName: PropTypes.string,
    hide: PropTypes.bool,
    hideSortIcons: PropTypes.bool,
    minWidth: PropTypes.number,
    renderCell: PropTypes.func,
    renderEditCell: PropTypes.func,
    renderHeader: PropTypes.func,
    resizable: PropTypes.bool,
    shouldRenderFillerRows: PropTypes.bool,
    sortable: PropTypes.bool,
    sortComparator: PropTypes.func,
    type: PropTypes.string,
    valueFormatter: PropTypes.func,
    valueGetter: PropTypes.func,
    valueOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
    valueParser: PropTypes.func,
    width: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { SortGridMenuItems };
