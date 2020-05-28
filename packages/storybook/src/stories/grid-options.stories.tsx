import React from 'react';
import { ColDef, Grid, GridOverlay } from '@material-ui-x/grid';
import { LinearProgress } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

export default {
  title: 'Grid Options',
};

const size = { width: 800, height: 600 };
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

export const WithCustomLogger = () => {
  const logger = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    debug: () => {},
    info: (...args) => console.info('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
    warn: (...args) => console.warn('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
    error: (...args) => console.error('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
  };
  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={rows} columns={columns} options={{ logger }} />
    </div>
  );
};
export const WithNoLogger = () => {
  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={rows} columns={columns} options={{ logLevel: false }} />
    </div>
  );
};

export const WithCustomLoadingComponent = () => {
  const loadingComponent = (
    <GridOverlay className={'custom-overlay'}>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={rows} columns={columns} options={{ loadingOverlayComponent: loadingComponent }} loading={true} />
    </div>
  );
};

export const WithCustomNoRowsComponent = () => {
  const loadingComponent = (
    <GridOverlay className={'custom-overlay'}>
      <CodeIcon />
      <span style={{ lineHeight: '24px', padding: '0 10px' }}>No Rows</span>
      <CodeIcon />
    </GridOverlay>
  );
  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid rows={[]} columns={columns} options={{ noRowsOverlayComponent: loadingComponent }} />
    </div>
  );
};
export const withCustomIcons = () => {
  const size = { width: 800, height: 600 };

  return (
    <div style={{ width: size.width, height: size.height, resize: 'both' }}>
      <Grid
        rows={rows}
        columns={columns}
        options={{
          icons: {
            // eslint-disable-next-line react/display-name
            columnSortedDescending: () => <ExpandMoreIcon className={'icon'} />,
            // eslint-disable-next-line react/display-name
            columnSortedAscending: () => <ExpandLessIcon className={'icon'} />,
          },
        }}
      />
    </div>
  );
};
