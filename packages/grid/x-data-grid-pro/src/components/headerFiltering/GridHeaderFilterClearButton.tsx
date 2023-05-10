import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridHeaderFilterClearIconProps {
  onClick: () => void;
}

function GridHeaderFilterClearButton({ onClick }: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="Clear filter"
      size="small"
      onClick={onClick}
    >
      <rootProps.slots.headerFilterClearIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearButton };
