import * as React from 'react';
import { GridSlotProps, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export type GridChartsDataPanelSearchProps = Pick<
  GridSlotProps['baseTextField'],
  'value' | 'onChange'
> & {
  onClear: () => void;
};

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    container: ['chartsDataPanelSearchContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridChartsDataPanelSearchContainer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsDataPanelSearchContainer',
})<{ ownerState: OwnerState }>({
  padding: vars.spacing(1),
});

function GridChartsDataPanelSearch(props: GridChartsDataPanelSearchProps) {
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
    <GridChartsDataPanelSearchContainer ownerState={rootProps} className={classes.container}>
      <rootProps.slots.baseTextField
        size="small"
        aria-label={apiRef.current.getLocaleText('chartsConfigurationSearchLabel')}
        placeholder={apiRef.current.getLocaleText('chartsConfigurationSearchPlaceholder')}
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
                aria-label={apiRef.current.getLocaleText('chartsConfigurationSearchClear')}
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
    </GridChartsDataPanelSearchContainer>
  );
}

export { GridChartsDataPanelSearch };
