import { MenuItem } from '@material-ui/core';
import * as React from 'react';
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

  return <MenuItem onClick={toggleColumn}>Hide</MenuItem>;
};
