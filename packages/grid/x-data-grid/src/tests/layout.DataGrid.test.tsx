import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen, ErrorBoundary, waitFor } from '@mui/monorepo/test/utils';
import { SinonStub, stub, spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGrid,
  GridValueGetterParams,
  GridToolbar,
  DataGridProps,
  ptBR,
  GridColumns,
  gridClasses,
} from '@mui/x-data-grid';
import { useData } from 'packages/storybook/src/hooks/useData';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getColumnHeaderCell, getColumnValues, getCell, getRow } from 'test/utils/helperFn';

describe('<DataGrid /> - Layout & Warnings', () => {
  const { clock, render } = createRenderer({ clock: 'fake' });

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

  describe('Layout', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should resize the width of the columns', async () => {
      // Using a fake clock also affects `requestAnimationFrame`.
      // Calling clock.tick() should call the callback passed, but it doesn't work.
      stub(window, 'requestAnimationFrame').callsFake((fn: any) => fn());
      stub(window, 'cancelAnimationFrame');

      interface TestCaseProps {
        width?: number;
      }
      const TestCase = (props: TestCaseProps) => {
        const { width = 300 } = props;
        return (
          <div style={{ width, height: 300 }}>
            <DataGrid {...baselineProps} />
          </div>
        );
      };

      const { container, setProps } = render(<TestCase width={300} />);
      let rect;
      rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
      expect(rect.width).to.equal(300 - 2);

      setProps({ width: 400 });

      await waitFor(() => {
        rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
        expect(rect.width).to.equal(400 - 2);
      });

      (window.requestAnimationFrame as SinonStub).restore();
      (window.cancelAnimationFrame as SinonStub).restore();
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
        expect(ref.current).to.equal(container.firstChild.firstChild);
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

          expect(container.firstChild.firstChild).to.have.class(classes.root);
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

        expect(document.querySelector(`.${className}`)).to.equal(container.firstChild.firstChild);
      });

      it('should support columns.valueGetter using `getValue` (deprecated)', () => {
        const columns = [
          { field: 'id' },
          { field: 'firstName' },
          { field: 'lastName' },
          {
            field: 'fullName',
            valueGetter: (params: GridValueGetterParams) =>
              `${params.getValue(params.id, 'firstName') || ''} ${
                params.getValue(params.id, 'lastName') || ''
              }`,
          },
        ];

        const rows = [
          { id: 1, lastName: 'Snow', firstName: 'Jon' },
          { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
        ];

        expect(() => {
          render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid rows={rows} columns={columns} />
            </div>,
          );

          expect(getColumnValues(3)).to.deep.equal(['Jon Snow', 'Cersei Lannister']);
        }).toWarnDev(
          'MUI: You are calling getValue. This method is deprecated and will be removed in the next major version.',
        );
      });

      it('should support columns.valueGetter using direct row access', () => {
        const columns: GridColumns = [
          { field: 'id' },
          { field: 'firstName' },
          { field: 'lastName' },
          {
            field: 'fullName',
            valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
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
      it('should warn if the container has no intrinsic height', () => {
        expect(() => {
          render(
            <div style={{ width: 300, height: 0 }}>
              <DataGrid {...baselineProps} />
            </div>,
          );
          // Use timeout to allow simpler tests in JSDOM.
          clock.tick(0);
        }).toWarnDev('MUI: useResizeContainer - The parent of the grid has an empty height.');
      });

      it('should warn if the container has no intrinsic width', () => {
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
        }).toWarnDev('MUI: useResizeContainer - The parent of the grid has an empty width.');
      });

      it('should warn when GridCellParams.valueGetter is called with a missing column', () => {
        const rows = [
          { id: 1, age: 1 },
          { id: 2, age: 2 },
        ];
        const columns = [
          { field: 'id' },
          {
            field: 'fullName',
            valueGetter: (params: GridValueGetterParams) => params.getValue(params.id, 'age'),
          },
        ];
        expect(() => {
          render(
            <div style={{ width: 300, height: 300 }}>
              <DataGrid rows={rows} columns={columns} />
            </div>,
          );
        }).toWarnDev(["You are calling getValue('age') but the column `age` is not defined"]);
        expect(getColumnValues(1)).to.deep.equal(['1', '2']);
      });
    });

    describe('swallow warnings', () => {
      beforeEach(() => {
        stub(console, 'warn');
      });

      afterEach(() => {
        // @ts-expect-error beforeEach side effect
        console.warn.restore();
      });

      it('should have a stable height if the parent container has no intrinsic height', () => {
        const { getByRole } = render(
          <div>
            <p>The table keeps growing... and growing...</p>
            <DataGrid {...baselineProps} />
          </div>,
        );
        const firstHeight = getByRole('grid').clientHeight;
        clock.tick(10);
        const secondHeight = getByRole('grid').clientHeight;
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

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col: HTMLElement) => {
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

        const { getAllByRole } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid columns={columns} rows={rows} />
          </div>,
        );

        getAllByRole('columnheader').forEach((col: HTMLElement, index: number) => {
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

      it('should handle hidden columns (deprecated)', () => {
        const rows = [{ id: 1, firstName: 'Jon' }];
        const columns = [
          { field: 'id', headerName: 'ID', flex: 1 },
          {
            field: 'firstName',
            headerName: 'First name',
            hide: true,
          },
        ];

        render(
          <div style={{ width: 200, height: 300 }}>
            <DataGrid rows={rows} columns={columns} />
          </div>,
        );

        const firstColumn = getColumnHeaderCell(0);
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });
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

      it('should resize flex: 1 column when setting hide: false on a column to avoid exceeding grid width (deprecated)', () => {
        const TestCase = (props: DataGridProps) => (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...props} />
          </div>
        );

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
              { field: 'age', width: 50, hide: true },
            ]}
          />,
        );

        let firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        expect(firstColumn).toHaveInlineStyle({
          width: '198px', // because of the 2px border
        });

        setProps({
          columns: [
            { field: 'clientId', flex: 1 },
            { field: 'first', width: 100 },
            { field: 'age', width: 50 },
          ],
        });

        firstColumn = document.querySelector('[role="columnheader"][aria-colindex="1"]');
        expect(firstColumn).toHaveInlineStyle({
          width: '148px', // because of the 2px border
        });
      });

      it('should resize flex: 1 column when changing columnVisibilityModel to avoid exceeding grid width', () => {
        const TestCase = (props: DataGridProps) => (
          <div style={{ width: 300, height: 500 }}>
            <DataGrid {...props} />
          </div>
        );

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
        const Test = () => {
          const columns = [{ field: 'id', headerName: 'ID', flex: 1 }];
          return (
            <div style={{ width: 200, height: 300 }}>
              <DataGrid rows={[]} columns={columns} />
            </div>
          );
        };

        const { setProps } = render(<Test />);
        setProps();

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
        const headerHeight = 40;
        const rowHeight = 30;
        render(
          <div style={{ width: 300 }}>
            <DataGrid
              {...baselineProps}
              headerHeight={headerHeight}
              rowHeight={rowHeight}
              autoHeight
            />
          </div>,
        );
        expect(document.querySelector('.MuiDataGrid-main')!.clientHeight).to.equal(
          headerHeight + rowHeight * baselineProps.rows.length,
        );
      });

      it('should include the scrollbar in the intrinsic height when there are more columns to show', function test() {
        // On MacOS the scrollbar has zero width
        if (/macintosh/i.test(window.navigator.userAgent)) {
          this.skip();
        }
        const headerHeight = 40;
        const rowHeight = 30;
        render(
          <div style={{ width: 150 }}>
            <DataGrid
              {...baselineProps}
              headerHeight={headerHeight}
              rowHeight={rowHeight}
              columns={[{ field: 'brand' }, { field: 'year' }]}
              autoHeight
            />
          </div>,
        );
        const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller');
        const scrollBarSize = virtualScroller!.offsetHeight - virtualScroller!.clientHeight;
        expect(scrollBarSize).not.to.equal(0);
        expect(document.querySelector('.MuiDataGrid-main')!.clientHeight).to.equal(
          scrollBarSize + headerHeight + rowHeight * baselineProps.rows.length,
        );
      });

      it('should give some space to the noRows overlay', () => {
        const rowHeight = 30;
        render(
          <div style={{ width: 300 }}>
            <DataGrid {...baselineProps} rows={[]} rowHeight={rowHeight} autoHeight />
          </div>,
        );
        expect(document.querySelector<HTMLElement>('.MuiDataGrid-overlay')!.clientHeight).to.equal(
          rowHeight * 2,
        );
      });

      it('should expand content height to one row height when there is an error', () => {
        const error = { message: 'ERROR' };
        const rowHeight = 50;

        render(
          <div style={{ width: 150 }}>
            <DataGrid
              columns={[{ field: 'brand' }]}
              rows={[]}
              autoHeight
              error={error}
              rowHeight={rowHeight}
            />
          </div>,
        );
        const errorOverlayElement = document.querySelector<HTMLElement>('.MuiDataGrid-overlay')!;
        expect(errorOverlayElement.textContent).to.equal(error.message);
        expect(errorOverlayElement.offsetHeight).to.equal(2 * rowHeight);
      });

      it('should apply the autoHeight class to the root element', () => {
        render(
          <div style={{ width: 300 }}>
            <DataGrid {...baselineProps} autoHeight />
          </div>,
        );
        expect(screen.getByRole('grid')).to.have.class(gridClasses.autoHeight);
      });
    });

    // A function test counterpart of ScrollbarOverflowVerticalSnap.
    it('should not have a horizontal scrollbar if not needed', () => {
      const TestCase = () => {
        const data = useData(100, 1);
        return (
          <div style={{ width: 500, height: 300 }}>
            <DataGrid {...data} />
          </div>
        );
      };
      render(<TestCase />);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      // It should not have a horizontal scrollbar
      expect(virtualScroller.scrollWidth - virtualScroller.clientWidth).to.equal(0);
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
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      expect(virtualScroller.scrollWidth - virtualScroller.clientWidth).not.to.equal(0);
    });

    it('should not place the overlay on top of the horizontal scrollbar when rows=[]', () => {
      const headerHeight = 40;
      const height = 300;
      const border = 1;
      render(
        <div style={{ width: 100 + 2 * border, height: height + 2 * border }}>
          <DataGrid
            rows={[]}
            columns={[{ field: 'brand' }, { field: 'price' }]}
            headerHeight={headerHeight}
            hideFooter
          />
        </div>,
      );
      const virtualScroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller');
      const scrollBarSize = virtualScroller!.offsetHeight - virtualScroller!.clientHeight;
      const overlayWrapper = screen.getByText('No rows').parentElement;
      const expectedHeight = height - headerHeight - scrollBarSize;
      expect(overlayWrapper).toHaveComputedStyle({ height: `${expectedHeight}px` });
    });

    // See https://github.com/mui/mui-x/issues/3795#issuecomment-1028001939
    it('should expand content height when there are no rows', () => {
      render(
        <div style={{ width: 150, height: 300 }}>
          <DataGrid columns={[{ field: 'brand' }, { field: 'year' }]} rows={[]} />
        </div>,
      );
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller') as Element;
      const virtualScrollerContent = document.querySelector(
        '.MuiDataGrid-virtualScrollerContent',
      ) as Element;
      expect(virtualScrollerContent.clientHeight).to.equal(virtualScroller.clientHeight);
    });

    // See https://github.com/mui/mui-x/issues/4113
    it('should preserve default width constraints when extending default column type', () => {
      const rows = [{ id: 1, value: 1 }];
      const columns = [{ field: 'id', type: 'number' }];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            columnTypes={{
              number: {},
            }}
          />
        </div>,
      );

      // default `width` should be used
      expect(getCell(0, 0).offsetWidth).to.equal(100);
    });

    it('should allow to override default width constraints when extending default column type', () => {
      const rows = [{ id: 1, value: 1 }];
      const columns = [{ field: 'id', type: 'number' }];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            columnTypes={{
              number: {
                width: 10,
                minWidth: 200,
              },
            }}
          />
        </div>,
      );

      expect(getCell(0, 0).offsetWidth).to.equal(200);
    });
  });

  describe('warnings', () => {
    it('should raise a warning if trying to use an enterprise feature', () => {
      expect(() => {
        render(
          <div style={{ width: 150, height: 300 }}>
            {/* @ts-ignore */}
            <DataGrid pagination={false} columns={[]} rows={[]} />
          </div>,
        );
      }).toErrorDev('MUI: `<DataGrid pagination={false} />` is not a valid prop.');
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

      const errorRef = React.createRef();
      expect(() => {
        render(
          <ErrorBoundary ref={errorRef}>
            <DataGrid {...baselineProps} rows={rows} />
          </ErrorBoundary>,
        );
      }).toErrorDev([
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
      const { getByText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            components={{
              Toolbar: GridToolbar,
            }}
            localeText={{ toolbarDensity: 'Size' }}
          />
        </div>,
      );

      expect(getByText('Size')).not.to.equal(null);
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
  });

  describe('Error', () => {
    it('should display error message when error prop set', () => {
      const message = 'Error can also be set in props!';
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} error={{ message }} />
        </div>,
      );
      expect(document.querySelector<HTMLElement>('.MuiDataGrid-overlay')!.textContent).to.equal(
        message,
      );
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

    expect(window.getComputedStyle(screen.getByRole('grid')).backgroundColor).to.equal(
      'rgb(255, 0, 0)',
    );
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

    expect(screen.getByRole('grid')).toHaveComputedStyle({
      color: 'rgb(0, 0, 255)',
    });
  });

  it('should not render the "no rows" overlay when transitioning the loading prop from false to true', () => {
    const NoRowsOverlay = spy(() => null);
    const TestCase = (props: Partial<DataGridProps>) => (
      <div style={{ width: 300, height: 500 }}>
        <DataGrid {...baselineProps} components={{ NoRowsOverlay }} {...props} />
      </div>
    );
    const { setProps } = render(<TestCase rows={[]} loading />);
    expect(NoRowsOverlay.callCount).to.equal(0);
    setProps({ loading: false, rows: [{ id: 1 }] });
    expect(NoRowsOverlay.callCount).to.equal(0);
  });

  it('should render the "no rows" overlay when changing the loading to false but not changing the rows prop', () => {
    const NoRowsOverlay = spy(() => null);
    const TestCase = (props: Partial<DataGridProps>) => (
      <div style={{ width: 300, height: 500 }}>
        <DataGrid {...baselineProps} components={{ NoRowsOverlay }} {...props} />
      </div>
    );
    const rows: DataGridProps['rows'] = [];
    const { setProps } = render(<TestCase rows={rows} loading />);
    expect(NoRowsOverlay.callCount).to.equal(0);
    setProps({ loading: false });
    expect(NoRowsOverlay.callCount).not.to.equal(0);
  });
});
