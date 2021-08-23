import * as React from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ColumnHeaderMenuIconProps {
  column: GridStateColDef;
  columnMenuId: string;
  columnMenuButtonId: string;
  open: boolean;
  iconButtonRef: React.RefObject<HTMLButtonElement>;
}

export const ColumnHeaderMenuIcon = React.memo((props: ColumnHeaderMenuIconProps) => {
  const { column, open, columnMenuId, columnMenuButtonId, iconButtonRef } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apiRef!.current.toggleColumnMenu(column.field);
    },
    [apiRef, column.field],
  );

  return (
    <div className={clsx(gridClasses.menuIcon, { [gridClasses.menuOpen]: open })}>
      <IconButton
        ref={iconButtonRef}
        tabIndex={-1}
        className={gridClasses.menuIconButton}
        aria-label={apiRef!.current.getLocaleText('columnMenuLabel')}
        title={apiRef!.current.getLocaleText('columnMenuLabel')}
        size="small"
        onClick={handleMenuIconClick}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-controls={columnMenuId}
        id={columnMenuButtonId}
      >
        <rootProps.components.ColumnMenuIcon fontSize="small" />
      </IconButton>
    </div>
  );
});
