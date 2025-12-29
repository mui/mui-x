import * as React from 'react';
import { GridSlotProps, getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export type GridPivotPanelSearchProps = Pick<
  GridSlotProps['baseTextField'],
  'value' | 'onChange'
> & {
  onClear: () => void;
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

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
})({
  padding: vars.spacing(0, 1, 1),
});

function GridPivotPanelSearch(props: GridPivotPanelSearchProps) {
  const { onClear, value, onChange } = props;
  const { slots, slotProps, classes: rootPropsClasses } = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses({ classes: rootPropsClasses });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClear();
    }
  };

  return (
    <GridPivotPanelSearchContainer className={classes.container}>
      <slots.baseTextField
        size="small"
        aria-label={apiRef.current.getLocaleText('pivotSearchControlLabel')}
        placeholder={apiRef.current.getLocaleText('pivotSearchControlPlaceholder')}
        onKeyDown={handleKeyDown}
        fullWidth
        slotProps={{
          input: {
            startAdornment: <slots.pivotSearchIcon fontSize="small" />,
            endAdornment: value ? (
              <slots.baseIconButton
                edge="end"
                size="small"
                onClick={onClear}
                aria-label={apiRef.current.getLocaleText('pivotSearchControlClear')}
              >
                <slots.pivotSearchClearIcon fontSize="small" />
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
    </GridPivotPanelSearchContainer>
  );
}

export { GridPivotPanelSearch };
