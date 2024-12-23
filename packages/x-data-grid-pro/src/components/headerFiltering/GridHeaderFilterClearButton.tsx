import * as React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridHeaderFilterClearIconProps extends IconButtonProps {}

function GridHeaderFilterClearButton(props: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      sx={{ ml: 0.25 }}
      {...rootProps.slotProps?.baseIconButton}
      {...props}
    >
      <rootProps.slots.columnMenuClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
