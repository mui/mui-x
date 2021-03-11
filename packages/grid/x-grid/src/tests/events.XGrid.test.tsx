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
} from '@material-ui/x-grid';
import { getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';

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
    let eventArgs: { params: GridColParams; event: React.MouseEvent } | null = null;
    let ageColumnElement;
    beforeEach(() => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onColumnHeaderClick={handleClick} />);

      ageColumnElement = getColumnHeaderCell(3);
      fireEvent.click(ageColumnElement);
    });

    it('should include the correct params', () => {
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
    let eventArgs: { params: GridRowParams; event: React.MouseEvent } | null = null;
    let row1;

    beforeEach(() => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      row1 = getRow(1);
      fireEvent.click(row1);
    });

    it('should include the correct params', () => {
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

      cell11 = getCell(1, 1);
      fireEvent.click(cell11);
    });

    it('should include the correct params', () => {
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
});
