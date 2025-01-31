import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridSidebarSearchFieldProps = GridSlotProps['baseTextField'] & {
  onClear: () => void;
};

export function GridSidebarSearchField(props: GridSidebarSearchFieldProps) {
  const { onClear, ...rest } = props;
  const rootProps = useGridRootProps();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }

    props.onKeyDown?.(event);
  };

  return (
    <rootProps.slots.baseTextField
      placeholder="Search"
      size="small"
      onKeyDown={handleKeyDown}
      slotProps={{
        input: {
          startAdornment: (
            <rootProps.slots.baseInputAdornment position="start">
              <SearchIcon fontSize="small" />
            </rootProps.slots.baseInputAdornment>
          ),
          endAdornment: (
            <rootProps.slots.baseInputAdornment position="end">
              <rootProps.slots.baseIconButton edge="end" size="small" onClick={props.onClear}>
                <CancelIcon fontSize="small" />
              </rootProps.slots.baseIconButton>
            </rootProps.slots.baseInputAdornment>
          ),
        },
      }}
      {...rest}
    />
  );
}
