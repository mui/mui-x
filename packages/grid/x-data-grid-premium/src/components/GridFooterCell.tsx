import * as React from 'react';
import { getDataGridUtilityClass, GridRenderCellParams } from '@mui/x-data-grid';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

const GridAggregationCellRoot = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'AggregationCell',
  overridesResolver: (_, styles) => styles.footerCell,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

interface GridFooterCellProps extends GridRenderCellParams {
  sx?: SxProps<Theme>;
}

interface OwnerState {
  classes: DataGridPremiumProcessedProps['classes'];
}

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['footerCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridFooterCell = (props: GridFooterCellProps) => {
  const { sx, formattedValue } = props;
  const rootProps = useGridRootProps();

  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <GridAggregationCellRoot ownerState={ownerState} sx={sx} className={classes.root}>
      {formattedValue}
    </GridAggregationCellRoot>
  );
};

export { GridFooterCell };
