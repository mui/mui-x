import * as React from 'react';
import { ApiRef, useApiRef, XGrid, PageChangeParams, RowsProp } from '@material-ui/x-grid';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import { action } from '@storybook/addon-actions';
import { array, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { useData } from '../hooks/useData';
import { getData, GridData } from '../data/data-service';

export default {
  title: 'X-Grid Tests/Pagination',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
  },
};

export function PaginationDefault() {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} pagination />
    </div>
  );
}

export function PageSize100() {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid rows={data.rows} columns={data.columns} pagination pageSize={100} />
    </div>
  );
}

export function PaginationKnobs() {
  const data = useData(100, 200);
  const rowsPerPageOptions = array('Rows per page options', ['10', '20', '50', '100', '200'], ', ');

  return (
    <XGrid
      rows={data.rows}
      columns={data.columns}
      {...{
        pagination: true,
        pageSize: number('PageSize', 100),
        page: number('Page', 1),
        rowCount: number('RowCount', 2000),
        autoPageSize: boolean('Auto page size', false),
        rowsPerPageOptions: rowsPerPageOptions.map((value) => parseInt(value, 10)),
        hideFooterRowCount: boolean('Hide row count', false),
        hideFooterPagination: boolean('Hide footer pagination', false),
        hideFooter: boolean('Hide footer', false),
      }}
    />
  );
}
export function HiddenPagination() {
  const data = useData(2000, 200);

  return (
    <div className="grid-container">
      <XGrid
        rows={data.rows}
        columns={data.columns}
        pageSize={100}
        pagination
        hideFooterPagination
      />
    </div>
  );
}

export function PaginationApiTests() {
  const apiRef: ApiRef = useApiRef();
  const data = useData(2000, 200);
  const [autosize, setAutoSize] = React.useState(false);

  React.useEffect(() => {
    return apiRef.current.onPageChange(action('pageChange'));
  }, [apiRef, data]);

  const backToFirstPage = () => {
    apiRef.current.setPage(1);
  };
  const [myPageSize, setPageSize] = React.useState(33);
  const changePageSizeWithOptionProp = () => {
    const newPageSize = myPageSize === 33 ? 50 : 33;
    setAutoSize(false);
    setPageSize(newPageSize);
  };
  const changePageSizeWithApi = () => {
    setAutoSize(false);
    apiRef.current.setPageSize(105);
  };
  return (
    <React.Fragment>
      <div>
        <Button component="button" color="primary" variant="outlined" onClick={backToFirstPage}>
          Back to first page
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={changePageSizeWithOptionProp}
        >
          Change pageSize with Options
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={changePageSizeWithApi}
        >
          Change pageSize with Api
        </Button>
        <Button color="primary" variant="outlined" onClick={() => setAutoSize((p) => !p)}>
          toggle pageAutoSize
        </Button>
      </div>
      <div className="grid-container">
        <XGrid
          rows={data.rows}
          columns={data.columns}
          apiRef={apiRef}
          pagination
          pageSize={myPageSize}
          autoPageSize={autosize}
          components={{
            pagination: ({ paginationProps }) => (
              <Pagination
                className="my-custom-pagination"
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
}

export function AutoPagination() {
  const [size, setSize] = React.useState({ width: 800, height: 600 });
  const data = useData(2000, 200);

  return (
    <React.Fragment>
      <div>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => setSize({ width: size.height, height: size.width })}
        >
          Invert Sizes
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => setSize((p) => ({ ...p, height: p.height + 20 }))}
        >
          Add 20px height
        </Button>
      </div>
      <div style={{ width: size.width, height: size.height }}>
        <XGrid rows={data.rows} columns={data.columns} autoPageSize pagination />
      </div>
    </React.Fragment>
  );
}

function loadServerRows(params: PageChangeParams): Promise<GridData> {
  return new Promise<GridData>((resolve) => {
    getData(params.pageSize, 10).then((data) => {
      setTimeout(() => {
        const minId = (params.page - 1) * params.pageSize;
        data.rows.forEach((row) => {
          row.id = (Number(row.id) + minId).toString();
        });
        resolve(data);
      }, 500);
    });
  });
}

export function ServerPaginationWithApi() {
  const apiRef: ApiRef = useApiRef();
  const data = useData(100, 10);
  const [rows, setRows] = React.useState<RowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = apiRef.current.onPageChange((params) => {
      action('onPageChange')(params);
      setLoading(true);
      loadServerRows(params).then((newData) => {
        setRows(newData.rows);
        setLoading(false);
      });
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [apiRef, data]);

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={data.columns}
        apiRef={apiRef}
        pagination
        pageSize={50}
        rowCount={552}
        paginationMode={'server'}
        loading={loading}
      />
    </div>
  );
}

export function ServerPaginationWithEventHandler() {
  const apiRef: ApiRef = useApiRef();
  const data = useData(100, 10);
  const [rows, setRows] = React.useState<RowsProp>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const onPageChange = React.useCallback(
    (params) => {
      action('onPageChange')(params);
      setLoading(true);
      loadServerRows(params).then((newData) => {
        setRows(newData.rows);
        setLoading(false);
      });
    },
    [setRows, setLoading],
  );

  return (
    <div className="grid-container">
      <XGrid
        rows={rows}
        columns={data.columns}
        apiRef={apiRef}
        pagination
        pageSize={50}
        rowCount={552}
        paginationMode={'server'}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
