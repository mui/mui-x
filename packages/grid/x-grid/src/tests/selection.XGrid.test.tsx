import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { getCell, getColumnValues, getRow } from 'test/utils/helperFn';
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
  XGrid,
  GridEvents,
} from '@mui/x-data-grid-pro';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function getSelectedRows(apiRef) {
  return Array.from(apiRef.current.getSelectedRows().keys());
}

describe('<XGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const baselineProps = {
    autoHeight: isJSDOM,
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
        brand: 'Under Armour',
      },
      {
        id: 4,
        brand: 'Asics',
      },
      {
        id: 5,
        brand: 'Reebok',
      },
    ],
    columns: [{ field: 'brand' }],
  };

  const Test = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  describe('getSelectedRows', () => {
    it('should handle the event internally before triggering onSelectionModelChange', () => {
      render(
        <Test
          onSelectionModelChange={(model) => {
            expect(apiRef!.current.getSelectedRows().size).to.equal(1);
            expect(model).to.deep.equal([1]);
          }}
        />,
      );
      expect(apiRef!.current.getSelectedRows().size).to.equal(0);
      apiRef!.current.selectRow(1);
      expect(apiRef!.current.getSelectedRows().get(1)).to.equal(baselineProps.rows[1]);
    });
  });

  describe('selectRow', () => {
    it('should call onSelectionModelChange with the ids selected', () => {
      const handleSelectionModelChange = spy();
      render(<Test onSelectionModelChange={handleSelectionModelChange} />);
      apiRef!.current.selectRow(1);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1]);
      apiRef!.current.selectRow(2);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
      // Keep old selection
      apiRef!.current.selectRow(3, true, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2, 3]);
      apiRef!.current.selectRow(3, false, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([2]);
    });

    it('should not call onSelectionModelChange if the row is unselectable', () => {
      const handleSelectionModelChange = spy();
      render(
        <Test
          isRowSelectable={(params) => params.id > 0}
          onSelectionModelChange={handleSelectionModelChange}
        />,
      );
      apiRef!.current.selectRow(0);
      expect(handleSelectionModelChange.callCount).to.equal(0);
      apiRef!.current.selectRow(1);
      expect(handleSelectionModelChange.callCount).to.equal(1);
    });
  });

  describe('selectRows', () => {
    it('should call onSelectionModelChange with the ids selected', () => {
      const handleSelectionModelChange = spy();
      render(<Test onSelectionModelChange={handleSelectionModelChange} />);
      apiRef!.current.selectRows([1, 2]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);
      apiRef!.current.selectRows([3]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2, 3]);
      apiRef!.current.selectRows([1, 2], false);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([3]);
      // Deselect others
      apiRef!.current.selectRows([4, 5], true, true);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([4, 5]);
    });

    it('should filter out unselectable rows before calling onSelectionModelChange', () => {
      const handleSelectionModelChange = spy();
      render(
        <Test
          isRowSelectable={(params) => params.id > 0}
          onSelectionModelChange={handleSelectionModelChange}
        />,
      );
      apiRef!.current.selectRows([0, 1, 2]);
      expect(handleSelectionModelChange.lastCall.args[0]).to.deep.equal([1, 2]);
    });
  });

  it('should clean the selected ids when the rows prop changes', () => {
    const DemoTest = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      const [selectionModelState, setSelectionModelState] = React.useState(props.selectionModel);
      const handleSelectionChange = (model) => setSelectionModelState(model);
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            {...baselineProps}
            {...props}
            selectionModel={selectionModelState}
            onSelectionModelChange={handleSelectionChange}
          />
        </div>
      );
    };

    const { setProps } = render(<DemoTest selectionModel={[0, 1, 2]} checkboxSelection />);
    expect(getSelectedRows(apiRef)).to.deep.equal([0, 1, 2]);
    setProps({
      rows: [
        {
          id: 0,
          brand: 'Nike',
        },
      ],
    });
    expect(getSelectedRows(apiRef)).to.deep.equal([0]);
  });

  it('should call onSelectionModelChange when selection state changes', () => {
    const handleSelectionModelChange = spy();
    const DemoTest = (props: Partial<GridComponentProps>) => {
      apiRef = useGridApiRef();
      const [selectionModelState] = React.useState(props.selectionModel);

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            {...baselineProps}
            {...props}
            selectionModel={selectionModelState}
            onSelectionModelChange={handleSelectionModelChange}
          />
        </div>
      );
    };

    const { setProps } = render(<DemoTest selectionModel={[0]} checkboxSelection />);
    expect(getSelectedRows(apiRef)).to.deep.equal([0]);
    setProps({
      rows: [
        {
          id: 1,
          brand: 'Nike',
        },
      ],
    });
    expect(handleSelectionModelChange.callCount).to.equal(1);
    expect(handleSelectionModelChange.getCall(0).args[0]).to.deep.equal([]);
  });

  it('should select only filtered rows after filter is applied', () => {
    render(<Test checkboxSelection />);
    const selectAll = screen.getByRole('checkbox', {
      name: /select all rows checkbox/i,
    });
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: 'brand',
          operatorValue: 'contains',
          value: 'Puma',
        },
      ],
    });
    expect(getColumnValues(1)).to.deep.equal(['Puma']);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([2]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([2]);
    fireEvent.click(selectAll);
    expect(getSelectedRows(apiRef)).to.deep.equal([]);
  });

  it('should only select visible rows on the current page', () => {
    render(
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          rows={[
            {
              id: 0,
              brand: 'Nike',
            },
            {
              id: 1,
              brand: 'Puma',
            },
          ]}
          columns={[{ field: 'brand', width: 100 }]}
          checkboxSelection
          checkboxSelectionVisibleOnly
          pagination
          pageSize={1}
          rowsPerPageOptions={[1]}
        />
      </div>,
    );
    const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
    fireEvent.click(selectAllCheckbox);
    expect(getRow(0)).to.have.class('Mui-selected');
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getRow(1)).not.to.have.class('Mui-selected');
  });

  describe('control Selection', () => {
    it('should update the selection state when neither the model nor the onChange are set', () => {
      render(<Test />);
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
    });

    it('should not update the selection model when the selectionModelProp is set', () => {
      const selectionModel: GridInputSelectionModel = [1];
      render(<Test selectionModel={selectionModel} />);

      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).not.to.have.class('Mui-selected');
    });

    it('should update the selection state when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(<Test onSelectionModelChange={onModelChange} />);

      fireEvent.click(getCell(0, 0));
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(onModelChange.callCount).to.equal(1);
      expect(onModelChange.firstCall.firstArg).to.deep.equal([0]);
    });

    it('should control selection state when the model and the onChange are set', () => {
      const ControlCase = (props: Partial<GridComponentProps>) => {
        const { rows, columns, ...others } = props;
        const [selectionModel, setSelectionModel] = React.useState<any>([0]);
        const handleSelectionChange = (newModel) => {
          if (newModel.length) {
            setSelectionModel([...newModel, 2]);
            return;
          }
          setSelectionModel(newModel);
        };

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              autoHeight={isJSDOM}
              columns={columns || baselineProps.columns}
              rows={rows || baselineProps.rows}
              selectionModel={selectionModel}
              onSelectionModelChange={handleSelectionChange}
              {...others}
            />
          </div>
        );
      };

      render(<ControlCase />);

      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(getCell(1, 0));
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');
      expect(getRow(2)).to.have.class('Mui-selected');
    });

    it('should not publish GRID_SELECTION_CHANGE if the selection state did not change ', () => {
      const handleSelectionChange = spy();
      const selectionModel = [];
      render(<Test selectionModel={selectionModel} />);
      apiRef.current.subscribeEvent(GridEvents.selectionChange, handleSelectionChange);
      apiRef.current.setSelectionModel(selectionModel);
      expect(handleSelectionChange.callCount).to.equal(0);
    });
  });
});
