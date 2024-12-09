import * as React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { inputBaseClasses } from '@mui/material/InputBase';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridHeaderFilterClearIconProps extends IconButtonProps {}

function GridHeaderFilterClearButton(props: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      sx={{
        [`.${inputBaseClasses.root} &`]: {
          mx: -0.5,
        },
      }}
      {...props}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnMenuClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
