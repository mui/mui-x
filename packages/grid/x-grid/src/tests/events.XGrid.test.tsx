import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-ignore
  fireEvent,
} from 'test/utils';
import { expect } from 'chai';
import {
  XGrid,
  GridColParams,
  useGridApiRef,
  XGridProps,
  GridRowParams,
  GridCellParams,
  GridRowsProp,
  GridColumns,
  GRID_ROWS_SCROLL,
} from '@material-ui/x-grid';
import { getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';

describe('<XGrid /> - Events Params ', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps: { rows: GridRowsProp; columns: GridColumns } = {
    rows: [
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
    ],
    columns: [
      { field: 'id' },
      { field: 'first', editable: true },
      { field: 'age' },
      {
        field: 'firstAge',
        valueGetter: (params) => `${params.row.first}_${params.row.age}`,
        valueFormatter: (params) => `${params.value} yrs`,
      },
    ],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let apiRef;
  const TestEvents = (props: Partial<XGridProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  describe('columnHeaderParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridColParams; event: React.MouseEvent } | null = null;
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onColumnHeaderClick={handleClick} />);

      const ageColumnElement = getColumnHeaderCell(3);
      fireEvent.click(ageColumnElement);

      expect(eventArgs!.params).to.deep.include({
        colDef: apiRef!.current.getColumnFromField('age'),
        element: ageColumnElement,
        colIndex: 2,
        field: 'age',
        api: apiRef.current,
      });
    });
  });

  describe('RowsParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridRowParams; event: React.MouseEvent } | null = null;

      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      const row1 = getRow(1);
      fireEvent.click(row1);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        element: row1,
        row: baselineProps.rows[1],
        rowIndex: 1,
        columns: apiRef!.current.getAllColumns(),
        api: apiRef.current,
      });
    });
  });

  describe('CellsParams', () => {
    let eventArgs: { params: GridCellParams; event: React.MouseEvent } | null = null;
    let cell11;

    beforeEach(() => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
    });

    it('should include the correct params', () => {
      cell11 = getCell(1, 1);
      fireEvent.click(cell11);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        value: 'Jack',
        formattedValue: 'Jack',
        isEditable: true,
        element: cell11,
        row: baselineProps.rows[1],
        rowIndex: 1,
        colDef: apiRef!.current.getColumnFromField('first'),
        colIndex: 1,
        api: apiRef.current,
      });
    });

    it('should consider value getter', () => {
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.value).to.equal('Jack_11');
    });

    it('should consider value formatter', () => {
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.formattedValue).to.equal('Jack_11 yrs');
    });
  });

  describe('onCellClick', () => {
    let eventStack: string[] = [];
    const push = (name: string) => () => {
      eventStack.push(name);
    };

    beforeEach(() => {
      eventStack = [];
    });

    it('should bubble to the row', () => {
      render(<TestEvents onCellClick={push('cellClick')} onRowClick={push('rowClick')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal(['cellClick', 'rowClick']);
    });

    it('should not bubble to the row if the column has disableEventBubbling', () => {
      render(
        <TestEvents
          onCellClick={push('cellClick')}
          onRowClick={push('rowClick')}
          columns={baselineProps.columns.map((col) => ({
            ...col,
            disableClickEventBubbling: true,
          }))}
        />,
      );

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal(['cellClick']);
    });

    it('should allow to stop propagation', () => {
      const stopClick = (params, event) => {
        event.stopPropagation();
      };
      render(<TestEvents onCellClick={stopClick} onRowSelected={push('rowSelected')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal([]);
    });

    it('should select a row by default', () => {
      render(<TestEvents onRowSelected={push('rowSelected')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal(['rowSelected']);
    });

    it('should not select a row if options.disableSelectionOnClick', () => {
      render(<TestEvents onRowSelected={push('rowSelected')} disableSelectionOnClick />);
      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal([]);
    });
  });
  it('publishing GRID_ROWS_SCROLL should call onRowsScrollEnd callback', () => {
    const handleOnRowsScrollEnd = spy();

    render(<TestEvents onRowsScrollEnd={handleOnRowsScrollEnd} />);
    apiRef.current.publishEvent(GRID_ROWS_SCROLL);
    expect(handleOnRowsScrollEnd.callCount).to.equal(1);
  });

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', () => {
    const handleOnRowsScrollEnd = spy();
    const data = {
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
        {
          id: 3,
          brand: 'Under Armor',
        },
        {
          id: 4,
          brand: 'Jordan',
        },
        {
          id: 5,
          brand: 'Reebok',
        },
      ],
      columns: [{ field: 'brand', width: 100 }],
    };

    const { container } = render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid columns={data.columns} rows={data.rows} onRowsScrollEnd={handleOnRowsScrollEnd} />
      </div>,
    );
    const gridWindow = container.querySelector('.MuiDataGrid-window');
    // arbitrary number to make sure that the bottom of the grid window is reached.
    gridWindow.scrollTop = 12345;
    gridWindow.dispatchEvent(new Event('scroll'));
    expect(handleOnRowsScrollEnd.callCount).to.equal(1);
  });
});
