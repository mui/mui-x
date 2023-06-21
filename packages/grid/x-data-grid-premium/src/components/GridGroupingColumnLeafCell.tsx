import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridGroupingColumnLeafCell(props: GridRenderCellParams & { offsetMultiplier: number }) {
  const { rowNode, offsetMultiplier } = props;

  const rootProps = useGridRootProps();

  const marginLeft =
    rootProps.rowGroupingColumnMode === 'multiple' ? 1 : rowNode.depth * offsetMultiplier;

  return <Box sx={{ ml: marginLeft }}>{props.formattedValue ?? props.value}</Box>;
}

export { GridGroupingColumnLeafCell };
