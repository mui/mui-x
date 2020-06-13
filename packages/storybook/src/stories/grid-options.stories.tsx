import React, { useEffect, useState } from 'react';
import { ColDef, Grid, GridOverlay, Footer, GridApiRef, gridApiRef } from '@material-ui/x-grid';
import { Button, LinearProgress } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { Pagination } from '@material-ui/lab';
import { action } from '@storybook/addon-actions';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';
// import mdx from './grid-options.mdx';

export default {
  title: 'X-Grid Tests/Options',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
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

export const WithCustomLogger = () => {
  const logger = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    debug: () => {},
    info: (...args) => console.info('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
    warn: (...args) => console.warn('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
    error: (...args) => console.error('CUSTOM-LOGGING =>' + args[0], args.slice(1)),
  };
  return (
    <div className="grid-container">
      <Grid rows={rows} columns={columns} options={{ logger }} />
    </div>
  );
};
export const WithNoLogger = () => {
  return (
    <div className="grid-container">
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
    <div className="grid-container">
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
    <div className="grid-container">
      <Grid rows={[]} columns={columns} options={{ noRowsOverlayComponent: loadingComponent }} />
    </div>
  );
};
export const withCustomIcons = () => {
  return (
    <div className="grid-container">
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
export const withPagination = () => {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 100,
        }}
      />
    </div>
  );
};

export const withPaginationNoRowCount = () => {
  const data = useData(2000, 200);
  const rowsPerPageOptions = array('Rows per page options', ['10', '20', '50', '100', '200'], ', ');

  return (
    <Grid
      rows={data.rows}
      columns={data.columns}
      options={{
        pagination: true,
        paginationPageSize: number('PageSize', 100),
        paginationAutoPageSize: boolean('Auto page size', false),
        paginationRowsPerPageOptions: rowsPerPageOptions.map(value => parseInt(value, 10)),
        hideFooterRowCount: boolean('Hide row count', false),
        hideFooterPagination: boolean('Hide footer pagination', false),
        hideFooter: boolean('Hide footer', false),
      }}
    />
  );
};
export const withPaginationButNotVisible = () => {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 100,
          hideFooterPagination: true,
        }}
      />
    </div>
  );
};

export const withCustomPagination = () => {
  const apiRef: GridApiRef = gridApiRef();
  const data = useData(2000, 200);
  const [autosize, setAutoSize] = useState(false);

  // eslint-disable-next-line
  useEffect(() => {
    let unsubscribe;
    if (apiRef && apiRef.current) {
      unsubscribe = apiRef.current.onPageChanged(action('pageChanged'));
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [apiRef, data]);

  const backToFirstPage = () => {
    apiRef.current?.setPage(1);
  };
  const [myPageSize, setPageSize] = useState(33);
  const changePageSizeWithOptionProp = () => {
    const newPageSize = myPageSize === 33 ? 50 : 33;
    setAutoSize(false);
    setPageSize(newPageSize);
  };
  const changePageSizeWithApi = () => {
    setAutoSize(false);
    apiRef.current!.setPageSize(105);
  };
  return (
    <div className="grid-container">
      <Button component={'button'} color={'primary'} variant={'outlined'} onClick={backToFirstPage}>
        Back to first page
      </Button>
      <Button component={'button'} color={'primary'} variant={'outlined'} onClick={changePageSizeWithOptionProp}>
        Change pageSize with Options
      </Button>
      <Button component={'button'} color={'primary'} variant={'outlined'} onClick={changePageSizeWithApi}>
        Change pageSize with Api
      </Button>
      <Button component={'button'} color={'primary'} variant={'outlined'} onClick={() => setAutoSize(p => !p)}>
        toggle pageAutoSize
      </Button>
      <Grid
        rows={data.rows}
        columns={data.columns}
        apiRef={apiRef}
        options={{
          pagination: true,
          paginationPageSize: myPageSize,
          paginationAutoPageSize: autosize,
          paginationComponent: paginationProps => (
            <Pagination
              className={'my-custom-pagination'}
              page={paginationProps.page}
              count={paginationProps.pageCount}
              onChange={(e, value) => paginationProps.setPage(value)}
            />
          ),
        }}
      />
    </div>
  );
};
export const withCustomFooter = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);
  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          footerComponent: ({ paginationProps, rows, columns, options, api, gridRef }) => (
            <Footer className={'my-custom-footer'}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                This is my custom footer and pagination here!
              </span>
              <Pagination
                className={'my-custom-pagination'}
                page={paginationProps.page}
                count={paginationProps.pageCount}
                onChange={(e, value) => paginationProps.setPage(value)}
              />
            </Footer>
          ),
        }}
      />
    </div>
  );
};

export const withCustomHeaderAndFooter = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          headerComponent: ({ paginationProps }) => (
            <div className={'custom-header'}>
              <Pagination
                className={'my-custom-pagination'}
                page={paginationProps.page}
                count={paginationProps.pageCount}
                onChange={(e, value) => paginationProps.setPage(value)}
              />
            </div>
          ),
          footerComponent: ({ paginationProps }) => (
            <div className="footer my-custom-footer"> I counted {paginationProps.rowCount} row(s) </div>
          ),
        }}
      />
    </div>
  );
};

export const withAutoPagination = () => {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <Button
        component={'button'}
        color={'primary'}
        variant={'outlined'}
        onClick={() => setSize({ width: size.height, height: size.width })}
      >
        Invert Sizes
      </Button>
      <Button
        component={'button'}
        color={'primary'}
        variant={'outlined'}
        onClick={() => setSize(p => ({ ...p, height: p.height + 20 }))}
      >
        Add 20px height
      </Button>
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationAutoPageSize: true,
        }}
      />
    </div>
  );
};
