---
title: Data Grid - Aggregation
---

# Data Grid - Aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Add aggregation functions to the Data Grid to let users combine row values.

The Data Grid Premium provides tools to give end users the ability to aggregate and compare row values.
It includes [built-in functions](#built-in-functions) to cover common use cases such as sum, average, minimum, and maximum, as well as the means to [create custom functions](#creating-custom-functions) for all other needs.

End users can aggregate rows through the Data Grid interface by opening the column menu and selecting from the items under **Aggregation**.
The aggregated values are rendered in a footer row at the bottom of the Grid.

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationInitialState() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
        }}
      />
    </div>
  );
}

```

:::info
This document covers client-side implementation.
For aggregation on the server side, see [Server-side aggregation](/x/react-data-grid/server-side-data/aggregation/).
:::

## Structure of the model

The aggregation model is an object.
The keys correspond to the columns, and the values are the names of the aggregation functions.

## Initializing aggregation

To initialize aggregation without controlling its state, provide the model to the `initialState` prop, as shown below:

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationInitialState() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
        }}
      />
    </div>
  );
}

```

## Controlled aggregation

Use the `aggregationModel` prop to control aggregation passed to the Data Grid.
Use the `onAggregationModelChange` prop to listen to changes to aggregation and update the prop accordingly.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridAggregationModel,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationControlled() {
  const data = useMovieData();

  const [aggregationModel, setAggregationModel] =
    React.useState<GridAggregationModel>({
      gross: 'sum',
    });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        aggregationModel={aggregationModel}
        onAggregationModelChange={(newModel) => setAggregationModel(newModel)}
      />
    </div>
  );
}

```

## Disabling aggregation

### For all columns

To disable aggregation, set the `disableAggregation` prop to `true`.
This will disable all features related to aggregation, even if a model is provided.

```tsx
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function AggregationDisabled() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        disableAggregation
        initialState={{ aggregation: { model: { gross: 'sum' } } }}
      />
    </div>
  );
}

```

### For specific columns

To disable aggregation on a specific column, set the `aggregable` property on its column definition (`GridColDef`) to `false`.

In the example below, the **Year** column is not aggregable since its `aggregable` property is set to `false`.

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    groupable: false,
    aggregable: false,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'year',
    headerName: 'Year',
    type: 'number',
    aggregable: false,
  },
];

export default function AggregationColDefAggregable() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'sum',
            },
          },
        }}
      />
    </div>
  );
}

```

## Aggregating non-aggregable columns

To apply aggregation programmatically on non-aggregable columns (columns with `aggregable: false` in the [column definition](/x/api/data-grid/grid-col-def/)), you can provide the aggregation model in one of the following ways:

- Pass `aggregation.model` to the `initialState` prop. This initializes aggregation with the provided model.
- Provide the `aggregationModel` prop. This controls aggregation with the provided model.
- Call the API method `setAggregationModel()`. This applies an aggregation with the provided model.

In the following demo, even though the **Year** column is not aggregable, it's still aggregated in read-only mode by providing an initial aggregation model as described above.

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    groupable: false,
    aggregable: false,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'year',
    headerName: 'Year',
    type: 'number',
    aggregable: false,
  },
];

export default function AggregationColDefNonAggregable() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'sum',
              year: 'sum',
            },
          },
        }}
      />
    </div>
  );
}

```

## Usage with row grouping

When [row grouping](/x/react-data-grid/row-grouping/) is enabled, aggregated values can be displayed in the grouping rows as well as the top-level footer.

In the example below, each row group's sum is aggregated and displayed in its grouping row, and the total sum for all rows is displayed in the footer.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'company',
    headerName: 'Company',
    width: 200,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationRowGrouping() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
      aggregation: {
        model: {
          gross: 'sum',
        },
      },
    },
  });

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={COLUMNS}
        disableRowSelectionOnClick
        initialState={initialState}
      />
    </div>
  );
}

```

