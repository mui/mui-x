import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridEventListener,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingExpandOnRowClick() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  const onRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params) => {
      const rowNode = apiRef.current?.getRowNode(params.id);
      if (rowNode && rowNode.type === 'group') {
        apiRef.current?.setRowChildrenExpansion(
          params.id,
          !rowNode.childrenExpanded,
        );
      }
    },
    [apiRef],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        onRowClick={onRowClick}
      />
    </div>
  );
}
