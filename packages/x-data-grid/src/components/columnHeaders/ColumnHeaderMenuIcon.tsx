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
  iconButtonRef: React.RefObject<HTMLButtonElement | null>;
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
  const divRef = React.useRef<HTMLDivElement>(null);

  const handleMenuIconClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apiRef.current.toggleColumnMenu(colDef.field);
    },
    [apiRef, colDef.field],
  );

  const columnName = colDef.headerName ?? colDef.field;
  const titleWidth =
    divRef.current?.parentElement?.firstElementChild?.firstElementChild?.clientWidth;
  const neededWidth =
    divRef.current?.parentElement?.firstElementChild?.firstElementChild?.firstElementChild
      ?.scrollWidth ?? 1;
  const title =
    apiRef.current.getLocaleText('columnMenuLabel') +
    (titleWidth && titleWidth < neededWidth / 2 ? ` (${columnName})` : '');

  return (
    <div className={classes.root} ref={divRef}>
      <rootProps.slots.baseTooltip
        title={title}
        enterDelay={1000}
        {...rootProps.slotProps?.baseTooltip}
      >
        <rootProps.slots.baseIconButton
          ref={iconButtonRef}
          tabIndex={-1}
          className={classes.button}
          aria-label={apiRef.current.getLocaleText('columnMenuAriaLabel')(columnName)}
          size="small"
          onClick={handleMenuIconClick}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? columnMenuId : undefined}
          id={columnMenuButtonId}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.columnMenuIcon fontSize="inherit" />
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseTooltip>
    </div>
  );
});
