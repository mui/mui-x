import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export interface ColumnHeaderMenuIconProps {
  colDef: GridStateColDef;
  columnMenuId: string;
  columnMenuButtonId: string;
  open: boolean;
  iconButtonRef: React.RefObject<HTMLButtonElement>;
}

type OwnerState = ColumnHeaderMenuIconProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, open } = ownerState;

  const slots = {
    root: ['menuIcon', open && 'menuOpen'],
    button: ['menuIconButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const ColumnHeaderMenuIcon = React.memo((props: ColumnHeaderMenuIconProps) => {
  const { colDef, open, columnMenuId, columnMenuButtonId, iconButtonRef } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apiRef.current.toggleColumnMenu(colDef.field);
    },
    [apiRef, colDef.field],
  );

  return (
    <div className={classes.root}>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('columnMenuLabel')}
        enterDelay={1000}
        {...rootProps.slotProps?.baseTooltip}
      >
        <rootProps.slots.baseIconButton
          ref={iconButtonRef}
          tabIndex={-1}
          className={classes.button}
          aria-label={apiRef.current.getLocaleText('columnMenuLabel')}
          size="small"
          onClick={handleMenuIconClick}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? columnMenuId : undefined}
          id={columnMenuButtonId}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.columnMenuIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </div>
  );
});
