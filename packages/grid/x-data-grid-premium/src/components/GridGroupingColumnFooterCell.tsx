import * as React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridFooterCell } from './GridFooterCell';

function GridGroupingColumnFooterCell(props: GridRenderCellParams) {
  const { rowNode } = props;

  const rootProps = useGridRootProps();

  let marginLeft: number;
  if (rowNode.parent == null) {
    marginLeft = 0;
  } else if (rootProps.rowGroupingColumnMode === 'multiple') {
    marginLeft = 2;
  } else {
    marginLeft = rowNode.depth * 2;
  }

  return <GridFooterCell sx={{ ml: marginLeft }} {...props} />;
}

export { GridGroupingColumnFooterCell };