You can use the `getAggregationPosition` prop to customize this behavior.
This function takes the current group node as an argument (or `null` for the root group) and returns the position of the aggregated value.
The position can be one of three values:

- `"footer"`—the Data Grid adds a footer to the group to aggregate its rows.
- `"inline"`—the Data Grid disables aggregation on the grouping row.
- `null`—the Data Grid doesn't aggregate the group.

The following snippets build on the demo above to show various use cases for the `getAggregationPosition` prop:

```tsx
// Aggregate the root group in the top-level footer
// and the other groups in their grouping row
// (default behavior)
getAggregationPosition={(groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline')}

// Aggregate all the groups in their grouping row;
// the root will not be aggregated
getAggregationPosition={(groupNode) => groupNode == null ? null : 'inline'}

// Only aggregate the company groups in the grouping row;
// director groups and root will not be aggregated
getAggregationPosition={(groupNode) => groupNode?.groupingField === 'company' ? 'inline' : null}

// Only aggregate the company group "Universal Pictures" in the grouping row
getAggregationPosition={(groupNode) =>
(groupNode?.groupingField === 'company' &&
  groupNode?.groupingKey === 'Universal Pictures') ? 'inline' : null
}

// Only aggregate the root group in the top-level footer
getAggregationPosition={(groupNode) => groupNode == null ? 'footer' : null}
```

The demo below shows the sum aggregation in the footer of each group but not in the top-level footer:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'company',
    headerName: 'Company',
    width: 200,
  },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationGetAggregationPosition() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company', 'director'],
      },
      aggregation: {
        model: {
          gross: 'sum',
        },
      },
    },
  });

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={COLUMNS}
        disableRowSelectionOnClick
        initialState={initialState}
        getAggregationPosition={(groupNode) =>
          groupNode.depth === -1 ? null : 'footer'
        }
      />
    </div>
  );
}

```

## Usage with tree data

When working with [tree data](/x/react-data-grid/tree-data/), aggregated values can be displayed in the footer and in grouping rows.

:::info
If an aggregated value is displayed in a grouping row, it always takes precedence over any existing row data.
This means that even if the dataset explicitly provides group values, they will be ignored in favor of the aggregated values calculated by the Data Grid.
:::

In the demo below, the max values of the **Last modification** column and the sums of the **Size** column values are displayed in both the grouping rows and the footer:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  DataGridPremiumProps,
  GridGroupingColDefOverride,
} from '@mui/x-data-grid-premium';

interface File {
  hierarchy: string[];
  size: number;
  updatedAt: string;
}

const rows: GridRowsProp<File> = [
  {
    hierarchy: ['.gitignore'],
    size: 413,
    updatedAt: '2022-04-08T07:29:49.228Z',
  },
  {
    hierarchy: ['README.md'],
    size: 1671,
    updatedAt: '2022-04-11T08:05:44.590Z',
  },
  {
    hierarchy: ['next-env.d.ts'],
    size: 201,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['next.config.js'],
    size: 88,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['package.json'],
    size: 766,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', '_app.tsx'],
    size: 1105,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', '_document.tsx'],
    size: 2715,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', 'about.tsx'],
    size: 1034,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['pages', 'index.tsx'],
    size: 911,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['public', 'favicon.ico'],
    size: 25931,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'Copyright.tsx'],
    size: 428,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'Link.tsx'],
    size: 2851,
    updatedAt: '2022-04-08T07:29:49.228Z',
  },
  {
    hierarchy: ['src', 'ProTip.tsx'],
    size: 927,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'createEmotionCache.ts'],
    size: 331,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['src', 'theme.ts'],
    size: 332,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
  {
    hierarchy: ['tsconfig.json'],
    size: 550,
    updatedAt: '2022-03-28T11:53:29.298Z',
  },
];

const columns: GridColDef<File>[] = [
  {
    field: 'size',
    headerName: 'Size',
    type: 'number',
    valueGetter: (value) => {
      if (value == null) {
        return 0;
      }
      const sizeInKb = value / 1024;
      // Round to 2 decimal places
      return Math.round(sizeInKb * 100) / 100;
    },
    valueFormatter: (value) => `${value} Kb`,
  },
  {
    field: 'updatedAt',
    headerName: 'Last modification',
    type: 'dateTime',
    width: 200,
    valueGetter: (value) => {
      if (value == null) {
        return null;
      }

      return new Date(value);
    },
  },
];

const getTreeDataPath: DataGridPremiumProps<File>['getTreeDataPath'] = (row) =>
  row.hierarchy;

const getRowId: DataGridPremiumProps<File>['getRowId'] = (row) =>
  row.hierarchy.join('/');

const groupingColDef: GridGroupingColDefOverride<File> = {
  headerName: 'Files',
  width: 350,
};

export default function AggregationTreeData() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        treeData
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        getRowId={getRowId}
        groupingColDef={groupingColDef}
        initialState={{
          aggregation: {
            model: {
              size: 'sum',
              updatedAt: 'max',
            },
          },
        }}
      />
    </div>
  );
}

```

