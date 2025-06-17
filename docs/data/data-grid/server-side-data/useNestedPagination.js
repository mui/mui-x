import * as React from 'react';
import { gridClasses } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid/internals';
import NestedPaginationGroupingCell from './NestedPaginationGroupingCell';

export default function useNestedPagination(initialPaginationModel) {
  const [expandedRows, setExpandedRows] = React.useState([]);
  const [paginationModels, setPaginationModels] = React.useState({
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
    (params) => (
      <NestedPaginationGroupingCell
        {...params}
        rowNode={params.rowNode}
        depth={expandedRows.length}
        setExpandedRows={setExpandedRows}
      />
    ),
    [setExpandedRows, expandedRows.length],
  );

  const setPaginationModel = React.useCallback(
    (model) => {
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
      [`& .${gridClasses.rowSkeleton} .${gridClasses.cell}:nth-child(1)`]: {
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
