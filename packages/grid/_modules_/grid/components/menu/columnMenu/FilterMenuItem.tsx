import { MenuItem } from '@material-ui/core';
import * as React from 'react';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { useGridState } from '../../../hooks/features/core/useGridState';
import { optionsSelector } from '../../../hooks/utils/useOptionsProp';
import { ColDef } from '../../../models/colDef/colDef';
import { ApiContext } from '../../api-context';
import { SortMenuItemsProps } from './SortMenuItems';

export interface FilterItemProps {
  column: ColDef;
  onClick: (event: React.MouseEvent<any>) => void;
}

export const FilterMenuItem: React.FC<SortMenuItemsProps> = ({ column, onClick }) => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const [gridState] = useGridState(apiRef!);

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      const lastFilter =
        gridState.filter.items.length > 0
          ? gridState.filter.items[gridState.filter.items.length - 1]
          : null;
      if (!lastFilter || lastFilter.columnField !== column?.field) {
        apiRef!.current.upsertFilter({ columnField: column?.field });
      }
      apiRef!.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, gridState.filter.items, onClick],
  );

  if (options.disableColumnFilter || !column?.filterable) {
    return null;
  }

  return <MenuItem onClick={showFilter}>Filter</MenuItem>;
};