## Filtering

By default, aggregation only uses filtered rows.
To use all rows, set the `aggregationRowsScope` prop to `"all"`.

In the example below, the movie _Avatar_ doesn't pass the filters but is still used for the max aggregation of the **Gross** column:

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationFiltering() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              gross: 'max',
            },
          },
          filter: {
            filterModel: {
              items: [{ field: 'title', operator: 'equals', value: 'Titanic' }],
            },
          },
        }}
        aggregationRowsScope="all"
      />
    </div>
  );
}

```

## Aggregation functions

### Basic structure

An aggregation function is an object that describes how to combine a given set of values.

```ts
const minAgg: GridAggregationFunction<number | Date> = {
  // Aggregates the `values` into a single value.
  apply: ({ values }) => Math.min(...values.filter((value) => value != null)),
  // This aggregation function is only compatible with numerical values.
  columnTypes: ['number'],
};
```

You can find full typing details in the [`GridAggregationFunction` API reference](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions to cover common use cases:

| Name   | Behavior                                                   | Supported column types       |
| :----- | :--------------------------------------------------------- | :--------------------------- |
| `sum`  | Returns the sum of all values in the group                 | `number`                     |
| `avg`  | Returns the non-rounded average of all values in the group | `number`                     |
| `min`  | Returns the smallest value of the group                    | `number`, `date`, `dateTime` |
| `max`  | Returns the largest value of the group                     | `number`, `date`, `dateTime` |
| `size` | Returns the number of cells in the group                   | all                          |

### Removing a built-in function

#### From all columns

To remove specific aggregation functions from all columns, pass a filtered object to the `aggregationFunctions` prop.
In the example below, the sum function has been removed:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

export default function AggregationRemoveFunctionAllColumns() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        aggregationFunctions={Object.fromEntries(
          Object.entries(GRID_AGGREGATION_FUNCTIONS).filter(
            ([name]) => name !== 'sum',
          ),
        )}
        initialState={{
          aggregation: {
            model: {
              gross: 'max',
            },
          },
        }}
      />
    </div>
  );
}

```

#### From a specific column

To limit the aggregation options in a given column, pass the `availableAggregationFunctions` property to the column definition.
This lets you specify which options are available to the end user:

```ts
const column = {
  field: 'year',
  type: 'number',
  availableAggregationFunctions: ['max', 'min'],
};
```

In the example below, you can only aggregate the **Year** column using the max and min functions, whereas all functions are available for the **Gross** column:

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'year',
    headerName: 'Year',
    type: 'number',
    availableAggregationFunctions: ['max', 'min'],
  },
];

export default function AggregationRemoveFunctionOneColumn() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              year: 'max',
              gross: 'max',
            },
          },
        }}
      />
    </div>
  );
}

