import { MenuItem } from '@material-ui/core';
import * as React from 'react';
import { ColDef } from '../../../models/colDef/colDef';
import { ApiContext } from '../../api-context';
import { SortMenuItemsProps } from './SortMenuItems';

export interface FilterItemProps {
  column: ColDef;
  onClick: (event: React.MouseEvent<any>) => void;
}

export const HideColMenuItem: React.FC<SortMenuItemsProps> = ({ column, onClick }) => {
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
