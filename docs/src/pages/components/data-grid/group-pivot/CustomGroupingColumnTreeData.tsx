import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  GridRenderCellParams,
  useGridApiContext,
  useGridSelector,
  gridVisibleDescendantCountLookupSelector,
} from '@mui/x-data-grid-pro';
import { useDemoTreeData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const CustomGridTreeDataGroupingCell = (props: GridRenderCellParams) => {
  const { id } = props;
  const apiRef = useGridApiContext();
  const descendantCountLookup = useGridSelector(
    apiRef,
    gridVisibleDescendantCountLookupSelector,
  );
  const node = apiRef.current.UNSTABLE_getRowNode(id);
  const descendantCount = descendantCountLookup[id];

  if (!node) {
    throw new Error(`MUI: No row with id #${id} found`);
  }

  return (
    <Box sx={{ ml: node.depth * 4 }}>
      <div>
        {descendantCount > 0 ? (
          <Button
            onClick={() =>
              apiRef.current.UNSTABLE_setRowExpansion(id, !node?.expanded)
            }
            tabIndex={-1}
            size="small"
          >
            See {descendantCount} children
          </Button>
        ) : (
          <span />
        )}
      </div>
    </Box>
  );
};

const groupingColDef: DataGridProProps['groupingColDef'] = {
  renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
};

export default function CustomGroupingColumnTreeData() {
  const { data, loading } = useDemoTreeData({
    rowLength: [10, 5, 3],
    randomLength: true,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        disableSelectionOnClick
        groupingColDef={groupingColDef}
        {...data}
      />
    </div>
  );
}
