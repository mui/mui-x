import * as React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';

const GridAggregationCellRoot = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'AggregationCell',
  overridesResolver: (_, styles) => styles.aggregationCell,
})<{ ownerState: GridRenderCellParams }>(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

interface GridFooterCellProps extends GridRenderCellParams {
  sx?: SxProps<Theme>;
}

const GridFooterCell = (props: GridFooterCellProps) => {
  const { sx, formattedValue } = props;

  return (
    <GridAggregationCellRoot ownerState={props} sx={sx}>
      {formattedValue}
    </GridAggregationCellRoot>
  );
};

export { GridFooterCell };
