import * as React from 'react';
import {
  DataGridPremium,
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const debug = (params: GridGroupNode) =>
  console.info('Row expansion changed for row ', params.id);

export default function RowGroupingSetChildrenExpansion() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.subscribeEvent('rowExpansionChange', debug);
  }, [apiRef]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  const toggle2ndGroup = () => {
    const groups =
      apiRef.current.getRowNode<GridGroupNode>(GRID_ROOT_GROUP_ID)!.children;

    if (groups.length > 1) {
      const groupId = groups[1];
      apiRef.current.setRowChildrenExpansion(
        groupId,
        !apiRef.current.getRowNode<GridGroupNode>(groupId)!.childrenExpanded,
      );
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Button size="small" onClick={toggle2ndGroup}>
        Toggle 2nd row expansion
      </Button>
      <Box sx={{ height: 400, pt: 1 }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          disableRowSelectionOnClick
          initialState={initialState}
        />
      </Box>
    </Box>
  );
}
