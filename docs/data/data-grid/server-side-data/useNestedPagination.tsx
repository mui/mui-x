import * as React from 'react';
import type {
  GridValidRowModel,
  GridPaginationModel,
  GridDataSourceGroupNode,
  GridRenderCellParams,
  DataGridProProps,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid/internals';
import NestedPaginationGroupingCell from './NestedPaginationGroupingCell';

type Depth = number;

interface UseNestedPaginationReturnType {
  groupKeys: GridGetRowsParams['groupKeys'];
  paginationModel: DataGridProProps['paginationModel'];
  onPaginationModelChange: DataGridProProps['onPaginationModelChange'];
  groupingColDef: DataGridProProps['groupingColDef'];
  pinnedRows: DataGridProProps['pinnedRows'];
  sx: DataGridProProps['sx'];
}

export default function useNestedPagination(
  initialPaginationModel: GridPaginationModel,
): UseNestedPaginationReturnType {
  const [expandedRows, setExpandedRows] = React.useState<GridValidRowModel[]>([]);
  const [paginationModels, setPaginationModels] = React.useState<
    Record<Depth, GridPaginationModel>
  >({
    0: initialPaginationModel,
  });

  React.useEffect(() => {
    setPaginationModels((prev) => {
      const newPaginationModels = { ...prev };
      if (prev[expandedRows.length] == null) {
        newPaginationModels[expandedRows.length] = initialPaginationModel;
      }
      // Cleanup stale pagination models
      let i = expandedRows.length + 1;
      while (newPaginationModels[i] != null) {
        delete newPaginationModels[i];
        i += 1;
      }
      return newPaginationModels;
    });
  }, [expandedRows.length, initialPaginationModel]);

  const renderGroupingCell = React.useCallback(
    (params: GridRenderCellParams) => (
      <NestedPaginationGroupingCell
        {...params}
        rowNode={params.rowNode as GridDataSourceGroupNode}
        depth={expandedRows.length}
        setExpandedRows={setExpandedRows}
      />
    ),
    [setExpandedRows, expandedRows.length],
  );

  const setPaginationModel = React.useCallback(
    (model: GridPaginationModel) => {
      setPaginationModels((prev) => ({ ...prev, [expandedRows.length]: model }));
    },
    [expandedRows.length],
  );

  const groupKeys = React.useMemo(
    () => expandedRows.map((row) => row.groupingKey),
    [expandedRows],
  );

  const sx = React.useMemo(
    () => ({
      [`& .MuiDataGrid-rowSkeleton .MuiDataGrid-cell:nth-child(1)`]: {
        paddingLeft: vars.spacing((expandedRows.length + 1) * 2),
      },
    }),
    [expandedRows.length],
  );

  return {
    groupKeys,
    paginationModel: paginationModels[expandedRows.length],
    sx,
    onPaginationModelChange: setPaginationModel,
    groupingColDef: {
      renderCell: renderGroupingCell,
    },
    pinnedRows: {
      top: expandedRows,
    },
  };
}
