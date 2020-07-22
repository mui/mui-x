# Material-UI DataGrid

The Material-UI community edition of the data grid component.

Check out our [Demo here!](https://muix-preview.netlify.app/#/grid)

## Install

Using your favorite package manager, install `@material-ui/data-grid`:

```sh
// with npm
npm install @material-ui/data-grid

// with yarn
yarn add @material-ui/data-grid
```

This component has 3 peer dependencies that you will need to install as well.

```json
"peerDependencies": {
  "@material-ui/core": "^4.11.0",
  "react": "^16.13.1",
  "styled-components": "^5.1.0"
},
```

## Quick Guide

After installing the package, you are now ready to use the grid.
First you have to import the component as below.

```js
import { DataGrid } from '@material-ui/data-grid';
```

Then you need to create some columns which are simple objects containing at least a field property.
You can import `ColDef` to see all column properties.
A simple set of column can be.

```tsx
const columns = [{ field: 'id'}, {field: 'name', headerName: 'Client Name' <>}...];
```

Rows are string key value pair objects.

```tsx
const rows = [{ id: 1, name: 'Jon Snow' }, { id: 2, name: 'Tyrion Lannister' }...];
```

A complete example below.

```tsx
import * as React from 'react';
import { DataGrid, ColDef } from '@material-ui/data-grid';

const columns: ColDef[] = [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  {
    field: 'age',
    cellClassName: ['age'],
    headerClassName: ['age'],
    type: 'number',
    sortDirection: 'desc',
  },
  {
    field: 'fullName',
    description: 'this column has a value getter and is not sortable',
    headerClassName: 'highlight',
    sortable: false,
    valueGetter: (params) =>
      `${params.getValue('firstName') || ''} ${
        params.getValue('lastName') || ''
      }`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
];

export default function MyApp() {
  return (
    <div style={{ width: 800, height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        options={{ checkboxSelection: true }}
      />
    </div>
  );
}
```

Code Sandbox [here!](https://codesandbox.io/s/get-started-grid-kkdn2)

### More examples on our storybook

https://muix-storybook.netlify.app/
