---
title: Data Grid - Row grouping recipes
---

# Data Grid - Row grouping recipes [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Advanced grid customization recipes.

## Toggling groups on row click

In the demo below, you can toggle the group by clicking anywhere on the grouping row:

```tsx
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

```

## Pinning a grouped column

Use `GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD` to pin a grouped column. In the demo below, the `Company` column is pinned:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function RowGroupingPinning() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
      pinnedColumns: { left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD] },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium {...data} apiRef={apiRef} initialState={initialState} />
    </div>
  );
}

```

## Creating and reordering groups with drag and drop

See [Toolbar component—Row grouping bar](/x/react-data-grid/components/toolbar/#row-grouping-toolbar) for an example of how to add a custom toolbar that allows users to create row groups with drag and drop.

## Sorting row groups by the number of child rows

By default, the row grouping column uses `sortComparator` of the grouping column for sorting.

To sort the row groups by the number of child rows, you can override it using `groupingColDef.sortComparator`:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  gridFilteredDescendantCountLookupSelector,
  useGridApiRef,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridGroupingColDefOverride,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const initialState: GridInitialState = {
  rowGrouping: {
    model: ['company', 'cinematicUniverse'],
  },
  sorting: {
    sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'desc' }],
  },
};

export default function RowGroupingSortByChildRows() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const groupingColDef: GridGroupingColDefOverride = React.useMemo(
    () => ({
      width: 275,
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        if (
          cellParams1.rowNode.type === 'group' &&
          cellParams2.rowNode.type === 'group'
        ) {
          // Sort the values, but only within the same group
          if (
            cellParams1.rowNode.groupingField === cellParams2.rowNode.groupingField
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
    }),
    [apiRef],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}

```

## Displaying child row count in footer

By default, the row count in the footer is the number of top level rows that are visible after filtering.

In the demo below, a `CustomFooterRowCount` component is added to the `footerRowCount` slot. This component uses the `gridFilteredDescendantRowCountSelector` to get the number of child rows and display it alongside the number of groups.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridRowCountProps,
  useGridApiRef,
  useGridSelector,
  useKeepGroupedColumnsHidden,
  useGridApiContext,
  gridFilteredDescendantRowCountSelector,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';

function CustomFooterRowCount(props: GridRowCountProps) {
  const { visibleRowCount: topLevelRowCount } = props;
  const apiRef = useGridApiContext();
  const descendantRowCount = useGridSelector(
    apiRef,
    gridFilteredDescendantRowCountSelector,
  );

  return (
    <Box sx={{ mx: 2 }}>
      {descendantRowCount} row{descendantRowCount > 1 ? 's' : ''} in{' '}
      {topLevelRowCount} group
      {topLevelRowCount > 1 ? 's' : ''}
    </Box>
  );
}

export default function RowGroupingChildRowCount() {
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

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        slots={{
          footerRowCount: CustomFooterRowCount,
        }}
      />
    </div>
  );
}

```
