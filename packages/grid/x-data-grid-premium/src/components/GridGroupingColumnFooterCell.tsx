import * as React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridFooterCell } from './GridFooterCell';

function GridGroupingColumnFooterCell({
  offsetMultiplier,
  ...props
}: GridRenderCellParams & { offsetMultiplier: number }) {
  const rootProps = useGridRootProps();

  let marginLeft: number;
  if (props.rowNode.parent == null) {
    marginLeft = 0;
  } else if (rootProps.rowGroupingColumnMode === 'multiple') {
    marginLeft = 2;
  } else {
    marginLeft = props.rowNode.depth * offsetMultiplier;
  }

  return <GridFooterCell sx={{ ml: marginLeft }} {...props} />;
}

export { GridGroupingColumnFooterCell };
