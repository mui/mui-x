import * as React from 'react';
import { createRenderer, act, fireEvent, waitFor, reactMajor } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import { vi } from 'vitest';
import { RefObject } from '@mui/x-internals/types';
import {
  $,
  $$,
  grid,
  gridOffsetTop,
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
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { useBasicDemoData, getBasicGridData } from '@mui/x-data-grid-generator';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

interface BaselineProps extends DataGridProProps {
  rows: GridValidRowModel[];
}

describe('<DataGridPro /> - Rows', () => {
  let baselineProps: BaselineProps;

  const { render } = createRenderer();

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
      let apiRef: RefObject<GridApi | null>;
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
      act(() => apiRef.current?.startCellEditMode({ id: 'c2', field: 'first' }));
      const cell = getCell(1, 1);

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')!.value).to.equal('Jack');
      act(() => apiRef.current?.stopCellEditMode({ id: 'c2', field: 'first' }));

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should not clone the row', () => {
      const getRowId: DataGridProProps['getRowId'] = (row) => `${row.clientId}`;
      let apiRef: RefObject<GridApi | null>;
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
          </div>
        );
      }
      render(<Test />);
      expect(apiRef!.current?.getRow('c1')).to.equal(baselineProps.rows[0]);
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

    let apiRef: RefObject<GridApi | null>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} disableVirtualization />
        </div>
      );
    }

    describe('throttling', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should not throttle by default', () => {
        render(<TestCase />);
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        act(() => apiRef.current?.updateRows([{ id: 1, brand: 'Fila' }]));
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
      });

      it('should allow to enable throttle', async () => {
        render(<TestCase throttleRowsMs={100} />);
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

        await act(async () => apiRef.current?.updateRows([{ id: 1, brand: 'Fila' }]));

        await act(async () => {
          await vi.advanceTimersByTimeAsync(10);
        });
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });
        // It seems that the trigger is not dependant only on timeout.
        vi.useRealTimers();
        await waitFor(async () => {
          expect(getColumnValues(0)).to.deep.equal(['Nike', 'Fila', 'Puma']);
        });
      });
    });

    it('should allow to update row data', () => {
      render(<TestCase />);
      act(() => apiRef.current?.updateRows([{ id: 1, brand: 'Fila' }]));
      act(() => apiRef.current?.updateRows([{ id: 0, brand: 'Pata' }]));
      act(() => apiRef.current?.updateRows([{ id: 2, brand: 'Pum' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum']);
    });

    it('update row data can also add rows', () => {
      render(<TestCase />);
      act(() => apiRef.current?.updateRows([{ id: 1, brand: 'Fila' }]));
      act(() => apiRef.current?.updateRows([{ id: 0, brand: 'Pata' }]));
      act(() => apiRef.current?.updateRows([{ id: 2, brand: 'Pum' }]));
      act(() => apiRef.current?.updateRows([{ id: 3, brand: 'Jordan' }]));
      expect(getColumnValues(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also add rows in bulk', () => {
      render(<TestCase />);
      act(() =>
        apiRef.current?.updateRows([
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
      act(() => apiRef.current?.updateRows([{ id: 1, _action: 'delete' }]));
      act(() => apiRef.current?.updateRows([{ id: 0, brand: 'Apple' }]));
      act(() => apiRef.current?.updateRows([{ id: 2, _action: 'delete' }]));
      act(() => apiRef.current?.updateRows([{ id: 5, brand: 'Atari' }]));
      expect(getColumnValues(0)).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data can also delete rows in bulk', () => {
      render(<TestCase />);
      act(() =>
        apiRef.current?.updateRows([
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
        apiRef.current?.updateRows([
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
      act(() => apiRef.current?.updateRows([{ id: 0, brand: 'Nike 2' }]));
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

      render(<Test />);
      const initialRendersCount = 2;
      expect(renderCellSpy.callCount).to.equal(initialRendersCount);

      act(() => apiRef.current?.updateRows([{ id: 1, name: 'John' }]));
      expect(renderCellSpy.callCount).to.equal(initialRendersCount + 2);
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

    let apiRef: RefObject<GridApi | null>;

    function TestCase(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
        </div>
      );
    }

    describe('throttling', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should not throttle by default', () => {
        render(<TestCase />);
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        act(() => apiRef.current?.setRows([{ id: 3, brand: 'Asics' }]));

        expect(getColumnValues(0)).to.deep.equal(['Asics']);
      });

      it('should allow to enable throttle', async () => {
        render(<TestCase throttleRowsMs={100} />);
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        await act(() => apiRef.current?.setRows([{ id: 3, brand: 'Asics' }]));

        await act(async () => {
          await vi.advanceTimersByTimeAsync(10);
        });
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        // React 18 seems to render twice
        const timerCount = reactMajor < 19 ? 2 : 1;
        expect(vi.getTimerCount()).to.equal(timerCount);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });
        expect(vi.getTimerCount()).to.equal(0);

        // It seems that the trigger is not dependant only on timeout.
        vi.useRealTimers();
        await waitFor(async () => {
          expect(getColumnValues(0)).to.deep.equal(['Asics']);
        });
      });
    });

    it('should work with `loading` prop change', async () => {
      const { setProps } = render(<TestCase />);
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      const newRows = [{ id: 3, brand: 'Asics' }];
      setProps({ loading: true });
      act(() => apiRef.current?.setRows(newRows));
      setProps({ loading: false });

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Asics']);
      });
    });
  });

  // Need layouting
  describeSkipIf(isJSDOM)('virtualization', () => {
    let apiRef: RefObject<GridApi | null>;
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
        <TestCaseVirtualization nbRows={5} nbCols={2} height={160} rowBufferPx={0} />,
      );
      expect(getRows()).to.have.length(1);
      setProps({
        height: 220,
      });
      await waitFor(() => {
        expect(getRows()).to.have.length(3);
      });
    });

    it('should render last row when scrolling to the bottom', async () => {
      const n = 4;
      const rowHeight = 50;
      const rowBufferPx = n * rowHeight;
      const nbRows = 996;
      const height = 600;
      const headerHeight = rowHeight;
      const innerHeight = height - headerHeight;
      render(
        <TestCaseVirtualization
          nbRows={nbRows}
          columnHeaderHeight={headerHeight}
          rowHeight={rowHeight}
          rowBufferPx={rowBufferPx}
          hideFooter
          height={height}
        />,
      );

      const virtualScroller = grid('virtualScroller')!;
      await act(async () => {
        // scrollTo doesn't seem to work in this case
        virtualScroller.scrollTop = 1000000;
        virtualScroller.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        const lastCell = $$('[role="row"]:last-child [role="gridcell"]')[0];
        expect(lastCell).to.have.text('995');
      });

      await waitFor(() => {
        const renderingZone = grid('virtualScrollerRenderZone')!;
        expect(renderingZone.children.length).to.equal(
          Math.floor(innerHeight / rowHeight) + n,
          'children should have the correct length',
        );
      });
      const scrollbarSize = apiRef.current?.state.dimensions.scrollbarSize || 0;
      const renderingZone = grid('virtualScrollerRenderZone')!;
      const distanceToFirstRow = (nbRows - renderingZone.children.length) * rowHeight;
      expect(gridOffsetTop()).to.equal(distanceToFirstRow, 'gridOffsetTop should be correct');
      expect(virtualScroller.scrollHeight - scrollbarSize - headerHeight).to.equal(
        nbRows * rowHeight,
        'scrollHeight should be correct',
      );
    });

    it('should have all the rows rendered of the page in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoPageSize pagination />);
      expect(getRows()).to.have.length(apiRef.current!.state.pagination.paginationModel.pageSize);
    });

    it('should have all the rows rendered in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoHeight />);
      expect(getRows()).to.have.length(apiRef.current!.state.pagination.paginationModel.pageSize);
    });

    it('should render extra columns when the columnBuffer prop is present', async () => {
      const border = 1;
      const width = 300;
      const n = 2;
      const columnWidth = 100;
      const columnBufferPx = n * columnWidth;
      render(
        <TestCaseVirtualization
          width={width + border * 2}
          nbRows={1}
          columnBufferPx={columnBufferPx}
        />,
      );
      const firstRow = getRow(0);
      expect($$(firstRow, '[role="gridcell"]')).to.have.length(Math.floor(width / columnWidth) + n);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      await act(async () => virtualScroller.scrollTo({ left: 301 }));
      await waitFor(() => {
        expect($$(firstRow, '[role="gridcell"]')).to.have.length(
          n + 1 + Math.floor(width / columnWidth) + n,
        );
      });
    });

    it('should render new rows when scrolling past the threshold value', async () => {
      const rowHeight = 50;
      const rowThresholdPx = 1 * rowHeight;
      render(<TestCaseVirtualization rowHeight={rowHeight} rowBufferPx={0} />);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      const renderingZone = document.querySelector('.MuiDataGrid-virtualScrollerRenderZone')!;
      let firstRow = renderingZone.firstChild;
      expect(firstRow).to.have.attr('data-rowindex', '0');
      await act(async () => virtualScroller.scrollTo({ top: rowThresholdPx }));
      firstRow = renderingZone.firstChild;
      await waitFor(() => {
        expect(firstRow).to.have.attr('data-rowindex', '1');
      });
    });

    it('should render new columns when scrolling past the threshold value', async () => {
      const columnWidth = 100;
      const columnThresholdPx = 1 * columnWidth;
      render(<TestCaseVirtualization nbRows={1} columnBufferPx={0} />);
      const virtualScroller = grid('virtualScroller')!;
      const renderingZone = grid('virtualScrollerRenderZone')!;
      const firstRow = $(renderingZone, '[role="row"]:first-child')!;
      let firstColumn = $$(firstRow, '[role="gridcell"]')[0];
      expect(firstColumn).to.have.attr('data-colindex', '0');
      await act(async () => virtualScroller.scrollTo({ left: columnThresholdPx }));
      await waitFor(() => {
        firstColumn = $(renderingZone, '[role="row"] > [role="gridcell"]')!;
        expect(firstColumn).to.have.attr('data-colindex', '1');
      });
    });

    describe('Pagination', () => {
      it('should render only the pageSize', async () => {
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
        // scroll to the bottom
        await act(async () => virtualScroller.scrollTo({ top: 2000 }));

        const dimensions = apiRef.current!.state.dimensions;
        const lastCell = $$('[role="row"]:last-child [role="gridcell"]')[0];
        expect(lastCell).to.have.text('31');
        expect(virtualScroller.scrollHeight).to.equal(
          dimensions.headerHeight + nbRows * rowHeight + dimensions.scrollbarSize,
        );
      });

      it('should not virtualize the last page if smaller than viewport', async () => {
        render(
          <TestCaseVirtualization
            pagination
            initialState={{ pagination: { paginationModel: { pageSize: 32, page: 3 } } }}
            pageSizeOptions={[32]}
            height={500}
          />,
        );
        const virtualScroller = grid('virtualScroller')!;

        await act(async () => virtualScroller.scrollTo({ top: 2000 }));

        const lastCell = $$('[role="row"]:last-child [role="gridcell"]')[0];
        expect(lastCell).to.have.text('99');
        expect(virtualScroller.scrollTop).to.equal(0);
        expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
        expect(grid('virtualScrollerRenderZone')!.children).to.have.length(4);
      });

      it('should paginate small dataset in auto page-size #1492', () => {
        render(
          <TestCaseVirtualization pagination autoPageSize height={496} nbCols={1} nbRows={9} />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

        const lastCell = $$('[role="row"]:last-child [role="gridcell"]')[0];
        expect(lastCell).to.have.text('6');
        const rows = document.querySelectorAll('.MuiDataGrid-row[role="row"]')!;
        expect(rows.length).to.equal(7);

        expect(virtualScroller.scrollTop).to.equal(0);
        expect(virtualScroller.scrollHeight).to.equal(virtualScroller.clientHeight);
        expect(grid('virtualScrollerRenderZone')!.children).to.have.length(7);
      });
    });

    describe('scrollToIndexes', () => {
      it('should scroll correctly when the given rowIndex is partially visible at the bottom', async () => {
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
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 4, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(rowHeight - offset);
      });

      it('should scroll correctly when the given index is partially visible at the top', async () => {
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
        // Simulate browser behavior
        await act(async () => virtualScroller.scrollTo({ top: offset }));
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 2, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(offset);
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 1, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(offset);
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 0, colIndex: 0 }));
        expect(virtualScroller.scrollTop).to.equal(0);
      });

      it('should scroll correctly when the given colIndex is partially visible at the right', async () => {
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
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 0, colIndex: 2 }));
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
      });

      it('should not scroll when going back', async () => {
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
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 0, colIndex: 2 }));
        await act(async () => virtualScroller.dispatchEvent(new Event('scroll'))); // Simulate browser behavior
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
        await act(async () => apiRef.current?.scrollToIndexes({ rowIndex: 0, colIndex: 1 }));
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
      });
    });
  });

  describe('no virtualization', () => {
    let apiRef: RefObject<GridApi | null>;

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
      expect(document.querySelectorAll('[role="gridcell"]')).to.have.length(10 * 10);
    });

    it('should render the correct rows when changing pages', async () => {
      render(
        <TestCase
          initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
          pageSizeOptions={[6]}
          pagination
        />,
      );
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(6);
      await act(async () => {
        apiRef.current?.setPage(1);
      });
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(4);
    });
  });

  describe('Cell focus', () => {
    let apiRef: RefObject<GridApi | null>;

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

    it('should focus the clicked cell in the state', async () => {
      const { user } = render(<TestCase rows={baselineProps.rows} />);

      await user.click(getCell(0, 0));
      expect(apiRef.current?.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[0].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should reset focus when removing the row containing the focus cell', async () => {
      const { setProps } = render(<TestCase rows={baselineProps.rows} />);

      fireEvent.focus(getCell(0, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      await waitFor(() => {
        expect(gridFocusCellSelector(apiRef)).to.equal(null);
      });
    });

    it('should not reset focus when removing a row not containing the focus cell', async () => {
      const { setProps, user } = render(<TestCase rows={baselineProps.rows} />);

      await user.click(getCell(1, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should set the focus when pressing a key inside a cell', async () => {
      const { user } = render(<TestCase rows={baselineProps.rows} />);
      const cell = getCell(1, 0);
      await user.click(cell);
      await user.keyboard('a');
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should update the focus when clicking from one cell to another', async () => {
      const { user } = render(<TestCase rows={baselineProps.rows} />);
      await user.click(getCell(1, 0));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      await user.click(getCell(2, 1));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[2].id,
        field: baselineProps.columns[1].field,
      });
    });

    it('should reset focus when clicking outside the focused cell', async () => {
      const { user } = render(<TestCase rows={baselineProps.rows} />);
      await user.click(getCell(1, 0));
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      await user.click(document.body);
      expect(gridFocusCellSelector(apiRef)).to.deep.equal(null);
    });

    it('should publish "cellFocusOut" when clicking outside the focused cell', async () => {
      const handleCellFocusOut = spy();
      const { user } = render(<TestCase rows={baselineProps.rows} />);
      apiRef.current?.subscribeEvent('cellFocusOut', handleCellFocusOut);
      await user.click(getCell(1, 0));
      expect(handleCellFocusOut.callCount).to.equal(0);
      await user.click(document.body);
      expect(handleCellFocusOut.callCount).to.equal(1);
      expect(handleCellFocusOut.args[0][0].id).to.equal(baselineProps.rows[1].id);
      expect(handleCellFocusOut.args[0][0].field).to.equal(baselineProps.columns[0].field);
    });

    it('should not crash when the row is removed during the click', async () => {
      const { user } = render(
        <TestCase
          rows={baselineProps.rows}
          onCellClick={() => {
            apiRef.current?.updateRows([{ id: 1, _action: 'delete' }]);
          }}
        />,
      );
      const cell = getCell(0, 0);
      await user.click(cell);
    });

    it('should not crash when the row is removed between events', async () => {
      const { user } = render(<TestCase rows={baselineProps.rows} />);
      const cell = getCell(0, 0);

      await user.pointer([{ keys: '[MouseLeft>]', target: cell }]);
      await act(async () => apiRef.current?.updateRows([{ id: 1, _action: 'delete' }]));
      // cleanup
      await user.pointer([{ keys: '[/MouseLeft]', target: cell }]);
    });

    // See https://github.com/mui/mui-x/issues/5742
    it('should not crash when focusing header after row is removed during the click', async () => {
      const { user } = render(
        <TestCase
          rows={baselineProps.rows}
          onCellClick={() => {
            apiRef.current?.updateRows([{ id: 1, _action: 'delete' }]);
          }}
        />,
      );
      const cell = getCell(0, 0);
      const columnHeaderCell = getColumnHeaderCell(0);
      await user.click(cell);
      fireEvent.focus(columnHeaderCell);
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
      render(
        <TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server" />,
      );

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length}`);
    });

    it('should show total row count in footer if `rowCount !== rows.length`', () => {
      const { rows, columns } = getBasicGridData(10, 2);
      const rowCount = rows.length + 10;
      render(
        <TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server" />,
      );

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length} of ${rowCount}`);
    });

    it('should update total row count in footer on `rowCount` prop change', () => {
      const { rows, columns } = getBasicGridData(10, 2);
      let rowCount = rows.length;
      const { setProps } = render(
        <TestCase rows={rows} columns={columns} rowCount={rowCount} paginationMode="server" />,
      );
      rowCount += 1;
      setProps({ rowCount });

      const rowCountElement = document.querySelector<HTMLElement>(`.${gridClasses.rowCount}`);
      expect(rowCountElement!.textContent).to.equal(`Total Rows: ${rows.length} of ${rowCount}`);
    });
  });
});
