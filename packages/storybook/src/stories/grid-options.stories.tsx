import * as React from 'react';
import { ColDef, XGrid } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Options',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
};

const columns: ColDef[] = [
  { field: 'id' },
  { field: 'name', sortDirection: 'asc' },
  { field: 'age', sortDirection: 'desc' },
];

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
      <XGrid rows={rows} columns={columns} options={{ logLevel: false }} />
    </div>
  );
};

export const CustomLogger = () => {
  const logger = {
    debug: () => {},
    // eslint-disable-next-line no-console
    info: (...args) => console.info(`CUSTOM-LOGGING =>${args[0]}`, args.slice(1)),
    warn: (...args) => console.warn(`CUSTOM-LOGGING =>${args[0]}`, args.slice(1)),
    error: (...args) => console.error(`CUSTOM-LOGGING =>${args[0]}`, args.slice(1)),
  };
  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={columns} options={{ logger }} />
    </div>
  );
};

export const NoRowExtend = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ extendRowFullWidth: false }} />
    </div>
  );
};

export const NoRowExtendCellBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        options={{ extendRowFullWidth: false, showCellRightBorder: true }}
      />
    </div>
  );
};

export const CellRightBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ showCellRightBorder: true }} />
    </div>
  );
};

export const ColumnRightBorder = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ showColumnRightBorder: true }} />
    </div>
  );
};
export const AutoHeightSmall = () => {
  const data = useData(8, 12);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ autoHeight: true }} />
    </div>
  );
};

export const AutoHeightLarge = () => {
  const data = useData(75, 20);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ autoHeight: true }} />
    </div>
  );
};
