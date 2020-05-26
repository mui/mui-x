#Material-ui-x/Grid

The official Material-UI Data Grid written in typescript. 

[logo]: https://material-ui.com/static/logo_raw.svg "Material-UI Logo"

##Install

```shell script
//with npm
npm install @material-ui-x/grid

//with yarn
yarn add @material-ui-x/grid
```

##Quick Guide

After installing the package, you are now ready to use the grid.
First you have to import the component as below.

```import { Grid } from '@material-ui-x/grid';```

Then you need to create some columns which are simple objects containing at least a field property.
You can import `ColDef` to see all column properties.
A simple set of column can be.
```typescript jsx
const columns = [{ field: "id"}, {field: "name", headerName:  'Client Name'}...];
```

Rows are string key value pair objects. 
```typescript jsx
const rows = [{id: 1, name:'Jon Snow'}, {id: 2, name: 'Tyrion Lannister'}...]
```

A complete example below.
```typescript jsx
import * as React from 'react';
import { ColDef, Grid } from '@material-ui-x/grid';

function MyApp() {
  const columns: ColDef[] = [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    {
    	field: 'age',
        cellClass: ['age'],
        headerClass: ['age'],
        type: 'number',
        sortDirection: 'desc',
    },
    {
        field: 'fullName',
        description: 'this column has a value getter and is not sortable',
        headerClass: 'highlight',
        sortable: false,
        valueGetter: params => `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`
    }
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 }
  ];

 return (
    <div style={{ width: 800, height: 600  }}>
      <Grid rows={rows} columns={columns} options={{ checkboxSelection: true }} />
    </div>
  );
}

```

###More Examples on our storybook

https://muix-storybook.netlify.app/