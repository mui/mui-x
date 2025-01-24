# Data Grid - Performance

<p class="description">Follow these recommendations to improve your Data Grid's performance.</p>

The Data Grid is a complex component that renders many elements, and you can inadvertantly introduce performance issues by triggering unnecessary re-renders.
This guide describes best practices for implementing your Data Grid to avoid common problems.

## Maintain a stable reference when passing props

As a general rule, all non-primitive props should maintain a stable reference between renders to avoid unnecessary re-renders.
This is especially important for the `columns` prop.
Columns are designed to be definitions that never change once the component is mounted; otherwise, you risk losing elements like column width or order.

There are two ways to maintain a stable reference:

1. If the columns don't depend on anything within the component scope, you can define them outside of the component and pass them as a prop:

   ```tsx
   const columns = [
     { field: 'id' },
     { field: 'firstName' },
     { field: 'lastName' },
     { field: 'age' },
     { field: 'fullName' },
   ];

   function App() {
     return <DataGrid columns={columns} {...other} />;
   }
   ```

2. If the columns require something within the component scope, such as a state value or a prop, you can use the `useMemo` hook to keep a stable reference between renders:

   ```tsx
   function App(props) {
     const renderCell = React.useCallback(
       (params) => {
         return (
           <strong>
             {params.value} {props.someValue}
           </strong>
         );
       },
       [props.someValue],
     );

     const columns = React.useMemo(
       () => [
         { field: 'id' },
         { field: 'firstName' },
         { field: 'lastName' },
         { field: 'age' },
         { field: 'fullName', renderCell },
       ],
       [renderCell],
     );

     return <DataGrid columns={columns} {...other} />;
   }
   ```

## Extract static objects and memoize root props

The Data Grid component uses `React.memo` to optimize its performance, which means the Grid and its subcomponents only re-render when their props change.
But it's very easy to cause unnecessary re-renders if the root props of your Data Grid aren't memoized.
In the example below, the `slots` and `initialState` objects are re-created on every render, which means the Data Grid itself has no choice but to re-render as well.

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

One way to prevent re-renders is to extract any objects that can be static, and to memoize any objects that depend on other objects.
This applies to any prop that's an object or a function.

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

## Visualizing the re-rendering process

The Data Grid memoizes some of its subcomponents to avoid re-rendering more than necessary.
Below is a visualization that shows you which cells re-render in response to your interactions with the Grid.

{{"demo": "GridVisualization.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
