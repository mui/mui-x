import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const GridGroupingColumnLeafCell = (props: GridRenderCellParams) => {
  const { rowNode } = props;

  const rootProps = useGridRootProps();

  const marginLeft = rootProps.rowGroupingColumnMode === 'multiple' ? 1 : rowNode.depth * 2;

  return <Box sx={{ ml: marginLeft }}>{props.formattedValue ?? props.value}</Box>;
};

export { GridGroupingColumnLeafCell };
