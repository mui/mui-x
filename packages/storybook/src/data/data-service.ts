import { currencyPairs } from './currency-pairs';
import { ColDef, RowId } from '@material-ui-x/grid';

export interface DataRowModel {
  id: RowId;
  currencyPair: string;
  [price: string]: number | string;
}

export interface GridData {
  columns: ColDef[];
  rows: DataRowModel[];
}

export function getData(rowLength: number, colLength: number): Promise<GridData> {
  return new Promise<GridData>((resolve, reject) => {
    const data: DataRowModel[] = [];
    const pricesColLength = colLength - 2;
    for (let i = 0; i < rowLength; i++) {
      const idx = i >= currencyPairs.length ? i % currencyPairs.length : i;
      const model: DataRowModel = {
        id: i,
        currencyPair: currencyPairs[idx],
      };
      for (let j = 1; j <= pricesColLength; j++) {
        model[`price${j}M`] = `${i.toString()}, ${j} `; //randomPrice(0.7, 2);
      }
      data.push(model);
    }

    const columns: ColDef[] = [
      { field: 'id', headerName: 'id' },
      { field: 'currencyPair', headerName: 'Currency Pair' },
    ];
    for (let j = 1; j <= pricesColLength; j++) {
      // const y = Math.floor(j / 12);
      columns.push({ field: `price${j}M`, headerName: `${j}M`, type: 'number' }); //(y > 0 ? `${y}Y` : '') + `${j - y * 12}M`
    }
    columns.length = colLength; //we cut the array in case < 2;
    resolve({ columns, rows: data });
  });
}
