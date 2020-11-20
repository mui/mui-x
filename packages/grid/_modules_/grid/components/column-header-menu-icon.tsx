import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useIcons } from '../hooks/utils/useIcons';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';

export interface ColumnHeaderFilterIconProps {
  column: ColDef;
}

export const ColumnHeaderMenuIcon: React.FC<ColumnHeaderFilterIconProps> = React.memo(
  ({ column }) => {
    const icons = useIcons();
    const icon = React.createElement(icons.ColumnMenu!, {});
    const apiRef = React.useContext(ApiContext);

    const menuIconClick = React.useCallback(() => {
      apiRef?.current.showColumnMenu(column.field);
    }, [apiRef, column.field]);

    return (
      <div className={'MuiDataGrid-menuIcon'}>
        <IconButton
          className={'MuiDataGrid-menuIconButton'}
          aria-label="Menu"
          size="small"
          onClick={menuIconClick}
        >
          {icon}
        </IconButton>
      </div>
    );
  },
);
ColumnHeaderMenuIcon.displayName = 'ColumnHeaderMenuIcon';
