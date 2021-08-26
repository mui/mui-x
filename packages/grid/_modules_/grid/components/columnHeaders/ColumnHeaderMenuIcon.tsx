import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../gridClasses';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ColumnHeaderMenuIconProps {
  column: GridStateColDef;
  columnMenuId: string;
  columnMenuButtonId: string;
  open: boolean;
  iconButtonRef: React.RefObject<HTMLButtonElement>;
}

const useUtilityClasses = (ownerState) => {
  const { classes, open } = ownerState;

  const slots = {
    root: ['menuIcon', open && 'menuOpen'],
    button: ['menuIconButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const ColumnHeaderMenuIcon = React.memo((props: ColumnHeaderMenuIconProps) => {
  const { column, open, columnMenuId, columnMenuButtonId, iconButtonRef } = props;
  const apiRef = useGridApiContext();
  const ColumnMenuIcon = apiRef!.current.components.ColumnMenuIcon!;
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apiRef.current.toggleColumnMenu(column.field);
    },
    [apiRef, column.field],
  );

  return (
    <div className={classes.root}>
      <IconButton
        ref={iconButtonRef}
        tabIndex={-1}
        className={classes.button}
        aria-label={apiRef.current.getLocaleText('columnMenuLabel')}
        title={apiRef.current.getLocaleText('columnMenuLabel')}
        size="small"
        onClick={handleMenuIconClick}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-controls={columnMenuId}
        id={columnMenuButtonId}
      >
        <ColumnMenuIcon fontSize="small" />
      </IconButton>
    </div>
  );
});
