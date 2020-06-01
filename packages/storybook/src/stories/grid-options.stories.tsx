import React, { useEffect } from 'react';
import { ColDef, Grid, GridOverlay, Footer, GridApiRef, gridApiRef } from '@material-ui-x/grid';
import {Button, LinearProgress} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { GridDataSet, useData } from '../components/grid-dataset';
import { Pagination } from '@material-ui/lab';
import { action } from '@storybook/addon-actions';

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
export const withPagination = () => {
  const size = { width: 800, height: 600 };

  return (
    <GridDataSet
      nbRows={2000}
      nbCols={200}
      container={size}
      options={{
        pagination: true,
        paginationPageSize: 100,
      }}
    />
  );
};

export const withPaginationNoRowCount = () => {
  const size = { width: 800, height: 600 };

  return (
    <GridDataSet
      nbRows={2000}
      nbCols={200}
      container={size}
      options={{
        pagination: true,
        paginationPageSize: 100,
        hideFooterRowCount: true,
      }}
    />
  );
};
export const withPaginationButNotVisible = () => {
  const size = { width: 800, height: 600 };

  return (
    <GridDataSet
      nbRows={2000}
      nbCols={200}
      container={size}
      options={{
        pagination: true,
        paginationPageSize: 100,
        hideFooterPagination: true,
      }}
    />
  );
};
export const withCustomPagination = () => {
  const size = { width: 800, height: 600 };
  const apiRef: GridApiRef = gridApiRef();
  const data = useData(2000, 200);

  useEffect(() => {
    if (apiRef && apiRef.current) {
      return apiRef.current.onPageChanged(action('pageChanged'));
    }
  }, [apiRef, data]);

const backToFirstPage = ()=> {
  apiRef.current.setPage(1);
};
  const changePageSize = ()=> {
    apiRef.current.setPageSize(50);
  };

  return (
    <div style={{ width: size.width, height: size.height }}>
      <Button component={'button'} color={"primary"} variant={"outlined"} onClick={backToFirstPage}>Back to first page! </Button>
      <Button component={'button'} color={"primary"} variant={"outlined"} onClick={changePageSize}>Change pageSize </Button>
      <Grid
        rows={data.rows}
        columns={data.columns}
        apiRef={apiRef}
        options={{
          pagination: true,
          paginationPageSize: 33,
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
  const size = { width: 800, height: 600 };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);
  return (
    <div style={{ width: size.width, height: size.height }}>
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          hideFooter: true,
        }}
      >
        {(paginationProps, rows, columns, options, api, gridRef) => (
          <Footer className={'my-custom-footer'}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              This is my custom footer and pagination here!{' '}
            </span>
            <Pagination
              className={'my-custom-pagination'}
              page={paginationProps.page}
              count={paginationProps.pageCount}
              onChange={(e, value) => paginationProps.setPage(value)}
            />
          </Footer>
        )}
      </Grid>
    </div>
  );
};

export const withCustomHeaderAndFooter = () => {
  const size = { width: 800, height: 600 };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useData(2000, 200);

  return (
    <div style={{ width: size.width, height: size.height }}>
      <Grid
        rows={data.rows}
        columns={data.columns}
        options={{
          pagination: true,
          paginationPageSize: 33,
          hideFooterPagination: true,
          hideFooter: true,
        }}
      >
        {{
          // eslint-disable-next-line react/display-name
          header: paginationProps => (
            <div className={'custom-header'}>
              <Pagination
                className={'my-custom-pagination'}
                page={paginationProps.page}
                count={paginationProps.pageCount}
                onChange={(e, value) => paginationProps.setPage(value)}
              />
            </div>
          ),
          // eslint-disable-next-line react/display-name
          footer: paginationProps => (
            <div className="footer my-custom-footer"> I counted {paginationProps.rowCount} row(s) </div>
          ),
        }}
      </Grid>
    </div>
  );
};

export const withAutoPagination = () => {
  const size = { width: 800, height: 600 };

  return (
    <GridDataSet
      nbRows={2000}
      nbCols={200}
      container={size}
      options={{
        pagination: true,
        paginationAutoPageSize: true,
      }}
    />
  );
};
