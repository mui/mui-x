import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../../hooks/utils/useOptionsProp';
import { ApiContext } from '../../api-context';
import { FilterItemProps } from './FilterItemProps';

export const FilterMenuItem: React.FC<FilterItemProps> = ({ column, onClick }) => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef!.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  if (options.disableColumnFilter || !column?.filterable) {
    return null;
  }

  return <MenuItem onClick={showFilter}>Filter</MenuItem>;
};
