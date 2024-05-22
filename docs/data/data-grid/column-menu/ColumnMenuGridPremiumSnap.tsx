import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

// This demo is used in visual regression tests to spot regressions in the column menu
export default function ColumnMenuGridPremiumSnap() {
  const apiRef = useGridApiRef();
  const data = useMovieData();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      aggregation: {
        model: {
          gross: 'avg',
        },
      },
      columns: {
        columnVisibilityModel: {
          cinematicUniverse: false,
          title: false,
        },
      },
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  React.useEffect(() => {
    // Timeout to avoid an issue around Popper being open before the ref is set.
    setTimeout(() => {
      apiRef.current.showColumnMenu('gross');
      console.log('after showColumnMenu');
    }, 0);
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        groupingColDef={{ leafField: 'title' }}
        initialState={initialState}
      />
    </div>
  );
}
