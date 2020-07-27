import * as React from 'react';
import { Columns, FeatureMode, PageChangeParams, RowsProp, XGrid } from '@material-ui/x-grid';
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

function loadServerRows(params: PageChangeParams): Promise<any> {
  return new Promise<any>((resolve) => {
    const rows: any[] = [];
    while (rows.length < params.pageSize) {
      rows.push(newRow());
    }

    setTimeout(() => {
      resolve({ response: { rows }, request: { params } });
    }, 800);
  });
}

export default function ServerPaginationDemo() {
  const [rows, setRows] = React.useState<RowsProp>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const currentPage = React.useRef<number>(1);

  const onPageChange = (params) => {
    currentPage.current = params.page;
    setLoading(true);
    loadServerRows(params).then(({ response, request }) => {
      if (currentPage.current === request.params.page) {
        setRows(response.rows);
        setLoading(false);
      }
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
        onPageChange,
      }}
      loading={isLoading}
    />
  );
}
