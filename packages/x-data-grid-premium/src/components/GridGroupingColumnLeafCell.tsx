import * as React from 'react';
import Box from '@mui/material/Box';
import { vars } from '@mui/x-data-grid/internals';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridGroupingColumnLeafCell(props: GridRenderCellParams) {
  const { rowNode } = props;
  const rootProps = useGridRootProps();

  return (
    <Box
      sx={[
        rootProps.rowGroupingColumnMode === 'multiple'
          ? {
              ml: 1,
            }
          : {
              ml: `calc(var(--DataGrid-cellOffsetMultiplier) * var(--depth) * ${vars.spacing(1)})`,
            },
      ]}
      style={{ '--depth': rowNode.depth } as any}
    >
      {props.formattedValue ?? props.value}
    </Box>
  );
}

export { GridGroupingColumnLeafCell };
