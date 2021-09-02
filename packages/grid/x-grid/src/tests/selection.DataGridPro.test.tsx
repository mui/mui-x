import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { getColumnValues, getRow, getSelectedRowIndexes } from 'test/utils/helperFn';
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

describe('<DataGridPro /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const defaultData = getData(4, 2);

  const TestDataGridSelection = (
    props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'> &
      Partial<Pick<DataGridProProps, 'rows' | 'columns'>>,
  ) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...defaultData} {...props} apiRef={apiRef} autoHeight={isJSDOM} />
      </div>
    );
  };

  describe('prop: checkboxSelectionVisibleOnly', () => {
    it('should select all visible rows regardless of pagination if checkboxSelectionVisibleOnly = false', () => {
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
      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getRow(1)).to.have.class('Mui-selected');
    });

    it('should select all visible rows of the current page if checkboxSelectionVisibleOnly = true', () => {
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
      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getRow(1)).not.to.have.class('Mui-selected');
    });
  });

  describe('apiRef: getSelectedRows', () => {
    it('should handle the event internally before triggering onSelectionModelChange', () => {
      render(
        <TestDataGridSelection
          onSelectionModelChange={(model) => {
            expect(apiRef.current.getSelectedRows().size).to.equal(1);
            expect(model).to.deep.equal([1]);
          }}
        />,
      );
      expect(apiRef.current.getSelectedRows().size).to.equal(0);
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
    expect(getSelectedRowIndexes()).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIndexes()).to.deep.equal([]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIndexes()).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRowIndexes()).to.deep.equal([]);
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
