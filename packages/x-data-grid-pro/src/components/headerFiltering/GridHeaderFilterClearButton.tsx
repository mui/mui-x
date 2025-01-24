import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type BaseIconButtonProps = GridSlotProps['baseIconButton'];

interface GridHeaderFilterClearIconProps extends BaseIconButtonProps {}

function GridHeaderFilterClearButton(props: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      {...rootProps.slotProps?.baseIconButton}
      {...props}
    >
      <rootProps.slots.columnMenuClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
