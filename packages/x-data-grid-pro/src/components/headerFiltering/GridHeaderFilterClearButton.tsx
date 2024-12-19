import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type BaseIconButtonProps = GridSlotProps['baseIconButton'];

// FIXME(v8:romgrk): Make parametric
interface GridHeaderFilterClearIconProps extends BaseIconButtonProps {}

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
