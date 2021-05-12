import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { GridIconSlotsComponent } from '../../models/gridIconSlotsComponent';
import { GridSortDirection } from '../../models/gridSortModel';
import { GridApiContext } from '../GridApiContext';

export interface GridColumnHeaderSortIconProps {
  direction: GridSortDirection;
  index: number | undefined;
  hide?: boolean;
}

function getIcon(icons: GridIconSlotsComponent, direction: GridSortDirection) {
  const Icon =
    direction === 'asc' ? icons!.ColumnSortedAscendingIcon! : icons!.ColumnSortedDescendingIcon!;
  return <Icon className="MuiDataGrid-sortIcon" />;
}

export const GridColumnHeaderSortIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnHeaderSortIconProps,
) {
  const { direction, index, hide } = props;
  const apiRef = React.useContext(GridApiContext);

  if (hide || direction == null) {
    return null;
  }

  return (
    <div className="MuiDataGrid-iconButtonContainer">
      <div>
        {index != null && (
          <Badge badgeContent={index} color="default">
            <IconButton
              tabIndex={-1}
              aria-label={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
              title={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
              size="small"
            >
              {getIcon(apiRef!.current.components, direction)}
            </IconButton>
          </Badge>
        )}
        {index == null && (
          <IconButton
            tabIndex={-1}
            aria-label={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
            title={apiRef!.current.getLocaleText('columnHeaderSortIconLabel')}
            size="small"
          >
            {getIcon(apiRef!.current.components, direction)}
          </IconButton>
        )}
      </div>
    </div>
  );
});
