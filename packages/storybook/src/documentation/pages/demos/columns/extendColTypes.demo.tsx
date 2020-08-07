import * as React from 'react';
import { Columns, RowsProp, XGrid, ColTypeDef } from '@material-ui/x-grid';
import { randomPrice, randomStatusOptions } from '@material-ui/x-grid-data-generator';
import '../demo.css';

const highlightCellColType: ColTypeDef = { cellClassName: 'highlight' };
const usdPriceColType: ColTypeDef = {
  extendType: 'number',
  width: 150,
  valueFormatter: ({ value }) => `${Number(value).toFixed(2)} USD`,
};

export default function ExtendColTypesDemo() {
  const columns: Columns = [
    { field: 'id', hide: true },
    { field: 'status', type: 'highlight' },
    { field: 'subTotal', type: 'usdPrice' },
    { field: 'total', type: 'usdPrice' },
  ];

  const rows: RowsProp = [
    {
      id: 1,
      status: randomStatusOptions(),
      subTotal: randomPrice(),
      total: randomPrice(),
    },
    {
      id: 2,
      status: randomStatusOptions(),
      subTotal: randomPrice(),
      total: randomPrice(),
    },
    {
      id: 3,
      status: randomStatusOptions(),
      subTotal: randomPrice(),
      total: randomPrice(),
    },
    {
      id: 4,
      status: randomStatusOptions(),
      subTotal: randomPrice(),
      total: randomPrice(),
    },
    {
      id: 5,
      status: randomStatusOptions(),
      subTotal: randomPrice(),
      total: randomPrice(),
    },
  ];

  return (
    <XGrid
      rows={rows}
      columns={columns}
      hideFooter
      autoHeight
      columnTypes={{
        usdPrice: usdPriceColType,
        highlight: highlightCellColType,
      }}
      className="demo"
    />
  );
}
