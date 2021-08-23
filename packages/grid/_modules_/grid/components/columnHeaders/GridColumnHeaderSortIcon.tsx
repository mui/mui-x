import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { GridIconSlotsComponent } from '../../models/gridIconSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridColumnHeaderSortIconProps {
  direction: GridSortDirection;
  index: number | undefined;
}

function getIcon(icons: GridIconSlotsComponent, direction: GridSortDirection) {
  let Icon = icons.ColumnUnsortedIcon;
  if (direction === 'asc') {
    Icon = icons.ColumnSortedAscendingIcon;
  } else if (direction === 'desc') {
    Icon = icons.ColumnSortedDescendingIcon;
  }

  if (!Icon) {
    return null;
  }

  return <Icon fontSize="small" className={gridClasses.sortIcon} />;
}

export const GridColumnHeaderSortIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnHeaderSortIconProps,
) {
  const { direction, index } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const iconElement = getIcon(rootProps.components, direction);

  if (!iconElement) {
    return null;
  }

  const iconButton = (
    <IconButton
      tabIndex={-1}
      aria-label={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
      title={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
      size="small"
    >
      {iconElement}
    </IconButton>
  );

  return (
    <div className={gridClasses.iconButtonContainer}>
      {index != null && (
        <Badge badgeContent={index} color="default">
          {iconButton}
        </Badge>
      )}
      {index == null && iconButton}
    </div>
  );
});
