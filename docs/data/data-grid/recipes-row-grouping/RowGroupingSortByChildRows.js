import * as React from 'react';
import {
  DataGridPremium,
  gridFilteredDescendantCountLookupSelector,
  useGridApiRef,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingSortByChildRows() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={{
          rowGrouping: {
            model: ['company', 'cinematicUniverse'],
          },
          sorting: {
            sortModel: [
              // TODO: this doesn't work
              { field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'desc' },
            ],
          },
        }}
        groupingColDef={{
          sortComparator: (v1, v2, cellParams1, cellParams2) => {
            if (
              cellParams1.rowNode.type === 'group' &&
              cellParams2.rowNode.type === 'group'
            ) {
              // We want to sort values of each group, but only inside the group
              if (
                cellParams1.rowNode.groupingField ===
                cellParams2.rowNode.groupingField
              ) {
                const filteredDescendantCountLookup =
                  gridFilteredDescendantCountLookupSelector(apiRef);
                const cell1DescendantCount =
                  filteredDescendantCountLookup[cellParams1.rowNode.id] ?? 0;
                const cell2DescendantCount =
                  filteredDescendantCountLookup[cellParams2.rowNode.id] ?? 0;

                return cell1DescendantCount - cell2DescendantCount;
              }
              return 0;
            }

            if (cellParams1.rowNode.type === 'group') {
              return 1;
            }

            if (cellParams2.rowNode.type === 'group') {
              return -1;
            }

            return 0;
          },
        }}
      />
    </div>
  );
}
