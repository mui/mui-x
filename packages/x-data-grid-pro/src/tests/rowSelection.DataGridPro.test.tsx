import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { getCell, getColumnValues, getRows } from 'test/utils/helperFn';
import { createRenderer, fireEvent, screen, act } from '@mui/internal-test-utils';
import {
  GridApi,
  useGridApiRef,
  DataGridPro,
  DataGridProProps,
  GridRowSelectionModel,
} from '@mui/x-data-grid-pro';
import { getBasicGridData } from '@mui/x-data-grid-generator';

function getSelectedRowIds() {
  const hasCheckbox = !!document.querySelector('input[type="checkbox"]');
  return Array.from(getRows())
    .filter((row) => row.classList.contains('Mui-selected'))
    .map((row) =>
      Number(
        row.querySelector(`[role="gridcell"][data-colindex="${hasCheckbox ? 1 : 0}"]`)!.textContent,
      ),
    );
}

describe('<DataGridPro /> - Row selection', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function TestDataGridSelection({
    rowLength = 4,
    ...other
  }: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridProProps, 'rows' | 'columns'>> & { rowLength?: number }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => getBasicGridData(rowLength, 2), [rowLength]);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...data} {...other} apiRef={apiRef} disableVirtualization />
      </div>
    );
  }

  describe('prop: checkboxSelectionVisibleOnly = false', () => {
    it('should select all rows of all pages if no row is selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          pageSizeOptions={[2]}
        />,
      );
      const selectAllCheckbox: HTMLInputElement = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.length(4);
      expect(selectAllCheckbox.checked).to.equal(true);
    });

    it('should unselect all rows of all the pages if 1 row of another page is selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          pageSizeOptions={[2]}
        />,
      );
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      const selectAllCheckbox: HTMLInputElement = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.length(0);
      expect(selectAllCheckbox.checked).to.equal(false);
    });

    it('should select all visible rows if pagination is not enabled', () => {
      const rowLength = 10;

      render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly={false}
          rowLength={rowLength}
        />,
      );

      const selectAllCheckbox: HTMLInputElement = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.length(rowLength);
      expect(selectAllCheckbox.checked).to.equal(true);
    });

    it('should set the header checkbox in a indeterminate state when some rows of other pages are not selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly={false}
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          pageSizeOptions={[2]}
        />,
      );

      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      fireEvent.click(getCell(1, 0).querySelector('input')!);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(selectAllCheckbox).to.have.attr('data-indeterminate', 'true');
    });

    it('should not select more than one row when disableMultipleRowSelection = true', () => {
      render(<TestDataGridSelection checkboxSelection disableMultipleRowSelection />);
      const input1 = getCell(0, 0).querySelector('input')!;
      fireEvent.click(input1);
      expect(input1.checked).to.equal(true);

      const input2 = getCell(1, 0).querySelector('input')!;
      fireEvent.click(input2);
      expect(input1.checked).to.equal(false);
      expect(input2.checked).to.equal(true);
    });
  });

  describe('prop: checkboxSelectionVisibleOnly = true', () => {
    it('should throw a console error if used without pagination', () => {
      expect(() => {
        render(
          <TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly rowLength={100} />,
        );
      }).toErrorDev(
        'MUI X: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.',
      );
    });

    it('should select all the rows of the current page if no row of the current page is selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          pageSizeOptions={[2]}
        />,
      );

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      const selectAllCheckbox: HTMLInputElement = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0, 2, 3]);
      expect(selectAllCheckbox.checked).to.equal(true);
    });

    it('should unselect all the rows of the current page if 1 row of the current page is selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          checkboxSelectionVisibleOnly
          pageSizeOptions={[2]}
        />,
      );

      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0, 2]);
      const selectAllCheckbox: HTMLInputElement = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0]);
      expect(selectAllCheckbox.checked).to.equal(false);
    });

    it('should not set the header checkbox in a indeterminate state when some rows of other pages are not selected', () => {
      render(
        <TestDataGridSelection
          checkboxSelection
          initialState={{ pagination: { paginationModel: { pageSize: 2 } } }}
          pagination
          pageSizeOptions={[2]}
        />,
      );

      fireEvent.click(getCell(0, 0));
      fireEvent.click(getCell(1, 0));
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });
      expect(selectAllCheckbox).to.have.attr('data-indeterminate', 'false');
    });

    it('should allow to select all the current page rows when props.paginationMode="server"', () => {
      function TestDataGridSelectionServerSide({
        rowLength = 4,
      }: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'> &
        Partial<Pick<DataGridProProps, 'rows' | 'columns'>> & { rowLength?: number }) {
        apiRef = useGridApiRef();
        const paginationModel = { pageSize: 2, page: 1 };

        const data = React.useMemo(() => getBasicGridData(rowLength, 2), [rowLength]);

        const rows = data.rows.slice(
          paginationModel.pageSize * paginationModel.page,
          paginationModel.pageSize * (paginationModel.page + 1),
        );

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              checkboxSelection
              checkboxSelectionVisibleOnly
              initialState={{ pagination: { paginationModel } }}
              pagination
              paginationMode="server"
              pageSizeOptions={[2]}
              apiRef={apiRef}
              rowCount={rowLength}
              disableVirtualization
            />
          </div>
        );
      }
      render(<TestDataGridSelectionServerSide />);

      const selectAllCheckbox = screen.getByRole('checkbox', {
        name: /select all rows/i,
      });

      fireEvent.click(selectAllCheckbox);
      expect(apiRef.current.getSelectedRows()).to.have.length(2);
    });
  });

  describe('apiRef: getSelectedRows', () => {
    it('should handle the event internally before triggering onRowSelectionModelChange', () => {
      render(
        <TestDataGridSelection
          onRowSelectionModelChange={(model) => {
            expect(apiRef.current.getSelectedRows()).to.have.length(1);
            expect(model).to.deep.equal([1]);
          }}
        />,
      );
      expect(apiRef.current.getSelectedRows()).to.have.length(0);
      act(() => apiRef.current.selectRow(1));
      expect(apiRef.current.getSelectedRows().get(1)).to.deep.equal({
        id: 1,
        currencyPair: 'USDEUR',
      });
    });
  });

  describe('apiRef: isRowSelected', () => {
    it('should check if the rows selected by clicking on the rows are selected', () => {
      render(<TestDataGridSelection />);

      fireEvent.click(getCell(1, 0));

      expect(apiRef.current.isRowSelected(0)).to.equal(false);
      expect(apiRef.current.isRowSelected(1)).to.equal(true);
    });

    it('should check if the rows selected with the rowSelectionModel prop are selected', () => {
      render(<TestDataGridSelection rowSelectionModel={[1]} />);

      expect(apiRef.current.isRowSelected(0)).to.equal(false);
      expect(apiRef.current.isRowSelected(1)).to.equal(true);
    });
  });

  describe('apiRef: selectRow', () => {
    it('should call onRowSelectionModelChange with the ids selected', () => {
      const handleRowSelectionModelChange = spy();
      render(<TestDataGridSelection onRowSelectionModelChange={handleRowSelectionModelChange} />);
      act(() => apiRef.current.selectRow(1));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([1]);
      // Reset old selection
      act(() => apiRef.current.selectRow(2, true, true));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
      // Keep old selection
      act(() => apiRef.current.selectRow(3));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([2, 3]);
      act(() => apiRef.current.selectRow(3, false));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
    });

    it('should not call onRowSelectionModelChange if the row is unselectable', () => {
      const handleRowSelectionModelChange = spy();
      render(
        <TestDataGridSelection
          isRowSelectable={(params) => Number(params.id) > 0}
          onRowSelectionModelChange={handleRowSelectionModelChange}
        />,
      );
      act(() => apiRef.current.selectRow(0));
      expect(handleRowSelectionModelChange.callCount).to.equal(0);
      act(() => apiRef.current.selectRow(1));
      expect(handleRowSelectionModelChange.callCount).to.equal(1);
    });
  });

  describe('apiRef: selectRows', () => {
    it('should call onRowSelectionModelChange with the ids selected', () => {
      const handleRowSelectionModelChange = spy();
      render(<TestDataGridSelection onRowSelectionModelChange={handleRowSelectionModelChange} />);

      act(() => apiRef.current.selectRows([1, 2]));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);

      act(() => apiRef.current.selectRows([3]));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2, 3]);

      act(() => apiRef.current.selectRows([1, 2], false));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([3]);

      // Deselect others
      act(() => apiRef.current.selectRows([4, 5], true, true));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([4, 5]);
    });

    it('should filter out unselectable rows before calling onRowSelectionModelChange', () => {
      const handleRowSelectionModelChange = spy();
      render(
        <TestDataGridSelection
          isRowSelectable={(params) => Number(params.id) > 0}
          onRowSelectionModelChange={handleRowSelectionModelChange}
        />,
      );
      act(() => apiRef.current.selectRows([0, 1, 2]));
      expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);
    });

    it('should not select a range of several elements when disableMultipleRowSelection = true', () => {
      render(<TestDataGridSelection disableMultipleRowSelection />);

      act(() => apiRef.current.selectRows([0, 1, 2], true));
      expect(getSelectedRowIds()).to.deep.equal([]);
    });
  });

  describe('apiRef: selectRowRange', () => {
    it('should select all the rows in the range', () => {
      render(<TestDataGridSelection />);

      act(() => apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true));
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
    });

    it('should unselect all the rows in the range', () => {
      render(<TestDataGridSelection />);

      act(() => apiRef.current.setRowSelectionModel([2, 3]));
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
      act(() => apiRef.current.selectRowRange({ startId: 0, endId: 3 }, false));
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should not unselect the selected elements if the range is to be selected', () => {
      render(<TestDataGridSelection />);

      act(() => {
        apiRef.current.setRowSelectionModel([2]);
        apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true);
      });
      expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
    });

    it('should not reset the other selections when resetSelection = false', () => {
      render(<TestDataGridSelection />);

      act(() => {
        apiRef.current.setRowSelectionModel([0]);
        apiRef.current.selectRowRange({ startId: 2, endId: 3 }, true, false);
      });
      expect(getSelectedRowIds()).to.deep.equal([0, 2, 3]);
    });

    it('should reset the other selections when resetSelection = true', () => {
      render(<TestDataGridSelection />);

      act(() => {
        apiRef.current.setRowSelectionModel([0]);
        apiRef.current.selectRowRange({ startId: 2, endId: 3 }, true, true);
      });
      expect(getSelectedRowIds()).to.deep.equal([2, 3]);
    });

    it('should not select unselectable rows inside the range', () => {
      render(<TestDataGridSelection isRowSelectable={(params) => Number(params.id) % 2 === 1} />);

      act(() => apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true));
      expect(getSelectedRowIds()).to.deep.equal([1, 3]);
    });

    it('should not select a range of several elements when disableMultipleRowSelection = true', () => {
      render(<TestDataGridSelection disableMultipleRowSelection />);

      act(() => apiRef.current.selectRowRange({ startId: 1, endId: 3 }, true));
      expect(getSelectedRowIds()).to.deep.equal([]);
    });

    it('should select only filtered rows selecting a range', () => {
      render(
        <TestDataGridSelection
          filterModel={{ items: [{ field: 'id', value: 1, operator: '!=' }] }}
        />,
      );
      act(() => apiRef.current.selectRowRange({ startId: 0, endId: 2 }, true));
      expect(getSelectedRowIds()).to.deep.equal([0, 2]);
    });
  });

  it('should select only filtered rows after filter is applied', () => {
    render(<TestDataGridSelection checkboxSelection />);
    const selectAll = screen.getByRole('checkbox', {
      name: /select all rows/i,
    });
    act(() =>
      apiRef.current.setFilterModel({
        items: [
          {
            field: 'currencyPair',
            value: 'usd',
            operator: 'startsWith',
          },
        ],
      }),
    );
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
    it('should not publish "rowSelectionChange" if the selection state did not change ', () => {
      const handleSelectionChange = spy();
      const rowSelectionModel: GridRowSelectionModel = [];
      render(<TestDataGridSelection rowSelectionModel={rowSelectionModel} />);
      apiRef.current.subscribeEvent('rowSelectionChange', handleSelectionChange);
      apiRef.current.setRowSelectionModel(rowSelectionModel);
      expect(handleSelectionChange.callCount).to.equal(0);
    });

    it('should not call onRowSelectionModelChange on initialization if rowSelectionModel contains more than one id and checkboxSelection=false', () => {
      const onRowSelectionModelChange = spy();
      render(
        <TestDataGridSelection
          onRowSelectionModelChange={onRowSelectionModelChange}
          rowSelectionModel={[0, 1]}
        />,
      );
      expect(onRowSelectionModelChange.callCount).to.equal(0);
    });
  });
});
