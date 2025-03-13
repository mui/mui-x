import * as React from 'react';
import { GridSlotProps, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export type GridPivotPanelSearchProps = GridSlotProps['baseTextField'] & {
  onClear: () => void;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    container: ['pivotPanelSearchContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPivotPanelSearchContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSearchContainer',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(0, 1, 1),
});

function GridPivotPanelSearch(props: GridPivotPanelSearchProps) {
  const { onClear, ...other } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }

    props.onKeyDown?.(event);
  };

  return (
    <GridPivotPanelSearchContainer ownerState={rootProps} className={classes.container}>
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
        {...rootProps.slotProps?.baseTextField}
        {...other}
      />
    </GridPivotPanelSearchContainer>
  );
}

export { GridPivotPanelSearch };
