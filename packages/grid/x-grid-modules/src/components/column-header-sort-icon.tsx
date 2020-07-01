import React from 'react';
import Badge from '@material-ui/core/Badge';
import { IconsOptions, SortDirection } from '../models';
import { IconButton } from '@material-ui/core';

import { useIcons } from '../hooks/utils/useIcons';

export interface ColumnHeaderSortIconProps {
  direction: SortDirection;
  index: number | undefined;
  hide?: boolean;
}

const getIcon = (icons: IconsOptions, direction: SortDirection): React.ReactNode =>
  direction === 'asc' ? icons!.columnSortedAscending!({}) : icons!.columnSortedDescending!({});

export const ColumnHeaderSortIcon: React.FC<ColumnHeaderSortIconProps> = React.memo(
  ({ direction, index, hide }) => {
    const icons = useIcons();

    if (hide || direction == null) {
      return null;
    }

    return (
      <span className={'sort-icon'}>
        {index != null && (
          <Badge badgeContent={index} color="default">
            <IconButton aria-label="Sort" size="small">
              {getIcon(icons, direction)}
            </IconButton>
          </Badge>
        )}
        {index == null && (
          <IconButton aria-label="Sort" size="small">
            {getIcon(icons, direction)}
          </IconButton>
        )}
      </span>
    );
  },
);
ColumnHeaderSortIcon.displayName = 'ColumnHeaderSortIcon';
