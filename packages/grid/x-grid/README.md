# @material-ui/x-grid

The Material-UI X edition of the data grid component.

## Installation

Install the package in your project directory with:

```sh
// with npm
npm install @material-ui/x-grid

// with yarn
yarn add @material-ui/x-grid
```

This component has 3 peer dependencies that you will need to install as well.

```json
"peerDependencies": {
  "@material-ui/core": "^4.9.12",
  "react": "^16.8.0",
  "styled-components": "^5.1.0"
},
```

## Quick Guide

After installing the package, you are now ready to use the grid.
First you have to import the component as below.

```js
import { XGrid } from '@material-ui/x-grid';
```

Then you need to create some columns which are simple objects containing at least a field property.
You can import `ColDef` to see all column properties.
A simple set of column can be.

```tsx
const columns = [{ field: 'id' }, { field: 'name', headerName: 'Client Name' }...];
```

Rows are string key value pair objects.

```tsx
const rows = [{ id: 1, name:'Jon Snow' }, { id: 2, name: 'Tyrion Lannister' }...];
```

A complete example below.

```tsx
import * as React from 'react';
import { XGrid, ColDef } from '@material-ui/x-grid';

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
      `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
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
      <XGrid rows={rows} columns={columns} options={{ checkboxSelection: true }} />
    </div>
  );
}
```

## Documentation

[The documentation](https://material-ui.com/components/data-grid/)
