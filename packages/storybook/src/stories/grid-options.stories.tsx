import * as React from 'react';
import { GridColDef, DataGridPro } from '@mui/x-data-grid-pro';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Options',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
};

const columns: GridColDef[] = [{ field: 'id' }, { field: 'name' }, { field: 'age' }];

const rows = [
  { id: 1, name: 'alice', age: 40 },
  { id: 2, name: 'bob', age: 30 },
  { id: 3, name: 'igor', age: 40 },
  { id: 4, name: 'clara', age: 40 },
  { id: 5, name: 'clara', age: null },
  { id: 6, name: null, age: 25 },
  { id: 7, name: '', age: 42 },
];

export const NoLogger = () => {
  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={columns} logLevel={false} />
    </div>
  );
};

export const CustomLogger = () => {
  const logger = {
    debug: () => {},
    // eslint-disable-next-line no-console
    info: (...args) => console.info(`CUSTOM-LOGGING => ${args[0]}`, args.slice(1)),
    warn: (...args) => console.warn(`CUSTOM-LOGGING => ${args[0]}`, args.slice(1)),
    error: (...args) => console.error(`CUSTOM-LOGGING => ${args[0]}`, args.slice(1)),
  };
  return (
    <div className="grid-container">
      <DataGridPro rows={rows} columns={columns} logger={logger} logLevel="debug" />
    </div>
  );
};

export const NoRowExtend = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} disableExtendRowFullWidth />
    </div>
  );
};

export const NoRowExtendCellBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <DataGridPro
        rows={data.rows}
        columns={data.columns}
        disableExtendRowFullWidth
        showCellRightBorder
      />
    </div>
  );
};

export const CellRightBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} showCellRightBorder />
    </div>
  );
};

export const ColumnRightBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} showColumnRightBorder />
    </div>
  );
};
export const AutoHeightSmall = () => {
  const data = useData(8, 12);
  return (
    <div>
      <DataGridPro rows={data.rows} columns={data.columns} autoHeight />
    </div>
  );
};

export const AutoHeightLarge = () => {
  const data = useData(75, 20);
  return (
    <div>
      <DataGridPro rows={data.rows} columns={data.columns} autoHeight />
    </div>
  );
};
