import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import clsx from 'clsx';
import { GridSlotProps, GridSlotsComponent } from '../models';
import { GridSortDirection } from '../models/gridSortModel';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { vars } from '../constants/cssVariables';
import { NotRendered } from '../utils';

export type GridColumnSortButtonProps = GridSlotProps['baseIconButton'] & {
  field: string;
  direction: GridSortDirection;
  index?: number;
  sortingOrder: readonly GridSortDirection[];
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type OwnerState = GridColumnSortButtonProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sortButton'],
    icon: ['sortIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridColumnSortButtonRoot = styled(NotRendered<GridSlotProps['baseIconButton']>, {
  name: 'DataGrid',
  slot: 'SortButton',
})<{ ownerState: OwnerState }>({
  transition: vars.transition(['opacity'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
});

function getIcon(
  icons: GridSlotsComponent,
  direction: GridSortDirection,
  className: string,
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
  return Icon ? <Icon fontSize="small" className={className} {...iconProps} /> : null;
}

function GridColumnSortButton(props: GridColumnSortButtonProps) {
  const { direction, index, sortingOrder, disabled, className, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const iconElement = getIcon(rootProps.slots, direction, classes.icon, sortingOrder);

  if (!iconElement) {
    return null;
  }

  const iconButton = (
    <GridColumnSortButtonRoot
      as={rootProps.slots.baseIconButton}
      ownerState={ownerState}
      aria-label={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      title={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      size="small"
      disabled={disabled}
      className={clsx(classes.root, className)}
      {...rootProps.slotProps?.baseIconButton}
      {...other}
    >
      {iconElement}
    </GridColumnSortButtonRoot>
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

GridColumnSortButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  direction: PropTypes.oneOf(['asc', 'desc']),
  disabled: PropTypes.bool,
  field: PropTypes.string.isRequired,
  index: PropTypes.number,
  onClick: PropTypes.func,
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
} as any;

export { GridColumnSortButton };
