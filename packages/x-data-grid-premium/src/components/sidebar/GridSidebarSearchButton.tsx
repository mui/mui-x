import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export type GridSidebarSearchButtonProps = GridSlotProps['baseIconButton'];

export function GridSidebarSearchButton(props: GridSidebarSearchButtonProps) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <rootProps.slots.baseIconButton
      aria-label={apiRef.current.getLocaleText('pivotSearchButton')}
      {...props}
    >
      {/* TODO: Replace with a new slots.searchButtonIcon or similar */}
      <SearchIcon fontSize="small" />
    </rootProps.slots.baseIconButton>
  );
}
