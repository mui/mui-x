import * as React from 'react';
import { GridSlotProps, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export type GridChartsPanelDataSearchProps = Pick<
  GridSlotProps['baseTextField'],
  'value' | 'onChange'
> & {
  onClear: () => void;
};

type OwnerState = Omit<DataGridPremiumProcessedProps, 'rows'>;

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
  const { rows, ...rootProps } = useGridRootProps();
  const { slots, slotProps } = rootProps;
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }
  };

  return (
    <GridChartsPanelDataSearchContainer className={classes.container} ownerState={rootProps}>
      <slots.baseTextField
        size="small"
        aria-label={apiRef.current.getLocaleText('chartsSearchLabel')}
        placeholder={apiRef.current.getLocaleText('chartsSearchPlaceholder')}
        onKeyDown={handleKeyDown}
        fullWidth
        slotProps={{
          input: {
            startAdornment: <slots.chartsSearchIcon fontSize="small" />,
            endAdornment: value ? (
              <slots.baseIconButton
                edge="end"
                size="small"
                onClick={onClear}
                aria-label={apiRef.current.getLocaleText('chartsSearchClear')}
              >
                <slots.chartsSearchClearIcon fontSize="small" />
              </slots.baseIconButton>
            ) : null,
          },
          htmlInput: {
            role: 'searchbox',
          },
        }}
        {...slotProps?.baseTextField}
        value={value}
        onChange={onChange}
      />
    </GridChartsPanelDataSearchContainer>
  );
}

export { GridChartsPanelDataSearch };
