import { GridApiCommon, GridApi, GridColDef, GridRowId } from '@mui/x-data-grid-pro';
import { currencyPairs } from './currency-pairs';

export interface DataRowModel {
  id: GridRowId;
  currencyPair: string;
  [price: string]: number | string;
}

export interface GridData<Api extends GridApiCommon> {
  columns: GridColDef<Api>[];
  rows: DataRowModel[];
}

export function getData<Api extends GridApiCommon = GridApi>(
  rowLength: number,
  colLength: number,
): GridData<Api> {
  const data: DataRowModel[] = [];
  const pricesColLength = colLength - 2;
  for (let i = 0; i < rowLength; i += 1) {
    const idx = i >= currencyPairs.length ? i % currencyPairs.length : i;
    const model: DataRowModel = {
      id: i,
      currencyPair: currencyPairs[idx],
    };
    for (let j = 1; j <= pricesColLength; j += 1) {
      model[`price${j}M`] = Number(`${i.toString()}${j}`); // randomPrice(0.7, 2);
    }
    data.push(model);
  }

  const columns: GridColDef<Api>[] = [
    { field: 'id', headerName: 'id', type: 'number' },
    { field: 'currencyPair', headerName: 'Currency Pair' },
  ];
  for (let j = 1; j <= pricesColLength; j += 1) {
    // const y = Math.floor(j / 12);
    columns.push({ field: `price${j}M`, headerName: `${j}M`, type: 'number' }); // (y > 0 ? `${y}Y` : '') + `${j - y * 12}M`
  }
  columns.length = colLength; // we cut the array in case < 2;
  return { columns, rows: data };
}
