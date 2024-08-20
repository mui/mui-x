import * as React from 'react';
import Box from '@mui/material/Box';
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
          : (theme) => ({
              ml: `calc(var(--DataGrid-cellOffsetMultiplier) * var(--depth) * ${theme.spacing(1)})`,
            }),
      ]}
      style={{ '--depth': rowNode.depth } as any}
    >
      {props.formattedValue ?? props.value}
    </Box>
  );
}

export { GridGroupingColumnLeafCell };
