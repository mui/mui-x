import React from 'react';
import Badge from '@material-ui/core/Badge';
import { SortDirection } from '../models';

export interface ColumnHeaderSortIconProps {
  direction: SortDirection;
  index: number | undefined;
  icons: { [key: string]: React.ReactElement };
  hide?: boolean;
}

export const ColumnHeaderSortIcon: React.FC<ColumnHeaderSortIconProps> = React.memo(
  ({ direction, index, icons, hide }) => {
    if (hide || direction == null) {
      return null;
    }

    return (
      <span className={'sort-icon'}>
        {index != null && (
          <Badge badgeContent={index} color="default">
            {icons[direction]}
          </Badge>
        )}
        {index == null && icons[direction]}
      </span>
    );
  },
);
ColumnHeaderSortIcon.displayName = 'ColumnHeaderSortIcon';