```

### Creating custom functions

An aggregation function is an object with the following shape:

```ts
const firstAlphabeticalAggregation: GridAggregationFunction<string, string | null> =
  {
    // The `apply` method takes the values to aggregate and returns the aggregated value
    apply: (params) => {
      if (params.values.length === 0) {
        return null;
      }

      const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

      return sortedValue[0];
    },
    // The `label` property defines the label displayed in the column header
    // when this aggregation is being used.
    label: 'firstAlphabetical',
    // The `types` property defines which type of columns can use this aggregation function.
    // Here, we only want to propose this aggregation function for `string` columns.
    // If not defined, aggregation will be available for all column types.
    columnTypes: ['string'],
  };
```

To provide custom aggregation functions, pass them to the `aggregationFunctions` prop on the Data Grid Premium.
In the example below, the Grid has two custom functions for `string` columns: `firstAlphabetical` and `lastAlphabetical`:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  GridAggregationFunction,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 200,
    groupable: false,
    aggregable: false,
  },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const firstAlphabeticalAggregation: GridAggregationFunction<string, string | null> =
  {
    apply: (params) => {
      if (params.values.length === 0) {
        return null;
      }

      const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

      return sortedValue[0];
    },
    label: 'first alphabetical',
    columnTypes: ['string'],
  };

const lastAlphabeticalAggregation: GridAggregationFunction<string, string | null> = {
  apply: (params) => {
    if (params.values.length === 0) {
      return null;
    }

    const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

    return sortedValue[sortedValue.length - 1];
  },
  label: 'last alphabetical',
  columnTypes: ['string'],
};

export default function AggregationCustomFunction() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        aggregationFunctions={{
          ...GRID_AGGREGATION_FUNCTIONS,
          firstAlphabetical: firstAlphabeticalAggregation,
          lastAlphabetical: lastAlphabeticalAggregation,
        }}
        initialState={{
          aggregation: {
            model: {
              director: 'firstAlphabetical',
            },
          },
        }}
      />
    </div>
  );
}

```

### Aggregating data from multiple row fields

By default, the `apply` method of the aggregation function receives an array of values that represent a single field value from each row.

In the example below, the sum function receives the values of the `gross` field.
The values in the `profit` column are derived from the `gross` and `budget` fields of the row:

```tsx
{
  field: 'profit',
  type: 'number',
  valueGetter: (value, row) => {
    if (!row.gross || !row.budget) {
      return null;
    }
    return (row.gross - row.budget) / row.budget;
  }
}
```

To aggregate the `profit` column, you would have to calculate the sum of the `gross` and `budget` fields separately, and then use the formula from the example above to calculate the aggregated `profit` value.
To do this, you can use the `getCellValue()` callback on the aggregation function to transform the data being passed to the `apply()` method:

```tsx
const profit: GridAggregationFunction<{ gross: number; budget: number }, number> = {
  label: 'profit',
  getCellValue: ({ row }) => ({ budget: row.budget, gross: row.gross }),
  apply: ({ values }) => {
    let budget = 0;
    let gross = 0;
    values.forEach((value) => {
      if (value) {
        gross += value.gross;
        budget += value.budget;
      }
    });
    return (gross - budget) / budget;
  },
  columnTypes: ['number'],
};
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridAggregationFunction,
  GridColDef,
  GRID_AGGREGATION_FUNCTIONS,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData, Movie } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function calculateProfit(gross: number, budget: number) {
  return (gross - budget) / budget;
}

const COLUMNS: GridColDef<Movie>[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'company',
    headerName: 'Company',
    width: 200,
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    width: 70,
    groupable: false,
    valueGetter: (value, row) => {
      if (!row.gross || !row.budget) {
        return null;
      }
      return calculateProfit(row.gross, row.budget);
    },
    valueFormatter: (value) => {
      if (!value) {
        return null;
      }
      return `${Math.round(value * 100)}%`;
    },
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    minWidth: 140,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'budget',
    headerName: 'Budget',
    type: 'number',
    minWidth: 140,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const profit: GridAggregationFunction<{ gross: number; budget: number }, number> = {
  label: 'profit',
  getCellValue: ({ row }) => ({ budget: row.budget, gross: row.gross }),
  apply: ({ values }) => {
    let budget = 0;
    let gross = 0;
    values.forEach((value) => {
      if (value) {
        gross += value.gross;
        budget += value.budget;
      }
    });
    return calculateProfit(gross, budget);
  },
  columnTypes: ['number'],
};

export default function AggregationMultipleRowFields() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
      aggregation: {
        model: {
          gross: 'sum',
          budget: 'sum',
          profit: 'profit',
        },
      },
    },
  });

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        columns={COLUMNS}
        disableRowSelectionOnClick
        initialState={initialState}
        aggregationFunctions={{
          ...GRID_AGGREGATION_FUNCTIONS,
          profit,
        }}
      />
    </div>
  );
}

```

