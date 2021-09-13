import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { getColumnValues, getRow, getRows } from 'test/utils/helperFn';
import {
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
} from 'test/utils';
import {
  GridApiRef,
  useGridApiRef,
  DataGridPro,
  GridEvents,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { getData } from 'storybook/src/data/data-service';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function getSelectedRowIds() {
  const hasCheckbox = !!document.querySelector('input[type="checkbox"]');
  return [...getRows()]
    .filter((row) => row.classList.contains('Mui-selected'))
    .map((row) =>
      Number(
        row.querySelector(`[role="cell"][data-colindex="${hasCheckbox ? 1 : 0}"]`)!.textContent,
      ),
    );
}

describe('<DataGridPro /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const TestDataGridSelection = ({
    rowLength = 4,
    ...other
  }: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridProProps, 'rows' | 'columns'>> & { rowLength?: number }) => {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => getData(rowLength, 2), [rowLength]);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...data} {...other} apiRef={apiRef} autoHeight={isJSDOM} />
      </div>
    );
  };

  describe('prop: checkboxSelectionVisibleOnly', () => {
    it('should select all visible rows of all pages if checkboxSelectionVisibleOnly = false', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          pageSize={1}
          pagination
          rowsPerPageOptions={[1]}
        />,
      );
      const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.length(4);
    });

    it('should select all visible rows of the current page if checkboxSelectionVisibleOnly = true and pagination is enabled', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly
          pageSize={1}
          pagination
          rowsPerPageOptions={[1]}
        />,
      );
      const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0]);
    });

    it('should select all rows when if checkboxSelectionVisibleOnly = false and pagination is not enabled', () => {
      const rowLength = 10;

      render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly={false}
          rowLength={rowLength}
        />,
      );

      const selectAll = screen.getByRole('checkbox', {
        name: /select all rows checkbox/i,
      });
      fireEvent.click(selectAll);
      expect(apiRef.current.getSelectedRows()).to.have.length(rowLength);
    });

    it('should throw a console error if checkboxSelectionVisibleOnly is used without pagination', () => {
      expect(() => {
        render(
          <TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly rowLength={100} />,
        );
      })
        // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev(
          'Material-UI: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.',
        );
    });
  });

  describe('apiRef: getSelectedRows', () => {
    it('should handle the event internally before triggering onSelectionModelChange', () => {
      render(
        <TestDataGridSelection
          onSelectionModelChange={(model) => {
            expect(apiRef.current.getSelectedRows()).to.have.length(1);
            expect(model).to.deep.equal([1]);
          }}
        />,
      );
      expect(apiRef.current.getSelectedRows()).to.have.length(0);
      apiRef.current.selectRow(1);
      expect(apiRef.current.getSelectedRows().get(1)).to.deep.equal({
        id: 1,
        currencyPair: 'USDEUR',
      });
    });
  });

  describe('apiRef: isRowSelected', () => {
    it('should check if the rows selected by clicking on the rows are selected', () => {
      render(<TestDataGridSelection />);

      fireEvent.click(getRow(1));

      expect(apiRef.current.isRowSelected(0)).to.equal(false);
      expect(apiRef.current.isRowSelected(1)).to.equal(true);
    });

    it('should check if the rows selected with the selectionModel prop are selected', () => {
      render(<TestDataGridSelection selectionModel={[1]} />);

      expect(apiRef.current.isRowSelected(0)).to.equal(false);
      expect(apiRef.current.isRowSelected(1)).to.equal(true);
    });
  });

  describe('apiRef: selectRow', () => {
    it('should call onSelectionModelChange with the ids selected', () => {
      const handleSelectionModelChange = spy();
      render(<TestDataGridSelection onSelectionModelChange={handleSelectionModelChange} />);
      apiRef.current.selectRow(1);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1]);
      // Reset old selection
      apiRef.current.selectRow(2, true, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
      // Keep old selection
      apiRef.current.selectRow(3);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2, 3]);
      apiRef.current.selectRow(3, false);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
    });

    it('should not call onSelectionModelChange if the row is unselectable', () => {
      const handleSelectionModelChange = spy();
      render(
        <TestDataGridSelection
          isRowSelectable={(params) => params.id > 0}
          onSelectionModelChange={handleSelectionModelChange}
        />,
      );
      apiRef.current.selectRow(0);
      expect(handleSelectionModelChange.callCount).to.equal(0);
      apiRef.current.selectRow(1);
      expect(handleSelectionModelChange.callCount).to.equal(1);
    });
  });

  describe('apiRef: selectRows', () => {
    it('should call onSelectionModelChange with the ids selected', () => {
      const handleSelectionModelChange = spy();
      render(<TestDataGridSelection onSelectionModelChange={handleSelectionModelChange} />);

      apiRef.current.selectRows([1, 2]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);

      apiRef.current.selectRows([3]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2, 3]);

      apiRef.current.selectRows([1, 2], false);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([3]);

      // Deselect others
      apiRef.current.selectRows([4, 5], true, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([4, 5]);
    });

    it('should filter out unselectable rows before calling onSelectionModelChange', () => {
      const handleSelectionModelChange = spy();
      render(
        <TestDataGridSelection
          isRowSelectable={(params) => params.id > 0}
          onSelectionModelChange={handleSelectionModelChange}
        />,
      );
      apiRef.current.selectRows([0, 1, 2]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);
    });

    it('should not select a range of several elements when disableMultipleSelection = true', () => {
      render(<TestDataGridSelection disableMultipleSelection />);

      apiRef.current.selectRows([0, 1, 2], true);
      expect(getSelectedRowIds()).to.deep.equal([]);
    });
  });

  describe('apiRef: selectRowRange', () => {
    it('should select all the rows in the range', () => {
      render(<TestDataGridSelection />);

      apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true);
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
    });

    it('should unselect all the rows in the range', () => {
      render(<TestDataGridSelection />);

      apiRef.current.setSelectionModel([2, 3]);
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
      apiRef.current.selectRowRange({ startId: 0, endId: 3 }, false);
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should not unselect the selected elements if the range is to be selected', () => {
      render(<TestDataGridSelection />);

      apiRef.current.setSelectionModel([2]);
      apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true);
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
    });

    it('should not reset the other selections when resetSelection = false', () => {
      render(<TestDataGridSelection />);

      apiRef.current.setSelectionModel([0]);
      apiRef.current.selectRowRange({ startId: 2, endId: 3 }, true, false);
      expect(getSelectedRowIds()).to.deep.equal([0, 2, 3]);
    });

    it('should reset the other selections when resetSelection = true', () => {
      render(<TestDataGridSelection />);

      apiRef.current.setSelectionModel([0]);
      apiRef.current.selectRowRange({ startId: 2, endId: 3 }, true, true);
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
    });

    it('should not select unselectable rows inside the range', () => {
      render(<TestDataGridSelection isRowSelectable={(params) => Number(params.id) % 2 === 1} />);

      apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true);
      expect(getSelectedRowIds()).to.deep.equal([1, 3]);
    });

    it('should not select a range of several elements when disableMultipleSelection = true', () => {
      render(<TestDataGridSelection disableMultipleSelection />);

      apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true);
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should select only filtered rows selecting a range', () => {
      render(
        <TestDataGridSelection
          filterModel={{ items: [{ columnField: 'id', value: 1, operatorValue: '!=' }] }}
        />,
      );
      apiRef.current.selectRowRange({ startId: 0, endId: 2 }, true);
      expect(getSelectedRowIds()).to.deep.equal([0, 2]);
    });
  });

  it('should select only filtered rows after filter is applied', () => {
    render(<TestDataGridSelection checkboxSelection />);
    const selectAll = screen.getByRole('checkbox', {
      name: /select all rows checkbox/i,
    });
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: 'currencyPair',
          value: 'usd',
          operatorValue: 'startsWith',
        },
      ],
    });
    expect(getColumnValues(1)).to.deep.equal(['0', '1']);
    fireEvent.click(selectAll);
    expect(getSelectedRowIds()).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIds()).to.deep.equal([]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIds()).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIds()).to.deep.equal([]);
  });

  describe('controlled selection', () => {
    it('should not publish GRID_SELECTION_CHANGE if the selection state did not change ', () => {
      const handleSelectionChange = spy();
      const selectionModel = [];
      render(<TestDataGridSelection selectionModel={selectionModel} />);
      apiRef.current.subscribeEvent(GridEvents.selectionChange, handleSelectionChange);
      apiRef.current.setSelectionModel(selectionModel);
      expect(handleSelectionChange.callCount).to.equal(0);
    });
  });
});
