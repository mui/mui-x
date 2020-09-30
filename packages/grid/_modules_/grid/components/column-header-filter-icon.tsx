import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useIcons } from '../hooks/utils/useIcons';
import { COLUMN_FILTER_BUTTON_CLICK } from '../constants';
import { ApiContext } from './api-context';
import { ColDef } from '../models/colDef/colDef';
import {OptionsContext} from "./options-context";

export interface ColumnHeaderFilterIconProps {
  column: ColDef;
}

export const ColumnHeaderFilterIcon: React.FC<ColumnHeaderFilterIconProps> = React.memo(
  ({ column }) => {
    const icons = useIcons();
    const icon = React.createElement(icons.columnFiltering!, {});
    const apiRef = React.useContext(ApiContext);
    const options = React.useContext(OptionsContext);

    const filterClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        apiRef!.current.publishEvent(COLUMN_FILTER_BUTTON_CLICK, {
          element: event.currentTarget,
          column,
        });
      },
      [apiRef, column],
    );

    if(options.disableColumnFilter) {
      return null;
    }

    return (
      <div className={'MuiDataGrid-iconFilter'}>
        <IconButton aria-label="Sort" size="small" onClick={filterClick}>
          {icon}
        </IconButton>
      </div>
    );
  },
);
ColumnHeaderFilterIcon.displayName = 'ColumnHeaderFilterIcon';
