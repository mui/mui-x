import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
} from 'test/utils';
import { expect } from 'chai';
import {
  DataGrid,
  DataGridProps,
  DEFAULT_GRID_OPTIONS,
  GridRowsProp,
} from '@material-ui/data-grid';
import { getColumnValues } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<DataGrid /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  describe('pagination', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should apply the page prop correctly', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
        },
        {
          id: 1,
          brand: 'Addidas',
        },
        {
          id: 2,
          brand: 'Puma',
        },
      ];
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rows={rows} page={1} pageSize={1} />
        </div>,
      );
      const cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
      expect(cell).to.have.text('Addidas');
    });

    it('should trigger onPageChange when clicking on next page', () => {
      const onPageChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} onPageChange={onPageChange} pageSize={1} />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.callCount).to.equal(2);
    });

    it('should trigger onPageChange when clicking on next page in Server mode', () => {
      const onPageChange = spy();

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            onPageChange={onPageChange}
            pageSize={1}
            paginationMode="server"
          />
        </div>,
      );
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange.callCount).to.equal(1);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange.callCount).to.equal(2);
    });

    it('should not trigger onPageChange on initialisation or on page prop change', () => {
      const onPageChange = spy();

      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }

      const { setProps } = render(<Test page={1} pageSize={1} onPageChange={onPageChange} />);
      expect(onPageChange.callCount).to.equal(0);
      setProps({ page: 2 });
      expect(onPageChange.callCount).to.equal(0);
    });

    it('should not trigger onPageSizeChange on initialisation or on pageSize prop change', () => {
      const onPageSizeChange = spy();

      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }

      const { setProps } = render(
        <Test onPageSizeChange={onPageSizeChange} pageSize={1} page={1} />,
      );
      expect(onPageSizeChange.callCount).to.equal(0);
      setProps({ pageSize: 2 });
      expect(onPageSizeChange.callCount).to.equal(0);
    });

    it('should support server side pagination', () => {
      const ServerPaginationGrid = () => {
        const [page, setPage] = React.useState(0);
        const [rows, setRows] = React.useState<GridRowsProp>([]);

        const handlePageChange = (params) => {
          setPage(params.page);
        };

        React.useEffect(() => {
          let active = true;

          (async () => {
            const newRows = [
              {
                id: page,
                brand: `Nike ${page}`,
              },
            ];

            if (!active) {
              return;
            }

            setRows(newRows);
          })();

          return () => {
            active = false;
          };
        }, [page]);

        return (
          <div style={{ height: 300, width: 300 }}>
            <DataGrid
              {...baselineProps}
              rows={rows}
              pagination
              pageSize={1}
              rowCount={3}
              paginationMode="server"
              onPageChange={handlePageChange}
            />
          </div>
        );
      };

      render(<ServerPaginationGrid />);
      expect(getColumnValues()).to.deep.equal(['Nike 0']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues()).to.deep.equal(['Nike 1']);
    });

    describe('AutoPageSize', () => {
      it('should always render the same amount of rows and fit the viewport', () => {
        const TestCaseAutoPageSize = (
          props: Partial<DataGridProps> & { nbRows?: number; nbCols?: number; height?: number },
        ) => {
          const data = useData(props.nbRows || 100, props.nbCols || 10);

          return (
            <div style={{ width: 300, height: props.height || 300 }}>
              <DataGrid
                columns={data.columns}
                rows={data.rows}
                autoPageSize
                pagination
                {...props}
              />
            </div>
          );
        };
        const height = 780;
        const footerHeight = 52;
        const nbRows = 27;
        const expectedViewportRowsLength = Math.floor(
          (height - DEFAULT_GRID_OPTIONS.headerHeight - footerHeight) /
            DEFAULT_GRID_OPTIONS.rowHeight,
        );
        render(<TestCaseAutoPageSize nbRows={nbRows} height={height} />);
        let rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
        rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(expectedViewportRowsLength);

        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        fireEvent.click(screen.getByRole('button', { name: /next page/i }));
        rows = document.querySelectorAll('.MuiDataGrid-viewport [role="row"]');
        expect(rows.length).to.equal(nbRows % expectedViewportRowsLength);
      });
    });
  });
});
