import * as React from 'react';
import { type GridSlotProps, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export type GridChartsPanelDataSearchProps = Pick<
  GridSlotProps['baseTextField'],
  'value' | 'onChange'
> & {
  onClear: () => void;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    container: ['chartsPanelDataSearchContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsPanelDataSearchContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelDataSearchContainer',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1),
});

function GridChartsPanelDataSearch(props: GridChartsPanelDataSearchProps) {
  const { onClear, value, onChange } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }
  };

  return (
    <GridChartsPanelDataSearchContainer ownerState={rootProps} className={classes.container}>
      <rootProps.slots.baseTextField
        size="small"
        aria-label={apiRef.current.getLocaleText('chartsSearchLabel')}
        placeholder={apiRef.current.getLocaleText('chartsSearchPlaceholder')}
        onKeyDown={handleKeyDown}
        fullWidth
        slotProps={{
          input: {
            startAdornment: <rootProps.slots.chartsSearchIcon fontSize="small" />,
            endAdornment: value ? (
              <rootProps.slots.baseIconButton
                edge="end"
                size="small"
                onClick={onClear}
                aria-label={apiRef.current.getLocaleText('chartsSearchClear')}
              >
                <rootProps.slots.chartsSearchClearIcon fontSize="small" />
              </rootProps.slots.baseIconButton>
            ) : null,
          },
          htmlInput: {
            role: 'searchbox',
          },
        }}
        {...rootProps.slotProps?.baseTextField}
        value={value}
        onChange={onChange}
      />
    </GridChartsPanelDataSearchContainer>
  );
}

export { GridChartsPanelDataSearch };
