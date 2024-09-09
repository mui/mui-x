import * as React from 'react';
import { createRenderer, screen, ErrorBoundary, waitFor } from '@mui/internal-test-utils';
import { stub, spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGrid,
  GridToolbar,
  DataGridProps,
  GridColDef,
  gridClasses,
  useGridApiRef,
  GridApi,
} from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  $,
  grid,
  gridVar,
  getColumnHeaderCell,
  getColumnValues,
  getCell,
  getRow,
  sleep,
} from 'test/utils/helperFn';

const getVariable = (name: string) => $('.MuiDataGrid-root')!.style.getPropertyValue(name);

describe('<DataGrid /> - Layout & warnings', () => {
  const { clock, render } = createRenderer();

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

  describe('immutable rows', () => {
    it('should throw an error if rows props is being mutated', () => {
      expect(() => {
        // We don't want to freeze baselineProps.rows
        const rows = [...baselineProps.rows];
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} rows={rows} />
          </div>,
        );
        rows.push({ id: 3, brand: 'Louis Vuitton' });
      }).to.throw();
    });

    // See https://github.com/mui/mui-x/issues/5411
    it('should fail silently if not possible to freeze', () => {
      expect(() => {
        // For example, MobX
        // https://github.com/mobxjs/mobx/blob/e60b36c9c78ff9871be1bd324831343c279dd69f/packages/mobx/src/types/observablearray.ts#L115
        const rows = new Proxy(baselineProps.rows, {
          preventExtensions() {
            throw new Error('Freezing is not supported');
          },
        });

        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} rows={rows} />
          </div>,
        );
      }).not.to.throw();
    });
  });

  describe('Layout', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should resize the width of the columns', async () => {
      interface TestCaseProps {
        width?: number;
      }

      function TestCase(props: TestCaseProps) {
        const { width = 300 } = props;
        return (
          <div style={{ width, height: 300 }}>
            <DataGrid {...baselineProps} />
          </div>
        );
      }

      const { container, setProps } = render(<TestCase width={300} />);
      let rect;
      rect = container.querySelector('[role="row"][data-rowindex="0"]')!.getBoundingClientRect();
      expect(rect.width).to.equal(300 - 2);

      setProps({ width: 400 });

      await waitFor(() => {
        rect = container.querySelector('[role="row"][data-rowindex="0"]')!.getBoundingClientRect();
        expect(rect.width).to.equal(400 - 2);
      });
    });

    // Adaptation of describeConformance()
    describe('MUI component API', () => {
      it(`attaches the ref`, () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} ref={ref} />
          </div>,
        );
        expect(ref.current).to.be.instanceof(window.HTMLDivElement);
        expect(ref.current).to.equal(container.firstChild?.firstChild);
      });

      describe('`classes` prop', () => {
        it("should apply the `root` rule name's value as a class to the root grid component", () => {
          const classes = {
            root: 'my_class_name',
          };

          const { container } = render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid {...baselineProps} classes={{ root: classes.root }} />
            </div>,
          );

          expect(container.firstChild?.firstChild).to.have.class(classes.root);
        });

        it('should support class names with underscores', () => {
          render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid {...baselineProps} classes={{ 'columnHeader--sortable': 'foobar' }} />
            </div>,
          );
          expect(getColumnHeaderCell(0)).to.have.class('foobar');
        });
      });

      it('applies the className to the root component', () => {
        function randomStringValue() {
          return `r${Math.random().toString(36).slice(2)}`;
        }

        const className = randomStringValue();

        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} className={className} />
          </div>,
        );

        expect(document.querySelector(`.${className}`)).to.equal(container.firstChild?.firstChild);
      });

      it('should support columns.valueGetter using direct row access', () => {
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'firstName' },
          { field: 'lastName' },
          {
            field: 'fullName',
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
          },
        ];

        const rows = [
          { id: 1, lastName: 'Snow', firstName: 'Jon' },
          { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
        ];
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid rows={rows} columns={columns} />
          </div>,
        );
        expect(getColumnValues(3)).to.deep.equal(['Jon Snow', 'Cersei Lannister']);
      });
    });

    describe('warnings', () => {
      clock.withFakeTimers();

      it('should error if the container has no intrinsic height', () => {
        expect(() => {
          render(
            <div style={{ width: 300, height: 0 }}>
              <DataGrid {...baselineProps} />
            </div>,
          );
          // Use timeout to allow simpler tests in JSDOM.
          clock.tick(0);
        }).toErrorDev(
          'MUI X: useResizeContainer - The parent DOM element of the data grid has an empty height.',
        );
      });

      it('should error if the container has no intrinsic width', () => {
        expect(() => {
          render(
            <div style={{ width: 0 }}>
              <div style={{ width: '100%', height: 300 }}>
                <DataGrid {...baselineProps} />
              </div>
            </div>,
          );
          // Use timeout to allow simpler tests in JSDOM.
          clock.tick(0);
        }).toErrorDev(
          'MUI X: useResizeContainer - The parent DOM element of the data grid has an empty width',
        );
      });
    });

    describe('swallow warnings', () => {
      clock.withFakeTimers();

      beforeEach(() => {
        stub(console, 'error');
      });

      afterEach(() => {
        // @ts-expect-error beforeEach side effect
        console.error.restore();
      });

      it('should have a stable height if the parent container has no intrinsic height', () => {
        render(
          <div>
            <p>The table keeps growing... and growing...</p>
            <DataGrid {...baselineProps} />
          </div>,
        );
        const firstHeight = grid('root')?.clientHeight;
        clock.tick(10);
        const secondHeight = grid('root')?.clientHeight;
        expect(firstHeight).to.equal(secondHeight);
      });
    });

    describe('column width', () => {
      it('should set the columns width to 100px by default', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const columns = [
          {
            field: 'id',
          },
          {
            field: 'name',
          },
          {
            field: 'age',
          },
        ];

        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        screen.getAllByRole('columnheader').forEach((col: HTMLElement) => {
          expect(col).toHaveInlineStyle({ width: '100px' });
        });
      });

      it('should set the columns width value to what is provided', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
            age: 30,
          },
        ];

        const colWidthValues = [50, 50, 200];
        const columns = [
          {
            field: 'id',
            width: colWidthValues[0],
          },
          {
            field: 'name',
            width: colWidthValues[1],
          },
          {
            field: 'age',
            width: colWidthValues[2],
          },
        ];

        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        screen.getAllByRole('columnheader').forEach((col: HTMLElement, index: number) => {
          expect(col).toHaveInlineStyle({ width: `${colWidthValues[index]}px` });
        });
      });

      it('should set the first column to be twice as wide as the second one', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            minWidth: 0,
            flex: 1,
          },
          {
            field: 'name',
            minWidth: 0,
            flex: 0.5,
          },
        ];

        render(
          <div style={{ width: 602, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        const secondColumn = getColumnHeaderCell(1);
        expect(firstColumn.offsetWidth).to.equal(2 * secondColumn.offsetWidth);
      });

      it('should set the first column to its `minWidth` and the second one to the remaining space', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
            minWidth: 100,
          },
          {
            field: 'name',
            flex: 1000,
          },
        ];

        render(
          <div style={{ width: 400, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        expect(getColumnHeaderCell(0).offsetWidth).to.equal(100);
        expect(getColumnHeaderCell(1).offsetWidth).to.equal(298); // 2px border
      });

      it('should respect `minWidth` when a column is fluid', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        expect(getColumnHeaderCell(0).offsetWidth).to.equal(150);
        expect(getColumnHeaderCell(1).offsetWidth).to.equal(50);
      });

      it('should use `minWidth` on flex columns if there is no more space to distribute', () => {
        const rows = [{ id: 1, username: '@MUI', age: 20 }];

        const columns = [
          { field: 'id', flex: 1, minWidth: 50 },
          // this column is wider than the viewport width
          { field: 'username', width: 200 },
          { field: 'age', flex: 3, minWidth: 50 },
        ];

        render(
          <div style={{ width: 100, height: 200 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        expect(getColumnHeaderCell(0).offsetWidth).to.equal(50);
        expect(getColumnHeaderCell(1).offsetWidth).to.equal(200);
        expect(getColumnHeaderCell(2).offsetWidth).to.equal(50);
      });

      it('should ignore `minWidth` on flex columns when computed width is greater', () => {
        const rows = [{ id: 1, username: '@MUI', age: 20 }];
        const columns = [
          { field: 'id', flex: 1, minWidth: 150 },
          { field: 'username', width: 200 },
          { field: 'age', flex: 0.3, minWidth: 50 },
        ];

        render(
          // width 850px + 2px border
          <div style={{ width: 852, height: 200 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        expect(getColumnHeaderCell(0).offsetWidth).to.equal(500);
        expect(getColumnHeaderCell(1).offsetWidth).to.equal(200);
        expect(getColumnHeaderCell(2).offsetWidth).to.equal(150);
      });

      it('should respect `maxWidth` when a column is fluid', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
            maxWidth: 100,
          },
          {
            field: 'name',
            width: 50,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        expect(firstColumn).toHaveInlineStyle({
          width: '100px',
        });
      });

      it('should split the columns equally if they are all flex', () => {
        const rows = [
          {
            id: 1,
            name: 'John Doe',
            age: 30,
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 1,
          },
          {
            field: 'age',
            flex: 1,
          },
        ];

        const containerWidth = 408;

        render(
          // 2px border
          <div style={{ width: containerWidth + 2, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        const expectedWidth = containerWidth / 3;
        expect(getColumnHeaderCell(0).offsetWidth).to.be.equal(expectedWidth);
        expect(getColumnHeaderCell(1).offsetWidth).to.be.equal(expectedWidth);
        expect(getColumnHeaderCell(2).offsetWidth).to.be.equal(expectedWidth);
      });

      it('should handle hidden columns', () => {
        const rows = [{ id: 1, firstName: 'Jon' }];
        const columns = [
          { field: 'id', headerName: 'ID', flex: 1 },
          {
            field: 'firstName',
            headerName: 'First name',
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ columns: { columnVisibilityModel: { firstName: false } } }}
            />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });
      });

      it('should resize flex: 1 column when changing columnVisibilityModel to avoid exceeding grid width', () => {
        function TestCase(props: DataGridProps) {
          return (
            <div style={{ width: 300, height: 500 }}>
              <DataGrid {...props} />
            </div>
          );
        }

        const { setProps } = render(
          <TestCase
            rows={[
              {
                id: 1,
                first: 'Mike',
                age: 11,
              },
              {
                id: 2,
                first: 'Jack',
                age: 11,
              },
              {
                id: 3,
                first: 'Mike',
                age: 20,
              },
            ]}
            columns={[
              { field: 'id', flex: 1 },
              { field: 'first', width: 100 },
              { field: 'age', width: 50 },
            ]}
            columnVisibilityModel={{ age: false }}
          />,
        );

        let firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });

        setProps({
          columnVisibilityModel: {},
        });

        firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        expect(firstColumn).toHaveInlineStyle({
          width: '148px', // because of the 2px border
        });
      });

      it('should be rerender invariant', () => {
        function Test() {
          const columns = [{ field: 'id', headerName: 'ID', flex: 1 }];
          return (
            <div style={{ width: 200, height: 300 }}>
              <DataGrid rows={[]} columns={columns} />
            </div>
          );
        }

        const { setProps } = render(<Test />);
        setProps({});

        const firstColumn = getColumnHeaderCell(0);
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });
      });

      it('should set the columns width so that if fills the remaining width when "checkboxSelection" is used and the columns have "flex" set', () => {
        const rows = [
          {
            id: 1,
            username: 'John Doe',
          },
        ];

        const columns = [
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 0.5,
          },
        ];

        const totalWidth = 700;

        render(
          <div style={{ width: totalWidth, height: 300 }}>
            <DataGrid columns={columns} rows={rows} checkboxSelection />
          </div>,
        );

        expect(
          Array.from(document.querySelectorAll('[role="columnheader"]')).reduce(
            (width, item) => width + item.clientWidth,
            0,
          ),
        ).to.equal(totalWidth - 2);
      });
    });

    describe('autoHeight', () => {
      it('should have the correct intrinsic height', () => {
        const columnHeaderHeight = 40;
        const rowHeight = 30;
        render(
          <div style={{ width: 300 }}>
            <DataGrid
              {...baselineProps}
              columnHeaderHeight={columnHeaderHeight}
              rowHeight={rowHeight}
              autoHeight
            />
          </div>,
        );
        const rowsHeight = rowHeight * baselineProps.rows.length;
        expect($('.MuiDataGrid-main')!.clientHeight).to.equal(columnHeaderHeight + rowsHeight);
        expect($('.MuiDataGrid-virtualScroller')!.clientHeight).to.equal(
          columnHeaderHeight + rowsHeight,
        );
      });

      it('should have the correct intrinsic height inside of a flex container', () => {
        const columnHeaderHeight = 40;
        const rowHeight = 30;
        render(
          <div style={{ display: 'flex' }}>
            <DataGrid
              {...baselineProps}
              columnHeaderHeight={columnHeaderHeight}
              rowHeight={rowHeight}
              autoHeight
            />
          </div>,
        );
        const rowsHeight = rowHeight * baselineProps.rows.length;
        expect($('.MuiDataGrid-main')!.clientHeight).to.equal(columnHeaderHeight + rowsHeight);
        expect($('.MuiDataGrid-virtualScroller')!.clientHeight).to.equal(
          columnHeaderHeight + rowsHeight,
        );
      });

      it('should include the scrollbar in the intrinsic height when there are more columns to show', function test() {
        // On MacOS the scrollbar has zero width
        if (/macintosh/i.test(window.navigator.userAgent)) {
          this.skip();
        }
        const columnHeaderHeight = 40;
        const rowHeight = 30;

        let apiRef!: React.MutableRefObject<GridApi>;
        function Test() {
          apiRef = useGridApiRef();
          return (
            <div style={{ width: 150 }}>
              <DataGrid
                {...baselineProps}
                apiRef={apiRef}
                columnHeaderHeight={columnHeaderHeight}
                rowHeight={rowHeight}
                columns={[{ field: 'brand' }, { field: 'year' }]}
                autoHeight
              />
            </div>
          );
        }
        render(<Test />);

        const scrollbarSize = apiRef.current.state.dimensions.scrollbarSize;
        expect(scrollbarSize).not.to.equal(0);
        expect(grid('main')!.clientHeight).to.equal(
          scrollbarSize + columnHeaderHeight + rowHeight * baselineProps.rows.length,
        );
      });

      it('should give some space to the noRows overlay', () => {
        const rowHeight = 30;
        render(
          <div style={{ width: 300 }}>
            <DataGrid {...baselineProps} rows={[]} rowHeight={rowHeight} autoHeight />
          </div>,
        );
        expect($('.MuiDataGrid-overlay')!.clientHeight).to.equal(rowHeight * 2);
      });

      it('should allow to override the noRows overlay height', () => {
        render(
          <div style={{ width: 300 }}>
            <DataGrid
              {...baselineProps}
              rows={[]}
              autoHeight
              sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
          </div>,
        );
        expect(document.querySelector<HTMLElement>('.MuiDataGrid-overlay')!.clientHeight).to.equal(
          300,
        );
      });

      it('should render loading overlay the same height as the content', () => {
        const rowHeight = 30;
        render(
          <div style={{ width: 300 }}>
            <DataGrid {...baselineProps} rowHeight={rowHeight} autoHeight loading />
          </div>,
        );
        expect($('.MuiDataGrid-overlay')!.clientHeight).to.equal(
          rowHeight * baselineProps.rows.length,
        );
      });

      it('should apply the autoHeight class to the root element', () => {
        render(
          <div style={{ width: 300 }}>
            <DataGrid {...baselineProps} autoHeight />
          </div>,
        );
        expect(grid('root')).to.have.class(gridClasses.autoHeight);
      });
    });

    // A function test counterpart of ScrollbarOverflowVerticalSnap.
    it('should not have a horizontal scrollbar if not needed', () => {
      function TestCase() {
        const data = useBasicDemoData(100, 1);
        return (
          <div style={{ width: 500, height: 300 }}>
            <DataGrid {...data} />
          </div>
        );
      }
      render(<TestCase />);
      // It should not have a horizontal scrollbar
      expect(gridVar('--DataGrid-hasScrollX')).to.equal('0');
    });

    it('should have a horizontal scrollbar when there are more columns to show and no rows', function test() {
      // On MacOS the scrollbar has zero width
      if (/macintosh/i.test(window.navigator.userAgent)) {
        this.skip();
      }
      render(
        <div style={{ width: 150, height: 300 }}>
          <DataGrid columns={[{ field: 'brand' }, { field: 'year' }]} rows={[]} />
        </div>,
      );
      expect(gridVar('--DataGrid-hasScrollX')).to.equal('1');
    });

    it('should not place the overlay on top of the horizontal scrollbar when rows=[]', () => {
      const columnHeaderHeight = 40;
      const height = 300;
      const border = 1;
      let apiRef!: React.MutableRefObject<GridApi>;
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 100 + 2 * border, height: height + 2 * border }}>
            <DataGrid
              apiRef={apiRef}
              rows={[]}
              columns={[{ field: 'brand' }, { field: 'price' }]}
              columnHeaderHeight={columnHeaderHeight}
              hideFooter
            />
          </div>
        );
      }
      render(<Test />);
      const scrollbarSize = apiRef.current.state.dimensions.scrollbarSize;
      const overlayWrapper = screen.getByText('No rows').parentElement;
      const expectedHeight = height - columnHeaderHeight - scrollbarSize;
      expect(overlayWrapper).toHaveComputedStyle({ height: `${expectedHeight}px` });
    });
  });

  describe('warnings', () => {
    // TODO: reintroduce chainProptypes that has been removed in https://github.com/mui/mui-x/pull/11303
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('should raise a warning if trying to use an enterprise feature', () => {
      expect(() => {
        render(
          <div style={{ width: 150, height: 300 }}>
            {/* @ts-ignore */}
            <DataGrid pagination={false} columns={[]} rows={[]} />
          </div>,
        );
      }).toErrorDev('MUI X: `<DataGrid pagination={false} />` is not a valid prop.');
    });

    it('should throw if the rows has no id', function test() {
      // TODO is this fixed?
      if (!/jsdom/.test(window.navigator.userAgent)) {
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        this.skip();
      }

      const rows = [
        {
          brand: 'Nike',
        },
      ];

      const errorRef = React.createRef<any>();
      expect(() => {
        render(
          <ErrorBoundary ref={errorRef}>
            <DataGrid {...baselineProps} rows={rows} />
          </ErrorBoundary>,
        );
      }).toErrorDev([
        'The data grid component requires all rows to have a unique `id` property',
        'The data grid component requires all rows to have a unique `id` property',
        'The above error occurred in the <ForwardRef(DataGrid)> component',
      ]);
      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(
        'The data grid component requires all rows to have a unique `id` property',
      );
    });
  });

  describe('localeText', () => {
    it('should replace the density selector button label text to "Size"', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
            localeText={{ toolbarDensity: 'Size' }}
          />
        </div>,
      );

      expect(screen.getByText('Size')).not.to.equal(null);
    });

    it('should support translations in the theme', () => {
      render(
        <ThemeProvider theme={createTheme({}, ptBR)}>
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} />
          </div>
        </ThemeProvider>,
      );
      expect(document.querySelector('[title="Ordenar"]')).not.to.equal(null);
    });

    it('should allow to change localeText on the fly', () => {
      function TestCase(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              slots={{
                toolbar: GridToolbar,
              }}
              {...props}
            />
          </div>
        );
      }
      const { setProps } = render(<TestCase localeText={{ toolbarDensity: 'Density' }} />);
      expect(screen.getByText('Density')).not.to.equal(null);
      setProps({ localeText: { toolbarDensity: 'Densidade' } });
      expect(screen.getByText('Densidade')).not.to.equal(null);
    });
  });

  describe('non-strict mode', () => {
    const { render: innerRender } = createRenderer({ strict: false });

    it('should render in JSDOM', function test() {
      if (!/jsdom/.test(window.navigator.userAgent)) {
        this.skip(); // Only run in JSDOM
      }
      innerRender(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} />
        </div>,
      );

      expect(getCell(0, 0).textContent).to.equal('Nike');
    });
  });

  it('should allow style customization using the theme', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    const theme = createTheme({
      components: {
        MuiDataGrid: {
          styleOverrides: {
            root: {
              backgroundColor: 'rgb(255, 0, 0)',
            },
            columnHeader: {
              backgroundColor: 'rgb(255, 255, 0)',
            },
            row: {
              backgroundColor: 'rgb(128, 0, 128)',
            },
            cell: {
              backgroundColor: 'rgb(0, 128, 0)',
            },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} />
        </div>
      </ThemeProvider>,
    );

    expect(window.getComputedStyle(grid('root')!).backgroundColor).to.equal('rgb(255, 0, 0)');
    expect(window.getComputedStyle(getColumnHeaderCell(0)).backgroundColor).to.equal(
      'rgb(255, 255, 0)',
    );
    expect(window.getComputedStyle(getRow(0)).backgroundColor).to.equal('rgb(128, 0, 128)');
    expect(window.getComputedStyle(getCell(0, 0)).backgroundColor).to.equal('rgb(0, 128, 0)');
  });

  it('should support the sx prop', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      this.skip(); // Doesn't work with mocked window.getComputedStyle
    }

    const theme = createTheme({
      palette: {
        primary: {
          main: 'rgb(0, 0, 255)',
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <div style={{ width: 300, height: 300 }}>
          <DataGrid columns={[]} rows={[]} sx={{ color: 'primary.main' }} />
        </div>
      </ThemeProvider>,
    );

    expect(grid('root')).toHaveComputedStyle({
      color: 'rgb(0, 0, 255)',
    });
  });

  it('should have ownerState in the theme style overrides', () => {
    expect(() =>
      render(
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiDataGrid: {
                styleOverrides: {
                  root: ({ ownerState }) => ({
                    // test that ownerState is not undefined
                    ...(ownerState.columns && {}),
                  }),
                },
              },
            },
          })}
        >
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} />
          </div>
        </ThemeProvider>,
      ),
    ).not.to.throw();
  });

  it('should not render the "no rows" overlay when transitioning the loading prop from false to true', () => {
    const NoRowsOverlay = spy(() => null);
    function TestCase(props: Partial<DataGridProps>) {
      return (
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} slots={{ noRowsOverlay: NoRowsOverlay }} {...props} />
        </div>
      );
    }
    const { setProps } = render(<TestCase rows={[]} loading />);
    expect(NoRowsOverlay.callCount).to.equal(0);
    setProps({ loading: false, rows: [{ id: 1 }] });
    expect(NoRowsOverlay.callCount).to.equal(0);
  });

  it('should render the "no rows" overlay when changing the loading to false but not changing the rows prop', () => {
    const NoRowsOverlay = spy(() => null);
    function TestCase(props: Partial<DataGridProps>) {
      return (
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} slots={{ noRowsOverlay: NoRowsOverlay }} {...props} />
        </div>
      );
    }
    const rows: DataGridProps['rows'] = [];
    const { setProps } = render(<TestCase rows={rows} loading />);
    expect(NoRowsOverlay.callCount).to.equal(0);
    setProps({ loading: false });
    expect(NoRowsOverlay.callCount).not.to.equal(0);
  });

  describe('should not overflow parent', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        this.skip(); // Doesn't work with mocked window.getComputedStyle
      }
    });

    const rows = [{ id: 1, username: '@MUI', age: 20 }];
    const columns = [
      { field: 'id', width: 300 },
      { field: 'username', width: 300 },
    ];

    it('grid container', async () => {
      render(
        <div style={{ maxWidth: 400 }}>
          <div style={{ display: 'grid' }}>
            <DataGrid autoHeight columns={columns} rows={rows} />
          </div>
        </div>,
      );

      await waitFor(() => {
        expect(grid('root')).toHaveComputedStyle({ width: '400px' });
      });
    });

    it('flex container', async () => {
      render(
        <div style={{ maxWidth: 400 }}>
          <div style={{ display: 'flex' }}>
            <DataGrid autoHeight columns={columns} rows={rows} />
          </div>
        </div>,
      );

      await waitFor(() => {
        expect(grid('root')).toHaveComputedStyle({ width: '400px' });
      });
    });
  });

  // See https://github.com/mui/mui-x/issues/8737
  it('should not add horizontal scrollbar when .MuiDataGrid-main has border', async function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }

    render(
      <div style={{ height: 300, width: 400, display: 'flex' }}>
        <DataGrid
          rows={[{ id: 1 }]}
          columns={[{ field: 'id', flex: 1 }]}
          sx={{ '.MuiDataGrid-main': { border: '2px solid red' } }}
        />
      </div>,
    );

    const virtualScroller = $('.MuiDataGrid-virtualScroller')!;
    const initialVirtualScrollerWidth = virtualScroller.clientWidth;

    // It should not have a horizontal scrollbar
    expect(getVariable('--DataGrid-hasScrollX')).to.equal('0');

    await sleep(200);
    // The width should not increase infinitely
    expect(virtualScroller.clientWidth).to.equal(initialVirtualScrollerWidth);
  });

  // See https://github.com/mui/mui-x/issues/8689#issuecomment-1582616570
  it('should not add scrollbars when the parent container has fractional size', async function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }

    render(
      <div style={{ height: 300.5, width: 400 }}>
        <DataGrid rows={[]} columns={[{ field: 'id', flex: 1 }]} />
      </div>,
    );

    // It should not have a horizontal scrollbar
    expect(getVariable('--DataGrid-hasScrollX')).to.equal('0');
    // It should not have a vertical scrollbar
    expect(getVariable('--DataGrid-hasScrollY')).to.equal('0');
  });

  // See https://github.com/mui/mui-x/issues/9510
  it('should not exceed maximum call stack size when the parent container has fractional width', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }

    render(
      <div style={{ height: 300, width: 400.6 }}>
        <DataGrid rows={[{ id: 1 }]} columns={[{ field: 'id', flex: 1 }]} />
      </div>,
    );
  });

  // See https://github.com/mui/mui-x/issues/9550
  it('should not exceed maximum call stack size with duplicated flex fields', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }

    expect(() => {
      render(
        <div style={{ height: 200, width: 400 }}>
          <DataGrid
            rows={[{ id: 1 }]}
            columns={[
              { field: 'id', flex: 1 },
              { field: 'id', flex: 1 },
            ]}
          />
        </div>,
      );
    }).toErrorDev([
      'Warning: Encountered two children with the same key, `id`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
      'Warning: Encountered two children with the same key, `id`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.',
    ]);
  });

  // See https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
  it('should not exceed maximum call stack size caused by floating point precision error', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }

    render(
      <div style={{ height: 300, width: 1584 }}>
        <DataGrid
          rows={[{ id: 1 }]}
          columns={[
            { field: '1', flex: 1 },
            { field: '2', flex: 1 },
            { field: '3', flex: 1 },
            { field: '4', flex: 1 },
            { field: '5', flex: 1 },
            { field: '6', flex: 1 },
          ]}
        />
      </div>,
    );
  });
});
