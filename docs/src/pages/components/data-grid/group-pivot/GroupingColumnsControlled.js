import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';

const INITIAL_GROUPING_COLUMN_MODEL = ['company', 'director'];

export default function GroupingColumnsControlled() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const [groupingColumnsModel, setGroupingColumnsModel] = React.useState(
    INITIAL_GROUPING_COLUMN_MODEL,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        groupingColumnsModel={groupingColumnsModel}
        onGroupingColumnsModelChange={(model) => setGroupingColumnsModel(model)}
        experimentalFeatures={{
          groupingColumns: true,
        }}
      />
    </div>
  );
}
