import * as React from 'react';
import { useGridRootProps } from '@mui/x-data-grid';
import { IconButtonProps } from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

// TODO: Figure out what the types should be for this component
// If users can provide a custom icon button, this could be something other than IconButtonProps
export function GridSidebarSearchButton(props: IconButtonProps) {
  const rootProps = useGridRootProps();
  const { slots } = rootProps;

  return (
    <slots.baseIconButton size="small" {...props}>
      {/* Replace with a new slots.searchButtonIcon or similar */}
      <SearchIcon fontSize="small" />
    </slots.baseIconButton>
  );
}
