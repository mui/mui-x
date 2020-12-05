import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { sortModelSelector } from '../../../hooks/features/sorting/sortingSelector';
import { SortDirection } from '../../../models/sortModel';
import { ApiContext } from '../../api-context';
import { FilterItemProps } from './FilterItemProps';

export const SortMenuItems: React.FC<FilterItemProps> = ({ column, onClick }) => {
  const apiRef = React.useContext(ApiContext);
  const sortModel = useGridSelector(apiRef, sortModelSelector);

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
      apiRef?.current.sortColumn(column!, direction as SortDirection);
    },
    [apiRef, column, onClick],
  );

  if (!column || !column.sortable) {
    return null;
  }

  return (
    <React.Fragment>
      <MenuItem onClick={onSortMenuItemClick} disabled={sortDirection == null}>
        Unsort
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="asc" disabled={sortDirection === 'asc'}>
        Sort by Asc
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="desc" disabled={sortDirection === 'desc'}>
        Sort by Desc
      </MenuItem>
    </React.Fragment>
  );
};