### Custom value formatter

By default, an aggregated cell uses the value formatter of its corresponding column.
But for some columns, the format of the aggregated value might differ from that of the column values.
You can provide a `valueFormatter()` method to the aggregation function to override the column's default formatting:

```ts
const aggregationFunction: GridAggregationFunction = {
  apply: () => {
    /* */
  },
  valueFormatter: (params) => {
    /* format the aggregated value */
  },
};
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  GridAggregationFunction,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'director',
    headerName: 'Director',
    width: 200,
  },
  {
    field: 'gross',
    headerName: 'Gross',
    type: 'number',
    width: 150,
    groupable: false,
    valueFormatter: (value) => {
      if (!value) {
        return value;
      }
      return currencyFormatter.format(value);
    },
  },
];

const firstAlphabeticalAggregation: GridAggregationFunction<string, string | null> =
  {
    apply: (params) => {
      if (params.values.length === 0) {
        return null;
      }

      const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

      return sortedValue[0];
    },
    label: 'first alphabetical',
    valueFormatter: (value) => `Agg: ${value}`,
    columnTypes: ['string'],
  };

export default function AggregationValueFormatter() {
  const data = useMovieData();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={data.rows}
        columns={COLUMNS}
        aggregationFunctions={{
          ...GRID_AGGREGATION_FUNCTIONS,
          firstAlphabetical: firstAlphabeticalAggregation,
        }}
        initialState={{
          aggregation: {
            model: {
              director: 'firstAlphabetical',
            },
          },
        }}
      />
    </div>
  );
}

```

## Custom rendering

If the column used to display aggregation has a `renderCell()` property, then the aggregated cell calls it with a `params.aggregation` object to let you decide how you want to render it.
This object contains a `hasCellUnit` property to indicate whether the current aggregation has the same unit as the rest of the column's data—for instance, if the column is in `$`, is the aggregated value is also in `$`?

In the example below, all the aggregation functions are rendered with the rating UI aside from `size`, because it's not a valid rating:

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import Rating from '@mui/material/Rating';

const COLUMNS: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200, groupable: false },
  {
    field: 'imdbRating',
    headerName: 'Rating',
    type: 'number',
    width: 180,
    availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
    display: 'flex',
    // Imdb rating is on a scale from 0 to 10, the MUI rating component is on a scale from 0 to 5
    renderCell: (params) => {
      if (params.aggregation && !params.aggregation.hasCellUnit) {
        return params.formattedValue;
      }

      return (
        <Rating
          name={params.row.title}
          value={params.value / 2}
          readOnly
          precision={0.5}
        />
      );
    },
  },
];

export default function AggregationRenderCell() {
  const data = useMovieData();

  // We take movies with the highest and lowest rating to have a visual difference
  const rows = React.useMemo(() => {
    return [...data.rows].sort((a, b) => b.imdbRating - a.imdbRating);
  }, [data.rows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={COLUMNS}
        initialState={{
          aggregation: {
            model: {
              imdbRating: 'avg',
            },
          },
        }}
      />
    </div>
  );
}

```

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Aggregation"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunction](/x/api/data-grid/grid-aggregation-function/)
