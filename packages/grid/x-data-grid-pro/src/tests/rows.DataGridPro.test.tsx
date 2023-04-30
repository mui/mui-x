import * as React from 'react';
import { createRenderer, fireEvent, act, userEvent } from '@mui/monorepo/test/utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  getCell,
  getRow,
  getColumnValues,
  getRows,
  getColumnHeaderCell,
} from 'test/utils/helperFn';
import {
  GridRowModel,
  useGridApiRef,
  DataGridPro,
  DataGridProProps,
  GridApi,
  gridFocusCellSelector,
  gridClasses,
} from '@mui/x-data-grid-pro';
import { useBasicDemoData, getBasicGridData } from '@mui/x-data-grid-generator';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Rows', () => {
  let baselineProps: DataGridProProps;

  const { clock, render } = createRenderer({ clock: 'fake' });

  describe('getRowId', () => {
    beforeEach(() => {
      baselineProps = {
        autoHeight: isJSDOM,
        rows: [
          {
            clientId: 'c1',
            first: 'Mike',
            age: 11,
          },
          {
            clientId: 'c2',
            first: 'Jack',
            age: 11,
          },
          {
            clientId: 'c3',
            first: 'Mike',
            age: 20,
          },
        ],
        columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
      };
    });

    it('should not crash with weird id', () => {
      const columns = [{ field: 'id' }];
      const rows = [{ id: "'1" }, { id: '"2' }];

      render(
        <div style={{ height: 300, width: 300 }}>
          <DataGridPro rows={rows} columns={columns} checkboxSelection />
        </div>,
      );
    });

    it('should allow to switch between cell mode', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      const editableProps = { ...baselineProps };
      editableProps.columns = editableProps.columns.map((col) => ({ ...col, editable: true }));
      const getRowId: DataGridProProps['getRowId'] = (row) => `${row.clientId}`;

      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...editableProps} apiRef={apiRef} getRowId={getRowId} />
          </div>
        );
      }
      render(<Test />);
      act(() => apiRef!.current.startCellEditMode({ id: 'c2', field: 'first' }));
      const cell = getCell(1, 1);

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')!.value).to.equal('Jack');
      act(() => apiRef!.current.stopCellEditMode({ id: 'c2', field: 'first' }));

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should not clone the row', () => {
      const getRowId: DataGridProProps['getRowId'] = (row) => `${row.clientId}`;
      let apiRef: React.MutableRefObject<GridApi>;
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
          </div>
        );
      }
      render(<Test />);
      expect(apiRef!.current.getRow('c1')).to.equal(baselineProps.rows[0]);
    });
  });

  describe('prop: rows', () => {
    it('should not throttle even when props.throttleRowsMs is defined', () => {
      const { rows, columns } = getBasicGridData(5, 2);

      function Test(props: Pick<DataGridProProps, 'rows'>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...props}
              columns={columns}
              autoHeight={isJSDOM}
              throttleRowsMs={100}
              disableVirtualization
            />
          </div>
        );
      }

      const { setProps } = render(<Test rows={rows.slice(0, 2)} />);

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
      setProps({ rows });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });
  });

  describe('apiRef: updateRows', () => {
    beforeEach(() => {
      baselineProps = {
        autoHeight: isJSDOM,
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
        columns: [{ field: 'brand', headerName: 'Brand' }],
      };
    });

    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} disableVirtualization />
        </div>
      );
    }

    it('should not throttle by default', () => {
      render(<TestCase />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      act(() => apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]));
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
    });

    it('should allow to enable throttle', () => {
      render(<TestCase throttleRowsMs={100} />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      act(() => apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]));
      clock.tick(50);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      clock.tick(50);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
    });

    it('should allow to update row data', () => {
      render(<TestCase />);
      act(() => apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]));
      act(() => apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]));
      act(() => apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum']);
    });

    it('update row data can also add rows', () => {
      render(<TestCase />);
      act(() => apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]));
      act(() => apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]));
      act(() => apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]));
      act(() => apiRef.current.updateRows([{ id: 3, brand: 'Jordan' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also add rows in bulk', () => {
      render(<TestCase />);
      act(() =>
        apiRef.current.updateRows([
          { id: 1, brand: 'Fila' },
          { id: 0, brand: 'Pata' },
          { id: 2, brand: 'Pum' },
          { id: 3, brand: 'Jordan' },
        ]),
      );
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also delete rows', () => {
      render(<TestCase />);
      act(() => apiRef.current.updateRows([{ id: 1, _action: 'delete' }]));
      act(() => apiRef.current.updateRows([{ id: 0, brand: 'Apple' }]));
      act(() => apiRef.current.updateRows([{ id: 2, _action: 'delete' }]));
      act(() => apiRef.current.updateRows([{ id: 5, brand: 'Atari' }]));
      expect(getColumnValues(0)).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data can also delete rows in bulk', () => {
      render(<TestCase />);
      act(() =>
        apiRef.current.updateRows([
          { id: 1, _action: 'delete' },
          { id: 0, brand: 'Apple' },
          { id: 2, _action: 'delete' },
          { id: 5, brand: 'Atari' },
        ]),
      );
      expect(getColumnValues(0)).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data should process getRowId', () => {
      function TestCaseGetRowId() {
        apiRef = useGridApiRef();
        const getRowId = React.useCallback((row: GridRowModel) => row.idField, []);
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              rows={baselineProps.rows.map((row) => ({ idField: row.id, brand: row.brand }))}
              getRowId={getRowId}
            />
          </div>
        );
      }

      render(<TestCaseGetRowId />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      act(() =>
        apiRef.current.updateRows([
          { idField: 1, _action: 'delete' },
          { idField: 0, brand: 'Apple' },
          { idField: 2, _action: 'delete' },
          { idField: 5, brand: 'Atari' },
        ]),
      );
      expect(getColumnValues(0)).to.deep.equal(['Apple', 'Atari']);
    });

    it('should not loose partial updates after a props.loading switch', () => {
      function Test(props: Partial<DataGridProProps>) {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
          </div>
        );
      }

      const { setProps } = render(<Test />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      setProps({ loading: true });
      act(() => apiRef.current.updateRows([{ id: 0, brand: 'Nike 2' }]));
      setProps({ loading: false });
      expect(getColumnValues(0)).to.deep.equal(['Nike 2', 'Adidas', 'Puma']);
    });

    it('should not trigger unnecessary cells rerenders', () => {
      const renderCellSpy = spy((params: any) => {
        return params.value;
      });
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              rows={[{ id: 1, name: 'John' }]}
              columns={[{ field: 'name', renderCell: renderCellSpy }]}
              apiRef={apiRef}
            />
          </div>
        );
      }

      // For some reason the number of renders in test env is 2x the number of renders in the browser
      const renrederMultiplier = 2;

      render(<Test />);
      const initialRendersCount = 2;
      expect(renderCellSpy.callCount).to.equal(initialRendersCount * renrederMultiplier);

      act(() => apiRef.current.updateRows([{ id: 1, name: 'John' }]));
      expect(renderCellSpy.callCount).to.equal((initialRendersCount + 2) * renrederMultiplier);
    });
  });

  describe('apiRef: setRows', () => {
    beforeEach(() => {
      baselineProps = {
        autoHeight: isJSDOM,
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
        columns: [{ field: 'brand', headerName: 'Brand' }],
      };
    });

    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
        </div>
      );
    }

    it('should not throttle by default', () => {
      render(<TestCase />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      const newRows = [
        {
          id: 3,
          brand: 'Asics',
        },
      ];
      act(() => apiRef.current.setRows(newRows));

      expect(getColumnValues(0)).to.deep.equal(['Asics']);
    });

    it('should allow to enable throttle', () => {
      render(<TestCase throttleRowsMs={100} />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      const newRows = [
        {
          id: 3,
          brand: 'Asics',
        },
      ];
      act(() => apiRef.current.setRows(newRows));

      clock.tick(50);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      clock.tick(50);
      expect(getColumnValues(0)).to.deep.equal(['Asics']);
    });

    it('should work with `loading` prop change', () => {
      const { setProps } = render(<TestCase />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      const newRows = [{ id: 3, brand: 'Asics' }];
      setProps({ loading: true });
      act(() => apiRef.current.setRows(newRows));
      setProps({ loading: false });

      expect(getColumnValues(0)).to.deep.equal(['Asics']);
    });
  });

  describe('virtualization', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    let apiRef: React.MutableRefObject<GridApi>;
    function TestCaseVirtualization(
      props: Partial<DataGridProProps> & {
        nbRows?: number;
        nbCols?: number;
        width?: number;
        height?: number;
      },
    ) {
      apiRef = useGridApiRef();
      const data = useBasicDemoData(props.nbRows || 100, props.nbCols || 10);

      return (
        <div style={{ width: props.width || 300, height: props.height || 300 }}>
          <DataGridPro apiRef={apiRef} columns={data.columns} rows={data.rows} {...props} />
        </div>
      );
    }

    it('should compute rows correctly on height change', async () => {
      const { setProps } = render(
        <TestCaseVirtualization nbRows={5} nbCols={2} height={160} rowBuffer={0} />,
      );
      expect(getRows()).to.have.length(1);
      setProps({
        height: 220,
      });
      await act(() => Promise.resolve());
      clock.runToLast();
      expect(getRows()).to.have.length(3);
    });

    it('should render last row when scrolling to the bottom', () => {
      const rowHeight = 50;
      const rowBuffer = 4;
      const nbRows = 996;
      const height = 600;
      render(
        <TestCaseVirtualization
          nbRows={nbRows}
          columnHeaderHeight={0}
          rowHeight={rowHeight}
          rowBuffer={rowBuffer}
          hideFooter
          height={height}
        />,
      );

      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      const renderingZone = document.querySelector<HTMLElement>(
        '.MuiDataGrid-virtualScrollerRenderZone',
      )!;
      virtualScroller.scrollTop = 10e6; // scroll to the bottom
      act(() => virtualScroller.dispatchEvent(new Event('scroll')));

      const lastCell = document.querySelector('[role="row"]:last-child [role="cell"]:first-child')!;
      expect(lastCell).to.have.text('995');
      expect(renderingZone.children.length).to.equal(
        Math.floor((height - 1) / rowHeight) + rowBuffer,
      ); // Subtracting 1 is needed because of the column header borders
      const distanceToFirstRow = (nbRows - renderingZone.children.length) * rowHeight;
      expect(renderingZone.style.transform).to.equal(
        `translate3d(0px, ${distanceToFirstRow}px, 0px)`,
      );
      expect(virtualScroller.scrollHeight).to.equal(nbRows * rowHeight);
    });

    it('should have all the rows rendered of the page in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoPageSize pagination />);
      expect(getRows()).to.have.length(apiRef.current.state.pagination.paginationModel.pageSize);
    });

    it('should have all the rows rendered in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoHeight />);
      expect(getRows()).to.have.length(apiRef.current.state.pagination.paginationModel.pageSize);
    });

    it('should render extra columns when the columnBuffer prop is present', () => {
      const border = 1;
      const width = 300 + border * 2;
      const columnBuffer = 2;
      const columnWidth = 100;
      render(<TestCaseVirtualization width={width} nbRows={1} columnBuffer={2} />);
      const firstRow = getRow(0);
      expect(firstRow.children).to.have.length(Math.floor(width / columnWidth) + columnBuffer);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      virtualScroller.scrollLeft = 301;
      act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      expect(firstRow.children).to.have.length(
        columnBuffer + Math.floor(width / columnWidth) + columnBuffer,
      );
    });

    it('should render new rows when scrolling past the rowThreshold value', () => {
      const rowThreshold = 3;
      const rowHeight = 50;
      render(
        <TestCaseVirtualization rowHeight={rowHeight} rowBuffer={0} rowThreshold={rowThreshold} />,
      );
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      const renderingZone = document.querySelector('.MuiDataGrid-virtualScrollerRenderZone')!;
      let firstRow = renderingZone.firstChild;
      expect(firstRow).to.have.attr('data-rowindex', '0');
      virtualScroller.scrollTop = rowThreshold * rowHeight;
      act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      firstRow = renderingZone.firstChild;
      expect(firstRow).to.have.attr('data-rowindex', '3');
    });

    it('should render new columns when scrolling past the columnThreshold value', () => {
      const columnThreshold = 3;
      const columnWidth = 100;
      render(
        <TestCaseVirtualization nbRows={1} columnBuffer={0} columnThreshold={columnThreshold} />,
      );
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      const renderingZone = document.querySelector('.MuiDataGrid-virtualScrollerRenderZone')!;
      let firstRow = renderingZone.querySelector('[role="row"]:first-child')!;
      let firstColumn = firstRow.firstChild!;
      expect(firstColumn).to.have.attr('data-colindex', '0');
      virtualScroller.scrollLeft = columnThreshold * columnWidth;
      act(() => virtualScroller.dispatchEvent(new Event('scroll')));
      firstRow = renderingZone.querySelector('[role="row"]:first-child')!;
      firstColumn = firstRow.firstChild!;
      expect(firstColumn).to.have.attr('data-colindex', '3');
    });

    describe('Pagination', () => {
      it('should render only the pageSize', () => {
        const rowHeight = 50;
        const nbRows = 32;
        render(
          <TestCaseVirtualization
            pagination
            rowHeight={50}
            initialState={{ pagination: { paginationModel: { pageSize: nbRows } } }}
            pageSizeOptions={[nbRows]}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        virtualScroller.scrollTop = 10e6; // scroll to the bottom
        act(() => virtualScroller.dispatchEvent(new Event('scroll')));

        const lastCell = document.querySelector(
          '[role="row"]:last-child [role="cell"]:first-child',
        )!;
        expect(lastCell).to.have.text('31');
        expect(virtualScroller.scrollHeight).to.equal(nbRows * rowHeight);
      });

      it('should not virtualized the last page if smaller than viewport', () => {
        render(
          <TestCaseVirtualization
            pagination
            initialState={{ pagination: { paginationModel: { pageSize: 32, page: 3 } } }}
            pageSizeOptions={[32]}
            height={500}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        virtualScroller.scrollTop = 10e6; // scroll to the bottom
        virtualScroller.dispatchEvent(new Event('scroll'));

        const lastCell = document.querySelector(
          '[role="row"]:last-child [role="cell"]:first-child',
        )!;
        expect(lastCell).to.have.text('99');
        expect(virtualScroller.scrollTop).to.equal(0);
        expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
        expect(
          document.querySelector('.MuiDataGrid-virtualScrollerRenderZone')!.children,
        ).to.have.length(4);
      });

      it('should paginate small dataset in auto page-size #1492', () => {
        render(
          <TestCaseVirtualization pagination autoPageSize height={496} nbCols={1} nbRows={9} />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

        const lastCell = document.querySelector(
          '[role="row"]:last-child [role="cell"]:first-child',
        )!;
        expect(lastCell).to.have.text('6');
        const rows = document.querySelectorAll('.MuiDataGrid-row[role="row"]')!;
        expect(rows.length).to.equal(7);

        expect(virtualScroller.scrollTop).to.equal(0);
        expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
        expect(
          document.querySelector('.MuiDataGrid-virtualScrollerRenderZone')!.children,
        ).to.have.length(7);
      });
    });

    describe('scrollToIndexes', () => {
      it('should scroll correctly when the given rowIndex is partially visible at the bottom', () => {
        const columnHeaderHeight = 40;
        const rowHeight = 50;
        const offset = 10;
        const border = 1;
        render(
          <TestCaseVirtualization
            hideFooter
            columnHeaderHeight={columnHeaderHeight}
            height={columnHeaderHeight + 4 * rowHeight + offset + border * 2}
            nbCols={2}
            rowHeight={rowHeight}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 4, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(rowHeight - offset);
      });

      it('should scroll correctly when the given index is partially visible at the top', () => {
        const columnHeaderHeight = 40;
        const rowHeight = 50;
        const offset = 10;
        const border = 1;
        render(
          <TestCaseVirtualization
            hideFooter
            columnHeaderHeight={columnHeaderHeight}
            height={columnHeaderHeight + 4 * rowHeight + border + border * 2}
            nbCols={2}
            rowHeight={rowHeight}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        virtualScroller.scrollTop = offset;
        virtualScroller.dispatchEvent(new Event('scroll')); // Simulate browser behavior
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 2, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(offset);
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 1, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(offset);
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(0);
      });

      it('should scroll correctly when the given colIndex is partially visible at the right', () => {
        const width = 300;
        const border = 1;
        const columnWidth = 120;
        const rows = [{ id: 0, firstName: 'John', lastName: 'Doe', age: 11 }];
        const columns = [
          { field: 'id', width: columnWidth },
          { field: 'firstName', width: columnWidth },
          { field: 'lastName', width: columnWidth },
          { field: 'age', width: columnWidth },
        ];
        render(<TestCaseVirtualization width={width + border * 2} rows={rows} columns={columns} />);
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        expect(virtualScroller.scrollLeft).to.equal(0);
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 2 }));
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
      });

      it('should not scroll when going back', () => {
        const width = 300;
        const border = 1;
        const columnWidth = 120;
        const rows = [{ id: 0, firstName: 'John', lastName: 'Doe', age: 11 }];
        const columns = [
          { field: 'id', width: columnWidth },
          { field: 'firstName', width: columnWidth },
          { field: 'lastName', width: columnWidth },
          { field: 'age', width: columnWidth },
        ];
        render(<TestCaseVirtualization width={width + border * 2} rows={rows} columns={columns} />);
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        expect(virtualScroller.scrollLeft).to.equal(0);
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 2 }));
        virtualScroller.dispatchEvent(new Event('scroll')); // Simulate browser behavior
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
        act(() => apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 1 }));
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
      });
    });
  });

  describe('no virtualization', () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: Partial<DataGridProProps> & { nbRows?: number; nbCols?: number }) {
      apiRef = useGridApiRef();
      const data = useBasicDemoData(props.nbRows || 10, props.nbCols || 10);
      return (
        <div style={{ width: 100, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            columns={data.columns}
            rows={data.rows}
            disableVirtualization
            {...props}
          />
        </div>
      );
    }

    it('should allow to disable virtualization', () => {
      render(<TestCase />);
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(10);
      expect(document.querySelectorAll('[role="cell"]')).to.have.length(10 * 10);
    });

    it('should render the correct rows when changing pages', () => {
      render(
        <TestCase
          initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
          pageSizeOptions={[6]}
          pagination
        />,
      );
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(6);
      act(() => apiRef.current.setPage(1));
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(4);
    });
  });

  describe('Cell focus', () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} {...baselineProps} {...props} />
        </div>
      );
    }

    beforeEach(() => {
      baselineProps = {
        autoHeight: isJSDOM,
        rows: [
          {
            id: 1,
            clientId: 'c1',
            first: 'Mike',
            age: 11,
          },
          {
            id: 2,
            clientId: 'c2',
            first: 'Jack',
            age: 11,
          },
          {
            id: 3,
            clientId: 'c3',
            first: 'Mike',
            age: 20,
          },
        ],
        columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
      };
    });

    it('should focus the clicked cell in the state', () => {
      render(<TestCase rows={baselineProps.rows} />);

      userEvent.mousePress(getCell(0, 0));
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[0].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should reset focus when removing the row containing the focus cell', () => {
      const { setProps } = render(<TestCase rows={baselineProps.rows} />);

      fireEvent.click(getCell(0, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      expect(gridFocusCellSelector(apiRef)).to.equal(null);
    });

    it('should not reset focus when removing a row not containing the focus cell', () => {
      const { setProps } = render(<TestCase rows={baselineProps.rows} />);

      userEvent.mousePress(getCell(1, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should set the focus when pressing a key inside a cell', () => {
      render(<TestCase rows={baselineProps.rows} />);
      const cell = getCell(1, 0);
      userEvent.mousePress(cell);
      fireEvent.keyDown(cell, { key: 'a' });
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should update the focus when clicking from one cell to another', () => {
      render(<TestCase rows={baselineProps.rows} />);
      userEvent.mousePress(getCell(1, 0));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      userEvent.mousePress(getCell(2, 1));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[2].id,
        field: baselineProps.columns[1].field,
      });
    });

    it('should reset focus when clicking outside the focused cell', () => {
      render(<TestCase rows={baselineProps.rows} />);
      userEvent.mousePress(getCell(1, 0));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      fireEvent.click(document.body);
      expect(gridFocusCellSelector(apiRef)).to.deep.equal(null);
    });

    it('should publish "cellFocusOut" when clicking outside the focused cell', () => {
      const handleCellFocusOut = spy();
      render(<TestCase rows={baselineProps.rows} />);
      apiRef.current.subscribeEvent('cellFocusOut', handleCellFocusOut);
      userEvent.mousePress(getCell(1, 0));
      expect(handleCellFocusOut.callCount).to.equal(0);
      fireEvent.click(document.body);
      expect(handleCellFocusOut.callCount).to.equal(1);
      expect(handleCellFocusOut.args[0][0].id).to.equal(baselineProps.rows[1].id);
      expect(handleCellFocusOut.args[0][0].field).to.equal(baselineProps.columns[0].field);
    });

    it('should not crash when the row is removed during the click', () => {
      expect(() => {
        render(
          <TestCase
            rows={baselineProps.rows}
            onCellClick={() => {
              apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
            }}
          />,
        );
        const cell = getCell(0, 0);
        userEvent.mousePress(cell);
      }).not.to.throw();
    });

    it('should not crash when the row is removed between events', () => {
      expect(() => {
        render(<TestCase rows={baselineProps.rows} />);
        const cell = getCell(0, 0);
        fireEvent.mouseEnter(cell);
        act(() => apiRef.current.updateRows([{ id: 1, _action: 'delete' }]));
        fireEvent.mouseLeave(cell);
      }).not.to.throw();
    });

    // See https://github.com/mui/mui-x/issues/5742
    it('should not crash when focusing header after row is removed during the click', () => {
      expect(() => {
        render(
          <TestCase
            rows={baselineProps.rows}
            onCellClick={() => {
              apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
            }}
          />,
        );
        const cell = getCell(0, 0);
        userEvent.mousePress(cell);
        const columnHeaderCell = getColumnHeaderCell(0);
        fireEvent.focus(columnHeaderCell);
      }).not.to.throw();
    });
  });

  describe('apiRef: setRowHeight', () => {
    const ROW_HEIGHT = 52;

    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    beforeEach(() => {
      baselineProps = {
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
        columns: [{ field: 'brand', headerName: 'Brand' }],
      };
    });

    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} rowHeight={ROW_HEIGHT} {...props} />
        </div>
      );
    }

    it('should change row height', () => {
      const resizedRowId = 1;
      render(<TestCase />);

      expect(getRow(1).clientHeight).to.equal(ROW_HEIGHT);

      act(() => apiRef.current.unstable_setRowHeight(resizedRowId, 100));
      expect(getRow(resizedRowId).clientHeight).to.equal(100);
    });

    it('should preserve changed row height after sorting', () => {
      const resizedRowId = 0;
      const getRowHeight = spy();
      render(<TestCase getRowHeight={getRowHeight} />);

      const row = getRow(resizedRowId);
      expect(row.clientHeight).to.equal(ROW_HEIGHT);

      getRowHeight.resetHistory();
      act(() => apiRef.current.unstable_setRowHeight(resizedRowId, 100));
      expect(row.clientHeight).to.equal(100);

      // sort
      fireEvent.click(getColumnHeaderCell(resizedRowId));

      expect(row.clientHeight).to.equal(100);
      expect(getRowHeight.neverCalledWithMatch({ id: resizedRowId })).to.equal(true);
    });
  });

  describe('prop: rowCount', () => {
    function TestCase(props: DataGridProProps) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...props} />
        </div>
      );
    }

    it('should not show total row count in footer if `rowCount === rows.length`', () => {
      const { rows, columns } = getBasicGridData(10, 2);
      const rowCount = rows.length;
      render(<TestCase rows={rows} columns={columns} rowCount={rowCount} />);

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length}`);
    });

    it('should show total row count in footer if `rowCount !== rows.length`', () => {
      const { rows, columns } = getBasicGridData(10, 2);
      const rowCount = rows.length + 10;
      render(<TestCase rows={rows} columns={columns} rowCount={rowCount} />);

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length} of ${rowCount}`);
    });

    it('should update total row count in footer on `rowCount` prop change', () => {
      const { rows, columns } = getBasicGridData(10, 2);
      let rowCount = rows.length;
      const { setProps } = render(<TestCase rows={rows} columns={columns} rowCount={rowCount} />);
      rowCount += 1;
      setProps({ rowCount });

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length} of ${rowCount}`);
    });
  });
});
