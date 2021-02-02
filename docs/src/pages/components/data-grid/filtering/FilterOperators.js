import * as React from 'react';
import {
  DataGrid,
  getNumericColumnOperators,
  getDateOperators,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function FilterOperators() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  const rows = data.rows;

  const columns = [
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 180 },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 180,
      type: 'number',
      filterOperators: getNumericColumnOperators(),
    },
    {
      field: 'dateCreated',
      headerName: 'Created on',
      width: 180,
      type: 'date',
      filterOperators: getDateOperators(),
    },
  ];

  const dateFilterModel = {
    items: [
      { columnField: 'dateCreated', operatorValue: 'after', value: '2020-10-01' },
    ],
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} filterModel={dateFilterModel} />
    </div>
  );
}
