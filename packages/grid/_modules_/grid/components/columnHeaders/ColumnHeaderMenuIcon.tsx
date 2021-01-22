import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { columnMenuStateSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { classnames } from '../../utils/classnames';
import { ApiContext } from '../api-context';
import { ColDef } from '../../models/colDef/colDef';

export interface ColumnHeaderFilterIconProps {
  column: ColDef;
}

export function ColumnHeaderMenuIcon(props: ColumnHeaderFilterIconProps) {
  const { column } = props;
  const apiRef = React.useContext(ApiContext);
  const columnMenuState = useGridSelector(apiRef, columnMenuStateSelector);
  const ColumnMenuIcon = apiRef!.current.components.ColumnMenuIcon!;

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const lastMenuState = apiRef!.current.getState<GridState>().columnMenu;
      if (!lastMenuState.open || lastMenuState.field !== column.field) {
        apiRef!.current.showColumnMenu(column.field);
      } else {
        apiRef!.current.hideColumnMenu();
      }
    },
    [apiRef, column.field],
  );

  const open = columnMenuState.open && columnMenuState.field === column.field;
  return (
    <div className={classnames('MuiDataGrid-menuIcon', { 'MuiDataGrid-menuOpen': open })}>
      <IconButton
        id={`menu-button-${column.field}`}
        className="MuiDataGrid-menuIconButton"
        aria-haspopup="true"
        aria-controls="menu-list-grow"
        aria-expanded={open}
        aria-label={apiRef!.current.getLocaleText('columnMenuLabel')}
        title={apiRef!.current.getLocaleText('columnMenuLabel')}
        size="small"
        onClick={handleMenuIconClick}
      >
        <ColumnMenuIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
