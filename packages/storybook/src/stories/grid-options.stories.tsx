import * as React from 'react';
import { useEffect, useState } from 'react';
import { ColDef, XGrid, GridApiRef, gridApiRef } from '@material-ui/x-grid';
import { Button } from '@material-ui/core';

import { Pagination } from '@material-ui/lab';
import { action } from '@storybook/addon-actions';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
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

export const ColumnSeparator = () => {
  const data = useData(20, 2);
  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} options={{ showColumnSeparator: true }} />
    </div>
  );
};

export const PageSize100 = () => {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid
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

export const PaginationKnobs = () => {
  const data = useData(2000, 200);
  const rowsPerPageOptions = array('Rows per page options', ['10', '20', '50', '100', '200'], ', ');

  return (
    <XGrid
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
export const HiddenPagination = () => {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid
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

export const PaginationApiTests = () => {
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
      if (unsubscribe) {
        unsubscribe();
      }
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
    <React.Fragment>
      <div>
        <Button
          component={'button'}
          color={'primary'}
          variant={'outlined'}
          onClick={backToFirstPage}
        >
          Back to first page
        </Button>
        <Button
          component={'button'}
          color={'primary'}
          variant={'outlined'}
          onClick={changePageSizeWithOptionProp}
        >
          Change pageSize with Options
        </Button>
        <Button
          component={'button'}
          color={'primary'}
          variant={'outlined'}
          onClick={changePageSizeWithApi}
        >
          Change pageSize with Api
        </Button>
        <Button
          component={'button'}
          color={'primary'}
          variant={'outlined'}
          onClick={() => setAutoSize(p => !p)}
        >
          toggle pageAutoSize
        </Button>
      </div>
      <div className="grid-container">
        <XGrid
          rows={data.rows}
          columns={data.columns}
          apiRef={apiRef}
          options={{
            pagination: true,
            paginationPageSize: myPageSize,
            paginationAutoPageSize: autosize,
          }}
          components={{
            pagination: ({ paginationProps }) => (
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
    </React.Fragment>
  );
};

export const AutoPagination = () => {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const data = useData(2000, 200);

  return (
    <React.Fragment>
      <div>
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
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <XGrid
          rows={data.rows}
          columns={data.columns}
          options={{
            pagination: true,
            paginationAutoPageSize: true,
          }}
        />
      </div>
    </React.Fragment>
  );
};
