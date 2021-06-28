import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../../hooks/utils/optionsSelector';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';

export const GridFilterMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
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

  return (
    <MenuItem onClick={showFilter}>{apiRef!.current.getLocaleText('columnMenuFilter')}</MenuItem>
  );
};
