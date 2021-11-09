import * as React from 'react';
import { createRenderer, fireEvent } from '@material-ui/monorepo/test/utils';
import { useFakeTimers, spy } from 'sinon';
import { expect } from 'chai';
import { getCell, getRow, getColumnValues, getRows } from 'test/utils/helperFn';
import {
  GridApiRef,
  GridComponentProps,
  GridRowModel,
  useGridApiRef,
  DataGridPro,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { useData } from 'packages/storybook/src/hooks/useData';
import { DataGridProps } from '@mui/x-data-grid';
import { getData } from 'storybook/src/data/data-service';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Rows', () => {
  let clock;
  let baselineProps;

  const { render } = createRenderer();

  describe('getRowId', () => {
    beforeEach(() => {
      clock = useFakeTimers();

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

    afterEach(() => {
      clock.restore();
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

    describe('updateRows', () => {
      it('should apply getRowId before updating rows', () => {
        const getRowId = (row) => `${row.clientId}`;
        let apiRef: GridApiRef;
        const Test = () => {
          apiRef = useGridApiRef();
          return (
            <div style={{ width: 300, height: 300 }}>
              <DataGridPro {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
            </div>
          );
        };
        render(<Test />);
        expect(getColumnValues()).to.deep.equal(['c1', 'c2', 'c3']);
        apiRef!.current.updateRows([
          { clientId: 'c2', age: 30 },
          { clientId: 'c3', age: 31 },
        ]);
        expect(getColumnValues(2)).to.deep.equal(['11', '30', '31']);
      });
    });

    it('should allow to switch between cell mode', () => {
      let apiRef: GridApiRef;
      const editableProps = { ...baselineProps };
      editableProps.columns = editableProps.columns.map((col) => ({ ...col, editable: true }));
      const getRowId = (row) => `${row.clientId}`;

      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...editableProps} apiRef={apiRef} getRowId={getRowId} />
          </div>
        );
      };
      render(<Test />);
      apiRef!.current.setCellMode('c2', 'first', 'edit');
      const cell = getCell(1, 1);

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')!.value).to.equal('Jack');
      apiRef!.current.setCellMode('c2', 'first', 'view');

      expect(cell).to.have.class('MuiDataGrid-cell--editable');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell.querySelector('input')).to.equal(null);
    });

    it('should not clone the row', () => {
      const getRowId = (row) => `${row.clientId}`;
      let apiRef: GridApiRef;
      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
          </div>
        );
      };
      render(<Test />);
      expect(apiRef!.current.getRow('c1')).to.equal(baselineProps.rows[0]);
    });
  });

  describe('props: rows', () => {
    it('should not throttle even when props.throttleRowsMs is defined', () => {
      const { rows, columns } = getData(5, 2);

      const Test = (props: Pick<DataGridProps, 'rows'>) => (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...props} columns={columns} autoHeight={isJSDOM} throttleRowsMs={100} />
        </div>
      );

      const { setProps } = render(<Test rows={rows.slice(0, 2)} />);

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
      setProps({ rows });
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });
  });

  describe('apiRef: updateRows', () => {
    beforeEach(() => {
      clock = useFakeTimers();

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

    afterEach(() => {
      clock.restore();
    });

    let apiRef: GridApiRef;

    const TestCase = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
        </div>
      );
    };

    it('should not throttle by default', () => {
      render(<TestCase />);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Fila', 'Puma']);
    });

    it('should allow to enable throttle', () => {
      render(<TestCase throttleRowsMs={100} />);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      clock.tick(50);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      clock.tick(50);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Fila', 'Puma']);
    });

    it('should allow to update row data', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
      apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
      expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum']);
    });

    it('update row data can also add rows', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
      apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
      apiRef.current.updateRows([{ id: 3, brand: 'Jordan' }]);
      expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also add rows in bulk', () => {
      render(<TestCase />);
      apiRef.current.updateRows([
        { id: 1, brand: 'Fila' },
        { id: 0, brand: 'Pata' },
        { id: 2, brand: 'Pum' },
        { id: 3, brand: 'Jordan' },
      ]);
      expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also delete rows', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Apple' }]);
      apiRef.current.updateRows([{ id: 2, _action: 'delete' }]);
      apiRef.current.updateRows([{ id: 5, brand: 'Atari' }]);
      expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data can also delete rows in bulk', () => {
      render(<TestCase />);
      apiRef.current.updateRows([
        { id: 1, _action: 'delete' },
        { id: 0, brand: 'Apple' },
        { id: 2, _action: 'delete' },
        { id: 5, brand: 'Atari' },
      ]);
      expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data should process getRowId', () => {
      const TestCaseGetRowId = () => {
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
      };

      render(<TestCaseGetRowId />);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      apiRef.current.updateRows([
        { idField: 1, _action: 'delete' },
        { idField: 0, brand: 'Apple' },
        { idField: 2, _action: 'delete' },
        { idField: 5, brand: 'Atari' },
      ]);
      expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
    });
  });

  describe('apiRef: setRows', () => {
    beforeEach(() => {
      clock = useFakeTimers();

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

    afterEach(() => {
      clock.restore();
    });

    let apiRef: GridApiRef;

    const TestCase = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
        </div>
      );
    };

    it('should not throttle by default', () => {
      render(<TestCase />);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      const newRows = [
        {
          id: 3,
          brand: 'Asics',
        },
      ];
      apiRef.current.setRows(newRows);

      expect(getColumnValues()).to.deep.equal(['Asics']);
    });

    it('should allow to enable throttle', () => {
      render(<TestCase throttleRowsMs={100} />);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      const newRows = [
        {
          id: 3,
          brand: 'Asics',
        },
      ];
      apiRef.current.setRows(newRows);

      clock.tick(50);
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      clock.tick(50);
      expect(getColumnValues()).to.deep.equal(['Asics']);
    });
  });

  describe('virtualization', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    let apiRef: GridApiRef;
    const TestCaseVirtualization = (
      props: Partial<DataGridProProps> & {
        nbRows?: number;
        nbCols?: number;
        width?: number;
        height?: number;
      },
    ) => {
      apiRef = useGridApiRef();
      const data = useData(props.nbRows || 100, props.nbCols || 10);

      return (
        <div style={{ width: props.width || 300, height: props.height || 300 }}>
          <DataGridPro apiRef={apiRef} columns={data.columns} rows={data.rows} {...props} />
        </div>
      );
    };

    it('should render last row when scrolling to the bottom', () => {
      const rowHeight = 50;
      const rowBuffer = 4;
      const nbRows = 996;
      const height = 600;
      render(
        <TestCaseVirtualization
          nbRows={nbRows}
          headerHeight={0}
          rowHeight={rowHeight}
          rowBuffer={rowBuffer}
          hideFooter
          height={height}
        />,
      );

      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      const renderingZone = document.querySelector(
        '.MuiDataGrid-virtualScrollerRenderZone',
      )! as HTMLElement;
      virtualScroller.scrollTop = 10e6; // scroll to the bottom
      virtualScroller.dispatchEvent(new Event('scroll'));

      const lastCell = document.querySelector('[role="row"]:last-child [role="cell"]:first-child')!;
      expect(lastCell).to.have.text('995');
      expect(renderingZone.children.length).to.equal(Math.floor(height / rowHeight) + rowBuffer);
      const distanceToFirstRow = (nbRows - renderingZone.children.length) * rowHeight;
      expect(renderingZone.style.transform).to.equal(
        `translate3d(0px, ${distanceToFirstRow}px, 0px)`,
      );
      expect(virtualScroller.scrollHeight).to.equal(nbRows * rowHeight);
    });

    it('should have all the rows rendered of the page in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoPageSize pagination />);
      expect(getRows()).to.have.length(apiRef.current.state.pagination.pageSize);
    });

    it('should have all the rows rendered in the DOM when autoPageSize: true', () => {
      render(<TestCaseVirtualization autoHeight />);
      expect(getRows()).to.have.length(apiRef.current.state.pagination.pageSize);
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
      virtualScroller.dispatchEvent(new Event('scroll'));
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
      const firstRow = renderingZone.firstChild;
      expect(firstRow).to.have.attr('data-rowindex', '0');
      virtualScroller.scrollTop = rowThreshold * rowHeight;
      virtualScroller.dispatchEvent(new Event('scroll'));
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
      const firstRow = renderingZone.querySelector('[role="row"]:first-child')!;
      const firstColumn = firstRow.firstChild!;
      expect(firstColumn).to.have.attr('data-colindex', '0');
      virtualScroller.scrollLeft = columnThreshold * columnWidth;
      virtualScroller.dispatchEvent(new Event('scroll'));
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
            pageSize={nbRows}
            rowsPerPageOptions={[nbRows]}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        virtualScroller.scrollTop = 10e6; // scroll to the bottom
        virtualScroller.dispatchEvent(new Event('scroll'));

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
            pageSize={32}
            rowsPerPageOptions={[32]}
            page={3}
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
        const headerHeight = 40;
        const rowHeight = 50;
        const offset = 10;
        const border = 1;
        render(
          <TestCaseVirtualization
            hideFooter
            headerHeight={headerHeight}
            height={headerHeight + 4 * rowHeight + offset + border * 2}
            nbCols={2}
            rowHeight={rowHeight}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        apiRef.current.scrollToIndexes({ rowIndex: 4, colIndex: 0 });
        expect(virtualScroller.scrollTop).to.equal(rowHeight - offset);
      });

      it('should scroll correctly when the given index is partially visible at the top', () => {
        const headerHeight = 40;
        const rowHeight = 50;
        const offset = 10;
        const border = 1;
        render(
          <TestCaseVirtualization
            hideFooter
            headerHeight={headerHeight}
            height={headerHeight + 4 * rowHeight + border + border * 2}
            nbCols={2}
            rowHeight={rowHeight}
          />,
        );
        const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
        virtualScroller.scrollTop = offset;
        virtualScroller.dispatchEvent(new Event('scroll')); // Simulate browser behavior
        apiRef.current.scrollToIndexes({ rowIndex: 2, colIndex: 0 });
        expect(virtualScroller.scrollTop).to.equal(offset);
        apiRef.current.scrollToIndexes({ rowIndex: 1, colIndex: 0 });
        expect(virtualScroller.scrollTop).to.equal(offset);
        apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 0 });
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
        apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 2 });
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
        apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 2 });
        virtualScroller.dispatchEvent(new Event('scroll')); // Simulate browser behavior
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
        apiRef.current.scrollToIndexes({ rowIndex: 0, colIndex: 1 });
        expect(virtualScroller.scrollLeft).to.equal(columnWidth * 3 - width);
      });
    });
  });

  describe('no virtualization', () => {
    let apiRef: GridApiRef;

    const TestCase = (props: Partial<DataGridProProps> & { nbRows?: number; nbCols?: number }) => {
      apiRef = useGridApiRef();
      const data = useData(props.nbRows || 100, props.nbCols || 10);
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            columns={data.columns}
            rows={data.rows}
            disableVirtualization
            {...props}
          />
        </div>
      );
    };

    it('should allow to disable virtualization', () => {
      render(<TestCase nbRows={100} nbCols={10} />);
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(100);
      expect(document.querySelectorAll('[role="cell"]')).to.have.length(100 * 10);
    });

    it('should render the correct rows when changing pages', () => {
      render(<TestCase nbRows={150} nbCols={10} pagination />);
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(100);
      apiRef.current.setPage(1);
      expect(document.querySelectorAll('[role="row"][data-rowindex]')).to.have.length(50);
    });
  });

  describe('Cell focus', () => {
    let apiRef: GridApiRef;

    const TestCase = ({ rows }: Pick<DataGridProProps, 'rows'>) => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro apiRef={apiRef} {...baselineProps} rows={rows} />
        </div>
      );
    };

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

      fireEvent.mouseUp(getCell(0, 0));
      fireEvent.click(getCell(0, 0));
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[0].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should reset focus when removing the row containing the focus cell', () => {
      const { setProps } = render(<TestCase rows={baselineProps.rows} />);

      fireEvent.click(getCell(0, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      expect(apiRef.current.state.focus.cell).to.equal(null);
    });

    it('should not reset focus when removing a row not containing the focus cell', () => {
      const { setProps } = render(<TestCase rows={baselineProps.rows} />);

      fireEvent.mouseUp(getCell(1, 0));
      fireEvent.click(getCell(1, 0));
      setProps({ rows: baselineProps.rows.slice(1) });
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should set the focus when pressing a key inside a cell', () => {
      render(<TestCase rows={baselineProps.rows} />);
      const cell = getCell(1, 0);
      cell.focus();
      fireEvent.keyDown(cell, { key: 'a' });
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
    });

    it('should update the focus when clicking from one cell to another', () => {
      render(<TestCase rows={baselineProps.rows} />);
      fireEvent.mouseUp(getCell(1, 0));
      fireEvent.click(getCell(1, 0));
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      fireEvent.mouseUp(getCell(2, 1));
      fireEvent.click(getCell(2, 1));
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[2].id,
        field: baselineProps.columns[1].field,
      });
    });

    it('should reset focus when clicking outside the focused cell', () => {
      render(<TestCase rows={baselineProps.rows} />);
      fireEvent.mouseUp(getCell(1, 0));
      fireEvent.click(getCell(1, 0));
      expect(apiRef.current.state.focus.cell).to.deep.equal({
        id: baselineProps.rows[1].id,
        field: baselineProps.columns[0].field,
      });
      fireEvent.click(document.body);
      expect(apiRef.current.state.focus.cell).to.deep.equal(null);
    });

    it('should publish "cellFocusOut" when clicking outside the focused cell', () => {
      const handleCellFocusOut = spy();
      render(<TestCase rows={baselineProps.rows} />);
      apiRef.current.subscribeEvent('cellFocusOut', handleCellFocusOut);
      fireEvent.mouseUp(getCell(1, 0));
      fireEvent.click(getCell(1, 0));
      expect(handleCellFocusOut.callCount).to.equal(0);
      fireEvent.click(document.body);
      expect(handleCellFocusOut.callCount).to.equal(1);
      expect(handleCellFocusOut.args[0][0].id).to.equal(baselineProps.rows[1].id);
      expect(handleCellFocusOut.args[0][0].field).to.equal(baselineProps.columns[0].field);
    });

    it('should not crash when the row is removed during the click', () => {
      expect(() => {
        render(<TestCase rows={baselineProps.rows} />);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
      }).not.to.throw();
    });

    it('should not crash when the row is removed between events', () => {
      expect(() => {
        render(<TestCase rows={baselineProps.rows} />);
        const cell = getCell(0, 0);
        fireEvent.mouseEnter(cell);
        apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
        fireEvent.mouseLeave(cell);
      }).not.to.throw();
    });
  });
});
