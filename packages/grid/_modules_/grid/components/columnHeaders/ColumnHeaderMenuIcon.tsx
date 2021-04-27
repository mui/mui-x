import * as React from 'react';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import IconButton from '@material-ui/core/IconButton';
import { gridColumnMenuStateSelector } from '../../hooks/features/columnMenu/columnMenuSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { classnames } from '../../utils/classnames';
import { GridApiContext } from '../GridApiContext';
import { GridColDef } from '../../models/colDef/gridColDef';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';

export interface ColumnHeaderFilterIconProps {
  column: GridColDef;
}

export function ColumnHeaderMenuIcon(props: ColumnHeaderFilterIconProps) {
  const { column } = props;
  const apiRef = React.useContext(GridApiContext);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuStateSelector);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const ColumnMenuIcon = apiRef!.current.components.ColumnMenuIcon!;
  const iconButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apiRef!.current.toggleColumnMenu(column.field);
    },
    [apiRef, column.field],
  );

  const open = columnMenuState.open && columnMenuState.field === column.field;

  return (
    <div className={classnames('MuiDataGrid-menuIcon', { 'MuiDataGrid-menuOpen': open })}>
      <IconButton
        ref={iconButtonRef}
        tabIndex={-1}
        className="MuiDataGrid-menuIconButton"
        aria-label={apiRef!.current.getLocaleText('columnMenuLabel')}
        title={apiRef!.current.getLocaleText('columnMenuLabel')}
        size="small"
        onClick={handleMenuIconClick}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-controls={columnMenuId}
        id={columnMenuButtonId}
      >
        <ColumnMenuIcon fontSize="small" />
      </IconButton>
      <GridColumnHeaderMenu
        columnMenuId={columnMenuId}
        columnMenuButtonId={columnMenuButtonId}
        field={column.field}
        open={open}
        target={iconButtonRef.current}
        ContentComponent={apiRef!.current.components.ColumnMenu}
        contentComponentProps={{
          ...apiRef!.current.componentsProps?.columnMenu,
        }}
      />
    </div>
  );
}
