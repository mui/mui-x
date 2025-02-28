import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { GridSlotsComponent } from '../../models/gridSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

export interface GridColumnHeaderSortButtonProps {
  field: string;
  direction: GridSortDirection;
  index: number | undefined;
  sortingOrder: readonly GridSortDirection[];
  disabled?: boolean;
}

type OwnerState = GridColumnHeaderSortButtonProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    button: ['sortButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function getIcon(
  icons: GridSlotsComponent,
  direction: GridSortDirection,
  sortingOrder: readonly GridSortDirection[],
) {
  let Icon;
  const iconProps: any = {};
  if (direction === 'asc') {
    Icon = icons.columnSortedAscendingIcon;
  } else if (direction === 'desc') {
    Icon = icons.columnSortedDescendingIcon;
  } else {
    Icon = icons.columnUnsortedIcon;
    iconProps.sortingOrder = sortingOrder;
  }
  return Icon ? <Icon fontSize="small" {...iconProps} /> : null;
}

function GridColumnHeaderSortButtonRaw(props: GridColumnHeaderSortButtonProps) {
  const { direction, index, sortingOrder, disabled, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const iconElement = getIcon(rootProps.slots, direction, sortingOrder);
  if (!iconElement) {
    return null;
  }

  const iconButton = (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      title={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      size="small"
      disabled={disabled}
      className={classes.button}
      {...rootProps.slotProps?.baseIconButton}
      {...other}
    >
      {iconElement}
    </rootProps.slots.baseIconButton>
  );

  return (
    <React.Fragment>
      {index != null && (
        <rootProps.slots.baseBadge badgeContent={index} color="default" overlap="circular">
          {iconButton}
        </rootProps.slots.baseBadge>
      )}

      {index == null && iconButton}
    </React.Fragment>
  );
}

const GridColumnHeaderSortButton = React.memo(GridColumnHeaderSortButtonRaw);

GridColumnHeaderSortButtonRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  direction: PropTypes.oneOf(['asc', 'desc']),
  disabled: PropTypes.bool,
  field: PropTypes.string.isRequired,
  index: PropTypes.number,
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
} as any;

export { GridColumnHeaderSortButton };
