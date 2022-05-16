import * as React from 'react';
import Box from '@mui/material/Box';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const GridGroupingColumnFooterCell = (props: GridRenderCellParams) => {
  const { rowNode } = props;

  const rootProps = useGridRootProps();

  let marginLeft: number;
  if (rowNode.parent == null) {
    marginLeft = 0;
  } else if (rootProps.rowGroupingColumnMode === 'multiple') {
    marginLeft = 1;
  } else {
    marginLeft = (rowNode.depth + 1) * 2;
  }

  return <Box sx={{ ml: marginLeft }}>{props.formattedValue ?? props.value}</Box>;
};

export { GridGroupingColumnFooterCell };
