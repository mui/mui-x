import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { GridIconSlotsComponent } from '../../models/gridIconSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { composeClasses } from '../../utils/material-ui-utils';
import { GridComponentProps } from '../../GridComponentProps';

export interface GridColumnHeaderSortIconProps {
  direction: GridSortDirection;
  index: number | undefined;
}

type OwnerState = GridColumnHeaderSortIconProps & {
  classes?: GridComponentProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['iconButtonContainer'],
    icon: ['sortIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function getIcon(icons: GridIconSlotsComponent, direction: GridSortDirection, className: string) {
  let Icon = icons.ColumnUnsortedIcon;
  if (direction === 'asc') {
    Icon = icons.ColumnSortedAscendingIcon;
  } else if (direction === 'desc') {
    Icon = icons.ColumnSortedDescendingIcon;
  }
  return Icon ? <Icon fontSize="small" className={className} /> : null;
}

export const GridColumnHeaderSortIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnHeaderSortIconProps,
) {
  const { direction, index } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const iconElement = getIcon(rootProps.components, direction, classes.icon);
  if (!iconElement) {
    return null;
  }

  const iconButton = (
    <IconButton
      tabIndex={-1}
      aria-label={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      title={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      size="small"
    >
      {iconElement}
    </IconButton>
  );

  return (
    <div className={classes.root}>
      {index != null && (
        <Badge badgeContent={index} color="default">
          {iconButton}
        </Badge>
      )}
      {index == null && iconButton}
    </div>
  );
});
