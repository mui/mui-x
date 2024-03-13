import * as React from 'react';
import { BaseIconButtonProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridHeaderFilterClearIconProps extends Omit<BaseIconButtonProps, 'children'> {}

const style = { padding: '2px' };

function GridHeaderFilterClearButton(props: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      style={style}
      {...props}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnMenuClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
