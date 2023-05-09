import * as React from 'react';
import { useGridRootProps } from '@mui/x-data-grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface GridHeaderFilterClearIconProps {
  onClick: () => void;
}

function GridHeaderFilterClearIcon({ onClick }: GridHeaderFilterClearIconProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton
      tabIndex={-1}
      aria-label="delete"
      size="small"
      onClick={onClick}
    >
      <HighlightOffIcon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}

export { GridHeaderFilterClearIcon };
