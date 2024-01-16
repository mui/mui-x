---
productId: x-data-grid
title: Frequently Asked Questions - React Data Grid
githubLabel: 'component: data grid'
packageName: '@mui/x-data-grid'
---

# Frequently asked questions

<p class="description">Can't find what you are looking for? The FAQ section has answers to some of the most frequent questions and challenges.</p>

If you still have trouble, you can refer to the [support page](/x/introduction/support/).

## How to pass props to the data grid for better performance?

The Data Grid is a complex component that renders a lot of elements. As a general rule, all the non-primitive props should keep a stable reference between renders to avoid unnecessary re-renders.

This is especially important for the `columns` prop. The columns are designed to be definitions, to never change once the component is mounted. Otherwise, you take the risk of losing elements like column width or order.

This can be achieved by one of the following ways:

1. If the columns do not depend on something within the component scope, you can define them outside of the component and pass them as a prop.

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

2. If the columns require something within the component scope, like a state value or a prop, you can use the `useMemo` hook to keep a stable reference between renders.

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

## What is the difference between renderCell, valueGetter, and valueFormatter? Which one should I use?

The Data Grid provides several ways to customize the content of a cell. Each of them has a different purpose and should be used in different situations. Here is a summary of their differences:

### `renderCell`

It is the most powerful way to customize the content of a cell. It allows you to render anything you want inside the cell. It is the only way to render a React component inside a cell. It is also the only way to customize the cell's behavior (for instance, add a click handler). It is the most flexible way to customize a cell, but it is also the most expensive one. It should be used only when the other options are not enough.

Here's an example for a cell that displays a button:

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <strong>
        {params.value.getFullYear()}
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Open
        </Button>
      </strong>
    ),
  },
];
```

See more about the `renderCell` method in the [rendering cells](/x/react-data-grid/column-definition/#rendering-cells) section.

### `valueGetter`

It is a function that allows you to derive the cell value from the row data. It is the most performant way to customize the cell content. It is also the only way to customize the cell value without changing the row data. It should be used when you need to derive the cell value from the row data. Common use cases are:

- Transforming the value (e.g. convert a decimal value to a percentage value)
- Deriving the value from multiple fields (e.g. concatenating first name and last name)
- Deriving the value from a nested field (e.g. `user.address.city`)

This value is also used internally in the Grid to filter, sort, and render (if no `renderCell` or `valueFormatter` is provided). You can learn more about it in the [value getter](/x/react-data-grid/column-definition/#value-getter) section.

### `valueFormatter`

It is a function that allows you to format the cell value. It could be used to customize the cell value without changing the row data. It should be used when you need to format the cell value.

A few common use-cases are:

- Formatting a date to a custom display format
- Formatting a decimal value to percentage and show `%` sign
- Formatting a boolean value to `Yes` or `No`

It only impacts the rendering part and does not impact the internal calculations like filtering or sorting. You can know more about it in the [value formatter](/x/react-data-grid/column-definition/#value-formatter) section.
