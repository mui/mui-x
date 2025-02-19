import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export type GridSidebarSearchFieldProps = GridSlotProps['baseTextField'] & {
  onClear: () => void;
};

export function GridSidebarSearchField(props: GridSidebarSearchFieldProps) {
  const { onClear, ...rest } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }

    props.onKeyDown?.(event);
  };

  return (
    <rootProps.slots.baseTextField
      size="small"
      aria-label={apiRef.current.getLocaleText('pivotSearchControlLabel')}
      placeholder={apiRef.current.getLocaleText('pivotSearchControlPlaceholder')}
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
              <rootProps.slots.baseIconButton
                edge="end"
                size="small"
                onClick={props.onClear}
                aria-label={apiRef.current.getLocaleText('pivotSearchControlClear')}
              >
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
