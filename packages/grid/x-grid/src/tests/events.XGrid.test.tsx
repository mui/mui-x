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

    it('should contains the column header element', () => {
      expect(eventArgs!.params.element).to.equal(ageColumnElement);
    });
    it('should contains the column def', () => {
      expect(eventArgs!.params.colDef).to.equal(apiRef!.current.getColumnFromField('age'));
    });
    it('should contains the column index', () => {
      expect(eventArgs!.params.colIndex).to.equal(2);
    });
    it('should contains the column field', () => {
      expect(eventArgs!.params.field).to.equal('age');
    });
    it('should contains the api', () => {
      expect(eventArgs!.params.api).to.equal(apiRef.current);
    });
  });

  describe('RowsParams', () => {
    let eventArgs: { params: GridRowParams; event: React.MouseEvent } | null = null;
    let row2;
    beforeEach(() => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      row2 = getRow(1);
      fireEvent.click(row2);
    });

    it('should contains the row id', () => {
      expect(eventArgs!.params.id).to.equal(2);
    });
    it('should contains the element', () => {
      expect(eventArgs!.params.element).to.equal(row2);
    });
    it('should contains the row model', () => {
      expect(eventArgs!.params.row).to.equal(baselineProps.rows[1]);
    });
    it('should contains the row index', () => {
      expect(eventArgs!.params.rowIndex).to.equal(1);
    });
    it('should contains the columns', () => {
      expect(eventArgs!.params.columns).to.equal(apiRef!.current.getAllColumns());
    });
    it('should contains the api', () => {
      expect(eventArgs!.params.api).to.equal(apiRef.current);
    });
  });

  describe('CellsParams', () => {
    let eventArgs: { params: GridCellParams; event: React.MouseEvent } | null = null;
    let cell22;
    beforeEach(() => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);

      cell22 = getCell(1, 1);
      fireEvent.click(cell22);
    });

    it('should contains the cell id', () => {
      expect(eventArgs!.params.id).to.equal(2);
    });
    it('should contains the cell value', () => {
      expect(eventArgs!.params.value).to.equal('Jack');
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
    it('should contains the cell formattedValue', () => {
      expect(eventArgs!.params.formattedValue).to.equal('Jack');
    });
    it('should contains the cell isEditable', () => {
      expect(eventArgs!.params.isEditable).to.equal(true);
    });
    it('should contains the element', () => {
      expect(eventArgs!.params.element).to.equal(cell22);
    });
    it('should contains the cell model', () => {
      expect(eventArgs!.params.row).to.equal(baselineProps.rows[1]);
    });
    it('should contains the cell index', () => {
      expect(eventArgs!.params.rowIndex).to.equal(1);
    });
    it('should contains the column', () => {
      expect(eventArgs!.params.colDef).to.equal(apiRef!.current.getColumnFromField('first'));
    });
    it('should contains the column index', () => {
      expect(eventArgs!.params.colIndex).to.equal(1);
    });
    it('should contains the api', () => {
      expect(eventArgs!.params.api).to.equal(apiRef.current);
    });
  });

  describe('onCellClick', () => {
    it('should bubble to the row', () => {
      let events = '';
      const addEventName = (name: string) => () => {
        events += `${name}, `;
      };
      render(
        <TestEvents
          onCellClick={addEventName('cellClick')}
          onRowClick={addEventName('rowClick')}
        />,
      );

      const cell22 = getCell(1, 1);
      fireEvent.click(cell22);
      expect(events).to.equal('cellClick, rowClick, ');
    });
  });
});
