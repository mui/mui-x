import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { GridIconSlotsComponent } from '../../models/gridIconSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { gridClasses } from '../../gridClasses';

export interface GridColumnHeaderSortIconProps {
  direction: GridSortDirection;
  index: number | undefined;
}

function getIcon(icons: GridIconSlotsComponent, direction: GridSortDirection) {
  let Icon = icons!.ColumnUnsortedIcon!;
  if (direction === 'asc') {
    Icon = icons!.ColumnSortedAscendingIcon!;
  } else if (direction === 'desc') {
    Icon = icons!.ColumnSortedDescendingIcon!;
  }
  return <Icon fontSize="small" className={gridClasses.sortIcon} />;
}

export const GridColumnHeaderSortIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnHeaderSortIconProps,
) {
  const { direction, index } = props;
  const apiRef = useGridApiContext();

  const unsortedIcon = apiRef!.current.components.ColumnUnsortedIcon;
  if (direction == null && unsortedIcon === null) {
    return null;
  }

  const iconButton = (
    <IconButton
      tabIndex={-1}
      aria-label={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      title={apiRef.current.getLocaleText('columnHeaderSortIconLabel')}
      size="small"
    >
      {getIcon(apiRef!.current.components, direction)}
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
