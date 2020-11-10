import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useIcons } from '../hooks/utils/useIcons';
import { COLUMN_MENU_BUTTON_CLICK } from '../constants';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';

export interface ColumnHeaderFilterIconProps {
  column: ColDef;
}

export const ColumnHeaderMenuIcon: React.FC<ColumnHeaderFilterIconProps> = React.memo(
  ({ column }) => {
    const icons = useIcons();
    const icon = React.createElement(icons.columnMenu!, {});
    const apiRef = React.useContext(ApiContext);

    const filterClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        apiRef!.current.publishEvent(COLUMN_MENU_BUTTON_CLICK, {
          element: event.currentTarget,
          column,
        });
      },
      [apiRef, column],
    );

    return (
      <div className={'MuiDataGrid-iconFilter'}>
        <IconButton aria-label="Sort" size="small" onClick={filterClick}>
          {icon}
        </IconButton>
      </div>
    );
  },
);
ColumnHeaderMenuIcon.displayName = 'ColumnHeaderFilterIcon';
