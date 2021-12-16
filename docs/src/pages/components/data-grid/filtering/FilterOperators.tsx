import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {randomCountry, renderCountry, renderEditCountry, useDemoData} from '@mui/x-data-grid-generator';
import {COUNTRY_ISO_OPTIONS} from "@mui/x-data-grid-generator/services/static-data";

const columns = [
  { field: 'name', headerName: 'Name', width: 180 },
  {
    field: 'rating',
    headerName: 'Rating',
    type: 'number',
    width: 80,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    width: 180,
    type: 'date',
  },
  {
    field: 'country',
    headerName: 'Country',
    renderCell: renderCountry,
    type: 'singleSelect',
    valueOptions: COUNTRY_ISO_OPTIONS,
    width: 150,
  },
  {
    field: 'isAdmin',
    headerName: 'Is admin?',
    width: 120,
    type: 'boolean',
  },
];

export default function FilterOperators() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data.rows} columns={columns} />
    </div>
  );
}
