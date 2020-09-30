import * as React from 'react';
import IconButton from "@material-ui/core/IconButton";
import { useIcons } from '../hooks/utils/useIcons';

export interface ColumnHeaderFilterIconProps {
}

export const ColumnHeaderFilterIcon: React.FC<ColumnHeaderFilterIconProps> = React.memo(
  () => {
    const icons = useIcons();
    const icon = React.createElement(icons.columnFiltering!, {});

    return (
      <div className={'MuiDataGrid-iconFilter'}>
        <IconButton aria-label="Sort" size="small">
          {icon}
        </IconButton>
      </div>
    );
  }
);
ColumnHeaderFilterIcon.displayName = 'ColumnHeaderFilterIcon';
