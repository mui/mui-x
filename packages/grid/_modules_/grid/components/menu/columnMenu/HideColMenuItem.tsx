import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { ApiContext } from '../../api-context';
import { FilterItemProps } from './FilterItemProps';

export const HideColMenuItem: React.FC<FilterItemProps> = ({ column, onClick }) => {
  const apiRef = React.useContext(ApiContext);

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef!.current.toggleColumn(column?.field, true);
    },
    [apiRef, column?.field, onClick],
  );

  if (!column) {
    return null;
  }

  return <MenuItem onClick={toggleColumn}>Hide</MenuItem>;
};
