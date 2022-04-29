import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen, waitFor } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import {
  DataGridPro,
  GridColumnHeaderParams,
  useGridApiRef,
  DataGridProProps,
  GridRowParams,
  GridCellParams,
  GridRowsProp,
  GridColumns,
  gridClasses,
  GridActionsCellItem,
  GridApi,
  GridEventListener,
} from '@mui/x-data-grid-pro';
import { getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Events Params', () => {
  const { render, clock } = createRenderer();

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

  let apiRef: React.MutableRefObject<GridApi>;

  const TestEvents = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...props} disableVirtualization />
      </div>
    );
  };

  describe('columnHeaderParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridColumnHeaderParams; event: React.MouseEvent } | null = null;
      const handleClick: GridEventListener<'columnHeaderClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onColumnHeaderClick={handleClick} />);

      const ageColumnElement = getColumnHeaderCell(2);
      fireEvent.click(ageColumnElement);

      expect(eventArgs!.params).to.deep.include({
        colDef: apiRef.current.getColumn('age'),
        field: 'age',
      });
    });
  });

  describe('RowsParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridRowParams; event: React.MouseEvent } | null = null;

      const handleClick: GridEventListener<'rowClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      const row1 = getCell(1, 0);
      fireEvent.click(row1);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        row: baselineProps.rows[1],
        columns: apiRef.current.getAllColumns(),
      });
    });
  });

  describe('CellsParams', () => {
    let eventArgs: { params: GridCellParams; event: React.MouseEvent } | null = null;
    let cell11;

    it('should include the correct params', () => {
      const handleClick: GridEventListener<'cellClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      cell11 = getCell(1, 1);
      fireEvent.click(cell11);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        value: 'Jack',
        formattedValue: 'Jack',
        isEditable: true,
        row: baselineProps.rows[1],
        colDef: apiRef.current.getColumn('first'),
        hasFocus: false,
        tabIndex: -1,
      });
    });

    it('should include the correct params when grid is sorted', () => {
      const handleClick: GridEventListener<'cellClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const header = screen
        .getByRole('columnheader', { name: 'first' })
        .querySelector('.MuiDataGrid-columnHeaderTitleContainer');
      fireEvent.click(header);

      const cell01 = getCell(0, 1);
      fireEvent.click(cell01);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        value: 'Jack',
        formattedValue: 'Jack',
        isEditable: true,
        row: baselineProps.rows[1],
        colDef: apiRef.current.getColumn('first'),
        hasFocus: false,
        tabIndex: -1,
      });
    });

    it('should consider value getter', () => {
      const handleClick: GridEventListener<'cellClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.value).to.equal('Jack_11');
    });

    it('should consider value formatter', () => {
      const handleClick: GridEventListener<'cellClick'> = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.formattedValue).to.equal('Jack_11 yrs');
    });
  });

  describe('onCellClick', () => {
    clock.withFakeTimers();

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

    it('should allow to stop propagation', () => {
      const stopClick = (params: GridCellParams, event: React.MouseEvent) => {
        event.stopPropagation();
      };
      render(<TestEvents onCellClick={stopClick} onRowClick={push('rowClick')} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal([]);
    });

    it('should allow to prevent the default behavior', () => {
      const handleCellDoubleClick = spy((params, event) => {
        event.defaultMuiPrevented = true;
      });
      render(<TestEvents onCellDoubleClick={handleCellDoubleClick} />);
      const cell = getCell(1, 1);
      fireEvent.doubleClick(cell);
      expect(handleCellDoubleClick.callCount).to.equal(1);
      expect(cell).not.to.have.class(gridClasses['row--editing']);
    });

    it('should allow to prevent the default behavior while allowing the event to propagate', async () => {
      const handleEditCellPropsChange = spy((params, event) => {
        event.defaultMuiPrevented = true;
      });
      render(<TestEvents onEditCellPropsChange={handleEditCellPropsChange} />);
      const cell = getCell(1, 1);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'Lisa' } });
      clock.tick(500);
      expect(handleEditCellPropsChange.callCount).to.equal(1);
      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(cell).to.have.text('Jack');
      });
    });

    it('should select a row by default', () => {
      const handleSelection = spy();
      render(<TestEvents onSelectionModelChange={handleSelection} />);

      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(handleSelection.callCount).to.equal(1);
      expect(handleSelection.lastCall.firstArg).to.deep.equal([2]);
    });

    it('should not select a row if props.disableSelectionOnClick', () => {
      const handleSelection = spy();
      render(<TestEvents onSelectionModelChange={handleSelection} disableSelectionOnClick />);
      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(handleSelection.callCount).to.equal(0);
    });
  });

  describe('onRowClick', () => {
    let eventStack: string[] = [];
    const push = (name: string) => () => {
      eventStack.push(name);
    };

    beforeEach(() => {
      eventStack = [];
    });

    it('should be called when clicking a cell', () => {
      render(<TestEvents onRowClick={push('rowClick')} />);
      const cell11 = getCell(1, 1);
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal(['rowClick']);
    });

    it('should not be called when clicking the checkbox added by checkboxSelection', () => {
      render(<TestEvents onRowClick={push('rowClick')} checkboxSelection />);
      const cell11 = getCell(1, 0).querySelector('input');
      fireEvent.click(cell11);
      expect(eventStack).to.deep.equal([]);
    });

    it('should not be called when clicking in an action', () => {
      render(
        <TestEvents
          onRowClick={push('rowClick')}
          rows={[{ id: 0 }]}
          columns={[
            {
              field: 'actions',
              type: 'actions',
              getActions: () => [<GridActionsCellItem icon={<span />} label="print" />],
            },
          ]}
        />,
      );
      fireEvent.click(screen.getByRole('menuitem', { name: 'print' }));
      expect(eventStack).to.deep.equal([]);
    });

    it('should not be called when opening the detail panel of a row', () => {
      render(<TestEvents onRowClick={push('rowClick')} getDetailPanelContent={() => <div />} />);
      fireEvent.click(getCell(0, 0));
      expect(eventStack).to.deep.equal([]);
    });

    it('should not be called when expanding a group of rows', () => {
      render(
        <TestEvents
          onRowClick={push('rowClick')}
          rows={[
            { id: 0, path: ['Group 1'] },
            { id: 1, path: ['Group 1', 'Group 2'] },
          ]}
          getTreeDataPath={(row) => row.path}
          treeData
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'see children' }));
      expect(eventStack).to.deep.equal([]);
    });

    it('should not be called when clicking inside a cell being edited', () => {
      render(<TestEvents onRowClick={push('rowClick')} />);
      const cell = getCell(0, 1);
      fireEvent.doubleClick(cell);
      fireEvent.click(cell.querySelector('input'));
      expect(eventStack).to.deep.equal([]);
    });
  });

  it('publishing GRID_ROWS_SCROLL should call onRowsScrollEnd callback', () => {
    const handleRowsScrollEnd = spy();
    render(<TestEvents onRowsScrollEnd={handleRowsScrollEnd} />);
    apiRef.current.publishEvent('rowsScroll', { left: 0, top: 3 * 52 });
    expect(handleRowsScrollEnd.callCount).to.equal(1);
  });

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const baseRows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Under Armor' },
      { id: 4, brand: 'Jordan' },
      { id: 5, brand: 'Reebok' },
    ];
    const handleRowsScrollEnd = spy();
    const TestCase = ({ rows }: { rows: typeof baseRows }) => {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[{ field: 'brand', width: 100 }]}
            rows={rows}
            onRowsScrollEnd={handleRowsScrollEnd}
          />
        </div>
      );
    };
    const { container, setProps } = render(<TestCase rows={baseRows} />);
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
    // arbitrary number to make sure that the bottom of the grid window is reached.
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
    setProps({
      rows: baseRows.concat(
        { id: 6, brand: 'Gucci' },
        { id: 7, brand: "Levi's" },
        { id: 8, brand: 'Ray-Ban' },
      ),
    });
    // Trigger a scroll again to notify the grid that we're not in the bottom area anymore
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(2);
  });

  it('should publish "unmount" event when unmounting the Grid', () => {
    const onUnmount = spy();

    const { unmount } = render(<TestEvents />);

    apiRef.current.subscribeEvent('unmount', onUnmount);
    unmount();
    expect(onUnmount.calledOnce).to.equal(true);
  });
});
