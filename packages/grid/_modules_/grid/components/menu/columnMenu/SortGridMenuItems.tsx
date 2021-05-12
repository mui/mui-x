import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { gridSortModelSelector } from '../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../models/gridSortModel';
import { GridApiContext } from '../../GridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';

export const SortGridMenuItems = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = React.useContext(GridApiContext);
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
      apiRef?.current.sortColumn(column!, direction as GridSortDirection);
    },
    [apiRef, column, onClick],
  );

  if (!column || !column.sortable) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuItem onClick={onSortMenuItemClick} disabled={sortDirection == null}>
        {apiRef!.current.getLocaleText('columnMenuUnsort')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="asc" disabled={sortDirection === 'asc'}>
        {apiRef!.current.getLocaleText('columnMenuSortAsc')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="desc" disabled={sortDirection === 'desc'}>
        {apiRef!.current.getLocaleText('columnMenuSortDesc')}
      </MenuItem>
    </React.Fragment>
  );
};
