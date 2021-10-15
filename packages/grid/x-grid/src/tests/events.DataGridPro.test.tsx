import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-ignore
  fireEvent,
  // @ts-ignore
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
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
  GridEvents,
  GridApiRef,
  gridClasses,
} from '@mui/x-data-grid-pro';
import { getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<DataGridPro /> - Events Params', () => {
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

  let apiRef: GridApiRef;
  const TestEvents = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  const TestVirtualization = (props) => {
    const { width, height, ...other } = props;
    const data = useData(50, 5);
    return (
      <div style={{ width: width || 300, height: height || 300 }}>
        <DataGridPro rows={data.rows} columns={data.columns} {...other} />
      </div>
    );
  };

  describe('columnHeaderParams', () => {
    it('should include the correct params', () => {
      let eventArgs: { params: GridColumnHeaderParams; event: React.MouseEvent } | null = null;
      const handleClick = (params, event) => {
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

      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onRowClick={handleClick} />);

      const row1 = getRow(1);
      fireEvent.click(row1);

      expect(eventArgs!.params).to.deep.include({
        id: 2,
        row: baselineProps.rows[1],
        columns: apiRef.current.getAllColumns(),
        getValue: apiRef.current.getCellValue,
      });
    });
  });

  describe('CellsParams', () => {
    let eventArgs: { params: GridCellParams; event: React.MouseEvent } | null = null;
    let cell11;

    it('should include the correct params', () => {
      const handleClick = (params, event) => {
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
        getValue: apiRef.current.getCellValue,
      });
    });

    it('should include the correct params when grid is sorted', () => {
      const handleClick = (params, event) => {
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
        getValue: apiRef.current.getCellValue,
      });
    });

    it('should consider value getter', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
      const cellFirstAge = getCell(1, 3);
      fireEvent.click(cellFirstAge);

      expect(eventArgs!.params.value).to.equal('Jack_11');
    });

    it('should consider value formatter', () => {
      const handleClick = (params, event) => {
        eventArgs = { params, event };
      };
      render(<TestEvents onCellClick={handleClick} />);
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

    it('should allow to stop propagation', () => {
      const stopClick = (params, event) => {
        event.stopPropagation();
      };
      render(<TestEvents onCellClick={stopClick} onSelectionModelChange={push('rowSelected')} />);

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

    it('should allow to prevent the default behavior while allowing the event to propagate', () => {
      const handleEditCellPropsChange = spy((params, event) => {
        event.defaultMuiPrevented = true;
      });
      render(<TestEvents onEditCellPropsChange={handleEditCellPropsChange} />);
      const cell = getCell(1, 1);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'Lisa' } });
      expect(handleEditCellPropsChange.callCount).to.equal(1);
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(cell).to.have.text('Jack');
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

  it('publishing GRID_ROWS_SCROLL should call onRowsScrollEnd callback', () => {
    const handleRowsScrollEnd = spy();

    render(<TestEvents onRowsScrollEnd={handleRowsScrollEnd} />);
    apiRef.current.publishEvent(GridEvents.rowsScroll, { left: 0, top: 3 * 52 });
    expect(handleRowsScrollEnd.callCount).to.equal(1);
  });

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', () => {
    const handleRowsScrollEnd = spy();
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
        <DataGridPro
          columns={data.columns}
          rows={data.rows}
          onRowsScrollEnd={handleRowsScrollEnd}
        />
      </div>,
    );
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
    // arbitrary number to make sure that the bottom of the grid window is reached.
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
  });

  // TODO check if rowsScroll is not enough
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('call onViewportRowsChange when the viewport rows change', async () => {
    const handleViewportRowsChange = spy();
    // TODO: Set the dimensions of the grid once the Windows test issues are resolved.
    const { container } = render(
      <TestVirtualization onViewportRowsChange={handleViewportRowsChange} />,
    );

    await waitFor(() => {
      expect(handleViewportRowsChange.lastCall.args[0].firstRowIndex).to.equal(0);
      expect(handleViewportRowsChange.lastCall.args[0].lastRowIndex).to.equal(6); // should be pageSize + 1
    });
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
    // scroll 6 rows so that the renderContext is updated. To be changed to a scroll of 1 row.
    // TODO: set RowHeight directly. Currently 52 is used because the test fails under Windows.
    virtualScroller.scrollTop = 52 * 6;
    virtualScroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(handleViewportRowsChange.lastCall.args[0].firstRowIndex).to.equal(6); // should be 1
      expect(handleViewportRowsChange.lastCall.args[0].lastRowIndex).to.equal(12); // should be pageSize + 1
    });
  });

  it('should publish GridEvents.unmount when unmounting the Grid', () => {
    const onUnmount = spy();

    const { unmount } = render(<TestEvents />);

    apiRef.current.subscribeEvent('unmount', onUnmount);
    unmount();
    expect(onUnmount.calledOnce).to.equal(true);
  });
});
