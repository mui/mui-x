# Data Grid - Performance

<p class="description">Follow these recommendations to improve your Data Grid's performance.</p>

## Maintain a stable reference when passing props

The Data Grid is a complex component that renders many elements. 
As a general rule, all the non-primitive props should keep a stable reference between renders to avoid unnecessary re-renders.

This is especially important for the `columns` prop. 
The columns are designed to be definitions that never change once the component is mounted. 
Otherwise, you risk losing elements like column width or order.

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

The Data Grid component uses `React.memo` to optimize its performance, which means itself and its subcomponents only re-render when their props change. 
But it's very easy to cause unnecessary re-renders if the root props of your Data Grid aren't memoized. 
Take the example below, the `slots` and `initialState` objects are re-created on every render, which means the Data Grid itself has no choice but to re-render as well.

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

An easy way to prevent re-renders is to extract any object that can be a static object, and to memoize any object that depends on another object. 
This applies to any prop that is an object or a function.

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

The Data Grid memoizes some of its subcomponents to avoid re-rendering more than needed. 
Below is a visualization thatshows you which cells re-render in reaction to your interaction with the grid.

{{"demo": "GridVisualization.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
