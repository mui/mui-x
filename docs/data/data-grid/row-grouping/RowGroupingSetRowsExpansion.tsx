import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function RowGroupingSetRowsExpansion() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  const expandToDepth = (depth: number) => {
    apiRef.current?.setRowsExpansion((node) => node.depth < depth);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => apiRef.current?.collapseAllRows()}>
          Collapse all
        </Button>
        <Button size="small" onClick={() => expandToDepth(1)}>
          Expand companies
        </Button>
        <Button size="small" onClick={() => apiRef.current?.expandAllRows()}>
          Expand all
        </Button>
      </Stack>
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
