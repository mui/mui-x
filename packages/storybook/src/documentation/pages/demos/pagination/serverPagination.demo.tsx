import { Columns, FeatureMode, PageChangedParams, RowsProp, XGrid } from '@material-ui/x-grid';
import { useState } from 'react';
import * as React from 'react';
import {
  randomCreatedDate,
  randomEmail,
  randomId,
  randomInt,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

function newRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    email: randomEmail(),
    age: randomInt(10, 100),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  };
}

const columns: Columns = [
  { field: 'id', hide: true },
  { field: 'name', type: 'string' },
  { field: 'email', type: 'string' },
  { field: 'age', type: 'number' },
  { field: 'dateCreated', type: 'date', width: 180 },
  { field: 'lastLogin', type: 'dateTime', width: 180 },
];

function loadServerRows(params: PageChangedParams): Promise<any> {
  return new Promise<any>((resolve) => {
    const rows: any[] = [];
    while (rows.length < params.pageSize) {
      rows.push(newRow());
    }

    setTimeout(() => {
      resolve(rows);
    }, 800);
  });
}

export default function ServerPaginationDemo() {
  const [rows, setRows] = useState<RowsProp>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onPageChanged = (params) => {
    setLoading(true);
    loadServerRows(params).then((newRows) => {
      setRows(newRows);
      setLoading(false);
    });
  };

  return (
    <XGrid
      rows={rows}
      columns={columns}
      options={{
        autoHeight: true,
        pagination: true,
        pageSize: 5,
        rowCount: 50,
        paginationMode: FeatureMode.server,
        onPageChanged,
      }}
      loading={isLoading}
    />
  );
}
