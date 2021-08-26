import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {getCell, getColumnValues, getRow} from 'test/utils/helperFn';
import {
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
} from 'test/utils';
import {
  GridApiRef,
  GridComponentProps,
  GridInputSelectionModel,
  useGridApiRef,
  DataGridPro,
  GridEvents,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { useData } from 'storybook/src/hooks/useData';
import { getData } from 'storybook/src/data/data-service';

function getSelectedRows(apiRef) {
  return Array.from(apiRef.current.getSelectedRows().keys());
}

describe('<DataGridPro /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const TestDataGridSelection = (
    props: Omit<DataGridProProps, 'rows' | 'columns' | 'apiRef'> &
      Partial<Pick<DataGridProProps, 'rows' | 'columns'>>,
  ) => {
    apiRef = useGridApiRef();
    const data = useData(4, 2);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...data} {...props} apiRef={apiRef} />
      </div>
    );
  };

  describe('getSelectedRows', () => {
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

  describe('selectRow', () => {
    it('should call onSelectionModelChange with the ids selected', () => {
      const handleSelectionModelChange = spy();
      render(<TestDataGridSelection onSelectionModelChange={handleSelectionModelChange} />);
      apiRef.current.selectRow(1);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1]);
      apiRef.current.selectRow(2);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
      // Keep old selection
      apiRef.current.selectRow(3, true, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2, 3]);
      apiRef.current.selectRow(3, false, true);
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

  describe('selectRows', () => {
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

  it('should clean the selected ids when the rows prop changes', () => {
    const { rows, columns } = getData(4, 2);

    const DemoTest = (props: Partial<GridComponentProps>) => {
      const [selectionModelState, setSelectionModelState] = React.useState(props.selectionModel);
      const handleSelectionChange = (model) => setSelectionModelState(model);
      return (
        <TestDataGridSelection
          {...props}
          selectionModel={selectionModelState}
          onSelectionModelChange={handleSelectionChange}
          columns={columns}
        />
      );
    };

    const { setProps } = render(
      <DemoTest selectionModel={[0, 1, 2]} checkboxSelection rows={rows} />,
    );
    expect(getSelectedRows(apiRef)).to.deep.equal([0, 1, 2]);
    setProps({
      rows: [rows[0]],
    });
    expect(getSelectedRows(apiRef)).to.deep.equal([0]);
  });

  it('should call onSelectionModelChange when selection state changes', () => {
    const handleSelectionModelChange = spy();

    render(
      <TestDataGridSelection
        onSelectionModelChange={handleSelectionModelChange}
        checkboxSelection
      />,
    );

    expect(getSelectedRows(apiRef)).to.deep.equal([]);
    fireEvent.click(getCell(0, 0));
    expect(handleSelectionModelChange.callCount).to.equal(1);
    expect(handleSelectionModelChange.getCall(0).args[0]).to.deep.equal([0]);
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
    expect(getSelectedRows(apiRef)).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([0, 1]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([]);
  });

  it('should only select visible rows on the current page', () => {
    render(
        <TestDataGridSelection
          checkboxSelection
          checkboxSelectionVisibleOnly
          pagination
          pageSize={1}
          rowsPerPageOptions={[1]}
        />
    );
    const selectAll = screen.getByRole('checkbox', {
      name: /select all rows checkbox/i,
    });
    fireEvent.click(selectAll);
    expect(getRow(0)).to.have.class('Mui-selected');
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getRow(1)).not.to.have.class('Mui-selected');
  });

  describe('control Selection', () => {
    it('should update the selection state when neither the model nor the onChange are set', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
    });

    it('should not update the selection model when the selectionModelProp is set', () => {
      const selectionModel: GridInputSelectionModel = [1];
      render(<TestDataGridSelection selectionModel={selectionModel} />);

      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).not.to.have.class('Mui-selected');
    });

    it('should update the selection state when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(<TestDataGridSelection onSelectionModelChange={onModelChange} />);

      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(onModelChange.callCount).to.equal(1);
      expect(onModelChange.firstCall.firstArg).to.deep.equal([0]);
    });

    it('should control selection state when the model and the onChange are set', () => {
      const ControlCase = () => {
        const [selectionModel, setSelectionModel] = React.useState<any>([]);

        const handleSelectionChange = (newModel) => {
          if (newModel.length) {
            setSelectionModel([...newModel, 2]);
            return;
          }
          setSelectionModel(newModel);
        };

        return (
            <TestDataGridSelection
                selectionModel={selectionModel}
                onSelectionModelChange={handleSelectionChange}
            />
        );
      };

      render(<ControlCase />);
      expect(getRow(0)).not.to.have.class('Mui-selected');
      fireEvent.click(getCell(1, 0));
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      expect(getRow(2)).to.have.class('Mui-selected');
    });

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
