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
          : {
              ml: (theme) =>
                `calc(var(--DataGrid-cellOffsetMultiplier) * ${theme.spacing(rowNode.depth)})`,
            },
      ]}
    >
      {props.formattedValue ?? props.value}
    </Box>
  );
}

export { GridGroupingColumnLeafCell };
