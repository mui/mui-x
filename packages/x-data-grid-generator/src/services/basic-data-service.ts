import { GridColDef, GridRowId } from '@mui/x-data-grid';

export const currencyPairs = [
  'USDGBP',
  'USDEUR',
  'GBPEUR',
  'JPYUSD',
  'MXNUSD',
  'BTCUSD',
  'USDCAD',
  'EURJPY',
  'EURUSD',
  'EURCHF',
  'USDCHF',
  'EURGBP',
  'GBPUSD',
  'AUDCAD',
  'NZDUSD',
  'GBPCHF',
  'AUDUSD',
  'GBPJPY',
  'USDJPY',
  'CHFJPY',
  'EURCAD',
  'AUDJPY',
  'EURAUD',
  'AUDNZD',
  'CADEUR',
  'CHFMXN',
  'ETHUSD',
  'BCHUSD',
  'ETHBTC',
  'XRPUSD',
  'XRPBTC',
  'USDLTC',
  'USDXRP',
  'USDDSH',
  'USDBCH',
  'JPYEUR',
  'JPYUSD',
  'JPYGBP',
  'JPYCAD',
  'JPYCHF',
  'JPYAUD',
  'JPYNZD',
  'JPYSGD',
  'JPYNOK',
  'JPYRUB',
  'JPYSEK',
  'JPYTRY',
  'JPYZAR',
  'JPYHKD',
  'JPYCNH',
  'JPYDKK',
  'JPYMXN',
  'JPYPLN',
  'JPYXAG',
  'JPYXAU',
  'JPYBTC',
  'JPYETH',
  'JPYLTC',
  'JPYXRP',
  'JPYDSH',
  'JPYBCH',
  'GBPEUR',
  'GBPRUB',
  'GBPTRY',
];

interface GridBasicRowModel {
  id: GridRowId;
  currencyPair: string;
  [price: string]: number | string;
}

export interface GridBasicData {
  columns: GridColDef[];
  rows: GridBasicRowModel[];
}

export const getBasicGridData = (rowLength: number, colLength: number): GridBasicData => {
  const data: GridBasicRowModel[] = [];
  const pricesColLength = colLength - 2;
  for (let i = 0; i < rowLength; i += 1) {
    const idx = i >= currencyPairs.length ? i % currencyPairs.length : i;
    const model: GridBasicRowModel = {
      id: i,
      currencyPair: currencyPairs[idx],
    };
    for (let j = 1; j <= pricesColLength; j += 1) {
      model[`price${j}M`] = Number(`${i.toString()}${j}`); // randomPrice(0.7, 2);
    }
    data.push(model);
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', type: 'number' },
    { field: 'currencyPair', headerName: 'Currency Pair' },
  ];
  for (let j = 1; j <= pricesColLength; j += 1) {
    // const y = Math.floor(j / 12);
    columns.push({ field: `price${j}M`, headerName: `${j}M`, type: 'number' }); // (y > 0 ? `${y}Y` : '') + `${j - y * 12}M`
  }
  columns.length = colLength; // we cut the array in case < 2;
  return { columns, rows: data };
};
