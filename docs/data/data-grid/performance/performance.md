# Data Grid - Performance

<p class="description">Improve the performance of the DataGrid using the recommendations from this guide.</p>

## Extract static objects and memoize root props

The `DataGrid` component uses `React.memo` to optimize its performance, which means itself and its subcomponents only
re-render when their props change. But it's very easy to cause unnecessary re-renders if the root props of your
`DataGrid` aren't memoized. Take the example below, the `slots` and `initialState` objects are re-created on every
render, which means the `DataGrid` itself has no choice but to re-render as well.

```tsx
function Component(props) {
  return (
    <DataGrid
      rows={props.rows}
      slots={{
        row: CustomRow,
      }}
      cellModesModel={{ [props.rows[0].id]: { name: { mode: GridCellModes.Edit } } }}
    />
  );
}
```

An easy way to prevent re-renders is to extract any object that can be a static object, and to memoize any object that
depends on another object. This applies to any prop that is an object or a function.

```tsx
const slots = {
  row: CustomRow,
};

function Component(props) {
  const cellModesModel = React.useMemo(
    () => ({ [props.rows[0].id]: { name: { mode: GridCellModes.Edit } } }),
    [props.rows],
  );

  return (
    <DataGrid rows={props.rows} slots={slots} cellModesModel={cellModesModel} />
  );
}
```

## Visualization

The DataGrid memoizes some of its subcomponents to avoid re-rendering more than needed. Below is a visualization that
shows you which cells re-render in reaction to your interaction with the grid.

{{"demo": "GridVisualization.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
