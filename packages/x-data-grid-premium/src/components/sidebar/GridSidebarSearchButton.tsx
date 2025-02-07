import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridSidebarSearchButtonProps = GridSlotProps['baseIconButton'];

export function GridSidebarSearchButton(props: GridSidebarSearchButtonProps) {
  const rootProps = useGridRootProps();
  return (
    <rootProps.slots.baseIconButton size="small" {...props}>
      {/* TODO: Replace with a new slots.searchButtonIcon or similar */}
      <SearchIcon fontSize="small" />
    </rootProps.slots.baseIconButton>
  );
}
