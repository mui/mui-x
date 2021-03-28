import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import {
  GridApiRef,
  GridColDef,
  GridComponentProps,
  GridRowData,
  useGridApiRef,
  XGrid,
  XGridProps,
} from '@material-ui/x-grid';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<XGrid /> - Rows', () => {
  let clock;
  let baselineProps: { columns: GridColDef[]; rows: GridRowData[] };

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('getRowId', () => {
    beforeEach(() => {
      clock = useFakeTimers();

      baselineProps = {
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
        columns: [{ field: 'id' }, { field: 'first' }, { field: 'age' }],
      };
    });

    afterEach(() => {
      clock.restore();
    });

    describe('updateRows', () => {
      it('should apply getRowId before updating rows', () => {
        const getRowId = (row) => `${row.clientId}`;
        let apiRef: GridApiRef;
        const Test = () => {
          apiRef = useGridApiRef();
          return (
            <div style={{ width: 300, height: 300 }}>
              <XGrid {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
            </div>
          );
        };
        render(<Test />);
        expect(getColumnValues()).to.deep.equal(['c1', 'c2', 'c3']);
        apiRef!.current.updateRows([
          { clientId: 'c2', age: 30 },
          { clientId: 'c3', age: 31 },
        ]);
        clock.tick(100);

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
            <XGrid {...editableProps} apiRef={apiRef} getRowId={getRowId} />
          </div>
        );
      };
      render(<Test />);
      apiRef!.current.setCellMode('c2', 'first', 'edit');
      const cell = getCell(1, 1);

      expect(cell).to.have.class('MuiDataGrid-cellEditable');
      expect(cell).to.have.class('MuiDataGrid-cellEditing');
      expect(cell.querySelector('input')!.value).to.equal('Jack');
      apiRef!.current.setCellMode('c2', 'first', 'view');

      expect(cell).to.have.class('MuiDataGrid-cellEditable');
      expect(cell).not.to.have.class('MuiDataGrid-cellEditing');
      expect(cell.querySelector('input')).to.equal(null);
    });
  });

  describe('updateRows', () => {
    beforeEach(() => {
      clock = useFakeTimers();

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

    afterEach(() => {
      clock.restore();
    });

    let apiRef: GridApiRef;

    const TestCase = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            columns={baselineProps.columns}
            rows={baselineProps.rows}
            {...props}
          />
        </div>
      );
    };

    it('should allow to reset rows with setRows and render after 100ms', () => {
      render(<TestCase />);
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

    it('should allow to update row data', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
      apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
      clock.tick(100);
      expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum']);
    });

    it('update row data can also add rows', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
      apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
      apiRef.current.updateRows([{ id: 3, brand: 'Jordan' }]);
      clock.tick(100);
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
      clock.tick(100);
      expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
    });

    it('update row data can also delete rows', () => {
      render(<TestCase />);
      apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
      apiRef.current.updateRows([{ id: 0, brand: 'Apple' }]);
      apiRef.current.updateRows([{ id: 2, _action: 'delete' }]);
      apiRef.current.updateRows([{ id: 5, brand: 'Atari' }]);
      clock.tick(100);
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
      clock.tick(100);
      expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
    });

    it('update row data should process getRowId', () => {
      const TestCaseGetRowId = () => {
        apiRef = useGridApiRef();
        const getRowId = React.useCallback((row: GridRowData) => row.idField, []);
        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              apiRef={apiRef}
              columns={baselineProps.columns}
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
      clock.tick(100);
      expect(getColumnValues()).to.deep.equal(['Apple', 'Atari']);
    });
  });

  describe('virtualization', () => {
    let apiRef: GridApiRef;
    const TestCaseVirtualization = (
      props: Partial<XGridProps> & { nbRows?: number; nbCols?: number; height?: number },
    ) => {
      apiRef = useGridApiRef();
      const data = useData(props.nbRows || 100, props.nbCols || 10);

      return (
        <div style={{ width: 300, height: props.height || 300 }}>
          <XGrid apiRef={apiRef} columns={data.columns} rows={data.rows} {...props} />
        </div>
      );
    };

    it('Rows should not be virtualized when the number of rows fit in the viewport', () => {
      const headerHeight = 50;
      const rowHeight = 50;
      const maxRowsNotVirtualised = (300 - headerHeight) / rowHeight;
      render(
        <TestCaseVirtualization
          nbRows={maxRowsNotVirtualised}
          hideFooter
          headerHeight={headerHeight}
          rowHeight={rowHeight}
        />,
      );

      const isVirtualized = apiRef!.current!.getState().containerSizes!.isVirtualized;
      expect(isVirtualized).to.equal(false);
    });

    it('Rows should be virtualized when at least 2 rows are outside the viewport', () => {
      const headerHeight = 50;
      const rowHeight = 50;
      const maxRowsNotVirtualised = (300 - headerHeight) / rowHeight;
      render(
        <TestCaseVirtualization
          nbRows={maxRowsNotVirtualised + 1}
          hideFooter
          headerHeight={headerHeight}
          rowHeight={rowHeight}
        />,
      );

      let isVirtualized = apiRef!.current!.getState().containerSizes!.isVirtualized;
      expect(isVirtualized).to.equal(false);

      render(
        <TestCaseVirtualization
          nbRows={maxRowsNotVirtualised + 2}
          hideFooter
          headerHeight={headerHeight}
          rowHeight={rowHeight}
        />,
      );

      isVirtualized = apiRef!.current!.getState().containerSizes!.isVirtualized;
      expect(isVirtualized).to.equal(true);
    });

    it('should render last row when scrolling to the bottom', () => {
      render(<TestCaseVirtualization nbRows={996} hideFooter height={600} />);
      const totalHeight = apiRef!.current!.getState().containerSizes?.totalSizes.height!;

      const gridWindow = document.querySelector('.MuiDataGrid-window')!;
      const renderingZone = document.querySelector('.MuiDataGrid-renderingZone')! as HTMLElement;
      gridWindow.scrollTop = 10e6; // scroll to the bottom
      gridWindow.dispatchEvent(new Event('scroll'));

      const lastCell = document.querySelector('[role="row"]:last-child [role="cell"]:first-child')!;
      expect(lastCell.textContent).to.equal('995');
      expect(renderingZone.children.length).to.equal(16);
      expect(renderingZone.style.transform).to.equal('translate3d(0px, -312px, 0px)');
      expect(gridWindow.scrollHeight).to.equal(totalHeight);
    });

    it('Rows should not be virtualized when the grid is in pagination autoPageSize', () => {
      render(<TestCaseVirtualization autoPageSize pagination />);

      const isVirtualized = apiRef!.current!.getState().containerSizes!.isVirtualized;
      expect(isVirtualized).to.equal(false);
    });

    it('Rows should not be virtualized when the grid is in autoHeight', () => {
      render(<TestCaseVirtualization autoHeight />);

      const isVirtualized = apiRef!.current!.getState().containerSizes!.isVirtualized;
      expect(isVirtualized).to.equal(false);
    });
  });
});
