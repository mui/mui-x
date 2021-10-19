import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { GridIconSlotsComponent } from '../../models/gridIconSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
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

function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps) {
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
}

const GridColumnHeaderSortIcon = React.memo(GridColumnHeaderSortIconRaw);

GridColumnHeaderSortIconRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  direction: PropTypes.oneOf(['asc', 'desc']),
  index: PropTypes.number,
} as any;

export { GridColumnHeaderSortIcon };
