import * as React from 'react';
import Box from '@mui/material/Box';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridRenderCellParams } from '../../models/params/gridCellParams';

const GridGroupingColumnLeafCell = (props: GridRenderCellParams) => {
  const { rowNode } = props;

  const rootProps = useGridRootProps();

  const marginLeft = rootProps.groupingColumnMode === 'multiple' ? 1 : rowNode.depth * 2;

  return <Box sx={{ ml: marginLeft }}>{props.formattedValue ?? props.value}</Box>;
};

export { GridGroupingColumnLeafCell };
