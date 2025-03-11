import * as React from 'react';
import { GridSlotProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export type GridSidebarSearchFieldProps = GridSlotProps['baseTextField'] & {
  onClear: () => void;
};

function GridSidebarSearchField(props: GridSidebarSearchFieldProps) {
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
      fullWidth
      slotProps={{
        input: {
          startAdornment: <rootProps.slots.pivotSearchIcon fontSize="small" />,
          endAdornment: props.value ? (
            <rootProps.slots.baseIconButton
              edge="end"
              size="small"
              onClick={props.onClear}
              aria-label={apiRef.current.getLocaleText('pivotSearchControlClear')}
            >
              <rootProps.slots.pivotSearchClearIcon fontSize="small" />
            </rootProps.slots.baseIconButton>
          ) : null,
        },
      }}
      {...rest}
    />
  );
}

export { GridSidebarSearchField };
