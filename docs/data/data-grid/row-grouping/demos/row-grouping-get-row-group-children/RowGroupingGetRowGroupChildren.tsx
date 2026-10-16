import { gridRowNodeSelector } from '@mui/x-data-grid';
import * as React from 'react';
import type { GridEventListener } from '@mui/x-data-grid-premium';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import type { Movie } from '@mui/x-data-grid-generator';
import { useMovieData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';

export default function RowGroupingGetRowGroupChildren() {
  // @focus-start @padding 1
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const [lastGroupClickedChildren, setLastGroupClickedChildren] = React.useState<
    string[] | null
  >(null);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
    },
  });

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params) => {
      // Only log groups
      if (
        !apiRef.current ||
        gridRowNodeSelector(apiRef, params.id)?.type !== 'group'
      ) {
        return;
      }

      const rowIds = apiRef.current.getRowGroupChildren({
        groupId: params.id,
      });

      const rowTitles = rowIds.map(
        (rowId) => apiRef.current!.getRow<Movie>(rowId)!.title,
      );

      setLastGroupClickedChildren(rowTitles);
    },
    [apiRef],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          {...data}
          apiRef={apiRef}
          onRowClick={handleRowClick}
          hideFooter
          initialState={initialState}
        />
      </div>
      <Alert severity="info" sx={{ mb: 1 }}>
        {lastGroupClickedChildren ? (
          <code>
            Movies in the last group clicked
            <br />
            <br />
            {lastGroupClickedChildren.map((movieTitle) => (
              <React.Fragment>
                - {movieTitle}
                <br />
              </React.Fragment>
            ))}
          </code>
        ) : (
          <code>Click on a group row to log its children here</code>
        )}
      </Alert>
    </div>
  );
  // @focus-end
}
