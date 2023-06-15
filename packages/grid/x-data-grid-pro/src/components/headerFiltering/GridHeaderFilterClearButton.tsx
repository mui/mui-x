import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridHeaderFilterClearIconProps {
  onClick: () => void;
}

const sx = { padding: '2px' };

function GridHeaderFilterClearButton({ onClick }: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      onClick={onClick}
      sx={sx}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnMenuClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
