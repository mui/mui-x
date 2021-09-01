import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGrid, DataGridProps, GridInputSelectionModel } from '@mui/x-data-grid';
import { getCell, getRow, getSelectedRowIndexes } from 'test/utils/helperFn';
import { getData } from 'storybook/src/data/data-service';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const defaultData = getData(4, 2);

  const TestDataGridSelection = (
    props: Omit<DataGridProps, 'rows' | 'columns'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) => (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...defaultData} {...props} autoHeight={isJSDOM} />
    </div>
  );

  describe('props: checkboxSelection = false (single selection)', () => {
    it('should select one row at a time on click WITHOUT ctrl or meta pressed', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      fireEvent.click(getCell(1, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it(`should not deselect the selected row on click WITHOUT ctrl or meta pressed`, () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
    });

    ['metaKey', 'ctrlKey'].forEach((key) => {
      it(`should select one row at a time on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(getSelectedRowIndexes()).to.deep.equal([0]);
        fireEvent.click(getCell(1, 0), { [key]: true });
        expect(getSelectedRowIndexes()).to.deep.equal([1]);
      });

      it(`should deselect the selected row on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        fireEvent.click(getCell(0, 0));
        expect(getSelectedRowIndexes()).to.deep.equal([0]);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(getSelectedRowIndexes()).to.deep.equal([]);
      });
    });

    it('should not select a range with shift pressed', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 0), { shiftKey: true });
      expect(getSelectedRowIndexes()).to.deep.equal([2]);
    });
  });

  describe('prop: checkboxSelection = true (multi selection)', () => {
    it('should check and uncheck when double clicking the row', () => {
      render(<TestDataGridSelection checkboxSelection />);
      expect(getSelectedRowIndexes()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', true);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([]);
      expect(getRow(0).querySelector('input')).to.have.property('checked', false);
    });

    it('should select all visible rows regardless of pagination', () => {
      render(<TestDataGridSelection checkboxSelection pageSize={1} rowsPerPageOptions={[1]} />);
      const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
      fireEvent.click(selectAllCheckbox);
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should check the checkbox when there is no rows', () => {
      render(<TestDataGridSelection rows={[]} checkboxSelection />);
      const selectAll = screen.getByRole('checkbox', {
        name: /select all rows checkbox/i,
      });
      expect(selectAll).to.have.property('checked', false);
    });

    it('should disable the checkbox if isRowSelectable returns false', () => {
      render(
        <TestDataGridSelection isRowSelectable={(params) => params.id === 0} checkboxSelection />,
      );
      expect(getRow(0).querySelector('input')).to.have.property('disabled', false);
      expect(getRow(1).querySelector('input')).to.have.property('disabled', true);
    });

    it('should select a range with shift pressed', () => {
      render(<TestDataGridSelection checkboxSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
      fireEvent.click(getCell(2, 0), { shiftKey: true });
      expect(getSelectedRowIndexes()).to.deep.equal([0, 1, 2]);
    });
  });

  describe('props: isRowSelectable', () => {
    it('should update the selected rows when the isRowSelectable prop changes', async () => {
      const { setProps } = render(
        <TestDataGridSelection isRowSelectable={() => true} checkboxSelection />,
      );

      fireEvent.click(getRow(0));
      fireEvent.click(getRow(1));

      expect(getSelectedRowIndexes()).to.deep.equal([0, 1]);

      setProps({ isRowSelectable: (params) => Number(params.id) % 2 === 0 });
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
    });

    it('should not select unselectable rows given in selectionModel', () => {
      render(
        <TestDataGridSelection
          selectionModel={[0, 1]}
          isRowSelectable={(params) => Number(params.id) % 2 === 0}
          checkboxSelection
        />,
      );

      // TODO: ID 1 should not be selected
      // expect(getSelectedRowIndexes()).to.deep.equal([0]);
      // TODO: ID 1 and 3 should not be selected
      // setProps({ selectionModel: [0, 1, 2, 3] });
      // expect(getSelectedRowIndexes()).to.deep.equal([0, 2])
    });
  });

  describe('props: rows', () => {
    it('should remove the outdated selected rows when rows prop changes', () => {
      const data = getData(4, 2);

      const { setProps } = render(
        <TestDataGridSelection selectionModel={[0, 1, 2]} checkboxSelection {...data} />,
      );
      expect(getSelectedRowIndexes()).to.deep.equal([0, 1, 2]);

      setProps({
        rows: data.rows.slice(0, 1),
      });
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
    });
  });

  describe('props: selectionModel and onSelectionModelChange', () => {
    it('should select rows when initialised (array-version)', () => {
      render(<TestDataGridSelection selectionModel={[1]} />);
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should select rows when initialised (non-array version)', () => {
      render(<TestDataGridSelection selectionModel={1} />);
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should allow to switch selectionModel from array version to non-array version', () => {
      const { setProps } = render(<TestDataGridSelection selectionModel={[1]} />);
      expect(getSelectedRowIndexes()).to.deep.equal([1]);

      setProps({ selectionModel: 1 });
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should not call onSelectionModelChange on initialisation or on selectionModel prop change', () => {
      const onSelectionModelChange = spy();

      const { setProps } = render(
        <TestDataGridSelection
          onSelectionModelChange={onSelectionModelChange}
          selectionModel={0}
        />,
      );
      expect(onSelectionModelChange.callCount).to.equal(0);
      setProps({ selectionModel: 1 });
      expect(onSelectionModelChange.callCount).to.equal(0);
    });

    it('should deselect the old selected rows when updating selectionModel', () => {
      const { setProps } = render(<TestDataGridSelection selectionModel={[0]} />);

      expect(getSelectedRowIndexes()).to.deep.equal([0]);

      setProps({ selectionModel: [1] });
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should update the selection when neither the model nor the onChange are set', () => {
      render(<TestDataGridSelection />);
      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
    });

    it('should not update the selection model when the selectionModelProp is set', () => {
      const selectionModel: GridInputSelectionModel = [1];
      render(<TestDataGridSelection selectionModel={selectionModel} />);
      expect(getSelectedRowIndexes()).to.deep.equal([1]);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([1]);
    });

    it('should update the selection when the model is not set, but the onChange is set', () => {
      const onModelChange = spy();
      render(<TestDataGridSelection onSelectionModelChange={onModelChange} />);

      fireEvent.click(getCell(0, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([0]);
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
            checkboxSelection
          />
        );
      };

      render(<ControlCase />);
      expect(getSelectedRowIndexes()).to.deep.equal([]);
      fireEvent.click(getCell(1, 0));
      expect(getSelectedRowIndexes()).to.deep.equal([1, 2]);
    });
  });

  describe('console error', () => {
    it('should throw console error when selectionModel contains more than 1 item in DataGrid without checkbox selection', () => {
      expect(() => {
        render(<TestDataGridSelection selectionModel={[0, 1]} />);
      })
        // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev('selectionModel can only be of 1 item in DataGrid');
    });

    it('should not throw console error when selectionModel contains more than 1 item in DataGrid with checkbox selection', () => {
      expect(() => {
        render(<TestDataGridSelection selectionModel={[0, 1]} checkboxSelection />);
      })
        .not // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev();
    });
  });
});
