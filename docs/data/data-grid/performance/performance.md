# Data Grid - Performance

<p class="description">Improve the performance of the DataGrid using the recommendations from this guide.</p>

## Memoize inner components with `React.memo`

The `DataGrid` component is composed of a central state object where all data is stored.
When an API method is called, a prop changes, or the user interacts with the UI (e.g. filtering a column), this state object is updated with the changes made.
To reflect the changes in the interface, the component must re-render.
Since the state behaves like `React.useState`, it means that the `DataGrid` component will re-render as well as its children, which includes column headers, rows and cells.
With smaller datasets, this is not a problem for concern, but it can become a bottleneck if the number of rows gets increased and, specially, if many columns render [custom content](/x/react-data-grid/column-definition/#rendering-cells).
One way to overcome this issue is using `React.memo` to only re-render the children components when their props have changed.
To start using memoization, import the inner components, then pass their memoized version to the respective slots, as follow:

```tsx
import {
  GridRow,
  GridCell,
  DataGrid, // or DataGridPro, DataGridPremium
  DataGridColumnHeaders, // or DataGridProColumnHeaders, DataGridPremiumColumnHeaders
} from '@mui/x-data-grid';

const MemoizedRow = React.memo(GridRow);
const MemoizedCell = React.memo(GridCell);
const MemoizedColumnHeaders = React.memo(DataGridColumnHeaders);

<DataGrid
  components={{
    Row: MemoizedRow,
    Cell: MemoizedCell,
    ColumnHeaders: MemoizedColumnHeaders,
  }}
/>;
```

The following demo show this trick in action.
It also contains additional logic to highlight the components when they re-render.

{{"demo": "GridWithReactMemo.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
We do not ship the components above already wrapped with `React.memo` because if you have cells that display custom content whose source is not the received props, these cells may display outdated information.
For instance, if you define a column with a custom cell renderer where content comes from a [selector](/x/react-data-grid/state/#catalog-of-selectors) that changes more often then the props passed to `GridCell` and `GridRow`, the row and column should not be memoized.
You can choose whether to memoize or not a component by passing a 2nd argument to `React.memo`:

```tsx
function shallowCompare(prevProps, nextProps) {
  const aKeys = Object.keys(prevProps);
  const bKeys = Object.keys(nextProps);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every(
    (key) => nextProps.hasOwnProperty(key) && nextProps[key] === prevProps[key],
  );
}

const MemoizedCell = React.memo(GridCell, (prevProps, nextProps) => {
  // Prevent memoizing the cells from the "total" column
  return nextProps.field !== 'total' && shallowCompare(prevProps, nextProps);
});
```

:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
