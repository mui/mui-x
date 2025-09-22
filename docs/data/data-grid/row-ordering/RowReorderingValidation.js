import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const isValidRowReorder = (context) => {
  if (context.sourceNode.type === 'group') {
    return true;
  }
  if (context.targetNode.type === 'leaf') {
    return context.sourceNode.parent !== context.targetNode.parent;
  }
  return false;
};

export default function RowReorderingValidation() {
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

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        rowReordering
        isValidRowReorder={isValidRowReorder}
      />
    </div>
  );
}
